import { db } from '../db';
import { epistemicCandidates } from '../schema/epistemic';
import { eq, and } from 'drizzle-orm';

const AXIOM_API_URL = process.env.AXIOM_API_URL || 'https://axiomtool-production.up.railway.app';
const PRAXIS_API_URL = process.env.PRAXIS_API_URL || 'https://praxis-production-da89.up.railway.app';
const LUMEN_INTERNAL_TOKEN = process.env.LUMEN_INTERNAL_TOKEN || '';

function confidenceToText(score: number): string {
  if (score >= 0.85) return 'high';
  if (score >= 0.70) return 'medium-high';
  if (score >= 0.50) return 'medium';
  if (score >= 0.35) return 'medium-low';
  return 'low';
}

export async function pushCandidateToAxiomtool(candidate: typeof epistemicCandidates.$inferSelect): Promise<boolean> {
  try {
    const body = {
      title: candidate.title.slice(0, 200),
      truthClaim: candidate.title.slice(0, 500),
      signal: candidate.summary,
      convergence: `Auto-promoted from epistemic queue. Confidence: ${Math.round(candidate.confidence * 100)}%.`,
      interpretation: candidate.summary,
      workingPrinciple: '',
      confidence: confidenceToText(candidate.confidence),
      confidenceScore: Math.round(candidate.confidence * 100),
      counterevidence: '',
      revisionNote: '',
      revisionHistory: '[]',
      liminalCount: 0,
      parallaxCount: 0,
      praxisCount: 0,
      inputDescriptions: JSON.stringify([candidate.summary]),
      userId: candidate.userId,
    };
    const res = await fetch(`${AXIOM_API_URL}/api/internal/from-lumen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-lumen-internal-token': LUMEN_INTERNAL_TOKEN,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`[epistemicPush] Axiomtool rejected candidate ${candidate.id}: ${res.status} ${text}`);
    }
    return res.ok;
  } catch (e) {
    console.error('[epistemicPush] Axiomtool push error:', e);
    return false;
  }
}

export async function pushCandidateToPraxis(candidate: typeof epistemicCandidates.$inferSelect): Promise<boolean> {
  try {
    const body = {
      title: candidate.title.slice(0, 200),
      hypothesis: candidate.summary,
      design: 'Auto-generated from epistemic queue. Review and refine to structure your experiment.',
      source: 'liminal',
      status: 'active',
      experimentConstraint: '',
      observation: '',
      meaningExtraction: '',
      tags: '[]',
      userId: candidate.userId,
    };
    const res = await fetch(`${PRAXIS_API_URL}/api/internal/from-lumen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-lumen-internal-token': LUMEN_INTERNAL_TOKEN,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`[epistemicPush] Praxis rejected candidate ${candidate.id}: ${res.status} ${text}`);
    }
    return res.ok;
  } catch (e) {
    console.error('[epistemicPush] Praxis push error:', e);
    return false;
  }
}

export async function flushEpistemicQueue(userId: string): Promise<{ pushed: number; failed: number; axiom: number; praxis: number }> {
  let pushed = 0;
  let failed = 0;
  let axiomCount = 0;
  let praxisCount = 0;

  // Push doctrine_candidates to Axiomtool
  const axiomCandidates = db
    .select()
    .from(epistemicCandidates)
    .where(and(
      eq(epistemicCandidates.userId, userId),
      eq(epistemicCandidates.status, 'queued_for_axiom')
    ))
    .all();

  for (const candidate of axiomCandidates) {
    const ok = await pushCandidateToAxiomtool(candidate);
    if (ok) {
      db.update(epistemicCandidates)
        .set({ status: 'accepted', updatedAt: new Date().toISOString() })
        .where(eq(epistemicCandidates.id, candidate.id))
        .run();
      pushed++;
      axiomCount++;
    } else {
      failed++;
    }
  }

  // Push hypothesis_candidates to Praxis
  const praxisCandidates = db
    .select()
    .from(epistemicCandidates)
    .where(and(
      eq(epistemicCandidates.userId, userId),
      eq(epistemicCandidates.status, 'queued_for_praxis')
    ))
    .all();

  for (const candidate of praxisCandidates) {
    const ok = await pushCandidateToPraxis(candidate);
    if (ok) {
      db.update(epistemicCandidates)
        .set({ status: 'accepted', updatedAt: new Date().toISOString() })
        .where(eq(epistemicCandidates.id, candidate.id))
        .run();
      pushed++;
      praxisCount++;
    } else {
      failed++;
    }
  }

  return { pushed, failed, axiom: axiomCount, praxis: praxisCount };
}
