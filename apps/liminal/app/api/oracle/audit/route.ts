import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { query } from '@/lib/db';
import { isOracle } from '@/lib/permissions';

/**
 * GET /api/oracle/audit — Recent audit log entries.
 */
export async function GET() {
  try {
    const user = await getSession();
    if (!user || !isOracle(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const entries = await query<{
      id: string;
      action: string;
      details: unknown;
      created_at: Date;
      actor_email: string;
      target_email: string | null;
    }>(
      `SELECT a.id, a.action, a.details, a.created_at,
              actor.email AS actor_email,
              target.email AS target_email
       FROM audit_log a
       JOIN users actor ON a.actor_id = actor.id
       LEFT JOIN users target ON a.target_user_id = target.id
       ORDER BY a.created_at DESC
       LIMIT 50`
    );

    return NextResponse.json({
      entries: entries.map((e) => ({
        ...e,
        created_at: e.created_at instanceof Date ? e.created_at.toISOString() : String(e.created_at),
      })),
    });
  } catch (err) {
    console.error('[oracle/audit]', err);
    return NextResponse.json({ error: 'Failed to load audit log' }, { status: 500 });
  }
}
