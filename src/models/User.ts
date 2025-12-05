import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  _id?: string;
  userId: string;
  username: string;
  email: string;
  password: string;
  role: 'learner' | 'mentor' | 'user';
  name?: string;
  yearLevel?: string;
  program?: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  sex?: string;
  subjects?: string[];
  availability?: string[];
  sessionDur?: string;
  modality?: string;
  style?: string[];
  goals?: string;
  experience?: string;
  proficiency?: string;
  topics?: string[];
  credentials?: string[];
  image?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['learner', 'mentor', 'user'], 
      default: 'user',
      required: true 
    },
    name: String,
    yearLevel: String,
    program: String,
    phoneNumber: String,
    address: String,
    bio: String,
    sex: String,
    subjects: [String],
    availability: [String],
    sessionDur: String,
    modality: String,
    style: [String],
    goals: String,
    experience: String,
    proficiency: String,
    topics: [String],
    credentials: [String],
    image: String,
    status: { type: String, default: 'Active' }
  },
  {
    timestamps: true
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
