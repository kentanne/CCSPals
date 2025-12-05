import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  isAuthenticated,
  isPublicRoute,
  isProtectedRoute,
  shouldExclude,
  getLoginRedirectUrl,
  getUserAgent,
  checkRateLimit,
} from '@/lib/middlewareUtils';

/**
 * Security headers to be added to all responses
 */
const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'on',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Main middleware function
 * Handles:
 * - Authentication checks
 * - Protected route access
 * - Security headers
 * - Rate limiting
 * - Device detection
 * - Redirect management
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for excluded paths (API, static files, etc.)
  if (shouldExclude(pathname)) {
    return NextResponse.next();
  }

  // Rate limiting for authentication routes to prevent brute force
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/api/auth/login')) {
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
    const rateLimit = checkRateLimit(`login:${ip}`, 10, 60000); // 10 requests per minute
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }
  }

  // Handle public routes - allow access
  if (isPublicRoute(pathname)) {
    const response = NextResponse.next();
    
    // Add security headers
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }

  // Handle protected routes - check authentication
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated(request)) {
      // Store the intended destination for redirect after login
      const loginUrl = getLoginRedirectUrl(request);
      
      const response = NextResponse.redirect(loginUrl);
      
      // Add security headers
      Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      // Set headers for debugging/logging
      response.headers.set('X-Middleware-Redirect', 'unauthenticated');
      response.headers.set('X-Redirect-From', pathname);
      
      return response;
    }
  }

  // Let authenticated users access auth pages
  // This allows client-side redirects to work after login
  // The client-side code will handle redirecting to appropriate dashboard

  // Device detection - add custom header for responsive behavior
  const deviceInfo = getUserAgent(request);
  const response = NextResponse.next();
  
  // Add device type header for server-side rendering optimization
  if (deviceInfo.isMobile) {
    response.headers.set('X-Device-Type', 'mobile');
  } else if (deviceInfo.isTablet) {
    response.headers.set('X-Device-Type', 'tablet');
  } else {
    response.headers.set('X-Device-Type', 'desktop');
  }
  
  // Add security headers to all responses
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add browser info for analytics/debugging
  response.headers.set('X-Browser', deviceInfo.browser);
  
  return response;
}

// Configure which routes should run through middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - Image files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
