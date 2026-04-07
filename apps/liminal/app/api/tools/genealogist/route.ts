import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { queryOne } from '@/lib/db';
import { runGenealogist } from '@/lib/tools/genealogist/orchestrator';
import { checkAndIncrementUsage } from '@/lib/usage';

const schema = z.object({
  belief: z
    .string()
    .min(10, 'Please describe your belief in more detail')
    .max(2000),
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

    const { belief } = parsed.data;

    // Check session limit
    const usage = await checkAndIncrementUsage(user);
    if (!usage.allowed) {
      return NextResponse.json(
        { error: 'You have reached your monthly session limit. Upgrade to Cabinet for unlimited sessions.', code: 'SESSION_LIMIT' },
        { status: 429 }
      );
    }

    const output = await runGenealogist(belief);

    const title = belief.length > 80 ? belief.slice(0, 80) + '…' : belief;
    const summary = output.hidden_function.slice(0, 200) + '…';

    const session = await queryOne<{ id: string }>(
      `INSERT INTO tool_sessions
         (user_id, tool_slug, title, input_text, structured_output, summary)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [user.id, 'genealogist', title, belief, JSON.stringify(output), summary]
    );

    return NextResponse.json({ sessionId: session!.id, output });
  } catch (err) {
    console.error('[genealogist]', err);
    return NextResponse.json(
      { error: 'The Genealogist could not complete the excavation. Please try again.' },
      { status: 500 }
    );
  }
}
