// Service Worker for CyberSoluce Asset Manager
// Basic service worker to enable PWA features

const CACHE_NAME = 'cybersoluce-asset-manager-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        // Silently fail - app will work without cache
        console.error('Service Worker cache failed:', error);
      })
  );
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
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
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests that might violate CSP (let browser handle them)
  const url = new URL(event.request.url);
  const isCrossOrigin = url.origin !== self.location.origin;
  
  // For cross-origin requests to fonts, let the browser handle them directly
  // Service worker shouldn't intercept these as they're handled by CSP
  if (isCrossOrigin && (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com'))) {
    return; // Let browser handle directly
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache successful responses (clone before caching)
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch((error) => {
            // If fetch fails, return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html').then((offlinePage) => {
                return offlinePage || new Response('Offline', { status: 503 });
              });
            }
            // For other requests, return a proper error response
            return new Response('Network error', { 
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
      .catch(() => {
        // Fallback error response
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html').then((offlinePage) => {
            return offlinePage || new Response('Offline', { status: 503 });
          });
        }
        return new Response('Cache error', { 
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

