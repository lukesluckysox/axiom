import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, deleteSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (token) {
      await deleteSession(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[logout]', err);
    return NextResponse.json({ success: true });
  }
}
