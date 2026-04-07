'use client';

import { useState } from 'react';

type FeedbackValue = 'clarifying' | 'still_thinking' | 'changed_view';

const OPTIONS: { value: FeedbackValue; label: string; tooltip: string }[] = [
  {
    value: 'clarifying',
    label: 'Clarifying',
    tooltip: 'This sharpened how I see the question',
  },
  {
    value: 'still_thinking',
    label: 'Still thinking',
    tooltip: "I'm sitting with this — not resolved yet",
  },
  {
    value: 'changed_view',
    label: 'Changed my view',
    tooltip: 'I came in thinking one thing and left thinking another',
  },
];

interface SessionFeedbackProps {
  sessionId: string;
  initialFeedback: string | null;
  accentHue: string;
}

export function SessionFeedback({ sessionId, initialFeedback, accentHue }: SessionFeedbackProps) {
  const [selected, setSelected] = useState<FeedbackValue | null>(
    (initialFeedback as FeedbackValue) ?? null
  );
  const [saving, setSaving] = useState(false);

  async function handleSelect(value: FeedbackValue) {
    if (saving) return;
    const next = selected === value ? null : value;
    setSelected(next);
    setSaving(true);
    try {
      await fetch(`/api/sessions/${sessionId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: next }),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        marginTop: 'clamp(2rem, 3.5vw, 3rem)',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgb(var(--color-border) / 0.08)',
      }}
    >
      <p
        style={{
          fontSize: 'clamp(0.625rem, 0.58rem + 0.12vw, 0.6875rem)',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgb(var(--color-text-faint))',
          marginBottom: '0.75rem',
        }}
      >
        How did this sit with you?
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {OPTIONS.map((opt) => {
          const isActive = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              title={opt.tooltip}
              disabled={saving}
              style={{
                background: isActive ? `rgb(${accentHue} / 0.1)` : 'transparent',
                border: `1px solid ${isActive ? `rgb(${accentHue} / 0.3)` : 'rgb(var(--color-border) / 0.12)'}`,
                borderRadius: '3px',
                padding: '0.3rem 0.75rem',
                cursor: saving ? 'default' : 'pointer',
                fontFamily: 'inherit',
                fontSize: 'clamp(0.75rem, 0.7rem + 0.15vw, 0.8125rem)',
                fontWeight: isActive ? 500 : 400,
                color: isActive ? `rgb(${accentHue})` : 'rgb(var(--color-text-muted))',
                transition: 'all 140ms ease',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
