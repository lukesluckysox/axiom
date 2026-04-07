import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { execute, queryOne } from '@/lib/db';

const VALID_FEEDBACK = new Set(['clarifying', 'still_thinking', 'changed_view', null]);

interface RouteParams {
  params: { sessionId: string };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId } = params;
  const body = await req.json();
  const feedback: string | null = body.feedback ?? null;

  if (!VALID_FEEDBACK.has(feedback)) {
    return NextResponse.json({ error: 'Invalid feedback value' }, { status: 400 });
  }

  // Verify the session belongs to this user
  const session = await queryOne<{ id: string }>(
    `SELECT id FROM tool_sessions WHERE id = $1 AND user_id = $2`,
    [sessionId, user.id]
  );
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await execute(
    `UPDATE tool_sessions SET feedback = $1, updated_at = NOW() WHERE id = $2`,
    [feedback, sessionId]
  );

  return NextResponse.json({ ok: true });
}
