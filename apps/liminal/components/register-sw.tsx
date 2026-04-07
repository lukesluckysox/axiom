'use client';

import { useEffect } from 'react';

/**
 * RegisterSW — registers the service worker on first client mount.
 * Silent in production; logs to console in dev.
 * Rendered once in the root layout.
 */
export function RegisterSW() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[sw] registered:', reg.scope);
        }
      })
      .catch((err) => {
        // Non-fatal — the app works without the SW
        if (process.env.NODE_ENV === 'development') {
          console.warn('[sw] registration failed:', err);
        }
      });
  }, []);

  return null;
}
