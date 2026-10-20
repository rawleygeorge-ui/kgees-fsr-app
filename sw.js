// KGEES FSR service worker
// Caches only the wrapper (this page, icons, manifest) so the app opens instantly
// and shows a "no signal" screen instead of Chrome's dinosaur when offline.
// The FSR app itself (Apps Script) always loads live from Google.

const CACHE = 'kgees-fsr-v3';   // bump to v2, v3... whenever you change these files
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/logo.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // never touch Google's requests

  // Network first, fall back to cache, so updates show up as soon as there is signal.
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
  );
});
