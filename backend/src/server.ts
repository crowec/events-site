import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import {
    securityMiddleware,
    errorHandler,
    notFoundHandler,
} from './middleware/security';
import authRoutes, { setEvents } from './routes/auth';
import { initializeEvents } from './config/events';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

app.set('trust proxy', 1);

app.use(compression());

app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        maxAge: 86400,
    })
);

app.use(...securityMiddleware);

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(
    express.json({
        limit: '1mb',
        strict: true,
    })
);

app.use(
    express.urlencoded({
        extended: false,
        limit: '1mb',
    })
);

// Rate limiting disabled for development
// app.use(generalRateLimit);

app.get('/health', (_req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
    });
});

app.use('/api/auth', authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
    try {
        const events = await initializeEvents();
        setEvents(events);

        console.log(
            `Initialized ${events.length} events with secure password hashing`
        );

        app.listen(PORT, () => {
            console.log(`🚀 Secure events API server running on port ${PORT}`);
            console.log(
                `Environment: ${process.env.NODE_ENV || 'development'}`
            );
            console.log(`Health check: http://localhost:${PORT}/health`);

            if (process.env.NODE_ENV !== 'production') {
                console.log('🔐 Event passwords for testing:');
                console.log('  - shadows (Midnight Gala)');
                console.log('  - midas (Golden Circle)');
                console.log('  - phoenix (Crimson Society)');
                console.log('  - azure (Sapphire Summit)');
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

startServer();
