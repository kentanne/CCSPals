/**
 * Middleware utilities for authentication and routing
 */

import { NextRequest } from 'next/server';

/**
 * Extract and decode JWT token from request
 * Note: In production, use a proper JWT library for security
 */
export function extractToken(request: NextRequest): string | null {
  // Check cookie first (try both possible names for compatibility)
  const cookieToken = request.cookies.get('mindmate_token')?.value || 
                      request.cookies.get('MindMateToken')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Check if user is authenticated based on token presence
 * For full validation, API should be called
 */
export function isAuthenticated(request: NextRequest): boolean {
  return extractToken(request) !== null;
}

/**
 * Check if path is a public route
 */
export function isPublicRoute(pathname: string): boolean {
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/info/learner',
    '/info/mentor',
  ];

  return publicPaths.some(path => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  });
}

/**
 * Check if path is a protected route
 */
export function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = ['/learner', '/mentor'];
  return protectedPaths.some(path => pathname.startsWith(path));
}

/**
 * Check if path should be excluded from middleware
 */
export function shouldExclude(pathname: string): boolean {
  const excludePatterns = [
    '/api/',
    '/_next/',
    '/img/',
    '/svg/',
    '/public/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.json',
  ];

  return excludePatterns.some(pattern => pathname.startsWith(pattern));
}

/**
 * Get redirect URL for unauthenticated users
 */
export function getLoginRedirectUrl(request: NextRequest): URL {
  const loginUrl = new URL('/auth/login', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return loginUrl;
}

/**
 * Get user agent information
 */
export function getUserAgent(request: NextRequest): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  browser: string;
} {
  const userAgent = request.headers.get('user-agent') || '';

  const isMobile = /mobile/i.test(userAgent);
  const isTablet = /tablet|ipad/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;

  let browser = 'unknown';
  if (userAgent.includes('Chrome')) browser = 'chrome';
  else if (userAgent.includes('Safari')) browser = 'safari';
  else if (userAgent.includes('Firefox')) browser = 'firefox';
  else if (userAgent.includes('Edge')) browser = 'edge';

  return { isMobile, isTablet, isDesktop, browser };
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * In production, use Redis or similar
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count };
}

/**
 * Clean up old rate limit entries periodically
 */
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 60000); // Clean up every minute
}
