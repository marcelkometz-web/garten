// Nur öffentliche Programmdateien. Keine Anmeldung, API-Antworten, Fotos oder Gartendaten cachen.
const CACHE = 'ramonas-private-f005288a-shell-188586826b0f';
const ASSETS = ["/newgarten/","/newgarten/index.html","/newgarten/impressum.html","/newgarten/read.html","/newgarten/help.js","/newgarten/read.txt","/newgarten/style.css","/newgarten/app.js","/newgarten/manifest.webmanifest","/newgarten/icon.svg","/newgarten/icon-192.png","/newgarten/icon-512.png"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS.map(path=>new Request(path,{cache:'reload'})))));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('ramonas-private-f005288a-shell-') && key!==CACHE).map(key=>caches.delete(key)));
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
