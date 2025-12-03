export interface Reviewer {
  name: string;
  course: string;
  year: string;
  image?: string;
  program?: string;
  yearLevel?: string;
}

export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  reviewer?: Reviewer;
  date?: string;
  subject?: string;
  location?: string;
  mentor?: any;
  learner?: any;
  feedback?: any;
  has_feedback?: boolean;
  mentorId?: string;
  scheduleId?: string;
  reviewerId?: string;
}

export interface FeedbackFromAPI {
  _id: string;
  learner: string;
  mentor: string;
  schedule: string;
  rating: number;
  comments: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsComponentProps {
  schedForReview?: any[];
  userData?: any;
  data?: {
    schedForReview: any[];
  };
  feedbacks?: Feedback[];
}

export interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}