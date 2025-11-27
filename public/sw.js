// Service Worker for CyberSoluce Asset Manager
// Basic service worker to enable PWA features

const CACHE_NAME = 'cybersoluce-asset-manager-v3'; // Increment version to force update
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

// Cache CSS and JS files on demand (not in initial cache to avoid stale assets)

// Helper function to get app origin dynamically
function getAppOrigin() {
  try {
    // Try to get origin from registration scope (most reliable in service workers)
    if (self.registration && self.registration.scope) {
      return new URL(self.registration.scope).origin;
    }
  } catch (e) {
    // If that fails, return null - we'll skip all requests to be safe
  }
  return null;
}

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

  // Skip ALL cross-origin and external requests - let browser handle them directly
  // This prevents CSP violations and ensures external resources load correctly
  try {
    const url = new URL(event.request.url);
    const requestOrigin = url.origin;
    
    // Get app origin dynamically (in case registration wasn't available at load time)
    const appOrigin = getAppOrigin();
    
    // If we can't determine app origin, skip all requests to be safe
    if (!appOrigin) {
      return;
    }
    
    // Skip any request that's not from the same origin
    if (requestOrigin !== appOrigin) {
      return; // Let browser handle cross-origin requests directly
    }
    
    // Additional safety check: skip known external domains (double-check)
    if (url.hostname.includes('fonts.googleapis.com') || 
        url.hostname.includes('fonts.gstatic.com') ||
        url.hostname.includes('googleapis.com') ||
        url.hostname.includes('gstatic.com') ||
        url.hostname.includes('supabase.co')) {
      return; // Let browser handle directly
    }
  } catch (e) {
    // If URL parsing fails, skip service worker to be safe
    return;
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
            // Only cache CSS, JS, and other static assets - skip API calls and dynamic content
            if (networkResponse && networkResponse.status === 200) {
              const url = new URL(event.request.url);
              const isStaticAsset = url.pathname.match(/\.(css|js|woff2?|eot|ttf|otf|png|jpe?g|svg|gif|ico|webp)$/i) ||
                                   url.pathname.startsWith('/styles/') ||
                                   url.pathname.startsWith('/js/') ||
                                   url.pathname.startsWith('/images/') ||
                                   url.pathname.startsWith('/fonts/');
              
              if (isStaticAsset) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseClone).catch(() => {
                    // Silently fail if cache put fails
                  });
                });
              }
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

