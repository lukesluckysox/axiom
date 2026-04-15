'use client';

import Link from 'next/link';
import { Home, CircleDot, Compass, FlaskConical, Zap, Ghost } from 'lucide-react';

const LUMEN_HUB_URL = 'https://lumen-os.up.railway.app';
const CURRENT_APP = 'liminal';

const APP_NAV = [
  { key: 'parallax', href: 'https://parallaxapp.up.railway.app/', icon: Compass, label: 'Parallax' },
  { key: 'praxis', href: 'https://praxis-app.up.railway.app/', icon: FlaskConical, label: 'Praxis' },
  { key: 'axiom', href: 'https://axiomtool-production.up.railway.app/#/', icon: Zap, label: 'Axiom' },
  { key: 'liminal', href: 'https://liminal-app.up.railway.app/', icon: Ghost, label: 'Liminal' },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderTop: '1px solid rgb(var(--color-border) / 0.15)',
        background: 'rgb(var(--color-bg) / 0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      className="md:hidden"
    >
      {/* Top row: Lumen Home + App Home */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgb(var(--color-border) / 0.1)',
        }}
      >
        <a
          href={LUMEN_HUB_URL}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            padding: '0.5rem',
            textDecoration: 'none',
            color: 'rgb(var(--color-text-faint))',
            opacity: 0.6,
            transition: 'opacity 0.15s ease',
          }}
        >
          <CircleDot style={{ width: '14px', height: '14px', flexShrink: 0 }} strokeWidth={1.5} />
          <span style={{ fontSize: '10px', fontFamily: 'var(--font-body), system-ui, sans-serif', letterSpacing: '0.04em' }}>
            Lumen
          </span>
        </a>
        <div style={{ width: '1px', background: 'rgb(var(--color-border) / 0.1)' }} />
        <Link
          href="/"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            padding: '0.5rem',
            textDecoration: 'none',
            color: 'rgb(var(--color-text-faint))',
            opacity: 0.6,
            transition: 'opacity 0.15s ease',
          }}
        >
          <Home style={{ width: '14px', height: '14px', flexShrink: 0 }} strokeWidth={1.5} />
          <span style={{ fontSize: '10px', fontFamily: 'var(--font-body), system-ui, sans-serif', letterSpacing: '0.04em' }}>
            Liminal
          </span>
        </Link>
      </div>

      {/* Bottom row: 4 sub-apps */}
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'stretch',
        }}
      >
        {APP_NAV.map(({ key, href, icon: Icon, label }) => {
          const isSelf = key === CURRENT_APP;
          return (
            <a
              key={key}
              href={isSelf ? '/' : href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.625rem 0.5rem',
                minHeight: '48px',
                textDecoration: 'none',
                color: isSelf
                  ? 'rgb(var(--color-gold))'
                  : 'rgb(var(--color-text-faint))',
                opacity: isSelf ? 1 : 0.4,
                transition: 'opacity 0.15s ease, color 0.15s ease',
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <Icon
                style={{ width: '20px', height: '20px', flexShrink: 0 }}
                strokeWidth={isSelf ? 2 : 1.5}
              />
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-body), system-ui, sans-serif',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  fontWeight: isSelf ? 600 : 400,
                }}
              >
                {label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
