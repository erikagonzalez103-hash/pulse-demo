/* Pulse — minimal service worker (MVP shell).
   Strategy: network-first for screens (always fresh), cache-first for
   styles/scripts/images (fast + offline-tolerant). Bump VERSION to invalidate. */
const VERSION = 'pulse-v2';  // bumped: compass-mark icons
const STATIC = /\.(css|js|jpg|jpeg|png|webmanifest)($|\?)/;

self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  if (e.request.method !== 'GET') return;
  if (STATIC.test(url)) {
    e.respondWith(
      caches.open(VERSION).then(cache =>
        cache.match(e.request).then(hit => hit || fetch(e.request).then(res => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }))
      )
    );
  } else {
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        if (res.ok) caches.open(VERSION).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request))
    );
  }
});
