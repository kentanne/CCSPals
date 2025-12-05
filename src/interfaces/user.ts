export interface RoleData {
  role: string;
}

export interface UserData {
  _id: string;
  userId: string;
  name: string;
  email: string;
  address: string;
  yearLevel: string;
  program: string;
  availability: string[];
  sessionDur: string;
  bio: string;
  subjects: string[];
  image: string;
  phoneNumber: string;
  style: string[];
  goals: string;
  sex: string;
  status: string;
  modality: string;
  createdAt: string;
  __v: number;
}

export interface Schedule {
  id: string;
  date: string;
  time: string;
  subject: string;
  location: string;
  mentor: {
    id: string;
    name: string;
    program: string;
    yearLevel: string;
    image: string;
  };
  learner: {
    id: string;
    name: string;
    program: string;
    yearLevel: string;
    image?: string;
  };
  feedback?: {
    rating: number;
    feedback: string;
  };
  has_feedback?: boolean;
}

export interface ProgressData {
  sessionsAttended: number;
  totalSessions: number;
  progress: number;
}

export interface RankData {
  rank: string;
  progress: number;
  requiredSessions: number | null;
  sessionsToNextRank: number | null;
}