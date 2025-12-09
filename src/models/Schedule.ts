import mongoose, { Schema, Model } from 'mongoose';

export interface ISchedule {
  _id?: string;
  scheduleId: string;
  learnerId?: string;
  learnerName: string;
  mentorId?: string;
  mentorName: string;
  subject: string;
  date: string;
  time: string;
  duration?: string;
  modality: string;
  meetingLink?: string;
  location?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ScheduleSchema = new Schema<ISchedule>(
  {
    scheduleId: { type: String, required: true, unique: true },
    learnerId: { type: String },
    learnerName: { type: String, required: true },
    mentorId: { type: String },
    mentorName: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: String },
    modality: { 
      type: String, 
      enum: ['online', 'in-person', 'hybrid'],
      required: true 
    },
    meetingLink: String,
    location: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    notes: String
  },
  {
    timestamps: true
  }
);

// Clear cached model to ensure schema changes take effect
if (mongoose.models.Schedule) {
  delete mongoose.models.Schedule;
}

const Schedule: Model<ISchedule> = mongoose.model<ISchedule>('Schedule', ScheduleSchema);

export default Schedule;
