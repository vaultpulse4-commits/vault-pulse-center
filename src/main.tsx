import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { pwaManager } from './lib/pwa'

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await pwaManager.register();
      console.log('[PWA] Service worker registered successfully');
      
      // Check for updates every minute
      pwaManager.startUpdateCheck(60000);
      
      // Request persistent storage
      await pwaManager.requestPersistentStorage();
    } catch (error) {
      console.error('[PWA] Service worker registration failed:', error);
    }
  });
}
