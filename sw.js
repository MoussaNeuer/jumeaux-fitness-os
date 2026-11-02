// Service worker : réseau d'abord, cache des ressources statiques uniquement
const V = 'jfos-v2';
const FILES = ['./','./index.html','./manifest.json','./assets/icons/icon.svg','./assets/css/dashboard.css','./assets/css/components.css','./assets/css/style.css','./assets/css/responsive.css','./assets/js/presentation.js','./assets/js/core.js','./assets/js/app.js','./assets/js/member-portal.js','./assets/js/actions.js','./assets/js/landing.js','./assets/js/dashboard.js','./assets/js/data.js'];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
