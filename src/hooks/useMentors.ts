import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { transformMentorData } from '@/utils/transformers';

export interface Mentor {
  id: string;
  userName: string;
  yearLevel: string;
  course: string;
  image_url: string;
  proficiency: string;
  rating_ave: number;
}

export const useMentors = () => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [transformedMentors, setTransformedMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMentors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.fetchMentors();
      // Ensure data is always an array
      const mentorsArray = Array.isArray(data) ? data : (data?.mentors || []);
      setMentors(mentorsArray);
      
      // Transform mentor data
      const transformed = transformMentorData(mentorsArray);
      setTransformedMentors(transformed);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching mentors:', err);
      setMentors([]);
      setTransformedMentors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return {
    mentors,
    transformedMentors,
    isLoading,
    error,
    refetch: fetchMentors
  };
};
