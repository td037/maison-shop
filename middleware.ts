import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Routes that require authentication
const protectedRoutes = ['/account', '/admin', '/checkout', '/cart'];

export function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get('auth-token')?.value;

    console.log('🔍 Middleware check:', { pathname, hasToken: !!token, tokenPreview: token?.substring(0, 10) });

    // Check if route is protected
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

    // If accessing protected route without token
    if (isProtected && !token) {
      console.log('❌ Protected route but no token, redirecting to login');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // If accessing protected route with token
    if (isProtected && token) {
      const decoded = verifyToken(token);
      console.log('✓ Token verification:', { isValid: !!decoded, userId: decoded?.userId });
      if (!decoded) {
        console.log('❌ Token invalid, redirecting to login');
        const response = NextResponse.redirect(new URL('/login', req.url));
        response.cookies.set('auth-token', '', { maxAge: -1 });
        return response;
      }
    }

    // If accessing login/signup with valid token, redirect to home
    if ((pathname === '/login' || pathname === '/signup') && token) {
      const decoded = verifyToken(token);
      if (decoded) {
        console.log('✓ Authenticated user accessing login/signup, redirecting to home');
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico).*)',
  ],
};
