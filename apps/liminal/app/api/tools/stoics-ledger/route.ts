import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { queryOne } from '@/lib/db';
import { runStoicsLedger } from '@/lib/tools/stoics-ledger/orchestrator';
import { checkAndIncrementUsage } from '@/lib/usage';

const schema = z.object({
  report: z
    .string()
    .min(20, 'Please provide a fuller account of your day')
    .max(3000),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const { report } = parsed.data;

    const usage = await checkAndIncrementUsage(user);
    if (!usage.allowed) {
      return NextResponse.json(
        { error: 'You have reached your monthly session limit. Upgrade to Cabinet for unlimited sessions.', code: 'SESSION_LIMIT' },
        { status: 429 }
      );
    }

    const output = await runStoicsLedger(report);

    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const title = `Ledger — ${today}`;
    const summary = output.conduct_review.slice(0, 200) + '…';

    const session = await queryOne<{ id: string }>(
      `INSERT INTO tool_sessions
         (user_id, tool_slug, title, input_text, structured_output, summary)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        user.id,
        'stoics-ledger',
        title,
        report,
        JSON.stringify(output),
        summary,
      ]
    );

    return NextResponse.json({ sessionId: session!.id, output });
  } catch (err) {
    console.error('[stoics-ledger]', err);
    return NextResponse.json(
      { error: 'The Ledger could not be completed. Please try again.' },
      { status: 500 }
    );
  }
}
