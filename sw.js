// Nur öffentliche Programmdateien. Keine Anmeldung, API-Antworten, Fotos oder Gartendaten cachen.
const CACHE = 'ramonas-private-f005288a-shell-garten-a2d778f39bcf';
const ASSETS = ["/garten/","/garten/index.html","/garten/impressum.html","/garten/read.html","/garten/help.js","/garten/read.txt","/garten/style.css","/garten/app.js","/garten/migrate-preferences.js","/garten/link-apps.js","/garten/daily-recipes.js","/garten/daily-recipes.css","/garten/manifest.webmanifest","/garten/icon.svg","/garten/icon-192.png","/garten/icon-512.png"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS.map(path=>new Request(path,{cache:'reload'})))));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('ramonas-private-f005288a-shell-garten-') && key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
// Only activate once every open tab can keep its work safe. Older tabs that
// do not understand the handshake block activation until they are closed.
let activating = false;
self.addEventListener('message', event => {
  if (event.data?.type !== 'GARDEN_REQUEST_ACTIVATION' || activating) return;
  activating = true;
  event.waitUntil((async () => {
    try {
      const tabs = (await self.clients.matchAll({type:'window',includeUncontrolled:true})).filter(tab=>tab.url.startsWith(self.registration.scope));
      if (!tabs.length) return;
      const safe = await Promise.all(tabs.map(tab=>new Promise(resolve=>{
        const channel = new MessageChannel();
        const finish = value => {clearTimeout(timer);channel.port1.close();resolve(value);};
        const timer = setTimeout(()=>finish(false),2500);
        channel.port1.onmessage = reply => finish(reply.data?.safe === true);
        try {tab.postMessage({type:'GARDEN_UPDATE_CHECK'},[channel.port2]);}catch{finish(false);}
      })));
      if (safe.every(Boolean)) await self.skipWaiting();
    } finally {activating = false;}
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.search || !ASSETS.includes(url.pathname)) return;
  event.respondWith(fetch(event.request,{cache:'no-cache'}).catch(() => caches.match(event.request)));
});
