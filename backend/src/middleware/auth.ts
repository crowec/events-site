import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { EventConfig } from '../config/events';

export interface AuthenticatedRequest extends Request {
  event?: EventConfig;
  user?: {
    eventId: string;
    iat: number;
    exp: number;
  };
}

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured');
      res.status(500).json({ error: 'Authentication service unavailable' });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      eventId: string;
      iat: number;
      exp: number;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid access token' });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Access token expired' });
      return;
    }

    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};