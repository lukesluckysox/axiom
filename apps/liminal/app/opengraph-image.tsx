/**
 * Open Graph image — 1200×630
 * Editorial card: bone-on-soot, Cinzel wordmark, old-brass accent rule,
 * tool names at foot in spaced small caps.
 */
import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const alt = 'Liminal — A Cabinet of Instruments for Thought';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  const cinzel = readFileSync(
    join(process.cwd(), 'public/fonts/Cinzel-Regular.woff')
  );
  const cinzelSemiBold = readFileSync(
    join(process.cwd(), 'public/fonts/Cinzel-SemiBold.woff')
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: '#14120E',
          display: 'flex',
          flexDirection: 'column',
          padding: '90px 100px 80px',
        }}
      >
        {/* Accent dash — old brass */}
        <div
          style={{
            width: 40,
            height: 2,
            backgroundColor: '#9C8654',
            marginBottom: 32,
          }}
        />

        {/* Wordmark */}
        <div
          style={{
            fontFamily: 'Cinzel',
            fontWeight: 600,
            fontSize: 82,
            color: '#DAD4C8',
            letterSpacing: '0.08em',
            lineHeight: 1,
            marginBottom: 22,
          }}
        >
          LIMINAL
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: 'Cinzel',
            fontWeight: 400,
            fontSize: 17,
            color: '#8A8276',
            letterSpacing: '0.10em',
          }}
        >
          A CABINET OF INSTRUMENTS FOR THOUGHT
        </div>

        {/* Flex spacer */}
        <div style={{ flex: 1 }} />

        {/* Horizontal rule — brass at low opacity */}
        <div
          style={{
            width: '100%',
            height: 1,
            backgroundColor: 'rgba(156, 134, 84, 0.22)',
            marginBottom: 26,
          }}
        />

        {/* Tool names — spaced caps, bone at low opacity */}
        <div
          style={{
            fontFamily: 'Cinzel',
            fontWeight: 400,
            fontSize: 11,
            color: 'rgba(218, 212, 200, 0.38)',
            letterSpacing: '0.16em',
          }}
        >
          SMALL COUNCIL  ·  THE GENEALOGIST  ·  THE INTERLOCUTOR  ·  THE STOIC'S LEDGER  ·  THE FOOL  ·  THE INTERPRETER
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Cinzel', data: cinzel, style: 'normal', weight: 400 },
        { name: 'Cinzel', data: cinzelSemiBold, style: 'normal', weight: 600 },
      ],
    }
  );
}
