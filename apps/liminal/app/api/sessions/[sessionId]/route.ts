import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { queryOne } from '@/lib/db';

interface Params {
  params: { sessionId: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = params;

    const session = await queryOne<{
      id: string;
      tool_slug: string;
      title: string;
      input_text: string;
      structured_output: unknown;
      summary: string;
      created_at: Date;
    }>(
      `SELECT id, tool_slug, title, input_text, structured_output, summary, created_at
       FROM tool_sessions
       WHERE id = $1 AND user_id = $2`,
      [sessionId, user.id]
    );

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ session });
  } catch (err) {
    console.error('[session-get]', err);
    return NextResponse.json({ error: 'Failed to load session' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = params;

    const session = await queryOne<{ id: string }>(
      `DELETE FROM tool_sessions
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [sessionId, user.id]
    );

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[session-delete]', err);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
