import mongoose, { Document, Schema } from 'mongoose';

export enum FeedbackCategory {
  BUG = 'Bug',
  FEATURE_REQUEST = 'Feature Request',
  IMPROVEMENT = 'Improvement',
  OTHER = 'Other',
}

export enum FeedbackStatus {
  NEW = 'New',
  IN_REVIEW = 'In Review',
  RESOLVED = 'Resolved',
}

export interface IFeedback extends Document {
  title: string;
  description: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  submitterName?: string;
  submitterEmail?: string;
  
  // AI fields
  ai_category?: string;
  ai_sentiment?: string;
  ai_priority?: number;
  ai_summary?: string;
  ai_tags?: string[];
  ai_processed: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, required: true, minlength: 20 },
    category: {
      type: String,
      enum: Object.values(FeedbackCategory),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(FeedbackStatus),
      default: FeedbackStatus.NEW,
    },
    submitterName: { type: String },
    submitterEmail: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => !v || /^\S+@\S+\.\S+$/.test(v),
        message: 'Invalid email format',
      },
    },
    
    // AI fields
    ai_category: { type: String },
    ai_sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative'],
    },
    ai_priority: { type: Number, min: 1, max: 10 },
    ai_summary: { type: String },
    ai_tags: [{ type: String }],
    ai_processed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for performance
FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ category: 1 });
FeedbackSchema.index({ ai_priority: -1 });
FeedbackSchema.index({ createdAt: -1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
