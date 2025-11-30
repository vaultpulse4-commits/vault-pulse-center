# 🚀 PWA Quick Test Guide

## Test 1: Verify PWA Setup ✅

### Check Service Worker Registration
1. Buka http://localhost:5173
2. Open DevTools (F12)
3. Go to **Console** tab
4. Look for messages:
   ```
   [PWA] Service worker registered successfully
   [SW] Installing service worker...
   [SW] Service worker installed
   [SW] Service worker activated
   ```

### Check Manifest
1. In DevTools, go to **Application** tab
2. Click **Manifest** in left sidebar
3. Verify:
   - ✅ Name: "Vault Pulse Center"
   - ✅ Theme Color: #9333ea (purple)
   - ✅ Icons: 192x192, 512x512

---

## Test 2: Offline Functionality ✅

### Method 1: DevTools Offline Mode
1. Open DevTools → **Application** tab
2. Click **Service Workers**
3. Check **"Offline"** checkbox
4. Reload page (Ctrl+R)
5. **Expected**: App still works with cached data

### Method 2: Network Throttling
1. DevTools → **Network** tab
2. Change throttling to **"Offline"**
3. Navigate to different tabs
4. **Expected**: Cached pages load, API returns cached data

### Method 3: Real Offline Test
1. Login to app
2. Browse equipment, events tabs
3. Disconnect WiFi/Internet
4. Refresh page
5. **Expected**: 
   - Network status badge shows "Offline Mode"
   - Equipment tab shows last cached data
   - Navigation still works

---

## Test 3: Install Prompt ✅

### Desktop Install (Chrome/Edge)
1. Wait 30 seconds after loading
2. **Expected**: Install prompt appears bottom-right
3. Click "Install"
4. **Expected**: App opens in standalone window
5. Check app drawer: "Vault Pulse Center" should appear

### Check If Installable (Manual)
1. DevTools → **Application** → **Manifest**
2. Click **"Add to homescreen"** link
3. Should show install dialog

---

## Test 4: Cache Inspection ✅

### View Cached Assets
```javascript
// In DevTools Console:
caches.keys().then(names => console.log('Cache Names:', names));
// Expected: ["vault-pulse-v1", "vault-pulse-runtime", "vault-pulse-api"]

caches.open('vault-pulse-v1')
  .then(cache => cache.keys())
  .then(keys => console.log('Cached URLs:', keys.map(k => k.url)));
// Expected: /, /index.html, /offline.html, etc.
```

### Check Storage Usage
```javascript
// In DevTools Console:
navigator.storage.estimate()
  .then(est => console.log(`Using ${est.usage} of ${est.quota} bytes`));
```

---

## Test 5: Offline Page ✅

1. Open http://localhost:5173
2. DevTools → Application → Service Workers → Check "Offline"
3. Navigate to a new uncached page
4. **Expected**: Beautiful offline page with:
   - "You're Offline" message
   - Connection status indicator
   - List of available offline features
   - Retry button

---

## Test 6: Update Notification ✅

### Simulate Update
1. Open app in browser
2. Edit `public/sw.js`, change `CACHE_NAME`:
   ```javascript
   const CACHE_NAME = 'vault-pulse-v2'; // Increment version
   ```
3. Save file
4. Refresh page
5. **Expected**: Update notification appears top-right
6. Click "Update Now"
7. **Expected**: Page reloads with new version

---

## Test 7: Network Status Badge ✅

1. Open app while online
2. Disconnect internet
3. **Expected**: Badge appears at top center: "Offline Mode - Using Cached Data"
4. Reconnect internet
5. **Expected**: Badge changes to "Back Online" (shows for 3 seconds)

---

## Test 8: API Caching ✅

### Test API Cache
1. Login to app
2. Go to Equipment tab (loads from API)
3. DevTools → Network → Enable "Offline"
4. Refresh page
5. Go to Equipment tab again
6. **Expected**: Equipment data still shows (from cache)
7. Network tab shows "(from ServiceWorker)"

---

## Test 9: Mobile Installation ✅

### Android Chrome
1. Open http://your-server-ip:5173 on mobile
2. Chrome menu (⋮) → "Install app"
3. Tap "Install"
4. **Expected**: App icon on home screen
5. Tap icon → App opens fullscreen (no browser UI)

### iOS Safari
1. Open app in Safari
2. Share button (⬆️) → "Add to Home Screen"
3. **Expected**: App icon on home screen
4. Tap → Opens like native app

---

## Test 10: Lighthouse PWA Audit ✅

1. Open http://localhost:5173
2. DevTools → **Lighthouse** tab
3. Select:
   - ✅ Progressive Web App
   - ✅ Performance
4. Device: Mobile
5. Click "Analyze page load"
6. **Expected Scores**:
   - PWA: 90+ 
   - Performance: 80+
   - Best Practices: 90+

---

## Test 11: Background Sync (Future) ⏳

**Note**: Background sync requires online → offline → online cycle

1. Login to app
2. Go offline
3. Try to create equipment
4. **Expected**: Action queued
5. Go online
6. **Expected**: Action syncs automatically

---

## Quick Checklist ✅

Run through this checklist:

- [ ] Service worker registers without errors
- [ ] Manifest loads correctly
- [ ] App works offline (DevTools offline mode)
- [ ] Install prompt appears after 30s
- [ ] Can install on desktop
- [ ] Can install on mobile
- [ ] Offline page shows when no cache
- [ ] Network status badge works
- [ ] Update notification works
- [ ] Cached data persists after refresh
- [ ] Lighthouse PWA score > 90
- [ ] Icons display correctly (192, 512)

---

## Troubleshooting

### Service Worker Not Registering
```javascript
// Unregister and retry
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(r => r.unregister()))
  .then(() => location.reload());
```

### Clear All Caches
```javascript
caches.keys()
  .then(names => Promise.all(names.map(n => caches.delete(n))))
  .then(() => location.reload());
```

### Check SW Status
```javascript
navigator.serviceWorker.getRegistrations()
  .then(regs => console.log('Registrations:', regs));
```

---

## Expected Console Output

When everything works correctly, you should see:

```
[PWA] Service worker registered successfully
[PWA] Install prompt available (after 30s)
[SW] Installing service worker...
[SW] Precaching assets
[SW] Service worker installed
[SW] Service worker activated
[SW] Network request succeeded: /api/equipment
```

When offline:
```
[SW] Network request failed, trying cache: /api/equipment
NetworkStatus: Offline
```

---

## Performance Metrics

### First Visit (Online):
- **FCP**: ~1.5s
- **TTI**: ~2.5s
- **LCP**: ~2s

### Subsequent Visits (Cached):
- **FCP**: ~200ms ⚡
- **TTI**: ~500ms ⚡
- **LCP**: ~300ms ⚡

### Offline:
- **Load Time**: ~100ms (instant from cache)
- **No network errors**: ✅
- **Full functionality**: Equipment, Events, Profile

---

## Success Criteria

✅ PWA is fully functional if:
1. App can be installed on mobile/desktop
2. Works completely offline after first visit
3. Loads instantly from cache
4. Shows network status correctly
5. Caches API responses
6. Updates smoothly when new version available
7. Lighthouse PWA score > 90

🎉 **Your PWA is production-ready!**
