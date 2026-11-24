import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ALLOWED = ['USER', 'CHARITY', 'ADMIN'];

export async function POST(req: Request) {
  const { role } = await req.json();
  const intent = ALLOWED.includes(role) ? role : 'USER';
  const cookieStore = await cookies();
  cookieStore.set('oauth_intent', intent, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 300,
    path: '/',
  });
  return NextResponse.json({ ok: true, role: intent });
}
