import { useState } from 'react';
import { Comment } from '@/interfaces/community';
import { Icons } from '@/components/atoms/Icons';
const UpvoteIcon = Icons.Upvote;
const DownvoteIcon = Icons.Downvote;
import { formatTimeAgo, getVoteScore } from '@/utils/forumUtils';

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  userData: any;
  onVoteComment: (commentId: string, voteType: 'up' | 'down') => void;
  onAddReply: (content: string, parentCommentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  activeReply: string | null;
  setActiveReply: (id: string | null) => void;
  replyContent: { [key: string]: string };
  setReplyContent: (content: { [key: string]: string }) => void;
}

export default function CommentItem({ 
  comment, 
  depth = 0, 
  userData, 
  onVoteComment, 
  onAddReply, 
  onDeleteComment,
  activeReply,
  setActiveReply,
  replyContent,
  setReplyContent
}: CommentItemProps) {
  const isReply = depth > 0;
  
  return (
    <div className={`comment ${isReply ? 'reply' : ''}`} style={{ marginLeft: depth * 20 }}>
      <div className="commentContent">
        <div className="commentHeader">
          <span className="commentAuthor">{comment.authorName}</span>
          <span className="commentTime">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>
        
        <p className="commentText">{comment.content}</p>
        
        <div className="commentFooter">
          <div className="voteSection">
            <button 
              className={`voteButton upvote ${comment.userVote === 'up' ? 'active' : ''}`}
              onClick={() => onVoteComment(comment.id, 'up')}
              aria-label="Upvote comment"
            >
              <UpvoteIcon />
            </button>
            <span className="voteCount">
              {getVoteScore(comment.upvotes, comment.downvotes)}
            </span>
            <button 
              className={`voteButton downvote ${comment.userVote === 'down' ? 'active' : ''}`}
              onClick={() => onVoteComment(comment.id, 'down')}
              aria-label="Downvote comment"
            >
              <DownvoteIcon />
            </button>
          </div>

          <div className="commentActions">
            <button 
              className="replyBtn"
              onClick={() => setActiveReply(activeReply === comment.id ? null : comment.id)}
              aria-label="Reply to comment"
            >
              Reply
            </button>
            {userData?.name === comment.author && (
              <>
                <button className="editBtn">
                  Edit
                </button>
                <button className="deleteBtn" onClick={() => onDeleteComment(comment.id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {activeReply === comment.id && (
          <div className="replyForm">
            <textarea
              placeholder="Write a reply..."
              value={replyContent[comment.id] || ''}
              onChange={(e) => setReplyContent({
                ...replyContent,
                [comment.id]: e.target.value
              })}
              rows={2}
              className="replyTextarea"
            />
            <div className="replyActions">
              <button 
                className="cancelReply"
                onClick={() => setActiveReply(null)}
                aria-label="Cancel reply"
              >
                Cancel
              </button>
              <button 
                className="submitReply"
                onClick={() => onAddReply(replyContent[comment.id] || '', comment.id)}
                disabled={!replyContent[comment.id]?.trim()}
                aria-label="Submit reply"
              >
                Reply
              </button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.map(reply => (
          <CommentItem 
            key={reply.id} 
            comment={reply} 
            depth={depth + 1} 
            userData={userData}
            onVoteComment={onVoteComment}
            onAddReply={onAddReply}
            onDeleteComment={onDeleteComment}
            activeReply={activeReply}
            setActiveReply={setActiveReply}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
          />
        ))}
      </div>
    </div>
  );
}