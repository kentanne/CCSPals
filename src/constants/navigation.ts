export interface TopbarItem {
  key: string;
  label: string;
  icon: string;
}

export const LEARNER_TOPBAR_ITEMS: TopbarItem[] = [
  { key: 'main', label: 'Mentors', icon: '/svg/main.svg' },
  { key: 'session', label: 'Schedules', icon: '/svg/calendar.svg' },
  { key: 'records', label: 'Reviews', icon: '/svg/records.svg' },
  { key: 'challenges', label: 'Challenges', icon: '/svg/challenges.svg' },
  { key: 'community', label: 'Community', icon: '/svg/community.svg' },
  { key: 'analytics', label: 'Analytics', icon: '/svg/analytics.svg' }
];

export const MENTOR_TOPBAR_ITEMS: TopbarItem[] = [
  { key: 'main', label: 'Learners', icon: '/svg/main.svg' },
  { key: 'session', label: 'Schedules', icon: '/svg/calendar.svg' },
  { key: 'reviews', label: 'Reviews', icon: '/svg/records.svg' },
  { key: 'files', label: 'Files', icon: '/svg/uploadCloud.svg' },
  { key: 'fileManage', label: 'File Manager', icon: '/svg/files.svg' },
  { key: 'challenges', label: 'Challenges', icon: '/svg/challenges.svg' },
  { key: 'community', label: 'Community', icon: '/svg/community.svg' },
  { key: 'analytics', label: 'Analytics', icon: '/svg/analytics.svg' }
];