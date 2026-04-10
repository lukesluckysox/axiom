# Lumen Voice Guide

A reference for every piece of user-facing copy across the Lumen ecosystem. This is not about making every app sound identical — each tool has an earned tone. This is about making them sound like different pages from the same author.

---

## The Shared Voice

Lumen speaks like a thoughtful editor, not a therapist, not a coach, not software. It assumes the reader is intelligent, serious, and capable of handling directness. It never flatters. It never hedges with corporate caution. It never uses exclamation marks.

### Principles

1. **Precise, not clever.** Say what something does. Don't dress it up.
2. **Invitational, not instructional.** "Each session is saved here" not "Start journaling now!"
3. **First person for the user's own truths.** "I am someone who believes…" — the user's constitution, hypotheses, and reflections belong to them.
4. **Second person for the system observing.** "You move toward what you can't yet name." — when Lumen or its tools are speaking about the user.
5. **No meta-descriptions.** "A hypothesis was formed from journal analysis" is wrong. State the hypothesis itself.
6. **Earned gravity.** The tone is serious because the work is serious, not because seriousness is a style choice.

### What Lumen never says
- "Let's get started!" / "Welcome back!" / "Great job!"
- "Oops!" / "Uh oh!" / anything performatively casual
- "Unlock your potential" / "Level up" / any growth-hacking language
- "We" (Lumen is not a team speaking to you, it's an instrument you use)

---

## Per-App Tone — What's Earned, What's Drift

Each app has a legitimate tonal register. The differences below are intentional. What follows each is the drift that needs correcting.

### Liminal — The Examiner
**Legitimate tone:** Socratic, precise, intellectually confrontational. The six instruments (Fool, Genealogist, Interlocutor, Interpreter, Stoic's Ledger, Small Council) each have distinct personas and speak in second person ("You hold this belief because…"). This is correct — they are examining you.

**Drift to correct:**
- Tool error messages use tool-character language inconsistently. "The Fool could not complete the challenge" is good. "Something went wrong. Please try again." in the same app breaks the spell. Standardize: "The [Tool] was unable to complete this examination. Try again."
- The UI chrome (nav labels, archive headers, hex progress) is functionally silent — no labels, no descriptions. Add brief orienting copy where the user lands cold.

### Parallax — The Observer
**Legitimate tone:** Analytical, perceptive, slightly detached. Parallax sees patterns the user doesn't. It speaks about the user in a way that feels like reading a dossier written by someone who knows you well. Observational voice.

**Drift to correct:**
- Empty states are inconsistent in person. "No check-ins yet. Each check-in captures how I'm showing up right now" uses first person (I), but "No insights yet. Connect Spotify or save a few check-ins — Parallax reads behavioral signals and surfaces what I might not see on my own" also uses first person but then refers to Parallax in third person in the same sentence. Pick one: either pure first-person throughout empty states, or pure system-voice. Recommendation: first-person ("I") for empty states, since these are the user's own dashboard.
- Toast messages are too terse and generic: "Error" / "Saved" / "Spotify Connected". These should carry the Parallax voice: "Pattern recorded" instead of "Saved." "Signal source linked" instead of "Spotify Connected."
- The Daily Reading prompt must be strict about not fabricating data sources (reggae-soaked morning fix addresses this, but the principle should be explicit in all generation prompts: "Only reference data you are given. Never infer, hallucinate, or narrativize data that is not present in the context below.").

### Praxis — The Experimenter
**Legitimate tone:** Methodical, laboratory-like, hypothesis-driven. Praxis speaks in the language of controlled trials. It's the most structured app — Hypothesis → Experiment → Observation → Meaning Extraction. The language should feel like a research protocol, not a journal.

**Drift to correct:**
- "Controlled trials designed to test what you think you believe." — this is good Praxis voice.
- "No experiments yet. Design a test for a belief, observe what happens, and let the results inform what I hold true." — mixes second person ("Design a test") with first person ("what I hold true") in the same sentence. Pick one per sentence. Recommendation: "No experiments yet. Each experiment tests a belief I hold — I design it, observe what happens, and let the results inform what I accept as true."
- The auto-generated hypothesis and experiment text from the Loop needs to always state the actual content, never meta-describe the process. (Fixed earlier today, but the voice guide should codify this.)
- Status labels are good: Active, Observing, Completed, Archived, Proposed, Dismissed. Keep these clinical.

### Axiom — The Constitutionalist
**Legitimate tone:** Grave, constitutional, first-person declarative. This is where the user's earned truths live. "I am someone who believes…" is the correct voice for governing claims. The language should feel like writing a personal constitution — cumulative, precise, revisable.

**Drift to correct:**
- The governing claim format must always follow: "I am someone who [verb]s [belief content]." Verbs: believes, values, recognizes, holds that, understands, accepts, rejects, insists. Never drop the verb.
- Empty states in Axiom should feel like an empty constitution awaiting its first article, not like a broken feature: "No proposals yet. As I explore beliefs in Liminal, track patterns in Parallax, and test hypotheses in Praxis, truth claims will surface here for my examination." — this is already well-written. Keep this standard.
- Error toasts like "Enrichment is temporarily unavailable. Please try again later." are too generic. Better: "Examination could not be completed. Try again." — keep the constitutional metaphor.
- "Something went wrong while loading this axiom. Please try again." → "This principle could not be retrieved. Try again."

---

## Empty State Voice Standard

Empty states are the first thing a new user sees. They must feel like an invitation, not an absence.

**Pattern:** [What belongs here] + [How it gets here]

| App | Current | Recommended |
|-----|---------|-------------|
| Liminal Archive | "Nothing recorded yet. Each session I complete with any of the six instruments…is saved here for future reading and comparison." | Good as-is. Keep. |
| Parallax Check-ins | "No check-ins yet. Each check-in captures how I'm showing up right now — over time, the pattern tells a story." | Good as-is. Keep. |
| Parallax Insights | "Not enough data for insights yet. Check in a few times and connect data sources — patterns emerge once there's enough signal." | Good as-is. Keep. |
| Praxis Experiments | "No experiments yet. Design a test for a belief…" | → "No experiments yet. Each experiment I design tests a belief I hold — observe what happens, and let the results inform what I accept as true." |
| Praxis Tensions | "No tensions mapped yet." | → "No tensions mapped yet. Tensions emerge when two things I value pull in opposite directions — mapping them is how I stop pretending the conflict doesn't exist." |
| Praxis Doctrines | "No doctrines yet." | → "No doctrines yet. A doctrine crystallizes when enough experiments point the same direction — a working truth I'm willing to act on." |
| Axiom Proposals | "No proposals yet. As I explore beliefs in Liminal…" | Good as-is. Keep. |
| Axiom Constitution Preamble | "No preamble yet. A preamble synthesizes the spirit of the constitution…" | Good as-is. Keep. |

---

## Error Message Voice Standard

Errors should name the instrument, not the technology.

**Pattern:** "[Instrument/feature] could not [action]. Try again."

| Current | Recommended |
|---------|-------------|
| "Something went wrong. Please try again." | "This could not be completed. Try again." |
| "The Fool could not complete the challenge. Please try again." | Keep — this is correct Liminal voice. |
| "Could not analyze decision" | "Decision could not be evaluated. Try again." |
| "Could not interpret your feeling" | "Reflection could not be interpreted. Try again." |
| "Could not save check-in" | "Check-in could not be saved. Try again." |
| "Analysis failed. Try again." | "Writing could not be analyzed. Try again." |
| "Enrichment is temporarily unavailable. Please try again later." | "Examination could not be completed. Try again." |
| "Something went wrong while loading this axiom." | "This principle could not be retrieved. Try again." |
| "Something went wrong while fetching your proposals." | "Proposals could not be loaded. Try again." |

---

## Toast Message Voice Standard

Toasts should acknowledge what happened in the language of the system, not in generic UI language.

| Current | Recommended |
|---------|-------------|
| "Saved" / "Decision recorded" | "Decision recorded." |
| "Spotify Connected" / "Your Spotify account has been linked." | "Signal source linked." |
| "Spotify" / "Disconnected from Spotify." | "Signal source removed." |
| "Error" / "Could not analyze decision" | "Decision could not be evaluated." |
| "Failed to save." | "Could not be saved." |
| "Failed to accept experiment." | "Experiment could not be accepted." |

---

## Loop Toast Voice (Cross-App Notifications)

When data flows between apps via the Loop, acknowledge it with a brief ephemeral toast. These should feel like a quiet system pulse, not an alert.

**Pattern:** "[Source description] arrived from [App]."

| Event | Toast |
|-------|-------|
| Pattern arrives in Parallax from Liminal session | "A new pattern was recognized from your Liminal session." |
| Experiment proposed in Praxis from Parallax | "A hypothesis arrived from Parallax." |
| Truth claim surfaces in Axiom from the Loop | "A truth claim surfaced for examination." |
| Inquiry seed returns to Liminal from Axiom | "An inquiry returned from the Loop." |
| Constitutional principle promoted in Axiom | "A principle was promoted to the constitution." |

---

## AI Prompt Guardrails (for all apps)

Add to every LLM system prompt across the ecosystem:

```
VOICE RULES:
- Only reference data explicitly provided in the context below. Never fabricate, infer, or narrativize data that is not present.
- When generating first-person claims (e.g. governing principles, hypotheses), always use the format: "I am someone who [verb]s [content]." Valid verbs: believes, values, recognizes, holds that, understands, accepts, rejects, insists.
- When generating descriptions of what was found, state the finding itself — never describe the process that produced it. Wrong: "A hypothesis was formed from journal analysis." Right: "My creative output increases when I work in isolation before sharing."
- Match the register of the app you are generating for. Liminal: Socratic, examining. Parallax: observational, pattern-reading. Praxis: experimental, protocol-like. Axiom: constitutional, declarative.
```

---

## Typography Lock (reference only)

All four sub-apps and Lumen OS should converge on:
- **Display/Serif:** Cormorant (not Cormorant Garamond — they are different fonts)
- **Body/Sans:** Satoshi
- **Mono/Labels:** IBM Plex Mono (currently only in Axiom — adopt ecosystem-wide for labels, status tags, metadata)

---

*This document is the source of truth for voice across the Lumen ecosystem. When adding new copy to any app, check it against these standards before committing.*
