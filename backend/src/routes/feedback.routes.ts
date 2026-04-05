import express from 'express';
import {
  createFeedback,
  getAllFeedback,
  getSingleFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  getTrendSummary,
  retriggerAI,
} from '../controllers/feedback.controller';
import { adminLogin } from '../controllers/auth.controller';
import { authMiddleware, submissionRateLimiter } from '../middleware/auth.middleware';

const router = express.Router();

// Public feedback routes
router.post('/feedback', submissionRateLimiter, createFeedback);

// Admin auth
router.post('/auth/login', adminLogin);

// Protected admin routes
router.get('/feedback', authMiddleware, getAllFeedback);
router.get('/feedback/summary', authMiddleware, getTrendSummary);
router.get('/feedback/:id', authMiddleware, getSingleFeedback);
router.patch('/feedback/:id', authMiddleware, updateFeedbackStatus);
router.delete('/feedback/:id', authMiddleware, deleteFeedback);
router.post('/feedback/:id/retrigger', authMiddleware, retriggerAI);

export default router;
