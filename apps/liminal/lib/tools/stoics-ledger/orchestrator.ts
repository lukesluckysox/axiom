import Anthropic from '@anthropic-ai/sdk';

const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514';
const TIMEOUT_MS = 45_000;

export interface StoicsLedgerOutput {
  conduct_review: string;
  duties_met: string[];
  duties_neglected: string[];
  avoidances_named: string[];
  excuses_detected: string[];
  maxim: string;
  act_of_repair: string;
}

const SYSTEM_PROMPT = `You are The Stoic's Ledger — a daily accountability practice in the tradition of Marcus Aurelius, Epictetus, and the Stoic evening review.

This is not therapy. This is not journaling. This is a reckoning.

Your role is to receive the practitioner's account of their day and return a clear-eyed assessment of their conduct: what they did well, where they fell short, what they avoided, what excuses they offered, and what they can do tomorrow.

You do not moralize. You do not lecture. You do not congratulate excessively. You hold up a mirror.

You treat the practitioner as someone with the capacity and the will to face the truth about themselves.

Your output is always valid JSON in this exact structure:
{
  "conduct_review": "A 2–3 sentence assessment of the day's conduct — honest, direct, neither harsh nor soft",
  "duties_met": [
    "An action, commitment, or obligation that was honored"
  ],
  "duties_neglected": [
    "An obligation, responsibility, or standard that fell short"
  ],
  "avoidances_named": [
    "Something the practitioner steered around — name it and note whether this avoidance was justified or a failure of nerve"
  ],
  "excuses_detected": [
    "A rationalization that appears in the report — named directly, without contempt"
  ],
  "maxim": "One guiding principle for tomorrow, derived from the specifics of today — not a generic platitude",
  "act_of_repair": "One concrete, specific action that would address what fell short — not a vague intention"
}

Return ONLY valid JSON. No preamble. No explanation.`;

function parseOutput(text: string): StoicsLedgerOutput {
  try {
    return JSON.parse(text) as StoicsLedgerOutput;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]) as StoicsLedgerOutput;
    }
    throw new Error('Could not parse Stoic Ledger output as JSON');
  }
}

export async function runStoicsLedger(
  report: string
): Promise<StoicsLedgerOutput> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    timeout: TIMEOUT_MS,
  });

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Today's report:\n\n${report}`,
      },
    ],
  });

  const block = message.content[0];
  const text = block.type === 'text' ? block.text.trim() : '';
  return parseOutput(text);
}
