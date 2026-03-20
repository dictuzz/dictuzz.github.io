import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PORTFOLIO_ACCESS_COOKIE, getPortfolioRedirectTarget } from '@/lib/auth';

const PUBLIC_PATHS = new Set([
  '/login',
  '/api/portfolio-auth'
]);

function normalizePathname(pathname: string) {
  const localPath = pathname.startsWith('/portfolio')
    ? pathname.slice('/portfolio'.length) || '/'
    : pathname;

  if (localPath.length > 1 && localPath.endsWith('/')) {
    return localPath.slice(0, -1);
  }

  return localPath;
}

export function proxy(request: NextRequest) {
  const pathname = normalizePathname(request.nextUrl.pathname);

  if (!pathname.startsWith('/') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const shouldProtect = pathname === '/' || pathname.startsWith('/work/');

  if (!shouldProtect) {
    return NextResponse.next();
  }

  const hasAccess = request.cookies.get(PORTFOLIO_ACCESS_COOKIE)?.value === 'granted';

  if (hasAccess) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/portfolio/login/';
  loginUrl.searchParams.set('next', getPortfolioRedirectTarget(request.nextUrl.pathname, request.nextUrl.search));

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/portfolio/:path*']
};
