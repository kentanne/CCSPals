import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';

export interface Learner {
  id: string;
  name: string;
  yearLevel: string;
  program: string;
  image: string;
  subjects?: string[];
  style?: string[];
  goals?: string;
  bio?: string;
  modality?: string;
  availability?: string[];
}

export const useLearners = () => {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLearners = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.fetchLearners();
      // Ensure data is always an array
      const learnersArray = Array.isArray(data) ? data : (data?.learners || []);
      setLearners(learnersArray);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching learners:', err);
      setLearners([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, []);

  return {
    learners,
    isLoading,
    error,
    refetch: fetchLearners
  };
};
