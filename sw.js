const CACHE_NAME = 'dictuzz-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/site.css',
  '/resources/resources.css',
  '/resources/search.css',
  '/js/home.js',
  '/js/ui-kit.js',
  '/js/icon-kit.js',
  '/js/icon-data.js',
  '/js/site-content.js',
  '/js/site-renderers.js',
  '/js/site-seo.js',
  '/resources/resources.js',
  '/resources/search.js',
  '/resources/search.html',
  '/content/resources/search-index.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Exclude non-GET requests and external APIs/CDNs if any, though we want offline capability
  if (request.method !== 'GET') return;
  // If it's an extension or chrome internal, ignore
  if (!url.protocol.startsWith('http')) return;

  // Network-First Strategy for everything to ensure updates are visible
  event.respondWith(
    fetch(request)
      .then((response) => {
        // If network request is successful, clone it, put in cache, and return
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(request);
      })
  );
});
