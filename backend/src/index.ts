import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import feedbackRoutes from './routes/feedback.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Body parsing middleware
app.use(express.json());
app.use(cors());

// Define routes
app.use('/api', feedbackRoutes);

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/feedpulse';

console.log('Attempting to connect to MongoDB...');
// Added connection options for reliability
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error Details:');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    if (err.reason) {
      console.error('Reason:', JSON.stringify(err.reason, null, 2));
    }
    process.exit(1);
  });
