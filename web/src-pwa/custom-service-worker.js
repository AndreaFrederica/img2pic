/* eslint-env serviceworker */
/* global workbox */
/*
 * Custom Service Worker for img2pic PWA
 * This service worker provides offline functionality for the pixel art conversion app
 */

// Note: Workbox will inject the precache manifest here
globalThis.importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'
);

workbox.loadModule('workbox-precaching');
workbox.loadModule('workbox-routing');
workbox.loadModule('workbox-strategies');

// This line will be replaced with the actual precache manifest
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Cache strategy for different request types
workbox.routing.registerRoute(
  ({ request }) => {
    // Cache static assets
    return request.destination === 'script' ||
           request.destination === 'style' ||
           request.destination === 'font' ||
           request.url.includes('/icons/') ||
           request.url.includes('/assets/');
  },
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'app-shell-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Cache HTML pages with NetworkFirst strategy
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: 'html-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
  })
);

// Cache external resources (like Google Fonts, CDN resources)
workbox.routing.registerRoute(
  ({ url }) => url.origin !== self.location.origin,
  new workbox.strategies.CacheFirst({
    cacheName: 'external-resources',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Don't cache user uploads - process them directly
workbox.routing.registerRoute(
  ({ url }) => {
    return url.pathname.includes('upload') || url.pathname.includes('temp');
  },
  new workbox.strategies.NetworkFirst({
    cacheName: 'user-uploads',
    networkTimeoutSeconds: 3,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 5,
        maxAgeSeconds: 60, // Only cache uploads for 1 minute
      }),
    ],
  })
);

// Handle offline fallback for HTML pages
workbox.routing.setCatchHandler(({ event }) => {
  if (event.request.destination === 'document') {
    return caches.match('/index.html');
  }
});

// Handle push notifications for future features
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icons/icon-192x192.png',
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

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      globalThis.clients.openWindow('/')
    );
  }
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
