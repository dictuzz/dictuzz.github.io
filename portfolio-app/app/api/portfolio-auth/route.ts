import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { DEFAULT_PORTFOLIO_ACCESS_KEY, PORTFOLIO_ACCESS_COOKIE } from '@/lib/auth';

export async function POST(request: Request) {
  const formData = await request.formData();
  const passphrase = String(formData.get('passphrase') || '').trim();
  const next = String(formData.get('next') || '/portfolio/');
  const secret = process.env.PORTFOLIO_ACCESS_KEY || DEFAULT_PORTFOLIO_ACCESS_KEY;

  if (passphrase !== secret) {
    return NextResponse.redirect(new URL('/resume/#connect', request.url), 303);
  }

  const cookieStore = await cookies();
  cookieStore.set(PORTFOLIO_ACCESS_COOKIE, 'granted', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12
  });

  return NextResponse.redirect(new URL(next, request.url), 303);
}
