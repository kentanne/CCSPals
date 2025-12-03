'use client';

import { useState } from 'react';
import styles from './community.module.css';
import { toast } from 'react-toastify';
import { CommunityForumProps } from '@/interfaces/community';
import { Icons } from '@/components/atoms/Icons';
import CommentItem from '@/components/organisms/CommentItem';
import { formatTimeAgo, getVoteScore, updateCommentVote, removeCommentRecursive } from '@/utils/forumUtils';
import { useForumPosts } from '@/hooks/useForumPosts';
import { forumService } from '@/services/forumService';

export default function CommunityForumComponent({ 
  forumData, 
  userData, 
  onForumUpdate 
}: CommunityForumProps) {
  const {
    posts,
    setPosts,
    selectedPost,
    setSelectedPost,
    comments,
    setComments,
    newPost,
    setNewPost,
    newComment,
    setNewComment,
    replyContent,
    setReplyContent,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    postFilter,
    setPostFilter,
    isCreatingPost,
    setIsCreatingPost,
    showCommentsModal,
    setShowCommentsModal,
    activeReply,
    setActiveReply,
    categories,
    filteredPosts,
    fetchForumPosts
  } = useForumPosts(forumData, userData);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    try {
      const newPostData = await forumService.createPost(newPost, userData);
      setPosts(prev => [newPostData, ...prev]);
      setNewPost({ title: '', content: '', topics: 'General' });
      setIsCreatingPost(false);
      toast.success('Post created successfully!');
      onForumUpdate();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error creating post');
    }
  };

  const handleVotePost = async (postId: string, voteType: 'up' | 'down') => {
    try {
      await forumService.votePost(postId, voteType);
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const currentVote = post.userVote;
          let upvotes = post.upvotes;
          let downvotes = post.downvotes;

          if (currentVote === voteType) {
            if (voteType === 'up') upvotes = Math.max(0, upvotes - 1);
            else downvotes = Math.max(0, downvotes - 1);
            return { ...post, upvotes, downvotes, userVote: null };
          } else if (currentVote) {
            if (currentVote === 'up') upvotes = Math.max(0, upvotes - 1);
            else downvotes = Math.max(0, downvotes - 1);
            if (voteType === 'up') upvotes++;
            else downvotes++;
            return { ...post, upvotes, downvotes, userVote: voteType };
          } else {
            if (voteType === 'up') upvotes++;
            else downvotes++;
            return { ...post, upvotes, downvotes, userVote: voteType };
          }
        }
        return post;
      }));
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Error voting on post');
    }
  };

  const handleOpenComments = async (post: any) => {
    setSelectedPost(post);
    setShowCommentsModal(true);
    
    try {
      const commentsData = await forumService.getComments(post.id);
      setComments(commentsData);

      commentsData.forEach(comment => {
        if (comment.commentsCount && comment.commentsCount > 0) {
          fetchRepliesForComment(comment.id, post.id);
        }
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Error fetching comments');
    }
  };

  const handleAddComment = async (content: string, parentCommentId?: string) => {
    if (!content.trim() || !selectedPost) return;

    try {
      const newCommentData = await forumService.addComment(content, selectedPost.id, parentCommentId, userData);

      if (parentCommentId) {
        setComments(prev => prev.map(comment => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newCommentData],
              commentsCount: comment.commentsCount + 1
            };
          }
          return comment;
        }));
        setReplyContent(prev => ({ ...prev, [parentCommentId]: '' }));
        setActiveReply(null);
      } else {
        setComments(prev => [newCommentData, ...prev]);
        setNewComment('');
      }

      setPosts(prev => prev.map(post => 
        post.id === selectedPost.id 
          ? { ...post, commentsCount: post.commentsCount + 1 }
          : post
      ));

      setSelectedPost(prev => prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null);
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding comment');
    }
  };

  const handleVoteComment = async (commentId: string, voteType: 'up' | 'down') => {
    try {
      await forumService.voteComment(commentId, voteType);
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return updateCommentVote(comment, voteType);
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === commentId ? updateCommentVote(reply, voteType) : reply
            )
          };
        }
        return comment;
      }));
    } catch (error) {
      console.error('Error voting comment:', error);
      toast.error('Error voting on comment');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await forumService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      if (selectedPost?.id === postId) {
        setSelectedPost(null);
        setShowCommentsModal(false);
      }
      toast.success('Post deleted successfully!');
      onForumUpdate();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error deleting post');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await forumService.deleteComment(commentId);
      setComments(prev => removeCommentRecursive(prev, commentId));
      setPosts(prev => prev.map(p => p.id === selectedPost?.id ? { ...p, commentsCount: Math.max(0, p.commentsCount - 1) } : p));
      setSelectedPost(prev => prev ? { ...prev, commentsCount: Math.max(0, prev.commentsCount - 1) } : prev);
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error deleting comment');
    }
  };

  const fetchRepliesForComment = async (commentId: string, postId?: string) => {
    try {
      const targetPostId = postId || selectedPost?.id;
      if (!targetPostId) return;

      const replies = await forumService.getReplies(commentId, targetPostId);
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, replies } : c));
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  return (
    <div className={styles.communityForum}>
      {/* Sticky Header Section */}
      <div className={styles.stickyHeader}>
        <div className={styles.forumHeader}>
          <div className={styles.headerMain}>
            <div className={styles.headerTitle}>
              <h1>Community Forum</h1>
            </div>
          </div>
        </div>

        <div className={styles.forumControls}>
          <div className={styles.searchFilter}>
            <div className={styles.filterGroup}>
              <Icons.Filter />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search discussions"
              />
            </div>
            <div className={styles.customSelect}>
              <select 
                aria-label="Select category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.categoryFilter}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>
            <div className={styles.customSelect}>
              <select 
                aria-label="Filter posts"
                value={postFilter}
                onChange={(e) => setPostFilter(e.target.value as 'all' | 'my-posts')}
                className={styles.postFilter}
              >
                <option value="all">All Posts</option>
                <option value="my-posts">My Posts</option>
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>
          </div>
          
          <button 
            className={styles.createPostBtn}
            onClick={() => setIsCreatingPost(true)}
            aria-label="Create new post"
            title="Create new post"
          >
            + Create Post
          </button>
        </div>
      </div>

      {isCreatingPost && (
        <div className={styles.createPostModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Create New Post</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setIsCreatingPost(false)}
                aria-label="Close comments modal"
              >
                <Icons.Close />
              </button>
            </div>
            <form onSubmit={handleCreatePost}>
              <input
                type="text"
                placeholder="Post Title"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                required
                className={styles.titleInput}
              />
              <select
                value={newPost.topics}
                onChange={(e) => setNewPost(prev => ({ ...prev, topics: e.target.value }))}
                className={styles.categorySelect}
              >
                {categories.filter(cat => cat !== 'All').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <textarea
                placeholder="Post Content"
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                required
                className={styles.contentTextarea}
              />
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setIsCreatingPost(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  aria-label="Submit new post"
                >
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.postsGrid}>
        {filteredPosts.map(post => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.postContent}>
              <div className={styles.postHeader}>
                <div className={styles.postMeta}>
                  <span className={styles.postCategory}>{post.topics || 'General'}</span>
                  <span className={styles.postAuthor}>by {post.authorName}</span>
                  <span className={styles.postTime}>{formatTimeAgo(post.createdAt)}</span>
                </div>
                <h3 className={styles.postTitle}>{post.title}</h3>
              </div>
              
              <div className={styles.postBody}>
                <p className={styles.postPreview}>{post.content}</p>
              </div>

              <div className={styles.postFooter}>
                <div className={styles.postActions}>
                  {userData?.name === post.author && (
                    <>
                      <button className={styles.actionBtn}>
                        <Icons.Edit />
                        Edit
                      </button>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Icons.Delete />
                        Delete
                      </button>
                    </>
                  )}
                </div>
                
                <div className={styles.postRightActions}>
                  <button 
                    className={styles.commentsBtn}
                    onClick={() => handleOpenComments(post)}
                    aria-label="Open comment"
                  >
                    <Icons.Comments />
                    {post.commentsCount || 0}
                  </button>
                  
                  <div className={styles.voteSection}>
                    <button 
                      className={`${styles.voteButton} ${styles.upvote} ${post.userVote === 'up' ? styles.active : ''}`}
                      onClick={() => handleVotePost(post.id, 'up')}
                      aria-label="Upvote post"
                    >
                      <Icons.Upvote />
                    </button>
                    <span className={styles.voteCount}>
                      {getVoteScore(post.upvotes, post.downvotes)}
                    </span>
                    <button 
                      className={`${styles.voteButton} ${styles.downvote} ${post.userVote === 'down' ? styles.active : ''}`}
                      onClick={() => handleVotePost(post.id, 'down')}
                      aria-label="Downvote post"
                    >
                      <Icons.Downvote />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className={styles.noPosts}>
            <p>
              {postFilter === 'my-posts' 
                ? "You haven't created any posts yet." 
                : "No posts found matching your criteria."}
            </p>
            <button 
              className={styles.createFirstPostBtn}
              onClick={() => setIsCreatingPost(true)}
              aria-label="Create the first post"
            >
              {postFilter === 'my-posts' ? 'Create your first post!' : 'Create the first post!'}
            </button>
          </div>
        )}
      </div>

      {/* Split-View Comments Modal */}
      {showCommentsModal && selectedPost && (
        <div className={styles.commentsModal}>
          <div className={styles.modalOverlay} onClick={() => setShowCommentsModal(false)} />
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Discussion</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowCommentsModal(false)}
                aria-label="Close comments modal"
              >
                <Icons.Close />
              </button>
            </div>
            
            <div className={styles.modalSplitView}>
              {/* Left Side - Post Details */}
              <div className={styles.postSidebar}>
                <div className={styles.postCardDetailed}>
                  <div className={styles.postHeader}>
                    <div className={styles.postMeta}>
                      <span className={styles.postCategory}>{selectedPost.topics || 'General'}</span>
                      <span className={styles.postAuthor}>by {selectedPost.authorName}</span>
                      <span className={styles.postTime}>{formatTimeAgo(selectedPost.createdAt)}</span>
                    </div>
                  </div>
                  
                  <h3 className={styles.postTitle}>{selectedPost.title}</h3>
                  <div className={styles.postContentDetailed}>
                    {selectedPost.content}
                  </div>
                  
                  <div className={styles.postStats}>
                    <div className={styles.statGroup}>
                      <div className={styles.statItem}>
                        <Icons.Comments />
                        <span>{selectedPost.commentsCount || 0} comments</span>
                        <div className={styles.voteSection}>
                          <button 
                            className={`${styles.voteButton} ${styles.upvote} ${selectedPost.userVote === 'up' ? styles.active : ''}`}
                            onClick={() => handleVotePost(selectedPost.id, 'up')}
                            aria-label="Upvote post"
                          >
                            <Icons.Upvote />
                          </button>
                          <span className={styles.voteCount}>
                            {getVoteScore(selectedPost.upvotes, selectedPost.downvotes)}
                          </span>
                          <button 
                            className={`${styles.voteButton} ${styles.downvote} ${selectedPost.userVote === 'down' ? styles.active : ''}`}
                            onClick={() => handleVotePost(selectedPost.id, 'down')}
                            aria-label="Downvote post"
                          >
                            <Icons.Downvote />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.commentForm}>
                    <div className={styles.currentUser}>
                      Commenting as <strong>{userData?.name || 'Anonymous'}</strong>
                    </div>
                    <textarea
                      placeholder="Share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className={styles.commentTextarea}
                    />
                    <button 
                      className={styles.commentSubmit}
                      onClick={() => handleAddComment(newComment)}
                      disabled={!newComment.trim()}
                      aria-label="Post comment"
                    >
                      Post Comment
                    </button>
                  </div>

                  {userData?.name === selectedPost.author && (
                    <div className={styles.ownerActions}>
                      <button className={styles.actionBtn}>
                        <Icons.Edit />
                        Edit
                      </button>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => handleDeletePost(selectedPost.id)}
                      >
                        <Icons.Delete />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Comments Only */}
              <div className={styles.commentsSidebar}>
                <div className={styles.commentSection}>
                  <div className={styles.commentsList}>
                    <h4 className={styles.commentsTitle}>
                      {comments.length} Comment{comments.length !== 1 ? 's' : ''}
                    </h4>
                    <div className={styles.commentsContainer}>
                      {comments.map(comment => (
                        <CommentItem 
                          key={comment.id} 
                          comment={comment} 
                          userData={userData}
                          onVoteComment={handleVoteComment}
                          onAddReply={handleAddComment}
                          onDeleteComment={handleDeleteComment}
                          activeReply={activeReply}
                          setActiveReply={setActiveReply}
                          replyContent={replyContent}
                          setReplyContent={setReplyContent}
                        />
                      ))}
                      
                      {comments.length === 0 && (
                        <div className={styles.noComments}>
                          <p>No comments yet. Be the first to share your thoughts!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}