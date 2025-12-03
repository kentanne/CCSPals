import { useState, useEffect } from 'react';
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

  const fetchExistingFeedbacks = async () => {
    try {
      const endpoint = type === 'learner' 
        ? '/api/learner/feedback-given'
        : '/api/mentor/feedbacks';
      
      const response = await api.get(endpoint);
      console.log('Existing feedbacks:', response.data);
      setExistingFeedbacks(response.data);
      return response.data;
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
    fetchExistingFeedbacks();
  }, []);

  useEffect(() => {
    console.log("Initial schedules received:", initialSchedules);
    console.log("Existing feedbacks:", existingFeedbacks);
    
    if (initialSchedules && initialSchedules.length > 0) {
      const transformedRecords = initialSchedules.map(schedule => 
        transformScheduleToFeedback(schedule, existingFeedbacks, type)
      );
      setRecords(transformedRecords);
      console.log("Transformed records with feedback:", transformedRecords);
    } else if (initialFeedbacks && initialFeedbacks.length > 0) {
      setRecords(initialFeedbacks);
      console.log("Using initial feedbacks:", initialFeedbacks);
    }
  }, [initialSchedules, initialFeedbacks, existingFeedbacks, type]);

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