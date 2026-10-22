// Nur öffentliche Programmdateien. Keine Anmeldung, API-Antworten, Fotos oder Gartendaten cachen.
const CACHE = 'ramonas-private-f005288a-shell-e8c38b727b36';
const ASSETS = ["/newgarten/","/newgarten/index.html","/newgarten/impressum.html","/newgarten/read.txt","/newgarten/style.css","/newgarten/app.js","/newgarten/manifest.webmanifest","/newgarten/icon.svg","/newgarten/icon-192.png","/newgarten/icon-512.png"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('ramonas-private-f005288a-shell-') && key !== CACHE).map(key => caches.delete(key)))));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.search || !ASSETS.includes(url.pathname)) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
