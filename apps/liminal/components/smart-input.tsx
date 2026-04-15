'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface Recommendation {
  slug: string;
  name: string;
  description: string;
}

const RECOMMENDATIONS: Record<string, Recommendation> = {
  genealogist: {
    slug: 'genealogist',
    name: 'The Genealogist',
    description: 'traces belief origins',
  },
  fool: {
    slug: 'fool',
    name: 'The Fool',
    description: 'challenges certainty',
  },
  'small-council': {
    slug: 'small-council',
    name: 'Small Council',
    description: 'deliberates competing options',
  },
  interlocutor: {
    slug: 'interlocutor',
    name: 'The Interlocutor',
    description: 'examines arguments',
  },
  interpreter: {
    slug: 'interpreter',
    name: 'The Interpreter',
    description: 'reads symbols and dreams',
  },
  'stoics-ledger': {
    slug: 'stoics-ledger',
    name: "Stoic's Ledger",
    description: 'reviews daily conduct',
  },
};

function getRecommendation(text: string): Recommendation {
  const lower = text.toLowerCase();

  // Family / origin / inheritance → Genealogist
  if (
    /\b(family|parents?|mother|father|childhood|origin|inherit|raised|grew up|upbringing)\b/.test(lower)
  ) {
    return RECOMMENDATIONS.genealogist;
  }

  // Strong certainty / absolutes → The Fool
  if (
    /\b(i always|i never|absolutely|certainly|without doubt|no question|i('m| am) (sure|certain|convinced)|obviously|everyone knows)\b/.test(lower)
  ) {
    return RECOMMENDATIONS.fool;
  }

  // Dilemma / trade-off / "should I" → Small Council
  if (
    /\b(should i|dilemma|trade-?off|torn between|on one hand|either .* or|weighing|can't decide|deciding between|versus|vs\.?)\b/.test(lower)
  ) {
    return RECOMMENDATIONS['small-council'];
  }

  // Intellectual thesis / philosophical → Interlocutor
  if (
    /\b(i (believe|think|argue|contend|maintain|hold that)|my (thesis|argument|position|view)|in my (view|opinion)|philosophi|the case (for|against))\b/.test(lower)
  ) {
    return RECOMMENDATIONS.interlocutor;
  }

  // Dreams / symbols / images / metaphors → Interpreter
  if (
    /\b(dream|symbol|image|metaphor|vision|recurring|pattern|archetype|nightmare|keeps appearing)\b/.test(lower)
  ) {
    return RECOMMENDATIONS.interpreter;
  }

  // Daily behavior / actions / conduct → Stoic's Ledger
  if (
    /\b(today i|i did|i avoided|this morning|this evening|my day|what i did|i acted|i failed to|i neglected)\b/.test(lower)
  ) {
    return RECOMMENDATIONS['stoics-ledger'];
  }

  // Default
  return RECOMMENDATIONS.interlocutor;
}

export function SmartInput() {
  const router = useRouter();
  const [input, setInput] = useState('');

  const recommendation = useMemo(
    () => (input.trim().length >= 5 ? getRecommendation(input) : null),
    [input]
  );

  function handleGo() {
    if (!recommendation || !input.trim()) return;
    const encoded = encodeURIComponent(input.trim());
    // Track this tool usage for bottom nav
    try {
      const stored = localStorage.getItem('liminal_recent_tools');
      const recent: string[] = stored ? JSON.parse(stored) : [];
      const updated = [recommendation.slug, ...recent.filter((s) => s !== recommendation.slug)].slice(0, 10);
      localStorage.setItem('liminal_recent_tools', JSON.stringify(updated));
    } catch { /* ignore */ }
    router.push(`/tool/${recommendation.slug}?claim=${encoded}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey && recommendation) {
      e.preventDefault();
      handleGo();
    }
  }

  return (
    <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a claim, question, belief, or symbol..."
        style={{
          width: '100%',
          background: 'rgb(var(--color-surface-2))',
          border: '1px solid rgb(var(--color-border) / 0.14)',
          borderRadius: '3px',
          padding: '0.75rem 1rem',
          color: 'rgb(var(--color-text))',
          fontSize: 'clamp(0.9375rem, 0.875rem + 0.25vw, 1rem)',
          lineHeight: 1.65,
          outline: 'none',
          transition: 'border-color 160ms ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgb(156 134 84 / 0.42)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgb(106 97 84 / 0.14)';
        }}
      />

      {/* Recommendation line */}
      {recommendation && (
        <div
          style={{
            marginTop: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            animation: 'fadeSlideUp 0.25s ease both',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(0.75rem, 0.7rem + 0.15vw, 0.8125rem)',
              color: 'rgb(var(--color-text-faint))',
            }}
          >
            Recommended:{' '}
            <span style={{ color: 'rgb(var(--color-gold))' }}>
              {recommendation.name}
            </span>
            {' '}&mdash; {recommendation.description}
          </span>
          <button
            onClick={handleGo}
            style={{
              background: 'transparent',
              border: '1px solid rgb(var(--color-gold) / 0.25)',
              borderRadius: '3px',
              padding: '0.25rem 0.75rem',
              color: 'rgb(var(--color-gold))',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'border-color 160ms ease, background 160ms ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgb(156 134 84 / 0.5)';
              e.currentTarget.style.background = 'rgb(156 134 84 / 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgb(156 134 84 / 0.25)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Go &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
