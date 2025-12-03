export const API_ENDPOINTS = {
  PROFILE: {
    LEARNER: '/learner/profile',
    MENTOR: '/mentor/profile'
  },
  SCHEDULES: {
    LEARNER: '/learner/schedules',
    MENTOR: '/mentor/schedules'
  },
  MENTORS: '/learner/mentors',
  LEARNERS: '/mentor/learners',
  FEEDBACKS: '/mentor/feedbacks',
  FORUM: '/forum/posts',
  ANALYTICS: {
    LEARNER: '/learner/analytics',
    MENTOR: '/mentor/session/analytics'
  },
  AUTH: {
    SWITCH_ROLE: '/auth/switch-role',
    LOGOUT: '/auth/logout'
  },
  PUSHER_AUTH: '/pusher/auth'
} as const;