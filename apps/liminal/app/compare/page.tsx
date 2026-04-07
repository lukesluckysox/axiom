import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Nav } from '@/components/nav';
import { SessionOutput } from '@/components/session-output';
import { SessionOutputErrorBoundary } from '@/components/session-output-error-boundary';
import { LocalDate } from '@/components/local-date';
import { getSession } from '@/lib/auth/session';
import { queryOne } from '@/lib/db';
import { TOOL_LABELS, TOOL_ACCENTS } from '@/lib/tools/constants';
import { canCompare } from '@/lib/permissions';
import { UpgradePrompt } from '@/components/upgrade-prompt';

export const metadata: Metadata = {
  title: 'Compare Sessions — Liminal',
};

interface PageProps {
  searchParams: { a?: string; b?: string };
}

interface ToolSession {
  id: string;
  tool_slug: string;
  title: string;
  input_text: string;
  structured_output: unknown;
  created_at: Date;
}

function serializeSession(s: ToolSession) {
  return {
    ...s,
    created_at_iso:
      s.created_at instanceof Date ? s.created_at.toISOString() : String(s.created_at),
  };
}

export default async function ComparePage({ searchParams }: PageProps) {
  const user = await getSession();
  if (!user) notFound();

  // Plan gate: comparison is Cabinet-only
  if (!canCompare(user.plan)) {
    return (
      <>
        <Nav user={user} />
        <main
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: 'clamp(2.5rem, 5vw, 5rem) 1.5rem',
          }}
        >
          <UpgradePrompt feature="compare" />
        </main>
      </>
    );
  }

  const { a, b } = searchParams;
  if (!a || !b) {
    return (
      <>
        <Nav user={user} />
        <main
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: 'clamp(2.5rem, 5vw, 5rem) 1.5rem',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(0.875rem, 0.8rem + 0.25vw, 1rem)',
              color: 'rgb(var(--color-text-muted))',
              fontStyle: 'italic',
            }}
          >
            Select two sessions from the{' '}
            <Link href="/archive" style={{ color: 'rgb(var(--color-gold))' }}>
              archive
            </Link>{' '}
            to compare them.
          </p>
        </main>
      </>
    );
  }

  const [sessionA, sessionB] = await Promise.all([
    queryOne<ToolSession>(
      `SELECT id, tool_slug, title, input_text, structured_output, created_at
       FROM tool_sessions WHERE id = $1 AND user_id = $2`,
      [a, user.id]
    ),
    queryOne<ToolSession>(
      `SELECT id, tool_slug, title, input_text, structured_output, created_at
       FROM tool_sessions WHERE id = $1 AND user_id = $2`,
      [b, user.id]
    ),
  ]);

  if (!sessionA || !sessionB) notFound();

  const sA = serializeSession(sessionA);
  const sB = serializeSession(sessionB);

  return (
    <>
      <Nav user={user} />
      <main
        style={{
          maxWidth: '1160px',
          margin: '0 auto',
          padding: 'clamp(2.5rem, 5vw, 5rem) 1.5rem',
        }}
      >
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem' }} aria-label="Breadcrumb">
          <Link
            href="/archive"
            style={{
              fontSize: 'clamp(0.75rem, 0.7rem + 0.2vw, 0.8125rem)',
              color: 'rgb(var(--color-text-faint))',
              textDecoration: 'none',
              letterSpacing: '0.04em',
            }}
          >
            ← Archive
          </Link>
        </nav>

        <header style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <p
            className="eyebrow"
            style={{ marginBottom: '0.5rem' }}
          >
            Comparing two sessions
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: 'clamp(1.375rem, 1rem + 1vw, 1.875rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'rgb(var(--color-text))',
              lineHeight: 1.2,
            }}
          >
            Side by side
          </h1>
        </header>

        {/* Two-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'start',
          }}
        >
          {[sA, sB].map((s) => {
            const ac = TOOL_ACCENTS[s.tool_slug] ?? '156 134 84';
            const label = TOOL_LABELS[s.tool_slug] ?? s.tool_slug;
            return (
              <article key={s.id}>
                {/* Session header */}
                <div
                  style={{
                    paddingBottom: '1.25rem',
                    marginBottom: '1.5rem',
                    borderBottom: `1px solid rgb(${ac} / 0.15)`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      marginBottom: '0.625rem',
                    }}
                  >
                    <Link
                      href={`/tool/${s.tool_slug}`}
                      style={{
                        fontSize: 'clamp(0.625rem, 0.58rem + 0.12vw, 0.6875rem)',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: `rgb(${ac})`,
                        textDecoration: 'none',
                      }}
                    >
                      {label}
                    </Link>
                    <span
                      style={{
                        width: '3px',
                        height: '3px',
                        borderRadius: '50%',
                        background: `rgb(${ac} / 0.35)`,
                        display: 'inline-block',
                      }}
                      aria-hidden
                    />
                    <LocalDate
                      isoString={s.created_at_iso}
                      format="short"
                      style={{
                        fontSize: 'clamp(0.625rem, 0.58rem + 0.12vw, 0.6875rem)',
                        color: 'rgb(var(--color-text-faint))',
                      }}
                    />
                  </div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display), Georgia, serif',
                      fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)',
                      fontWeight: 400,
                      fontStyle: 'italic',
                      color: 'rgb(var(--color-text))',
                      lineHeight: 1.25,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {s.title}
                  </h2>
                  <Link
                    href={`/session/${s.id}`}
                    style={{
                      fontSize: '0.6875rem',
                      color: `rgb(${ac} / 0.7)`,
                      textDecoration: 'none',
                      letterSpacing: '0.04em',
                    }}
                  >
                    View full session →
                  </Link>
                </div>

                {/* Output */}
                <SessionOutputErrorBoundary>
                  <SessionOutput
                    toolSlug={s.tool_slug}
                    output={s.structured_output}
                  />
                </SessionOutputErrorBoundary>
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}
