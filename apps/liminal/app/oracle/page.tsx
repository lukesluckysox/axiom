import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Nav } from '@/components/nav';
import { getSession } from '@/lib/auth/session';
import { isOracle } from '@/lib/permissions';
import { OracleDashboardClient } from '@/components/oracle-dashboard';

export const metadata: Metadata = {
  title: 'Oracle — Liminal',
};

export default async function OraclePage() {
  const user = await getSession();
  if (!user) redirect('/login?from=/oracle');
  if (!isOracle(user.role)) redirect('/');

  return (
    <>
      <Nav user={user} />
      <main
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: 'clamp(2rem, 4vw, 4rem) 1.5rem',
        }}
      >
        <header style={{ marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          <p
            className="eyebrow"
            style={{ marginBottom: '0.5rem' }}
          >
            Oracle
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: 'clamp(1.5rem, 1rem + 1.25vw, 2.25rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'rgb(var(--color-text))',
              lineHeight: 1.15,
            }}
          >
            Administration
          </h1>
        </header>

        <OracleDashboardClient />
      </main>
    </>
  );
}
