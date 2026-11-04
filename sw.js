// AllShop — service worker
// Siempre intenta traer la versión nueva de internet; si no hay conexión,
// abre la última versión guardada. Nunca guarda los datos del Apps Script.
const CACHE = 'allshop-v6';

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.endsWith('script.google.com') || url.hostname.endsWith('googleusercontent.com')) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok && (url.origin === location.origin || url.hostname.endsWith('cdnjs.cloudflare.com') || url.hostname.includes('fonts.g'))) {
          const copia = res.clone();
          caches.open(CACHE).then(c => c.put(req, copia));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
