const C = 'py-notepad-v2';
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(C).then(cache => cache.addAll(CORE).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== C).map(k => caches.delete(k))
    )).then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const same = new URL(e.request.url).origin === location.origin;
  e.respondWith(caches.open(C).then(async c => {
    const hit = await c.match(e.request);
    // Cross-origin runtime & libraries (Pyodide, JSZip): cache-first
    if (!same && hit) return hit;
    try {
      const r = await fetch(e.request);
      if (r.ok || r.type === 'opaque') c.put(e.request, r.clone());
      return r;
    } catch (err) {
      // Offline fallback
      return hit || (e.request.mode === 'navigate' ? await c.match('./index.html') : Response.error());
    }
  }));
});
