import api from '@/lib/axios';
import { Post, Comment } from '@/interfaces/community';
import { toast } from 'react-toastify';

export const forumService = {
  async createPost(payload: { title: string; content: string; topics: string }, userData: any) {
    const response = await api.post('/api/forum/posts', payload, { withCredentials: true });
    
    if (response.status === 201) {
      const created = response.data;
      const newPostData: Post = {
        id: created._id || created.id || '',
        title: created.title || payload.title,
        content: created.content || payload.content,
        author: created.author || '',
        authorName: created.authorName || userData?.name || 'Anonymous',
        createdAt: created.createdAt || new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        commentsCount: 0,
        topics: created.topics || payload.topics,
        tags: [],
        userVote: null
      };
      return newPostData;
    }
    throw new Error('Failed to create post');
  },

  async votePost(postId: string, voteType: 'up' | 'down') {
    const endpoint = voteType === 'up' 
      ? `/api/forum/posts/upvote/${postId}` 
      : `/api/forum/posts/downvote/${postId}`;
    
    return await api.post(endpoint, {}, { withCredentials: true });
  },

  async getComments(postId: string) {
    const response = await api.get(`/api/forum/posts/comments/${postId}`, { withCredentials: true });
    
    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data.map((c: any) => ({
        id: c.id || '',
        content: c.content || '',
        author: c.author || '',
        authorName: c.authorName || 'Anonymous',
        createdAt: c.createdAt || new Date().toISOString(),
        upvotes: typeof c.upvotes === 'number' ? c.upvotes : 0,
        downvotes: typeof c.downvotes === 'number' ? c.downvotes : 0,
        commentsCount: typeof c.commentsCount === 'number' ? c.commentsCount : 0,
        postId: postId,
        userVote: null,
        replies: []
      }));
    }
    throw new Error('Failed to fetch comments');
  },

  async addComment(content: string, postId: string, parentCommentId?: string, userData?: any) {
    const endpoint = parentCommentId 
      ? `/api/forum/comments/${parentCommentId}`
      : `/api/forum/posts/comment/${postId}`;
    
    const response = await api.post(endpoint, { content }, { withCredentials: true });

    if (response.status === 201) {
      const created = response.data;
      return {
        id: created._id || created.id || '',
        content: created.content || content,
        author: created.author || '',
        authorName: created.authorName || userData?.name || 'Anonymous',
        createdAt: created.createdAt || new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        commentsCount: 0,
        postId: postId,
        parentCommentId,
        userVote: null,
        replies: []
      };
    }
    throw new Error('Failed to add comment');
  },

  async voteComment(commentId: string, voteType: 'up' | 'down') {
    const endpoint = voteType === 'up' 
      ? `/api/forum/comments/upvote/${commentId}`
      : `/api/forum/comments/downvote/${commentId}`;
    
    return await api.post(endpoint, {}, { withCredentials: true });
  },

  async deletePost(postId: string) {
    return await api.delete(`/api/forum/posts/${postId}`, { withCredentials: true });
  },

  async deleteComment(commentId: string) {
    return await api.delete(`/api/forum/comments/${commentId}`, { withCredentials: true });
  },

  async getReplies(commentId: string, postId?: string) {
    const response = await api.get(`/api/forum/comments/replies/${commentId}`, { withCredentials: true });
    
    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data.map((r: any) => ({
        id: r.id || r._id || '',
        content: r.content || '',
        author: r.author || '',
        authorName: r.authorName || 'Anonymous',
        createdAt: r.createdAt || new Date().toISOString(),
        upvotes: typeof r.upvotes === 'number' ? r.upvotes : 0,
        downvotes: typeof r.downvotes === 'number' ? r.downvotes : 0,
        commentsCount: typeof r.commentsCount === 'number' ? r.commentsCount : 0,
        postId: postId,
        userVote: null,
        replies: []
      }));
    }
    throw new Error('Failed to fetch replies');
  }
};