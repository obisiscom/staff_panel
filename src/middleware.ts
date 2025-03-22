import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenExpired } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const refreshToken = request.cookies.get('refresh-token')?.value;
  const { pathname } = request.nextUrl;

  // Auth gerektiren sayfa kontrolü
  const isAuthPage = pathname.startsWith('/dashboard') || 
                     pathname.startsWith('/settings') ||
                     pathname.startsWith('/profile');
                     
  // Login veya register sayfası kontrolü
  const isAuthRoute = pathname.startsWith('/login') || 
                      pathname.startsWith('/register');

  // Token var ama süresi dolmuşsa ve refresh token yoksa logout yap
  if (token && isTokenExpired(token) && !refreshToken) {
    // Tüm cookie'leri temizle
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    response.cookies.delete('refresh-token');
    return response;
  }

  // Auth sayfaları için yönlendirme
  if (isAuthPage && (!token || (isTokenExpired(token) && !refreshToken))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Zaten giriş yapmış kullanıcıyı login/register sayfalarından dashboard'a yönlendir
  if (isAuthRoute && token && !isTokenExpired(token)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Middleware'in çalışacağı yollar
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
};