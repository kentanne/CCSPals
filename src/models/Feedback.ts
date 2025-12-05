import mongoose, { Schema, Model } from 'mongoose';

export interface IFeedback {
  _id?: string;
  feedbackId: string;
  scheduleId: string;
  learnerId: string;
  learnerName: string;
  mentorId: string;
  mentorName: string;
  rating: number;
  comment: string;
  subject: string;
  sessionDate: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    feedbackId: { type: String, required: true, unique: true },
    scheduleId: { type: String, required: true },
    learnerId: { type: String, required: true },
    learnerName: { type: String, required: true },
    mentorId: { type: String, required: true },
    mentorName: { type: String, required: true },
    rating: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    },
    comment: { type: String, required: true },
    subject: { type: String, required: true },
    sessionDate: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;
