export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};

export const calculateAttendanceRate = (schedules: any[]): number => {
  if (!schedules || schedules.length === 0) return 0;
  const completedSessions = schedules.filter(s => s.status === 'COMPLETED').length;
  return Math.round((completedSessions / schedules.length) * 100);
};