import api from '@/lib/axios';
import { SessionItem } from '@/interfaces/session';

// Helper to get cookie value
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export const sessionService = {
  async sendReminder(scheduleId: string | number) {
    const token = getCookie('MindMateToken');
    return await api.post(`/api/mentor/remind-sched/${scheduleId}`, {}, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  },

  async cancelSession(scheduleId: string | number, userType: 'mentor' | 'learner') {
    const token = getCookie('MindMateToken');
    const endpoint = userType === 'mentor' 
      ? `/api/mentor/cancel-sched/${scheduleId}`
      : `/api/learner/cancel-sched/${scheduleId}`;
    
    return await api.post(endpoint, {}, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  },

  async rescheduleSession(
    scheduleId: string | number, 
    date: string, 
    time: string, 
    userType: 'mentor' | 'learner'
  ) {
    const token = getCookie('MindMateToken');
    const endpoint = userType === 'mentor' 
      ? `/api/mentor/resched-sched/${scheduleId}`
      : `/api/learner/resched-sched/${scheduleId}`;
    
    return await api.post(endpoint, {
      date,
      time,
    }, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  },

  updateLocalSchedules(
    scheduleId: string | number,
    updates: Partial<SessionItem>,
    setTodaySchedule: React.Dispatch<React.SetStateAction<SessionItem[]>>,
    setUpcomingSchedule: React.Dispatch<React.SetStateAction<SessionItem[]>>
  ) {
    const updateSchedule = (schedule: SessionItem[]) => 
      schedule.map(session => 
        String(session.id) === String(scheduleId) ? { ...session, ...updates } : session
      );

    setTodaySchedule(prev => updateSchedule(prev));
    setUpcomingSchedule(prev => updateSchedule(prev));
  },

  removeFromSchedules(
    scheduleId: string | number,
    setTodaySchedule: React.Dispatch<React.SetStateAction<SessionItem[]>>,
    setUpcomingSchedule: React.Dispatch<React.SetStateAction<SessionItem[]>>
  ) {
    setTodaySchedule(prev => prev.filter(session => String(session.id) !== String(scheduleId)));
    setUpcomingSchedule(prev => prev.filter(session => String(session.id) !== String(scheduleId)));
  }
};