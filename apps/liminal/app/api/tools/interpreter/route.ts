import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { queryOne } from '@/lib/db';
import { runInterpreter } from '@/lib/tools/interpreter/orchestrator';
import { checkAndIncrementUsage } from '@/lib/usage';

const schema = z.object({
  symbol: z
    .string()
    .min(10, 'Please describe the dream or symbol in more detail')
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

    const { symbol } = parsed.data;

    const usage = await checkAndIncrementUsage(user);
    if (!usage.allowed) {
      return NextResponse.json(
        { error: 'You have reached your monthly session limit. Upgrade to Cabinet for unlimited sessions.', code: 'SESSION_LIMIT' },
        { status: 429 }
      );
    }

    const output = await runInterpreter(symbol);

    const title = symbol.length > 80 ? symbol.slice(0, 80) + '…' : symbol;
    const summary = output.tensions.slice(0, 200) + '…';

    const session = await queryOne<{ id: string }>(
      `INSERT INTO tool_sessions
         (user_id, tool_slug, title, input_text, structured_output, summary)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [user.id, 'interpreter', title, symbol, JSON.stringify(output), summary]
    );

    return NextResponse.json({ sessionId: session!.id, output });
  } catch (err) {
    console.error('[interpreter]', err);
    return NextResponse.json(
      { error: 'The Interpreter could not complete the reading. Please try again.' },
      { status: 500 }
    );
  }
}
