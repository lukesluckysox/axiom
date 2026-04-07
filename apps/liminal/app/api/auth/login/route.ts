import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { queryOne } from '@/lib/db';
import { createSession, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth/session';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const lowerEmail = email.toLowerCase().trim();

    const user = await queryOne<{ id: string; password_hash: string }>(
      'SELECT id, password_hash FROM users WHERE email = $1',
      [lowerEmail]
    );

    // Constant-time comparison to prevent timing attacks
    const dummyHash =
      '$2a$12$invalidhashinvalidhashinvalidhashinvalidhashinvalidhas';
    const hashToCheck = user?.password_hash ?? dummyHash;
    const match = await bcrypt.compare(password, hashToCheck);

    if (!user || !match) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await createSession(user.id);

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);

    return response;
  } catch (err) {
    console.error('[login]', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
