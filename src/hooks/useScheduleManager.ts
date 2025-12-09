import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Schedule {
  scheduleId?: string;
  mentorName: string;
  learnerName: string;
  subject: string;
  modality: string;
  time: string;
  date: string;
  location: string;
  status?: string;
}

interface ScheduleManagerReturn {
  todaySchedules: Schedule[];
  upcomingSchedules: Schedule[];
  loading: boolean;
  error: string | null;
  fetchSchedules: () => Promise<void>;
  createSchedule: (schedule: Omit<Schedule, 'status' | 'scheduleId'>) => Promise<Schedule>;
}

export function useScheduleManager(userName: string, role: 'learner' | 'mentor'): ScheduleManagerReturn {
  const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch schedules for this user (by name and role)
  const fetchSchedules = async () => {
    if (!userName) return;
    
    setLoading(true);
    setError(null);
    try {
      const queryParam = role === 'learner' ? 'learnerName' : 'mentorName';
      const response = await axios.get(`/api/schedules?${queryParam}=${encodeURIComponent(userName)}`);
      
      setTodaySchedules(response.data.todaySchedules || []);
      setUpcomingSchedules(response.data.upcomingSchedules || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch schedules');
      setTodaySchedules([]);
      setUpcomingSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new schedule
  const createSchedule = async (schedule: Omit<Schedule, 'status' | 'scheduleId'>): Promise<Schedule> => {
    setLoading(true);
    setError(null);
    try {
      console.log('useScheduleManager - Creating schedule:', schedule);
      const response = await axios.post('/api/schedules', schedule);
      console.log('useScheduleManager - Schedule created:', response.data);
      await fetchSchedules(); // Refresh schedules after creating
      return response.data.schedule;
    } catch (err: any) {
      console.error('useScheduleManager - Error creating schedule:', err);
      console.error('useScheduleManager - Error response:', err.response?.data);
      setError(err.message || 'Failed to create schedule');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userName) {
      fetchSchedules();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, role]);

  return { 
    todaySchedules, 
    upcomingSchedules, 
    loading, 
    error, 
    fetchSchedules, 
    createSchedule 
  };
}
