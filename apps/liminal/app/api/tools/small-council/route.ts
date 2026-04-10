import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { queryOne } from '@/lib/db';
import { runSmallCouncil } from '@/lib/tools/small-council/orchestrator';
import { checkAndIncrementUsage } from '@/lib/usage';
import { emitForSession } from '@/lib/lumenEmitter';
import { emitToParallax, emitToAxiom, emitToPraxis } from '@/lib/parallaxEmitter';

const schema = z.object({
  question: z.string().min(10, 'Please describe your dilemma in more detail').max(2000),
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

    const { question } = parsed.data;

    const usage = await checkAndIncrementUsage(user);
    if (!usage.allowed) {
      return NextResponse.json(
        { error: 'You have reached your monthly session limit. Upgrade to Cabinet for unlimited sessions.', code: 'SESSION_LIMIT' },
        { status: 429 }
      );
    }

    const output = await runSmallCouncil(question);

    const title =
      question.length > 80 ? question.slice(0, 80) + '…' : question;

    const session = await queryOne<{ id: string }>(
      `INSERT INTO tool_sessions
         (user_id, tool_slug, title, input_text, structured_output, summary)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        user.id,
        'small-council',
        title,
        question,
        JSON.stringify(output),
        output.summary,
      ]
    );

    // Fire-and-forget: emit base + enriched epistemic events to Lumen
    if (user.lumen_user_id && session) {
      emitForSession({ lumenUserId: user.lumen_user_id, sessionId: session.id, toolSlug: 'small-council', inputText: question, summary: output.summary });
    }

    // Collect downstream results for session summary
    const downstream: { destination: string; description: string }[] = [];
    if (user.lumen_user_id && session) {
      const emitPayload = {
        lumenUserId: user.lumen_user_id,
        sessionId: session.id,
        toolSlug: 'small-council',
        inputText: question,
        structuredOutput: output,
        summary: output.summary || '',
      };
      const [parallaxResult, axiomResult, praxisResult] = await Promise.all([
        emitToParallax(emitPayload),
        emitToAxiom(emitPayload),
        emitToPraxis(emitPayload),
      ]);
      if (parallaxResult.sent) downstream.push({ destination: parallaxResult.destination, description: parallaxResult.description });
      if (axiomResult.sent) downstream.push({ destination: axiomResult.destination, description: axiomResult.description });
      if (praxisResult.sent) downstream.push({ destination: praxisResult.destination, description: praxisResult.description });
    }

    return NextResponse.json({ sessionId: session!.id, output, downstream });
  } catch (err) {
    console.error('[small-council]', err);
    return NextResponse.json(
      { error: 'The council could not convene. Please try again.' },
      { status: 500 }
    );
  }
}
