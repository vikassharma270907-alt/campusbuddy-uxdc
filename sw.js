// CampusBuddy Service Worker - Offline Cache for Campus Wi-Fi Resilience
const CACHE_NAME = 'campusbuddy-v2';
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

  // Bypass service worker cache for large media, byte-range requests, and real-time SSE streams
  if (
    event.request.headers.has('range') ||
    event.request.url.includes('.mp4') ||
    event.request.url.includes('.mp3') ||
    event.request.url.includes('/events') ||
    event.request.url.includes('/api/events')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Return cached and update cache in background
        fetch(event.request).then((networkRes) => {
          if (networkRes && networkRes.status === 200 && (networkRes.type === 'basic' || networkRes.type === 'cors')) {
            const cloned = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(event.request).then((networkRes) => {
        if (!networkRes || networkRes.status !== 200 || (networkRes.type !== 'basic' && networkRes.type !== 'cors')) {
          return networkRes;
        }
        const cloned = networkRes.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        return networkRes;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return caches.match(event.request);
      });
    })
  );
});

// Push notification event listener for instant campus moment updates
self.addEventListener('push', (event) => {
  let payload = { title: 'CampusBuddy 🎓', body: 'New campus moment activity nearby!' };
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (_) {
      payload.body = event.data.text();
    }
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || 'CampusBuddy 🎓', {
      body: payload.body,
      icon: './favicon.ico',
      badge: './favicon.ico',
      vibrate: [100, 50, 100],
      data: { url: './index.html' }
    })
  );
});

// Focus active browser tab or open prototype when user clicks notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        try {
          const clientUrl = new URL(client.url);
          if (
            clientUrl.origin === self.location.origin &&
            (clientUrl.pathname.includes('index.html') || clientUrl.pathname.includes('campusbuddy.html') || clientUrl.pathname === '/')
          ) {
            return client.focus();
          }
        } catch {}
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('./index.html');
      }
    })
  );
});
