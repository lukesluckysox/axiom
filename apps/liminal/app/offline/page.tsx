'use client';

import Link from 'next/link';

/**
 * Offline fallback page.
 *
 * Served by the service worker when a navigation request fails due to
 * no network connection. The page is pre-cached during SW install.
 *
 * Tone: calm, editorial, honest.
 */
export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(2rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)',
        maxWidth: '540px',
        margin: '0 auto',
      }}
    >
      {/* Wordmark */}
      <p
        style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgb(var(--color-gold) / 0.6)',
          marginBottom: '2.5rem',
        }}
      >
        Liminal
      </p>

      {/* Accent rule */}
      <div
        style={{
          width: '28px',
          height: '2px',
          background: 'rgb(var(--color-gold))',
          opacity: 0.4,
          borderRadius: '1px',
          marginBottom: '1.5rem',
        }}
        aria-hidden
      />

      {/* Heading */}
      <h1
        style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontSize: 'clamp(1.75rem, 1.2rem + 1.5vw, 2.5rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: 'rgb(var(--color-text))',
          lineHeight: 1.15,
          marginBottom: '1.25rem',
        }}
      >
        You appear to be offline.
      </h1>

      {/* Body */}
      <p
        style={{
          fontSize: 'clamp(0.875rem, 0.82rem + 0.3vw, 1rem)',
          color: 'rgb(var(--color-text-muted))',
          lineHeight: 1.72,
          marginBottom: '0.75rem',
          maxWidth: '44ch',
        }}
      >
        Generating new sessions requires a connection. If you were recently
        online, previously visited pages may still be readable from your device.
      </p>

      <p
        style={{
          fontSize: 'clamp(0.8125rem, 0.76rem + 0.2vw, 0.875rem)',
          color: 'rgb(var(--color-text-faint))',
          lineHeight: 1.65,
          marginBottom: '2.5rem',
          maxWidth: '44ch',
        }}
      >
        Return to this page once you are back online. The archive and past
        sessions will be available again.
      </p>

      {/* Action */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
          style={{ textDecoration: 'none' }}
        >
          Try again
        </button>
        <Link
          href="/"
          className="btn-ghost"
          style={{ textDecoration: 'none' }}
        >
          Home
        </Link>
      </div>

      {/* Footnote */}
      <p
        style={{
          marginTop: '4rem',
          fontSize: '0.75rem',
          color: 'rgb(var(--color-text-faint))',
          letterSpacing: '0.03em',
          fontStyle: 'italic',
        }}
      >
        The threshold between confusion and clarity requires, for now, a signal.
      </p>
    </div>
  );
}
