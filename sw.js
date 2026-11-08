// CampusBuddy Service Worker - Offline Cache for Campus Wi-Fi Resilience
const CACHE_NAME = 'campusbuddy-v1';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './campusbuddy.html',
  './manifest.webmanifest',
  './DESIGN.md',
  './favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Return cached and update cache in background
        fetch(event.request).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkRes));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(event.request).then((networkRes) => {
        if (!networkRes || networkRes.status !== 200 || networkRes.type !== 'basic') {
          return networkRes;
        }
        const cloned = networkRes.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        return networkRes;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
