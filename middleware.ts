import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected and role-specific routes
const protectedRoutes = ['/dashboard', '/agents', '/map'];
const adminRoutes = ['/admin', '/department'];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/signup') ||
                      request.nextUrl.pathname.startsWith('/forgot-password');

  // If user is accessing an auth route and has a session, redirect to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check generic protected routes
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check /admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) return NextResponse.redirect(new URL('/login', request.url));
    if (userRole !== 'super_admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Check /department route
  if (request.nextUrl.pathname.startsWith('/department')) {
    if (!session) return NextResponse.redirect(new URL('/login', request.url));
    if (userRole !== 'department_admin' && userRole !== 'super_admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
