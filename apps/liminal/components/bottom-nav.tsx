'use client';

import { useState, useEffect, type ComponentType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Sparkles, Users, TreePine, BookOpen, CircleDot,
  MessageSquare, Eye, Scale,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const LUMEN_HUB_URL = 'https://lumen-os.up.railway.app';

const TOOL_NAV_MAP: Record<string, { label: string; Icon: ComponentType<LucideProps>; href: string }> = {
  'fool':          { label: 'Fool',        Icon: Sparkles,    href: '/tool/fool' },
  'small-council': { label: 'Council',     Icon: Users,       href: '/tool/small-council' },
  'genealogist':   { label: 'Genealogist', Icon: TreePine,    href: '/tool/genealogist' },
  'interlocutor':  { label: 'Interlocutor', Icon: MessageSquare, href: '/tool/interlocutor' },
  'interpreter':   { label: 'Interpreter', Icon: Eye,         href: '/tool/interpreter' },
  'stoics-ledger': { label: 'Ledger',      Icon: Scale,       href: '/tool/stoics-ledger' },
};

const DEFAULT_SLUGS = ['fool', 'small-council', 'genealogist'];

const ARCHIVE_ITEM = { label: 'Archive', Icon: BookOpen, href: '/archive' };

function getRecentToolSlugs(): string[] {
  try {
    const stored = localStorage.getItem('liminal_recent_tools');
    if (stored) {
      const parsed: string[] = JSON.parse(stored);
      const valid = parsed.filter((s) => s in TOOL_NAV_MAP);
      // Deduplicate
      const unique = Array.from(new Set(valid));
      if (unique.length >= 3) return unique.slice(0, 3);
      // Pad with defaults
      const padded = [...unique];
      for (const d of DEFAULT_SLUGS) {
        if (padded.length >= 3) break;
        if (!padded.includes(d)) padded.push(d);
      }
      return padded.slice(0, 3);
    }
  } catch { /* ignore */ }
  return DEFAULT_SLUGS;
}

export function BottomNav() {
  const pathname = usePathname();
  const [toolSlugs, setToolSlugs] = useState(DEFAULT_SLUGS);

  useEffect(() => {
    setToolSlugs(getRecentToolSlugs());

    // Re-read when other tabs/components update localStorage
    function handleStorage(e: StorageEvent) {
      if (e.key === 'liminal_recent_tools') {
        setToolSlugs(getRecentToolSlugs());
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const navItems = [
    ...toolSlugs.map((slug) => TOOL_NAV_MAP[slug]).filter(Boolean),
    ARCHIVE_ITEM,
  ];

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

      {/* Bottom row: 3 recent tools + Archive */}
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
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.625rem 0.5rem',
                minHeight: '48px',
                textDecoration: 'none',
                color: isActive
                  ? 'rgb(var(--color-gold))'
                  : 'rgb(var(--color-text-faint))',
                opacity: isActive ? 1 : 0.4,
                transition: 'opacity 0.15s ease, color 0.15s ease',
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <Icon
                style={{ width: '20px', height: '20px', flexShrink: 0 }}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-body), system-ui, sans-serif',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
