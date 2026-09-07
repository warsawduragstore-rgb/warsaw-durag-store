import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/adminAuth';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();

  // 1. Admin Session Authentication Check
  if (pathname === '/admin' || (pathname.startsWith('/admin/') && pathname !== '/admin/login')) {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = await verifyAdminSessionToken(sessionCookie);

    if (!isValid) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already authenticated and visiting /admin/login, redirect to /admin dashboard
  if (pathname === '/admin/login') {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = await verifyAdminSessionToken(sessionCookie);
    if (isValid) {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  // 2. 301 Redirect secondary domains (e.g., .com or www) to target production domain
  if (host === 'warsawduragstore.com' || host === 'www.warsawduragstore.com' || host === 'www.warsawduragstore.pl') {
    url.host = 'warsawduragstore.pl';
    url.port = '';
    url.protocol = 'https:';
    return NextResponse.redirect(url, { status: 301 });
  }

  const response = NextResponse.next();

  // 3. Add X-Robots-Tag: noindex, nofollow for admin and preview/non-production domains
  const isMainProductionDomain = host === 'warsaw-durag-store.vercel.app' || host === 'warsawduragstore.pl';
  const isPreviewDomain = host.includes('vercel.app') && !isMainProductionDomain;
  const isNonProduction = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
  const isAdmin = pathname.startsWith('/admin');

  if (isPreviewDomain || isNonProduction || isAdmin) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)).*)'],
};
