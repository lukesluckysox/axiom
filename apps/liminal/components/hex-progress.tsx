'use client';

/**
 * HexProgress — editorial progress widget.
 *
 * Left: a regular hexagon divided into 6 triangular slices (one per tool),
 *       rendered clockwise from the top: I → II → III → IV → V → VI.
 *       Each slice fills with the tool's accent colour once the user has
 *       consulted that tool. Each slice is independently clickable → /tool/:slug.
 *
 * Right: a compact streak counter + 7-day dot history.
 */

// ─── Tool slice registry (order = clockwise from top) ────────────────────────

const SLICES = [
  { slug: 'small-council', name: 'Small Council',      accent: '156 134 84' },
  { slug: 'genealogist',   name: 'The Genealogist',    accent: '110 120 98' },
  { slug: 'interlocutor',  name: 'The Interlocutor',   accent: '96 116 140' },
  { slug: 'stoics-ledger', name: "The Stoic's Ledger", accent: '98 96 88'   },
  { slug: 'fool',          name: 'The Fool',           accent: '136 78 70'  },
  { slug: 'interpreter',   name: 'The Interpreter',    accent: '104 94 120' },
] as const;

// ─── Geometry: pointy-top hexagon, viewBox 0 0 120 120, center (60,60), r=50

const CX = 60, CY = 60, R = 50;

function hex_vertex(i: number): [number, number] {
  // Vertex i is at angle (i*60 − 90)° so vertex 0 = top
  const a = (i * 60 - 90) * (Math.PI / 180);
  return [CX + R * Math.cos(a), CY + R * Math.sin(a)];
}

const VERTS = Array.from({ length: 6 }, (_, i) => hex_vertex(i));

function slice_path(i: number): string {
  const [ax, ay] = VERTS[i];
  const [bx, by] = VERTS[(i + 1) % 6];
  return `M${CX},${CY} L${ax.toFixed(2)},${ay.toFixed(2)} L${bx.toFixed(2)},${by.toFixed(2)}Z`;
}

// Outer hexagon border path
const HEX_BORDER = VERTS
  .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
  .join(' ') + 'Z';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface HexProgressProps {
  /** Tool slugs the user has ever consulted (from DB). */
  usedSlugs: string[];
  /** Consecutive-day streak. */
  streak: number;
  /** 7 booleans: index 0 = 6 days ago, index 6 = today. */
  recentDays: boolean[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export function HexProgress({ usedSlugs, streak, recentDays }: HexProgressProps) {
  const usedSet   = new Set(usedSlugs);
  const consulted = SLICES.filter((s) => usedSet.has(s.slug)).length;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(1.25rem, 3vw, 2rem)',
      }}
    >
      {/* ── Hexagon ─────────────────────────────────────────────── */}
      <svg
        viewBox="0 0 120 120"
        width={88}
        height={88}
        style={{ flexShrink: 0 }}
        aria-label={`${consulted} of 6 instruments consulted`}
        role="img"
      >
        {SLICES.map((slice, i) => {
          const used  = usedSet.has(slice.slug);
          const [r, g, b] = slice.accent.split(' ').map(Number);

          return (
            <a
              key={slice.slug}
              href={`/tool/${slice.slug}`}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              <title>
                {slice.name}{used ? ' — consulted' : ' — not yet consulted'}
              </title>
              <path
                d={slice_path(i)}
                fill={
                  used
                    ? `rgba(${r},${g},${b},0.52)`
                    : 'rgb(33,30,24)'
                }
                /* soot bg as stroke = creates natural gap between slices */
                stroke="rgb(20,18,14)"
                strokeWidth={2}
                style={{ transition: 'fill 0.25s ease, opacity 0.2s ease' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as SVGPathElement).style.opacity = '0.82';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as SVGPathElement).style.opacity = '1';
                }}
              />
            </a>
          );
        })}

        {/* Outer ring — thin old-brass stroke */}
        <path
          d={HEX_BORDER}
          fill="none"
          stroke="rgba(156,134,84,0.2)"
          strokeWidth={1}
          pointerEvents="none"
        />

        {/* Centre dot */}
        <circle
          cx={CX}
          cy={CY}
          r={5}
          fill="rgb(26,23,18)"
          stroke="rgba(156,134,84,0.28)"
          strokeWidth={1}
          pointerEvents="none"
        />
      </svg>

      {/* ── Streak + 7-day dots ──────────────────────────────────── */}
      <div>
        {/* Consulted count label */}
        <p
          style={{
            fontSize: 'clamp(0.6rem, 0.56rem + 0.15vw, 0.6875rem)',
            fontWeight: 600,
            letterSpacing: '0.11em',
            textTransform: 'uppercase',
            color: 'rgb(var(--color-text-faint))',
            marginBottom: streak > 0 ? '0.5rem' : '0.625rem',
          }}
        >
          {consulted === 6
            ? 'All instruments consulted'
            : consulted === 0
            ? 'No instruments yet'
            : `${consulted} of 6 consulted`}
        </p>

        {/* Streak count */}
        {streak > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.375rem',
              marginBottom: '0.625rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display), Georgia, serif',
                fontSize: 'clamp(1.375rem, 1.1rem + 0.9vw, 1.75rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'rgb(var(--color-gold))',
                lineHeight: 1,
              }}
            >
              {streak}
            </span>
            <span
              style={{
                fontSize: 'clamp(0.6rem, 0.56rem + 0.15vw, 0.6875rem)',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgb(var(--color-text-muted))',
              }}
            >
              {streak === 1 ? 'day' : 'day'} streak
            </span>
          </div>
        )}

        {/* 7-day history dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {recentDays.map((active, i) => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: active
                  ? 'rgb(var(--color-gold))'
                  : 'rgb(43,38,32)',
                border: `1px solid rgba(156,134,84,${active ? '0.4' : '0.18'})`,
                transition: 'background-color 0.2s',
              }}
            />
          ))}
          <span
            style={{
              marginLeft: '4px',
              fontSize: '0.5625rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgb(var(--color-text-faint))',
            }}
          >
            last 7 days
          </span>
        </div>
      </div>
    </div>
  );
}
