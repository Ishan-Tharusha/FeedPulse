import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_feedpulse_key';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. No token provided.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Invalid token.',
    });
  }
};

export const submissionRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 submissions per windowMs
  message: {
    success: false,
    message: 'Too many submissions from this IP, please try again after an hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
