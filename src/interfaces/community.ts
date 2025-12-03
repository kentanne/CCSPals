export interface Post {
  id: string; // MongoDB ObjectId as string
  title: string;
  content: string;
  author: string; // MongoDB ObjectId as string
  authorName: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  commentsCount: number; // backend uses commentsCount, not commentCount
  topics?: string; // backend uses topics, not category
  tags?: string[];
  userVote?: 'up' | 'down' | null;
}

export interface Comment {
  id: string; // MongoDB ObjectId as string
  content: string;
  author: string; // MongoDB ObjectId as string
  authorName: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  commentsCount: number; // replies count
  postId?: string;
  parentCommentId?: string;
  replies?: Comment[];
  userVote?: 'up' | 'down' | null;
}

export interface CommunityForumProps {
  forumData?: Post[];
  userData: any;
  onForumUpdate: () => void;
}