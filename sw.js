// ============================================
// KELVIN EINSTEIN — Service Worker (PWA cache)
// Cache version bump when assets or page list change
// ============================================
const CACHE_NAME = 'kelvin-einstein-v3';

// Core pages only (culture.html & gallery.html removed — do not cache them)
const ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/skills.html',
  '/work.html',
  '/services.html',
  '/insights.html',
  '/contact.html',
  '/style.css',
  '/extra.css',
  '/scripts.js',
  '/manifest.json'
];

// Paths that must never be served from cache (removed pages)
const REMOVED_PATHS = ['/culture.html', '/gallery.html', 'culture.html', 'gallery.html'];

function isRemovedUrl(url) {
  try {
    const path = new URL(url).pathname;
    return REMOVED_PATHS.some((p) => path === p || path.endsWith('/' + p.replace(/^\//, '')));
  } catch {
    return false;
  }
}

// INSTALL — precache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[SW] precache failed', err))
  );
});

// ACTIVATE — delete old caches (v1, v2, etc.)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// FETCH strategy:
// 1. Never cache / serve removed pages (culture, gallery)
// 2. Navigation (HTML): network-first, fall back to cache
// 3. Same-origin static assets: cache-first, then network + update cache
// 4. Cross-origin: network only
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = request.url;

  // Block removed pages — always try network (will 404); never use old cache
  if (isRemovedUrl(url)) {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response('This page has been removed.', {
            status: 404,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          })
      )
    );
    return;
  }

  const isNav = request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');

  if (isNav) {
    // Network-first for HTML so users get latest page structure
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) =>
              cached ||
              caches.match('/index.html') ||
              new Response('Offline — please reconnect.', {
                status: 503,
                headers: { 'Content-Type': 'text/plain; charset=utf-8' }
              })
          )
        )
    );
    return;
  }

  // Same-origin assets: cache-first
  const sameOrigin = url.startsWith(self.location.origin);
  if (sameOrigin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
  }
  // else: let browser handle cross-origin (fonts, images, etc.)
});
