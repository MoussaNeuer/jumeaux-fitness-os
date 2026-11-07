// ============================================================================
// Service worker — ressources statiques uniquement, aucune donnée métier
// ============================================================================
const V = 'jfos-v7.6';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './assets/images/logo.png',
  './assets/images/logo-mark.png',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/fonts/inter.woff2',
  './assets/fonts/instrument-serif-italic.woff2',
  './assets/fonts/fa-solid-900.woff2',
  './assets/vendor/fa.css',
  './assets/vendor/fa-solid.css',
  './assets/vendor/qrcode.js',
  './assets/css/style.css',
  './assets/css/dashboard.css',
  './assets/css/components.css',
  './assets/css/responsive.css',
  './assets/js/data.js',
  './assets/js/core.js',
  './assets/js/landing.js',
  './assets/js/dashboard.js',
  './assets/js/actions.js',
  './assets/js/member-portal.js',
  './assets/js/presentation.js',
  './assets/js/pro.js',
  './assets/css/pro.css',
  './assets/vendor/jsQR.js',
  './assets/icons/og-image.png',
  './404.html',
  './assets/js/app.js'
];

self.addEventListener('install', e => e.waitUntil(
  caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
));

self.addEventListener('activate', e => e.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k))))
    .then(() => clients.claim())
));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        if (r && r.ok) {
          const copy = r.clone();
          caches.open(V).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return r;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
