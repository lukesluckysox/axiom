/**
 * Apple Touch Icon — 180×180 PNG
 * More generous: "L" with the thin brass rule above it.
 */
import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  const font = readFileSync(
    join(process.cwd(), 'public/fonts/Cinzel-Regular.woff')
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          backgroundColor: '#14120E',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
        }}
      >
        {/* Brass rule */}
        <div
          style={{
            width: 40,
            height: 1.5,
            backgroundColor: '#9C8654',
            marginBottom: 14,
          }}
        />
        {/* Letterform */}
        <div
          style={{
            fontFamily: 'Cinzel',
            fontWeight: 400,
            fontSize: 88,
            color: '#DAD4C8',
            lineHeight: 1,
            letterSpacing: '0.06em',
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
