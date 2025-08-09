import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rsvpRoutes from './routes/rsvp';
import authRoutes, { setEvents } from './routes/auth';
import { initializeEvents } from './config/events';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Set JWT_SECRET if not provided
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-key-not-for-production';

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rsvp', rsvpRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const startServer = async (): Promise<void> => {
  try {
    // Initialize events and set them for auth
    const events = await initializeEvents();
    setEvents(events);
    
    app.listen(PORT, () => {
      console.log(`🚀 Events API server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Initialized ${events.length} events`);
      console.log('🔐 Event passwords for testing:');
      console.log('  - shadows (Midnight Gala)');
      console.log('  - midas (Golden Circle)');
      console.log('  - phoenix (Crimson Society)');
      console.log('  - azure (Sapphire Summit)');
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