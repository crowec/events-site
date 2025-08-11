import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { EventConfig } from '../config/events';
// Rate limiting disabled for development
// import { authRateLimit } from '../middleware/security';

const router = Router();

let events: EventConfig[] = [];

export const setEvents = (eventConfigs: EventConfig[]): void => {
    events = eventConfigs;
};

const authValidation = [
    body('password')
        .isLength({ min: 1, max: 100 })
        .withMessage('Password is required')
        .trim()
        .escape(),
];

router.post('/login', authValidation, async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                error: 'Invalid input',
                details: errors.array(),
            });
            return;
        }

        const { password } = req.body;

        if (!password || typeof password !== 'string') {
            res.status(400).json({ error: 'Password is required' });
            return;
        }

        let authenticatedEvent: EventConfig | null = null;

        for (const event of events) {
            const isValidPassword = await bcrypt.compare(
                password,
                event.passwordHash
            );
            if (isValidPassword) {
                authenticatedEvent = event;
                break;
            }
        }

        if (!authenticatedEvent) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            res.status(401).json({ error: 'Invalid password' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET not configured');
            res.status(500).json({
                error: 'Authentication service unavailable',
            });
            return;
        }

        const token = jwt.sign({ eventId: authenticatedEvent.id }, jwtSecret, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
            issuer: 'events-site',
            audience: 'events-site-client',
        } as jwt.SignOptions);

        const { passwordHash, ...eventData } = authenticatedEvent;

        res.json({
            success: true,
            token,
            event: eventData,
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

router.post('/verify', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }

        const token = authHeader.substring(7);
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            res.status(500).json({
                error: 'Authentication service unavailable',
            });
            return;
        }

        const decoded = jwt.verify(token, jwtSecret) as { eventId: string };
        const event = events.find((e) => e.id === decoded.eventId);

        if (!event) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        const { passwordHash, ...eventData } = event;

        res.json({
            valid: true,
            event: eventData,
        });
    } catch (error) {
        if (
            error instanceof jwt.JsonWebTokenError ||
            error instanceof jwt.TokenExpiredError
        ) {
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }

        console.error('Token verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

export default router;
