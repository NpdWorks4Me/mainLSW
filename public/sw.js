
/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'lsw-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy: Stale-While-Revalidate for most resources
self.addEventListener('fetch', (event) => {
  // Skip non-http requests (e.g., chrome-extension)
  if (!event.request.url.startsWith('http')) return;

  // Do not intercept cross-origin API calls (avoid caching or fetch interception
  // for third-party APIs which may enforce CORS or have dynamic responses).
  // Allow caching for known image/CDN hosts (supabase/cdn) that we explicitly handle below.
  try {
    const reqUrl = new URL(event.request.url);
    const isSameOrigin = reqUrl.origin === self.location.origin;
    const allowCrossOrigin = reqUrl.hostname.includes('supabase.co') || reqUrl.hostname.includes('cdn.zyrosite.com');
    if (!isSameOrigin && !allowCrossOrigin) {
      // Don't call event.respondWith — let the browser handle the network request directly.
      return;
    }
  } catch (err) {
    // If parsing fails, continue and let the default handler run
  }

  // Strategy for Supabase Storage Images (Cache First)
  if (event.request.url.includes('supabase.co/storage')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Default Strategy: Network First with Cache Fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response to cache it
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
