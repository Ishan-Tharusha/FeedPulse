import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_feedpulse_key';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@feedpulse.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export const adminLogin = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: { token },
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid email or password.',
  });
};
