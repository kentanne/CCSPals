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
  ANALYTICS: {
    LEARNER: '/learner/analytics',
    MENTOR: '/mentor/session/analytics'
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    CHECK: '/api/auth/check',
    SIGNUP: {
      LEARNER: '/api/auth/learner/signup',
      MENTOR: '/api/auth/mentor/signup'
    }
  }
} as const;