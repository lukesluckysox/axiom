import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const toolSlug = searchParams.get('tool');
    const limitParam = searchParams.get('limit');
    const limit = Math.min(parseInt(limitParam ?? '50', 10), 100);

    let sql = `
      SELECT id, tool_slug, title, summary, created_at
      FROM tool_sessions
      WHERE user_id = $1
    `;
    const params: unknown[] = [user.id];

    if (toolSlug) {
      sql += ` AND tool_slug = $2`;
      params.push(toolSlug);
    }

    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const sessions = await query<{
      id: string;
      tool_slug: string;
      title: string;
      summary: string;
      created_at: Date;
    }>(sql, params);

    return NextResponse.json({ sessions });
  } catch (err) {
    console.error('[sessions]', err);
    return NextResponse.json({ error: 'Failed to load sessions' }, { status: 500 });
  }
}
