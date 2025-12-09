import { useState, useEffect, useRef } from 'react';
import { Feedback, FeedbackFromAPI } from '@/interfaces/reviews';
import api from '@/lib/axios';
import { transformScheduleToFeedback } from '@/utils/reviewUtils';

interface UseReviewsProps {
  initialSchedules?: any[];
  initialFeedbacks?: Feedback[];
  type: 'mentor' | 'learner';
  userData?: any;
}

export const useReviews = ({ 
  initialSchedules = [], 
  initialFeedbacks = [], 
  type,
  userData 
}: UseReviewsProps) => {
  const [records, setRecords] = useState<Feedback[]>([]);
  const [recordView, setRecordView] = useState<Feedback | null>(null);
  const [isFeedback, setIsFeedback] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempRating, setTempRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFeedbacks, setExistingFeedbacks] = useState<FeedbackFromAPI[]>([]);
  const initializedRef = useRef(false);

  const fetchExistingFeedbacks = async () => {
    // Disabled for mock data - return empty array
    // This prevents API calls when using hardcoded feedback data
    try {
      // const endpoint = type === 'learner' 
      //   ? '/api/learner/feedback-given'
      //   : '/api/mentor/feedbacks';
      
      // const response = await api.get(endpoint);
      // setExistingFeedbacks(response.data);
      // return response.data;
      
      setExistingFeedbacks([]);
      return [];
    } catch (error: any) {
      console.error('Error fetching existing feedbacks:', error);
      if (error.response?.status === 404) {
        setExistingFeedbacks([]);
        return [];
      }
      return [];
    }
  };

  useEffect(() => {
    // Disabled API call for mock data
    // fetchExistingFeedbacks();
  }, []);

  useEffect(() => {
    // Only initialize once to prevent infinite loops
    if (initializedRef.current) {
      return;
    }
    
    if (initialSchedules && initialSchedules.length > 0) {
      const transformedRecords = initialSchedules.map(schedule => 
        transformScheduleToFeedback(schedule, existingFeedbacks, type)
      );
      setRecords(transformedRecords);
      initializedRef.current = true;
    } else if (initialFeedbacks && initialFeedbacks.length > 0) {
      setRecords(initialFeedbacks);
      initializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const viewFeedback = (record: Feedback) => {
    setIsFeedback(true);
    setRecordView(record);
    setTempRating(record.rating || 0);
    setFeedbackText(record.comment || '');
  };

  const closeFeedback = () => {
    setIsFeedback(false);
    setRecordView(null);
    setTempRating(0);
    setHoverRating(0);
    setFeedbackText('');
  };

  const handleSetRating = (rating: number) => {
    setTempRating(rating);
  };

  return {
    records,
    setRecords,
    recordView,
    setRecordView,
    isFeedback,
    setIsFeedback,
    searchQuery,
    setSearchQuery,
    tempRating,
    setTempRating,
    hoverRating,
    setHoverRating,
    feedbackText,
    setFeedbackText,
    isSubmitting,
    setIsSubmitting,
    existingFeedbacks,
    setExistingFeedbacks,
    viewFeedback,
    closeFeedback,
    handleSetRating,
    fetchExistingFeedbacks
  };
};