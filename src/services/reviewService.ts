import api from '@/lib/axios';
import { Feedback } from '@/interfaces/reviews';
import notify from '@/lib/toast';

export const reviewService = {
  async submitFeedback(
    scheduleId: string, 
    mentorId: string, 
    rating: number, 
    comments: string, 
    type: 'learner' | 'mentor'
  ) {
    // Mock implementation - simulate successful submission
    // In a real app, this would call the API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Feedback submitted successfully',
          feedbackId: `FB-${Date.now()}`,
          scheduleId,
          mentorId,
          rating,
          comments,
          createdAt: new Date().toISOString()
        });
      }, 500); // Simulate network delay
    });
    
    // Original API implementation (disabled for mock data)
    // if (type === 'learner') {
    //   const response = await api.post(`/api/learner/feedback/${scheduleId}`, {
    //     schedule: scheduleId,
    //     rating: rating,
    //     comments: comments
    //   });
    //   return response.data;
    // }
    // throw new Error('Mentor feedback submission not implemented');
  },

  async updateRecord(
    recordId: string, 
    updates: Partial<Feedback>, 
    setRecords: React.Dispatch<React.SetStateAction<Feedback[]>>
  ) {
    setRecords(prev => prev.map(r => r.id === recordId ? { ...r, ...updates } : r));
  },

  handleSubmitError(error: any) {
    console.error('Error submitting feedback:', error);
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || 'Failed to submit feedback';
      if (statusCode === 401) {
        notify.error('Session expired. Please log in again.');
        if (typeof window !== 'undefined') window.location.href = '/auth/login';
      } else if (statusCode === 403) {
        notify.error('You are not authorized to perform this action.');
      } else if (statusCode === 400) {
        notify.error(errorMessage);
      } else {
        notify.error(`Server error: ${errorMessage}`);
      }
    } else if (error.request) {
      notify.error('Network error. Please check your connection and try again.');
    } else {
      notify.error('Unexpected error. Please try again.');
    }
  }
};