import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';

export const useSchedules = (role: 'learner' | 'mentor') => {
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState<any[]>([]);
  const [schedForReview, setSchedForReview] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.fetchSchedules(role);
      setTodaySchedule(data.todaySchedule || []);
      setUpcomingSchedule(data.upcomingSchedule || []);
      setSchedForReview(data.schedForReview || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching schedules:', err);
      setTodaySchedule([]);
      setUpcomingSchedule([]);
      setSchedForReview([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [role]);

  return {
    todaySchedule,
    upcomingSchedule,
    schedForReview,
    isLoading,
    error,
    refetch: fetchSchedules
  };
};
