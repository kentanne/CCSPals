/**
 * Caching Configuration for CCSPals Platform
 * Defines revalidation intervals and cache strategies for different data types
 */

export const CACHE_CONFIG = {
  // User-specific data (always fresh)
  USER_PROFILE: {
    revalidate: false as const,
    cache: 'no-store' as const,
  },

  // Session/Schedule data (short cache)
  SCHEDULES: {
    revalidate: 60, // 1 minute
    tags: ['schedules'],
  },

  // Mentor/Learner lists (moderate cache)
  USERS_LIST: {
    revalidate: 300, // 5 minutes
    tags: ['users'],
  },

  // Feedback/Reviews (moderate cache)
  FEEDBACKS: {
    revalidate: 120, // 2 minutes
    tags: ['feedbacks'],
  },

  // Static content (long cache or permanent)
  STATIC_CONTENT: {
    revalidate: 3600, // 1 hour
    tags: ['static'],
  },

  // Public pages (fully static)
  PUBLIC_PAGES: {
    cache: 'force-cache' as const,
  },
} as const;

/**
 * Cache tags for on-demand revalidation
 */
export const CACHE_TAGS = {
  SCHEDULES_LEARNER: 'schedules-learner',
  SCHEDULES_MENTOR: 'schedules-mentor',
  MENTORS: 'mentors',
  LEARNERS: 'learners',
  FEEDBACKS: 'feedbacks',
  USER_PROFILE: 'user-profile',
  STATIC_INFO: 'static-info',
} as const;

/**
 * Helper to get cache config for specific data type
 */
export function getCacheConfig(type: keyof typeof CACHE_CONFIG) {
  return CACHE_CONFIG[type];
}
