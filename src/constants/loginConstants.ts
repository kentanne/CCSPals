export const LOGIN_CONSTANTS = {
  PLACEHOLDERS: {
    INI_CRED: 'Enter your email, username, or Student ID',
    PASSWORD: 'Enter your password',
  },
  LABELS: {
    INI_CRED: 'DOMAIN LOGIN',
    PASSWORD: 'PASSWORD',
  },
  ARIA_LABELS: {
    PASSWORD_TOGGLE_SHOW: 'Show password',
    PASSWORD_TOGGLE_HIDE: 'Hide password',
    LOADING: 'Logging in...',
  },
  DESCRIPTIONS: {
    INI_CRED: 'Enter your email, username, or Student ID',
    PASSWORD: 'Enter your password. Use Tab to navigate to next field.',
  },
  ROUTES: {
    ADMIN: '/admin',
    MENTOR: '/mentor',
    LEARNER: '/learner',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
} as const;