/* Hanger Hustle service worker: caches the app shell so it opens offline.
   Item data/photos live in IndexedDB, not in this cache. Bump VERSION to force an update. */
const VERSION = 'ctc-v9';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-180.png', './privacy.html', './terms.html'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  // Never cache Google sign-in / API traffic (accounts.google.com, googleapis.com, avatars) or any other site.
  if (/(^|\.)(google\.com|googleapis\.com|gstatic\.com|googleusercontent\.com)$/.test(url.hostname)) return;
  if (req.method !== 'GET' || url.origin !== location.origin) return; // marketplace links etc. go straight to network
  if (req.mode === 'navigate') {
    // Network first for the page (so updates arrive), fall back to cached copy offline.
    const page = /\/(privacy|terms)\.html$/.test(url.pathname) ? req : './index.html';
    e.respondWith(fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(page, cp)); } return r; })
      .catch(() => caches.match(page, { ignoreSearch: true }).then(h => h || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return r; })));
});
