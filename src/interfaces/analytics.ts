export interface BaseAnalyticsData {
  totalSessions: number;
  groupSessions: number;
  oneOnOneSessions: number;
  schedules: Schedule[];
}

export interface Schedule {
  learners: any;
  learningStyle: any;
  id: string;
  date: string;
  time: string;
  subject: string;
  mentor: string;
  duration: string;
  type: 'group' | 'one-on-one';
  location: string;
  status: string;
}

export interface MentorAnalyticsData extends BaseAnalyticsData {
  aveRating: number;
  topSubjects: { subject: string; count: number }[];
  topStyles: { style: string; count: number }[];
}

export interface LearnerAnalyticsData extends BaseAnalyticsData {
  subjectsOfInterest: { subject: string; count: number }[];
}

export interface SessionAnalyticsProps {
  analyticsData: any | null;
  userData: any;
  onDataRefresh: () => void;
}