/**
 * Server-side data fetching utilities for Next.js App Router
 * These functions are used in Server Components for SSR, SSG, and ISR
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface FetchOptions {
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Generic fetch wrapper with error handling and caching support
 */
async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions & RequestInit = {}
): Promise<T | null> {
  const { cache, revalidate, tags, ...fetchOptions } = options;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      ...(cache && { cache }),
      ...(revalidate !== undefined && { next: { revalidate, tags } }),
    });

    if (!response.ok) {
      console.error(`API Error: ${endpoint} - ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    return null;
  }
}

/**
 * Fetch user profile data (SSR - always fresh)
 * Used in protected dashboard pages
 */
export async function fetchUserProfile(
  role: 'learner' | 'mentor',
  token: string
) {
  return fetchAPI(`/api/${role}/profile`, {
    cache: 'no-store', // Always fetch fresh data for user profiles
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `mindmate_token=${token}`,
    },
  });
}

/**
 * Fetch schedules (SSR with short cache)
 * Revalidate every 60 seconds
 */
export async function fetchSchedules(
  role: 'learner' | 'mentor',
  token: string
) {
  return fetchAPI(`/api/${role}/schedules`, {
    revalidate: 60, // Cache for 1 minute
    tags: [`schedules-${role}`],
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `mindmate_token=${token}`,
    },
  });
}

/**
 * Fetch mentors list (ISR - longer cache)
 * Revalidate every 5 minutes
 */
export async function fetchMentors(token?: string) {
  return fetchAPI('/api/learner/mentors', {
    revalidate: 300, // Cache for 5 minutes
    tags: ['mentors'],
    ...(token && {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `mindmate_token=${token}`,
      },
    }),
  });
}

/**
 * Fetch learners list (ISR - longer cache)
 * Revalidate every 5 minutes
 */
export async function fetchLearners(token?: string) {
  return fetchAPI('/api/mentor/learners', {
    revalidate: 300, // Cache for 5 minutes
    tags: ['learners'],
    ...(token && {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `mindmate_token=${token}`,
      },
    }),
  });
}

/**
 * Fetch feedbacks (ISR - moderate cache)
 * Revalidate every 2 minutes
 */
export async function fetchFeedbacks(token: string) {
  return fetchAPI('/api/mentor/feedbacks', {
    revalidate: 120, // Cache for 2 minutes
    tags: ['feedbacks'],
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `mindmate_token=${token}`,
    },
  });
}

/**
 * Fetch public data (SSG - static generation)
 * No revalidation - fully static
 */
export async function fetchPublicData<T>(endpoint: string): Promise<T | null> {
  return fetchAPI<T>(endpoint, {
    cache: 'force-cache', // Fully static
  });
}

/**
 * Fetch with on-demand revalidation
 * Used for frequently changing data
 */
export async function fetchWithRevalidation<T>(
  endpoint: string,
  tags: string[]
): Promise<T | null> {
  return fetchAPI<T>(endpoint, {
    revalidate: false, // Only revalidate on-demand
    tags,
  });
}

/**
 * Parallel data fetching helper
 * Fetches multiple endpoints simultaneously
 */
export async function fetchParallel<T extends Record<string, any>>(
  fetchers: Record<keyof T, () => Promise<any>>
): Promise<T> {
  const entries = Object.entries(fetchers);
  const results = await Promise.all(
    entries.map(([key, fetcher]) =>
      fetcher().then(data => [key, data] as const)
    )
  );

  return Object.fromEntries(results) as T;
}

/**
 * Check authentication status (SSR)
 */
export async function checkAuthStatus(token?: string) {
  if (!token) return { authenticated: false };

  return fetchAPI('/api/auth/check', {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `mindmate_token=${token}`,
    },
  });
}
