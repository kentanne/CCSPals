export interface Challenge {
  id: string;
  title: string;
  description: string;
  instructions: string;
  specialization: string;
  points: number;
  deadline?: string;
  createdAt: string;
  submissions: Submission[];
}

export interface Submission {
  id: string;
  learnerName: string;
  learnerId: string;
  challengeId: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  content: string;
  feedback?: string;
  pointsAwarded?: number;
  attachedFiles?: FileAttachment[];
  challengeTitle?: string;
  challengePoints?: number;
  specialization?: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: string;
  url: string;
  type: string;
  uploadedBy: 'learner' | 'mentor';
  uploadDate: string;
}

export interface UserData {
  _id: string;
  name: string;
  subjects: string[];
}

export interface ChallengesComponentProps {
  userData: UserData;
}