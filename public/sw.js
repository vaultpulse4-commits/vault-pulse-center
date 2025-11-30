// Service Worker for Vault Pulse Center PWA
const CACHE_NAME = 'vault-pulse-v1';
const RUNTIME_CACHE = 'vault-pulse-runtime';
const API_CACHE = 'vault-pulse-api';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/equipment',
  '/api/event-briefs',
  '/api/crew',
  '/api/maintenance',
  '/api/incidents',
  '/api/proposals',
  '/api/rnd',
  '/api/consumables',
  '/api/alerts',
  '/api/kpi'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS.map(url => new Request(url, { cache: 'no-cache' })))
        .catch(err => {
          console.error('[SW] Precache failed:', err);
          // Continue even if some resources fail
        });
    }).then(() => {
      console.log('[SW] Service worker installed');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE && name !== API_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Service worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // API requests - Network First, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      networkFirstStrategy(request, API_CACHE)
    );
    return;
  }

  // Static assets - Cache First, fallback to network
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot|ico)$/) ||
    PRECACHE_ASSETS.includes(url.pathname)
  ) {
    event.respondWith(
      cacheFirstStrategy(request, CACHE_NAME)
    );
    return;
  }

  // HTML pages - Network First, fallback to cache, then offline page
  event.respondWith(
    networkFirstStrategy(request, RUNTIME_CACHE)
      .catch(() => caches.match('/offline.html'))
  );
});

// Network First Strategy - try network, fallback to cache
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network request failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Cache First Strategy - try cache, fallback to network
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Network request failed:', error);
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    // Get pending requests from IndexedDB
    const db = await openDatabase();
    const pendingRequests = await getPendingRequests(db);
    
    // Replay requests
    for (const req of pendingRequests) {
      try {
        await fetch(req.url, req.options);
        await removePendingRequest(db, req.id);
      } catch (error) {
        console.error('[SW] Failed to sync request:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received', event.data);
  
  let notification = {
    title: 'Vault Pulse Center',
    body: 'New update available',
    icon: '/pwa-icon-192.png',
    badge: '/pwa-icon-192.png',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    data: {
      dateOfArrival: Date.now()
    },
    actions: []
  };

  // Parse notification data
  try {
    if (event.data) {
      const payload = event.data.json();
      console.log('[SW] Push payload:', payload);
      
      notification.title = payload.title || notification.title;
      notification.body = payload.body || notification.body;
      notification.icon = payload.icon || notification.icon;
      notification.badge = payload.badge || notification.badge;
      notification.tag = payload.tag || undefined;
      notification.requireInteraction = payload.requireInteraction || false;
      notification.data = {
        ...notification.data,
        ...payload.data
      };

      // Add action buttons based on notification type
      if (payload.data?.type === 'EQUIPMENT_ALERT' || payload.data?.type === 'EQUIPMENT_STATUS') {
        notification.actions = [
          { action: 'view-equipment', title: '🔧 View Equipment', icon: '/pwa-icon-192.png' },
          { action: 'close', title: 'Dismiss', icon: '/pwa-icon-192.png' }
        ];
      } else if (payload.data?.type === 'MAINTENANCE_DUE') {
        notification.actions = [
          { action: 'view-maintenance', title: '📋 View Maintenance', icon: '/pwa-icon-192.png' },
          { action: 'close', title: 'Dismiss', icon: '/pwa-icon-192.png' }
        ];
      } else if (payload.data?.type === 'INCIDENT_REPORTED') {
        notification.actions = [
          { action: 'view-incident', title: '⚠️ View Incident', icon: '/pwa-icon-192.png' },
          { action: 'close', title: 'Dismiss', icon: '/pwa-icon-192.png' }
        ];
      } else if (payload.data?.type === 'SHIFT_REMINDER') {
        notification.actions = [
          { action: 'view-schedule', title: '📅 View Schedule', icon: '/pwa-icon-192.png' },
          { action: 'close', title: 'Dismiss', icon: '/pwa-icon-192.png' }
        ];
      } else {
        notification.actions = [
          { action: 'view', title: '👁️ View', icon: '/pwa-icon-192.png' },
          { action: 'close', title: 'Dismiss', icon: '/pwa-icon-192.png' }
        ];
      }
    }
  } catch (error) {
    console.error('[SW] Error parsing push data:', error);
  }
  
  event.waitUntil(
    self.registration.showNotification(notification.title, notification)
      .then(() => {
        console.log('[SW] Notification shown successfully');
        // Update badge count
        if ('setAppBadge' in navigator) {
          navigator.setAppBadge(1);
        }
      })
      .catch(err => {
        console.error('[SW] Error showing notification:', err);
      })
  );
});

// Notification click handler with routing
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action, event.notification.data);
  event.notification.close();
  
  // Clear badge when notification is clicked
  if ('clearAppBadge' in navigator) {
    navigator.clearAppBadge();
  }

  // Handle different actions
  let targetUrl = '/';
  
  if (event.action === 'close') {
    // Just close notification
    return;
  }
  
  // Route based on action or notification type
  const notificationData = event.notification.data;
  
  if (event.action === 'view-equipment' || notificationData?.type === 'EQUIPMENT_ALERT' || notificationData?.type === 'EQUIPMENT_STATUS') {
    targetUrl = '/vault?tab=equipment-health';
  } else if (event.action === 'view-maintenance' || notificationData?.type === 'MAINTENANCE_DUE') {
    targetUrl = '/vault?tab=maintenance-logs';
  } else if (event.action === 'view-incident' || notificationData?.type === 'INCIDENT_REPORTED') {
    targetUrl = '/vault?tab=event-briefs';
  } else if (event.action === 'view-schedule' || notificationData?.type === 'SHIFT_REMINDER') {
    targetUrl = '/vault?tab=shift-coverage';
  } else if (notificationData?.notificationId) {
    // If we have a notification ID, we could route to a notifications page
    targetUrl = `/?notificationId=${notificationData.notificationId}`;
  }

  // Open or focus app window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            console.log('[SW] Focusing existing window:', targetUrl);
            return client.focus().then(client => {
              // Navigate to target URL
              if ('navigate' in client) {
                return client.navigate(targetUrl);
              }
              return client;
            });
          }
        }
        
        // Open new window if app is not open
        if (clients.openWindow) {
          console.log('[SW] Opening new window:', targetUrl);
          return clients.openWindow(targetUrl);
        }
      })
      .catch(err => {
        console.error('[SW] Error handling notification click:', err);
      })
  );
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then(cache => {
        return cache.addAll(event.data.urls);
      })
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(name => caches.delete(name))
        );
      })
    );
  }
});

// Helper functions for IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('vault-pulse-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-requests')) {
        db.createObjectStore('pending-requests', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getPendingRequests(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-requests'], 'readonly');
    const store = transaction.objectStore('pending-requests');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function removePendingRequest(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-requests'], 'readwrite');
    const store = transaction.objectStore('pending-requests');
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
