import { Request, Response, NextFunction } from 'express';
// import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        childSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  })
];
  
// export const authRateLimit = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // 5 attempts per window
//   message: {
//     error: 'Too many authentication attempts. Please try again later.',
//     retryAfter: '15 minutes'
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: (_req: Request, res: Response) => {
//     res.status(429).json({
//       error: 'Too many authentication attempts. Please try again later.',
//       retryAfter: '15 minutes'
//     });
//   }
// });

// export const generalRateLimit = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 30, // 30 requests per minute
//   message: {
//     error: 'Too many requests. Please slow down.',
//     retryAfter: '1 minute'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  res.status(500).json({
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error'
  });
};

export const notFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    error: 'Resource not found'
  });
};