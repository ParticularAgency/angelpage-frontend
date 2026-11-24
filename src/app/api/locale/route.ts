import { NextResponse } from 'next/server';
import { LOCALE_COOKIE } from '@/i18n/messages';

export function GET(request: Request) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') === 'fr' ? 'fr' : 'en';
  const next = url.searchParams.get('next') || '/';
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/';
  const host = request.headers.get('host') || url.host;
  const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
  const response = NextResponse.redirect(`${proto}://${host}${safeNext}`);
  response.cookies.set(LOCALE_COOKIE, lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return response;
}
