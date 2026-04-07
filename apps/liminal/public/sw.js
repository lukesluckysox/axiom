/**
 * Liminal Service Worker
 *
 * Caching strategy:
 *   - /_next/static/**  → Cache-first (content-hashed, safe to cache permanently)
 *   - /fonts/**         → Cache-first (static woff files)
 *   - External fonts    → Cache-first (googleapis, fontshare)
 *   - /api/**           → Network-only (auth-sensitive, never cached)
 *   - Navigation        → Network-first with offline fallback
 *
 * Does NOT cache authenticated page content to avoid stale-auth bugs.
 */

const CACHE_VERSION = 'liminal-v1.4';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const PAGES_CACHE   = `${CACHE_VERSION}-pages`;

// Static shell assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/offline',
];

// ── Install — pre-cache shell assets ────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGES_CACHE)
      .then((cache) => {
        // Best-effort: don't fail install if assets can't be fetched
        return cache.addAll(PRECACHE_ASSETS).catch(() => {});
      })
      .then(() => self.skipWaiting())
  );
});

// ── Activate — prune old cache versions ─────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(CACHE_VERSION))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Skip API routes entirely — auth-sensitive, never cache
  if (url.pathname.startsWith('/api/')) return;

  // Skip non-HTTP(S) protocols
  if (!url.protocol.startsWith('http')) return;

  // Static Next.js chunks — cache-first (content-hashed filenames, eternally safe)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Local fonts (woff files)
  if (url.pathname.startsWith('/fonts/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // External fonts: Google Fonts, Fontshare
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    url.hostname === 'api.fontshare.com'
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Navigation requests — network-first, graceful offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // Everything else: network-first, no fallback (images, icons, etc.)
  event.respondWith(
    fetch(request).catch(() => new Response('', { status: 503 }))
  );
});

// ── Strategies ───────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 503 });
  }
}

async function networkFirstWithOfflineFallback(request) {
  const cache = await caches.open(PAGES_CACHE);

  try {
    const response = await fetch(request);
    // Only cache successful, full responses for same-origin navigation
    if (response.ok && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Try the cache first
    const cached = await cache.match(request);
    if (cached) return cached;

    // Fall back to the offline page
    const offline = await cache.match('/offline');
    if (offline) return offline;

    // Last resort
    return new Response(
      '<html><body style="font-family:Georgia,serif;color:#DAD4C8;background:#14120E;padding:3rem;max-width:40ch;margin:0 auto"><h1 style="font-style:italic;font-weight:400">Offline</h1><p style="opacity:.6">Liminal requires a connection for new sessions. Return when you are back online.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}
