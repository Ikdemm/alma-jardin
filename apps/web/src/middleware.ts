import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/api-client';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const isLogin = pathname === '/admin/login';

  if (pathname.startsWith('/admin') && !isLogin && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isLogin && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
