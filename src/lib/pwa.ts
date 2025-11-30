// PWA utilities and service worker registration

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.init();
  }

  private init() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      console.log('[PWA] Install prompt available');
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      this.deferredPrompt = null;
    });
  }

  // Register service worker
  async register(): Promise<ServiceWorkerRegistration | null> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('[PWA] Service worker registered:', this.registration.scope);

        // Handle updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration!.installing;
          console.log('[PWA] New service worker found');

          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New content available, please refresh');
              this.notifyUpdate();
            }
          });
        });

        return this.registration;
      } catch (error) {
        console.error('[PWA] Service worker registration failed:', error);
        return null;
      }
    } else {
      console.warn('[PWA] Service workers not supported');
      return null;
    }
  }

  // Unregister service worker
  async unregister(): Promise<boolean> {
    if (this.registration) {
      return await this.registration.unregister();
    }
    return false;
  }

  // Check if app can be installed
  canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  // Prompt user to install app
  async promptInstall(): Promise<'accepted' | 'dismissed' | null> {
    if (!this.deferredPrompt) {
      console.log('[PWA] Install prompt not available');
      return null;
    }

    try {
      await this.deferredPrompt.prompt();
      const choice = await this.deferredPrompt.userChoice;
      console.log('[PWA] User choice:', choice.outcome);
      
      this.deferredPrompt = null;
      return choice.outcome;
    } catch (error) {
      console.error('[PWA] Install prompt error:', error);
      return null;
    }
  }

  // Check if app is installed
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }

  // Update service worker
  async update(): Promise<void> {
    if (this.registration) {
      await this.registration.update();
      console.log('[PWA] Service worker updated');
    }
  }

  // Skip waiting and activate new service worker
  skipWaiting(): void {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  // Check for updates periodically
  startUpdateCheck(intervalMs: number = 60000): void {
    setInterval(() => {
      this.update();
    }, intervalMs);
  }

  // Send message to service worker
  sendMessage(message: any): void {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message);
    }
  }

  // Cache specific URLs
  cacheUrls(urls: string[]): void {
    this.sendMessage({
      type: 'CACHE_URLS',
      urls
    });
  }

  // Clear all caches
  clearCache(): void {
    this.sendMessage({
      type: 'CLEAR_CACHE'
    });
  }

  // Notify user about update
  private notifyUpdate(): void {
    // Dispatch custom event that components can listen to
    window.dispatchEvent(new CustomEvent('sw-update-available'));
  }

  // Check online status
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Request persistent storage
  async requestPersistentStorage(): Promise<boolean> {
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist();
      console.log('[PWA] Persistent storage:', isPersisted);
      return isPersisted;
    }
    return false;
  }

  // Check storage quota
  async getStorageEstimate(): Promise<StorageEstimate | null> {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      console.log('[PWA] Storage estimate:', estimate);
      return estimate;
    }
    return null;
  }

  // Enable push notifications
  async enablePushNotifications(): Promise<PushSubscription | null> {
    if (!('PushManager' in window)) {
      console.warn('[PWA] Push notifications not supported');
      return null;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.log('[PWA] Notification permission denied');
        return null;
      }

      if (!this.registration) {
        console.error('[PWA] No service worker registration');
        return null;
      }

      // You need to generate VAPID keys for your server
      // For demo purposes, using a public key
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'YOUR_PUBLIC_VAPID_KEY_HERE'
        ) as BufferSource
      });

      console.log('[PWA] Push subscription:', subscription);
      return subscription;
    } catch (error) {
      console.error('[PWA] Push subscription error:', error);
      return null;
    }
  }

  // Helper to convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Background sync for offline actions
  async registerBackgroundSync(tag: string): Promise<void> {
    if (!this.registration || !('sync' in this.registration)) {
      console.warn('[PWA] Background sync not supported');
      return;
    }

    try {
      await (this.registration as any).sync.register(tag);
      console.log('[PWA] Background sync registered:', tag);
    } catch (error) {
      console.error('[PWA] Background sync error:', error);
    }
  }
}

// Export singleton instance
export const pwaManager = new PWAManager();

// Network status utilities
export const networkStatus = {
  isOnline: () => navigator.onLine,
  
  onOnline: (callback: () => void) => {
    window.addEventListener('online', callback);
    return () => window.removeEventListener('online', callback);
  },
  
  onOffline: (callback: () => void) => {
    window.addEventListener('offline', callback);
    return () => window.removeEventListener('offline', callback);
  }
};

// IndexedDB utilities for offline storage
export class OfflineStorage {
  private dbName = 'vault-pulse-offline';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('equipment')) {
          db.createObjectStore('equipment', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('events')) {
          db.createObjectStore('events', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('crew')) {
          db.createObjectStore('crew', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('pending-actions')) {
          db.createObjectStore('pending-actions', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async save(storeName: string, data: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getAll(storeName: string): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async get(storeName: string, id: string): Promise<any> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const offlineStorage = new OfflineStorage();
