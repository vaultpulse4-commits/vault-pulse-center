import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, X } from "lucide-react";
import { pwaManager } from "@/lib/pwa";

export default function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setShowUpdate(true);
    };

    window.addEventListener('sw-update-available', handleUpdate);

    return () => {
      window.removeEventListener('sw-update-available', handleUpdate);
    };
  }, []);

  const handleUpdate = () => {
    pwaManager.skipWaiting();
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top-5">
      <Alert className="border-primary bg-gradient-card backdrop-blur-sm shadow-2xl">
        <RefreshCw className="h-4 w-4" />
        <AlertTitle className="flex items-center justify-between">
          New Update Available
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertTitle>
        <AlertDescription className="space-y-3">
          <p className="text-sm">
            A new version of Vault Pulse Center is available. Update now for the latest features and improvements.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleUpdate} size="sm" className="flex-1">
              <RefreshCw className="h-3 w-3 mr-2" />
              Update Now
            </Button>
            <Button variant="outline" size="sm" onClick={handleDismiss} className="flex-1">
              Later
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
