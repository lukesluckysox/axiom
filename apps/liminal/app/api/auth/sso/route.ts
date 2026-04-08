import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { queryOne, execute } from '@/lib/db';
import { createSession, COOKIE_OPTIONS, COOKIE_NAME } from '@/lib/auth/session';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || '4gLtMuM38OkYGIpM1SCD+QQLgBPqgrKFB3aZeObkaqobhpeFOCV3NkAMW2dyOS17';

interface SSOPayload {
  userId: number | string;
  username: string;
  email?: string;
  sso: boolean;
}

// GET /api/auth/sso?token=...&redirect=...
// Exchanges a Lumen OS SSO token for a Liminal session.
// Finds user by email, or creates a shadow account if none exists.
// Links lumen_user_id so cross-app feeds work.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const redirect = searchParams.get('redirect');

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as SSOPayload;

    if (!payload.sso || !payload.email) {
      return NextResponse.json({ error: 'Invalid SSO token' }, { status: 400 });
    }

    // Find existing user by email
    let user = await queryOne<{ id: string }>(
      `SELECT id FROM users WHERE email = $1`,
      [payload.email]
    );

    if (!user) {
      // Create a shadow account — no real password needed for SSO users
      const randomHash = await bcrypt.hash(randomUUID(), 4);
      user = await queryOne<{ id: string }>(
        `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id`,
        [payload.email, randomHash]
      );
    }

    if (!user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    // Link lumen_user_id (idempotent)
    await execute(
      `UPDATE users SET lumen_user_id = $1 WHERE id = $2`,
      [String(payload.userId), user.id]
    );

    // Create session + set cookie
    const sessionToken = await createSession(user.id);

    const dest = redirect && redirect.startsWith('/') ? redirect : '/';
    const response = NextResponse.redirect(new URL(dest, request.url));
    response.cookies.set(COOKIE_NAME, sessionToken, COOKIE_OPTIONS);

    return response;
  } catch (err) {
    console.error('[liminal/sso] token error:', err);
    return NextResponse.json(
      { error: 'Invalid or expired token. Please re-enter from Lumen.' },
      { status: 401 }
    );
  }
}
