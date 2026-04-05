import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import feedbackRoutes from '../src/routes/feedback.routes';
import Feedback from '../src/models/Feedback';
import jwt from 'jsonwebtoken';

// Mock gemini service
jest.mock('../src/services/gemini.service', () => ({
  analyzeFeedback: jest.fn().mockResolvedValue({
    category: 'Bug',
    sentiment: 'Negative',
    priority_score: 9,
    summary: 'Mocked summary',
    tags: ['mock', 'test'],
  }),
  generateWeeklySummary: jest.fn().mockResolvedValue('Mocked weekly summary'),
}));

const app = express();
app.use(express.json());
app.use('/api', feedbackRoutes);

let adminToken: string;

beforeAll(async () => {
  // Use memory DB or mock mongoose if needed, but here we assume a test DB or local mongo
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/feedpulse_test';
  await mongoose.connect(MONGO_URI);
  
  adminToken = jwt.sign(
    { email: 'admin@feedpulse.com', role: 'admin' },
    process.env.JWT_SECRET || 'supersecret_feedpulse_key'
  );
});

afterAll(async () => {
  await Feedback.deleteMany({});
  await mongoose.connection.close();
});

describe('Feedback API Endpoints', () => {
  it('POST /api/feedback - should create new feedback', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({
        title: 'Test Feedback Title',
        description: 'This is a long enough description for testing purposes.',
        category: 'Bug',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Test Feedback Title');
  });

  it('POST /api/feedback - should reject short description', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({
        title: 'Short Desc',
        description: 'Too short',
        category: 'Improvement',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/feedback - should reject unauthorized user', async () => {
    const res = await request(app).get('/api/feedback');
    expect(res.statusCode).toEqual(401);
  });

  it('GET /api/feedback - should allow authorized admin', async () => {
    const res = await request(app)
      .get('/api/feedback')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('PATCH /api/feedback/:id - should update status', async () => {
    const feedback = await Feedback.findOne();
    const res = await request(app)
      .patch(`/api/feedback/${feedback!._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'In Review' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.status).toBe('In Review');
  });
});
