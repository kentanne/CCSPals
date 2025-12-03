import { useState, useEffect } from 'react';
import { Post, Comment } from '@/interfaces/community';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

export const useForumPosts = (initialPosts?: Post[], userData?: any) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', topics: 'General' });
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [postFilter, setPostFilter] = useState<'all' | 'my-posts'>('all');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [activeReply, setActiveReply] = useState<string | null>(null);

  const categories = ['All', 'Teaching Methods', 'Student Management', 'Curriculum', 'Technology', 'General'];

  const fetchForumPosts = async () => {
    try {
      const response = await api.get('/api/forum/posts', { withCredentials: true });
      
      if (response.status === 200 && Array.isArray(response.data)) {
        const mapped: Post[] = response.data.map((p: any) => ({
          id: p.id || '',
          title: p.title || '',
          content: p.content || '',
          author: p.author || '',
          authorName: p.authorName || 'Anonymous',
          createdAt: p.createdAt || new Date().toISOString(),
          upvotes: typeof p.upvotes === 'number' ? p.upvotes : 0,
          downvotes: typeof p.downvotes === 'number' ? p.downvotes : 0,
          commentsCount: typeof p.commentsCount === 'number' ? p.commentsCount : 0,
          topics: p.topics || 'General',
          tags: p.tags || [],
          userVote: null
        }));
        setPosts(mapped);
      } else {
        toast.error('Failed to load forum posts');
      }
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      toast.error('Error fetching forum posts');
    }
  };

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      const validatedPosts = initialPosts.map(post => ({
        id: post.id || '',
        title: post.title || '',
        content: post.content || '',
        author: post.author || '',
        authorName: post.authorName || 'Anonymous',
        createdAt: post.createdAt || new Date().toISOString(),
        upvotes: typeof post.upvotes === 'number' ? post.upvotes : 0,
        downvotes: typeof post.downvotes === 'number' ? post.downvotes : 0,
        commentsCount: typeof post.commentsCount === 'number' ? post.commentsCount : 0,
        topics: post.topics || 'General',
        tags: post.tags || [],
        userVote: post.userVote || null
      }));
      setPosts(validatedPosts);
      return;
    }

    fetchForumPosts();
  }, [initialPosts]);

  const filteredPosts = posts.filter(post => {
    const safeTitle = post.title?.toLowerCase() || '';
    const safeContent = post.content?.toLowerCase() || '';
    const safeSearchQuery = searchQuery.toLowerCase();
    
    const matchesSearch = safeTitle.includes(safeSearchQuery) || safeContent.includes(safeSearchQuery);
    const matchesCategory = selectedCategory === 'All' || post.topics === selectedCategory;
    const matchesPostFilter = postFilter === 'all' || post.authorName === userData?.name;
    
    return matchesSearch && matchesCategory && matchesPostFilter;
  });

  return {
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
  };
};