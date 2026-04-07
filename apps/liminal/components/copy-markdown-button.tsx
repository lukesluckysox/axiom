'use client';

import { useState } from 'react';

interface CopyMarkdownButtonProps {
  toolSlug: string;
  toolLabel: string;
  title: string;
  createdAt: string;
  output: unknown;
}

// ── Markdown generators per tool ─────────────────────────────────────────────

function list(items: string[]): string {
  return items.map((i) => `- ${i}`).join('\n');
}

function section(heading: string, body: string): string {
  return `### ${heading}\n\n${body}`;
}

function generateMarkdown(
  toolSlug: string,
  toolLabel: string,
  title: string,
  createdAt: string,
  output: unknown
): string {
  const d = new Date(createdAt);
  const dateStr = d.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const header = `# ${title}\n\n**${toolLabel}** · ${dateStr}\n\n---\n\n`;

  try {
    switch (toolSlug) {
      case 'small-council': {
        const o = output as {
          turns: Array<{ advisor: string; round: number; content: string }>;
          synthesis: string;
        };
        const round1 = o.turns.filter((t) => t.round === 1);
        const round2 = o.turns.filter((t) => t.round === 2);
        const r1 = round1.map((t) => `**${t.advisor}:** ${t.content}`).join('\n\n');
        const r2 = round2.map((t) => `**${t.advisor}:** ${t.content}`).join('\n\n');
        return header +
          section('Round I — Initial Counsel', r1) + '\n\n' +
          section('Round II — Response', r2) + '\n\n' +
          section('Synthesis', o.synthesis);
      }

      case 'genealogist': {
        const o = output as {
          belief_statement: string;
          lineages: Array<{ source: string; description: string }>;
          inherited_vs_chosen: string;
          hidden_function: string;
          tensions: string[];
          belief_map: string;
          unresolved_questions: string[];
        };
        const lineagesMd = o.lineages
          .map((l) => `**${l.source}:** ${l.description}`)
          .join('\n\n');
        let md = header +
          section('The Belief, Restated', `> ${o.belief_statement}`) + '\n\n' +
          section('Lineages', lineagesMd) + '\n\n' +
          section('Inherited vs. Chosen', o.inherited_vs_chosen) + '\n\n' +
          section('Hidden Function', o.hidden_function);
        if (o.tensions.length) md += '\n\n' + section('Tensions', list(o.tensions));
        md += '\n\n' + section('Belief Map', o.belief_map);
        if (o.unresolved_questions.length) md += '\n\n' + section('Unresolved Questions', list(o.unresolved_questions));
        return md;
      }

      case 'interlocutor': {
        const o = output as {
          clarified_thesis: string;
          exposed_assumptions: Array<{ assumption: string; examination: string }>;
          strong_objections: Array<{ objection: string; weight: string }>;
          weak_spots: string[];
          better_formulations: string[];
          unanswered_questions: string[];
        };
        const assumptionsMd = o.exposed_assumptions
          .map((a, i) => `${i + 1}. **${a.assumption}** — ${a.examination}`)
          .join('\n\n');
        const objectionsMd = o.strong_objections
          .map((ob, i) => `${i + 1}. **${ob.objection}** — ${ob.weight}`)
          .join('\n\n');
        let md = header +
          section('Clarified Thesis', `> ${o.clarified_thesis}`) + '\n\n' +
          section('Exposed Assumptions', assumptionsMd) + '\n\n' +
          section('Strong Objections', objectionsMd);
        if (o.weak_spots.length) md += '\n\n' + section('Weak Spots', list(o.weak_spots));
        if (o.better_formulations.length) md += '\n\n' + section('Better Formulations', list(o.better_formulations));
        if (o.unanswered_questions.length) md += '\n\n' + section('Unanswered Questions', list(o.unanswered_questions));
        return md;
      }

      case 'stoics-ledger': {
        const o = output as {
          conduct_review: string;
          duties_met: string[];
          duties_neglected: string[];
          avoidances_named: string[];
          excuses_detected: string[];
          maxim: string;
          act_of_repair: string;
        };
        let md = header +
          section('Conduct Review', o.conduct_review);
        if (o.duties_met.length) md += '\n\n' + section('Duties Met', list(o.duties_met));
        if (o.duties_neglected.length) md += '\n\n' + section('Duties Neglected', list(o.duties_neglected));
        if (o.avoidances_named.length) md += '\n\n' + section('Avoidances Named', list(o.avoidances_named));
        if (o.excuses_detected.length) md += '\n\n' + section('Excuses Detected', list(o.excuses_detected));
        md += '\n\n' + section('Maxim for Tomorrow', `> ${o.maxim}`);
        md += '\n\n' + section('Act of Repair', o.act_of_repair);
        return md;
      }

      case 'fool': {
        const o = output as {
          core_claim: string;
          why_wrong: string;
          blind_spots: string[];
          risks: string[];
          reputational_danger: string;
          second_order_effects: string[];
          rival_interpretation: string;
        };
        let md = header +
          section('Your Claim', o.core_claim) + '\n\n' +
          section('Why You May Be Wrong', o.why_wrong);
        if (o.blind_spots.length) md += '\n\n' + section('Blind Spots', list(o.blind_spots));
        if (o.risks.length) md += '\n\n' + section('Risks', list(o.risks));
        md += '\n\n' + section('Reputational Danger', o.reputational_danger);
        if (o.second_order_effects.length) md += '\n\n' + section('Second-Order Effects', list(o.second_order_effects));
        md += '\n\n' + section('Rival Interpretation', `> ${o.rival_interpretation}`);
        return md;
      }

      case 'interpreter': {
        const o = output as {
          symbol_named: string;
          lenses: Array<{ name: string; notices: string; misses: string }>;
          tensions: string;
          questions_to_sit_with: string[];
        };
        const lensesMd = o.lenses
          .map((l) => `**${l.name}**\n\nNotices: ${l.notices}\n\nMisses: ${l.misses}`)
          .join('\n\n---\n\n');
        let md = header +
          section('The Symbol', `> ${o.symbol_named}`) + '\n\n' +
          section('Five Lenses', lensesMd) + '\n\n' +
          section('Tensions Between Interpretations', o.tensions);
        if (o.questions_to_sit_with.length) md += '\n\n' + section('Questions to Sit With', list(o.questions_to_sit_with));
        return md;
      }

      default:
        return header + '```json\n' + JSON.stringify(output, null, 2) + '\n```';
    }
  } catch {
    return header + '```json\n' + JSON.stringify(output, null, 2) + '\n```';
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CopyMarkdownButton({
  toolSlug,
  toolLabel,
  title,
  createdAt,
  output,
}: CopyMarkdownButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const md = generateMarkdown(toolSlug, toolLabel, title, createdAt, output);
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked — silent fail
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="btn-ghost"
      style={{ whiteSpace: 'nowrap' }}
      aria-label="Copy session as Markdown"
    >
      {copied ? 'Copied ✓' : 'Copy as Markdown'}
    </button>
  );
}
