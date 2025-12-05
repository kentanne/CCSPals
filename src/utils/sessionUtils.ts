import { SessionItem } from '@/interfaces/session';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (timeString: string) => {
  // If time is in HH:MM format, convert to 12-hour format
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const isOnlineSession = (location: string) => {
  if (!location) return false;
  const loc = location.toLowerCase().trim();
  return loc === 'online' || loc.includes('online');
};

export const getMentorId = (item: SessionItem): string | number => {
  return item.mentor?.id || item.mentor?.ment_inf_id || 0;
};

export const getLearnerName = (item: SessionItem) => {
  return item.learner?.name || "Unknown User";
};

export const getMentorName = (item: SessionItem) => {
  return item.mentor?.user?.name || item.mentor?.name || "Unknown Mentor";
};
