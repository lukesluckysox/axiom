/**
 * Favicon — 32×32 PNG
 * Cinzel "L" in bone ivory on warm soot.
 */
import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  const font = readFileSync(
    join(process.cwd(), 'public/fonts/Cinzel-Regular.woff')
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          backgroundColor: '#14120E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Thin brass rule at top */}
        <div
          style={{
            position: 'absolute',
            top: 5,
            left: 7,
            width: 18,
            height: 1,
            backgroundColor: '#9C8654',
          }}
        />
        {/* Letterform */}
        <div
          style={{
            fontFamily: 'Cinzel',
            fontWeight: 400,
            fontSize: 18,
            color: '#DAD4C8',
            lineHeight: 1,
            letterSpacing: '0.04em',
          }}
        >
          L
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Cinzel', data: font, style: 'normal', weight: 400 }],
    }
  );
}
