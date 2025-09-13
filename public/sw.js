const CACHE_NAME = 'greenland-pizza-v1';
const STATIC_CACHE = 'greenland-pizza-static-v1';
const DYNAMIC_CACHE = 'greenland-pizza-dynamic-v1';

// Files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/menu',
  '/build-pizza',
  '/build-calzone',
  '/cart',
  '/about',
  '/locations',
  '/manifest.json',
  '/icons/pizza-icon.svg',
  // Add critical CSS and JS files when they're available
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/menu/items',
  '/api/pizza/sizes',
  '/api/pizza/crusts',
  '/api/pizza/sauces',
  '/api/pizza/toppings',
  '/api/health'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS.concat(API_ENDPOINTS));
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );

  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all pages
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return fetch(request)
            .then((response) => {
              // Cache successful API responses
              if (response.status === 200) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => {
              // Return cached response if offline
              return cache.match(request)
                .then((cachedResponse) => {
                  if (cachedResponse) {
                    console.log('[SW] Serving cached API response:', request.url);
                    return cachedResponse;
                  }
                  // Return offline fallback for API
                  return new Response(
                    JSON.stringify({
                      success: false,
                      error: 'Offline - cached data not available',
                      offline: true
                    }),
                    {
                      status: 503,
                      headers: { 'Content-Type': 'application/json' }
                    }
                  );
                });
            });
        })
    );
    return;
  }

  // Handle navigation requests (pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Serve cached page or fallback offline page
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return cached homepage as fallback
              return caches.match('/');
            });
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fetch and cache new requests
        return fetch(request)
          .then((response) => {
            // Only cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // Return fallback for images
            if (request.destination === 'image') {
              return new Response('', { status: 404 });
            }
            throw new Error('Resource not available offline');
          });
      })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any pending orders or cart updates
      syncPendingOrders()
    );
  }
});

// Push notifications for order updates
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Your order status has been updated!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      tag: 'order-update',
      actions: [
        {
          action: 'view',
          title: 'View Order',
          icon: '/icons/icon-72x72.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Greenland Pizza', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('/orders')
  );
});

// Sync pending orders when online
async function syncPendingOrders() {
  try {
    // Check if there are any pending orders in IndexedDB
    // This would be implemented based on your cart/order storage strategy
    console.log('[SW] Syncing pending orders...');

    // Example: Send any cached cart data to server
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedCart = await cache.match('/api/cart');

    if (cachedCart) {
      // Process cached cart data
      console.log('[SW] Found cached cart data to sync');
    }
  } catch (error) {
    console.error('[SW] Error syncing pending orders:', error);
  }
}

// Update available notification
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});