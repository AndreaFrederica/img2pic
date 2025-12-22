/* eslint-env serviceworker */
/**
 * Custom Service Worker for img2pic PWA
 * No CDN dependencies - uses native Cache API
 *
 * Build process will replace self.__WB_MANIFEST with precache list
 */

// ============================================
// PRECACHE MANIFEST (injected by Quasar build)
// ============================================
const precacheList = self.__WB_MANIFEST || [];

// ============================================
// CACHE CONFIGURATION
// ============================================
const CACHE_PREFIX = 'img2pic';
const CACHE_VERSION = 'v1';
const PRECACHE_NAME = `${CACHE_PREFIX}-precache-${CACHE_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-${CACHE_VERSION}`;

// ============================================
// INSTALL EVENT
// ============================================
self.addEventListener('install', (event) => {
  self.skipWaiting();

  // Cache precached assets (injected by build)
  const precacheUrls = precacheList.map(entry => typeof entry === 'string' ? entry : entry.url);
  const staticAssets = ['/', '/index.html', '/icons/icon-96x96.png', '/icons/icon-128x128.png'];

  event.waitUntil(
    caches.open(PRECACHE_NAME).then((cache) => cache.addAll([...precacheUrls, ...staticAssets]))
  );
});

// ============================================
// ACTIVATE EVENT
// ============================================
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());

  // Cleanup old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== PRECACHE_NAME && cacheName !== RUNTIME_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// ============================================
// FETCH EVENT - Caching Strategies
// ============================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip dev server files and HMR requests
  if (url.pathname.includes('/src/') ||
      url.searchParams.has('t') ||
      url.pathname.endsWith('.ts') ||
      url.pathname.endsWith('.vue')) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests that shouldn't be cached
  if (url.origin !== self.location.origin && !url.origin.includes('fonts.gstatic.com')) {
    return;
  }

  // HTML pages - NetworkFirst for fresh content
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache the response
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  // Static assets (js, css, fonts, icons) - CacheFirst (prefer cache, fallback to network)
  if (request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'font' ||
      url.pathname.includes('/icons/') ||
      url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Update cache in background
          fetch(request).then((response) => {
            if (response && response.status === 200) {
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, response));
            }
          });
          return cached;
        }
        return fetch(request).then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Images - CacheFirst
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
          }
          return response;
        });
      })
    );
    return;
  }

  // NetworkFirst for other requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// ============================================
// MESSAGE HANDLER
// ============================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ============================================
// PUSH NOTIFICATIONS (future feature)
// ============================================
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icons/icon-128x128.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1'
      }
    };

    event.waitUntil(
      self.registration.showNotification('img2pic 通知', options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow('/')
  );
});
