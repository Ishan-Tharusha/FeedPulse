import { Request, Response } from 'express';
import Feedback, { FeedbackStatus } from '../models/Feedback';
import { analyzeFeedback, generateWeeklySummary } from '../services/gemini.service';

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { title, description, category, submitterName, submitterEmail } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, Description, and Category are required.',
      });
    }

    if (description.length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 20 characters.',
      });
    }

    const newFeedback = new Feedback({
      title,
      description,
      category,
      submitterName,
      submitterEmail,
    });

    await newFeedback.save();

    // Trigger AI analysis asynchronously
    analyzeFeedback(title, description)
      .then(async (analysis) => {
        if (analysis) {
          newFeedback.ai_category = analysis.category;
          newFeedback.ai_sentiment = analysis.sentiment;
          newFeedback.ai_priority = analysis.priority_score;
          newFeedback.ai_summary = analysis.summary;
          newFeedback.ai_tags = analysis.tags;
          newFeedback.ai_processed = true;
          await newFeedback.save();
        }
      })
      .catch((err) => console.error('Background AI Analysis Error:', err));

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. AI analysis is in progress.',
      data: newFeedback,
    });
  } catch (error: any) {
    console.error('Create Feedback Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating feedback.',
      error: error.message,
    });
  }
};

export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const { category, status, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query: any = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions: any = {};
    sortOptions[sortBy as string] = order === 'desc' ? -1 : 1;

    const total = await Feedback.countDocuments(query);
    const feedbacks = await Feedback.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching feedback.',
      error: error.message,
    });
  }
};

export const getSingleFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found.' });
    }
    return res.status(200).json({ success: true, data: feedback });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!Object.values(FeedbackStatus).includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found.' });
    }

    return res.status(200).json({ success: true, data: feedback });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found.' });
    }
    return res.status(200).json({ success: true, message: 'Feedback deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

export const getTrendSummary = async (req: Request, res: Response) => {
  try {
    // Get last 7 days feedback
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const feedbacks = await Feedback.find({ createdAt: { $gte: last7Days } });

    if (feedbacks.length === 0) {
      return res.status(200).json({
        success: true,
        data: 'No feedback found in the last 7 days.',
      });
    }

    const summary = await generateWeeklySummary(feedbacks);
    return res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

export const retriggerAI = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found.' });
    }

    const analysis = await analyzeFeedback(feedback.title, feedback.description);
    if (analysis) {
      feedback.ai_category = analysis.category;
      feedback.ai_sentiment = analysis.sentiment;
      feedback.ai_priority = analysis.priority_score;
      feedback.ai_summary = analysis.summary;
      feedback.ai_tags = analysis.tags;
      feedback.ai_processed = true;
      await feedback.save();
    }

    return res.status(200).json({
      success: true,
      message: 'AI analysis re-triggered and updated.',
      data: feedback,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};
