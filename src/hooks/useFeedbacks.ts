import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';

export const useFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.fetchFeedbacks();
      setFeedbacks(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching feedbacks:', err);
      setFeedbacks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return {
    feedbacks,
    isLoading,
    error,
    refetch: fetchFeedbacks
  };
};
