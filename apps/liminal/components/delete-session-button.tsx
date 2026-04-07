'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteSessionButtonProps {
  sessionId: string;
  /** Where to redirect after deletion. Defaults to '/archive'. */
  redirectTo?: string;
}

export function DeleteSessionButton({
  sessionId,
  redirectTo = '/archive',
}: DeleteSessionButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? 'Could not delete session.');
        setDeleting(false);
        setConfirming(false);
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('A network error occurred.');
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (error) {
    return (
      <span
        style={{
          fontSize: 'clamp(0.8rem, 0.75rem + 0.2vw, 0.875rem)',
          color: 'rgb(var(--color-error))',
        }}
      >
        {error}
      </span>
    );
  }

  if (confirming) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <span
          style={{
            fontSize: 'clamp(0.8rem, 0.75rem + 0.2vw, 0.875rem)',
            color: 'rgb(var(--color-text-muted))',
          }}
        >
          Delete this session?
        </span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            background: 'none',
            border: 'none',
            cursor: deleting ? 'not-allowed' : 'pointer',
            fontSize: 'clamp(0.8rem, 0.75rem + 0.2vw, 0.875rem)',
            color: 'rgb(var(--color-error))',
            padding: '0.25rem 0.5rem',
            borderRadius: '3px',
            opacity: deleting ? 0.5 : 1,
          }}
        >
          {deleting ? 'Deleting…' : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'clamp(0.8rem, 0.75rem + 0.2vw, 0.875rem)',
            color: 'rgb(var(--color-text-faint))',
            padding: '0.25rem 0.5rem',
            borderRadius: '3px',
          }}
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 'clamp(0.8rem, 0.75rem + 0.2vw, 0.875rem)',
        color: 'rgb(var(--color-text-faint))',
        padding: 0,
        transition: 'color 150ms ease',
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.color = 'rgb(var(--color-error))')
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.color = 'rgb(var(--color-text-faint))')
      }
    >
      Delete session
    </button>
  );
}
