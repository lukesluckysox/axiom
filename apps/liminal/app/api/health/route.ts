import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Liveness check — always returns 200 so Railway never kills the container
 * during startup. DB status is reported in the body for observability but
 * never used as a gating condition.
 *
 * Why: the previous version called initializeDatabase() which runs the full
 * schema SQL. If PostgreSQL isn't warm yet when Railway starts health-checking
 * (common on cold starts), every call returns 503, exhausting the
 * healthcheckTimeout and causing a false-negative failed deployment.
 */
export async function GET() {
  let dbStatus: 'connected' | 'unavailable' = 'unavailable';

  try {
    // Raw pool check — no schema init, no side effects, short circuit on error
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    dbStatus = 'connected';
  } catch {
    // DB not ready yet — app is still alive, schema init runs on first real request
  }

  return NextResponse.json(
    { status: 'ok', db: dbStatus, ts: Date.now() },
    { status: 200 }
  );
}
