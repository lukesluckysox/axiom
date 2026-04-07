/**
 * PWA icon route — serves the Liminal icon at 192px and 512px.
 * Uses the same Cinzel "L" on soot design as app/icon.tsx.
 *
 * Usage: /api/pwa-icon?size=192  or  /api/pwa-icon?size=512
 */

import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

// Cache these for the lifetime of the function (warm starts)
let cinzelSemiBold: ArrayBuffer | null = null;

function loadFont(): ArrayBuffer {
  if (cinzelSemiBold) return cinzelSemiBold;
  cinzelSemiBold = readFileSync(
    join(process.cwd(), 'public/fonts/Cinzel-SemiBold.woff')
  ).buffer as ArrayBuffer;
  return cinzelSemiBold;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawSize = parseInt(searchParams.get('size') ?? '192', 10);
  const size = rawSize === 512 ? 512 : 192;

  const fontData = loadFont();

  // Scale proportionally from the 192 base
  const scale     = size / 192;
  const fontSize  = Math.round(80 * scale);
  const ruleTop   = Math.round(40 * scale);
  const ruleH     = Math.round(40 * scale * 0.7); // keep thin
  const margin    = Math.round(42 * scale);
  const marginTop = Math.round(18 * scale);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#14120E',
          position: 'relative',
        }}
      >
        {/* Old-brass rule above the letter */}
        <div
          style={{
            position: 'absolute',
            top: ruleTop,
            left: margin,
            right: margin,
            height: ruleH > 2 ? 2 : ruleH,
            background: '#9C8654',
            opacity: 0.65,
          }}
        />
        {/* The letter */}
        <span
          style={{
            fontFamily: 'Cinzel',
            fontSize,
            color: '#DAD4C8',
            marginTop: marginTop,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          L
        </span>
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [
        {
          name: 'Cinzel',
          data: fontData,
          weight: 600,
          style: 'normal',
        },
      ],
    }
  );
}
