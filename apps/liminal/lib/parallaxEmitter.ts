// lib/parallaxEmitter.ts
// Pushes completed Liminal sessions to Parallax for pattern tracking

const PARALLAX_URL = process.env.PARALLAX_URL;
const LUMEN_INTERNAL_TOKEN = process.env.LUMEN_INTERNAL_TOKEN;

export interface EmitResult {
  sent: boolean;
  destination: string;
  description: string;
}

export async function emitToParallax(event: {
  lumenUserId: string;
  sessionId: string;
  toolSlug: string;
  inputText: string;
  structuredOutput: object;
  summary: string;
  createdAt?: string;
}): Promise<EmitResult> {
  if (!PARALLAX_URL || !LUMEN_INTERNAL_TOKEN) {
    return { sent: false, destination: 'parallax', description: 'Your patterns were recognized and mapped.' };
  }
  try {
    await fetch(`${PARALLAX_URL}/api/internal/from-liminal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-lumen-internal-token": LUMEN_INTERNAL_TOKEN,
      },
      body: JSON.stringify({
        lumenUserId: event.lumenUserId,
        sessionId: event.sessionId,
        toolSlug: event.toolSlug,
        inputText: event.inputText,
        structuredOutput: event.structuredOutput,
        summary: event.summary,
        createdAt: event.createdAt || new Date().toISOString(),
      }),
    });
    return { sent: true, destination: 'parallax', description: 'Your patterns were recognized and mapped.' };
  } catch (e) {
    console.error("[ParallaxEmitter] Failed to push session:", e);
    // Never throw — emission must not break the main app flow
    return { sent: false, destination: 'parallax', description: 'Your patterns were recognized and mapped.' };
  }
}

// Push testable hypotheses to Praxis as proposed experiments
const PRAXIS_URL = process.env.PRAXIS_URL;

export async function emitToPraxis(event: {
  lumenUserId: string;
  sessionId: string;
  toolSlug: string;
  inputText: string;
  structuredOutput: object;
  summary: string;
}): Promise<EmitResult> {
  if (!PRAXIS_URL || !LUMEN_INTERNAL_TOKEN) {
    return { sent: false, destination: 'praxis', description: 'A hypothesis awaits testing.' };
  }

  // Only tools that produce testable hypotheses should push to Praxis
  const praxisTools = ["fool", "interlocutor", "small-council"];
  if (!praxisTools.includes(event.toolSlug)) {
    return { sent: false, destination: 'praxis', description: 'A hypothesis awaits testing.' };
  }

  try {
    const output = event.structuredOutput as any;
    let hypothesis = "";
    let design = "";

    if (event.toolSlug === "fool") {
      // The Fool challenges a position — the hypothesis is whether the challenge holds
      hypothesis = output.why_wrong || output.challenge || "";
      design = `The Fool challenged your position. Test whether this challenge holds by observing your behavior around this belief for one week.`;
    } else if (event.toolSlug === "interlocutor") {
      // The Interlocutor produces objections — the strongest objection becomes the hypothesis
      const objections = output.strong_objections || [];
      hypothesis = objections[0] || output.clarified_thesis || "";
      design = `The Interlocutor raised this objection. Design a situation where you can observe whether it holds.`;
    } else if (event.toolSlug === "small-council") {
      // The Small Council produces a recommendation — test it
      hypothesis = output.recommendation || output.summary || "";
      design = `The Small Council recommended this. Implement it for a bounded period and observe the results.`;
    }

    if (!hypothesis) {
      return { sent: false, destination: 'praxis', description: 'A hypothesis awaits testing.' };
    }

    await fetch(`${PRAXIS_URL}/api/internal/from-lumen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-lumen-internal-token": LUMEN_INTERNAL_TOKEN,
      },
      body: JSON.stringify({
        title: `Liminal (${event.toolSlug}): ${hypothesis.slice(0, 150)}`,
        hypothesis,
        design,
        source: 'liminal',
        userId: event.lumenUserId,
      }),
    });
    return { sent: true, destination: 'praxis', description: 'A hypothesis awaits testing.' };
  } catch (e) {
    console.error("[PraxisEmitter] Failed to push from Liminal:", e);
    return { sent: false, destination: 'praxis', description: 'A hypothesis awaits testing.' };
  }
}

// Also push to Axiom when we detect strong belief/truth signals
const AXIOM_URL = process.env.AXIOM_TOOL_URL;

export async function emitToAxiom(event: {
  lumenUserId: string;
  sessionId: string;
  toolSlug: string;
  inputText: string;
  structuredOutput: object;
  summary: string;
}): Promise<EmitResult> {
  if (!AXIOM_URL || !LUMEN_INTERNAL_TOKEN) {
    return { sent: false, destination: 'axiom', description: 'This insight is ready for deeper examination.' };
  }

  // Only tools that produce truth-adjacent outputs should push to Axiom
  const axiomTools = ["genealogist", "interlocutor", "stoics-ledger"];
  if (!axiomTools.includes(event.toolSlug)) {
    return { sent: false, destination: 'axiom', description: 'This insight is ready for deeper examination.' };
  }

  try {
    // Extract a potential truth claim from the structured output
    const output = event.structuredOutput as any;
    let signal = "";
    let interpretation = "";
    let suggestedClaim = "";

    if (event.toolSlug === "genealogist") {
      signal = output.belief_statement || "";
      interpretation = output.hidden_function || "";
      suggestedClaim = output.inherited_vs_chosen || "";
    } else if (event.toolSlug === "interlocutor") {
      signal = output.clarified_thesis || "";
      interpretation = (output.strong_objections || []).join("; ");
      suggestedClaim = output.clarified_thesis || "";
    } else if (event.toolSlug === "stoics-ledger") {
      signal = output.conduct_review || "";
      interpretation = output.maxim || "";
      suggestedClaim = output.maxim || "";
    }

    if (!suggestedClaim) {
      return { sent: false, destination: 'axiom', description: 'This insight is ready for deeper examination.' };
    }

    await fetch(`${AXIOM_URL}/api/internal/from-lumen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-lumen-internal-token": LUMEN_INTERNAL_TOKEN,
      },
      body: JSON.stringify({
        lumenUserId: event.lumenUserId,
        source: "liminal",
        axioms: [{
          title: suggestedClaim.slice(0, 100),
          signal,
          interpretation,
          truthClaim: suggestedClaim,
          sourceCounts: { liminal: 1, parallax: 0, praxis: 0 },
        }],
      }),
    });
    return { sent: true, destination: 'axiom', description: 'This insight is ready for deeper examination.' };
  } catch (e) {
    console.error("[AxiomEmitter] Failed to push from Liminal:", e);
    return { sent: false, destination: 'axiom', description: 'This insight is ready for deeper examination.' };
  }
}
