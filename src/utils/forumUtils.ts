import { Comment } from '@/interfaces/community';

export const formatTimeAgo = (dateString: string) => {
  if (!dateString) return 'Unknown time';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

export const getVoteScore = (upvotes: number, downvotes: number) => {
  return upvotes - downvotes;
};

export const updateCommentVote = (comment: Comment, voteType: 'up' | 'down') => {
  const currentVote = comment.userVote;
  let upvotes = comment.upvotes;
  let downvotes = comment.downvotes;

  if (currentVote === voteType) {
    // Undo vote
    if (voteType === 'up') upvotes = Math.max(0, upvotes - 1);
    else downvotes = Math.max(0, downvotes - 1);
    return { ...comment, upvotes, downvotes, userVote: null };
  } else if (currentVote) {
    // Change vote
    if (currentVote === 'up') upvotes = Math.max(0, upvotes - 1);
    else downvotes = Math.max(0, downvotes - 1);
    if (voteType === 'up') upvotes++;
    else downvotes++;
    return { ...comment, upvotes, downvotes, userVote: voteType };
  } else {
    // New vote
    if (voteType === 'up') upvotes++;
    else downvotes++;
    return { ...comment, upvotes, downvotes, userVote: voteType };
  }
};

export const removeCommentRecursive = (list: Comment[], targetId: string): Comment[] => {
  return list.reduce<Comment[]>((acc, c) => {
    if (c.id === targetId) return acc;
    const newReplies = c.replies && c.replies.length ? removeCommentRecursive(c.replies, targetId) : c.replies;
    acc.push({ ...c, replies: newReplies });
    return acc;
  }, []);
};