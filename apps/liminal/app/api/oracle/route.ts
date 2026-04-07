import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { query, queryOne } from '@/lib/db';
import { isOracle } from '@/lib/permissions';

/**
 * GET /api/oracle — Dashboard stats for oracle users.
 * Server-side oracle check: returns 403 if not oracle.
 */
export async function GET() {
  try {
    const user = await getSession();
    if (!user || !isOracle(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Run all stats queries in parallel
    const [
      totalUsersRow,
      planBreakdown,
      recentSignups,
      activeUsersRow,
      sessionsOverTime,
      sessionsByTool,
      topUsers,
      totalSessionsRow,
    ] = await Promise.all([
      // Total users
      queryOne<{ count: string }>(`SELECT COUNT(*) AS count FROM users`),

      // Plan breakdown
      query<{ plan: string; count: string }>(
        `SELECT plan, COUNT(*) AS count FROM users GROUP BY plan ORDER BY count DESC`
      ),

      // Recent signups (last 30 days)
      query<{ id: string; email: string; plan: string; role: string; created_at: Date }>(
        `SELECT id, email, plan, role, created_at FROM users
         ORDER BY created_at DESC LIMIT 20`
      ),

      // Active users (had a session in last 7 days)
      queryOne<{ count: string }>(
        `SELECT COUNT(DISTINCT user_id) AS count FROM tool_sessions
         WHERE created_at > NOW() - INTERVAL '7 days'`
      ),

      // Sessions over time (last 30 days, grouped by day)
      query<{ day: string; count: string }>(
        `SELECT DATE(created_at) AS day, COUNT(*) AS count
         FROM tool_sessions
         WHERE created_at > NOW() - INTERVAL '30 days'
         GROUP BY DATE(created_at)
         ORDER BY day DESC`
      ),

      // Sessions by tool
      query<{ tool_slug: string; count: string }>(
        `SELECT tool_slug, COUNT(*) AS count FROM tool_sessions
         GROUP BY tool_slug ORDER BY count DESC`
      ),

      // Top users by usage
      query<{ user_id: string; email: string; plan: string; session_count: string }>(
        `SELECT ts.user_id, u.email, u.plan, COUNT(*) AS session_count
         FROM tool_sessions ts
         JOIN users u ON ts.user_id = u.id
         GROUP BY ts.user_id, u.email, u.plan
         ORDER BY session_count DESC
         LIMIT 15`
      ),

      // Total sessions
      queryOne<{ count: string }>(`SELECT COUNT(*) AS count FROM tool_sessions`),
    ]);

    return NextResponse.json({
      totalUsers: Number(totalUsersRow?.count ?? 0),
      activeUsers7d: Number(activeUsersRow?.count ?? 0),
      totalSessions: Number(totalSessionsRow?.count ?? 0),
      planBreakdown: planBreakdown.map((r) => ({
        plan: r.plan,
        count: Number(r.count),
      })),
      recentSignups: recentSignups.map((r) => ({
        ...r,
        created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
      })),
      sessionsOverTime: sessionsOverTime.map((r) => ({
        day: r.day,
        count: Number(r.count),
      })),
      sessionsByTool: sessionsByTool.map((r) => ({
        tool_slug: r.tool_slug,
        count: Number(r.count),
      })),
      topUsers: topUsers.map((r) => ({
        user_id: r.user_id,
        email: r.email,
        plan: r.plan,
        sessionCount: Number(r.session_count),
      })),
    });
  } catch (err) {
    console.error('[oracle/stats]', err);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
