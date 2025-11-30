import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import { networkStatus } from "@/lib/pwa";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(networkStatus.isOnline());
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      // Hide after 3 seconds
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    const unsubOnline = networkStatus.onOnline(handleOnline);
    const unsubOffline = networkStatus.onOffline(handleOffline);

    return () => {
      unsubOnline();
      unsubOffline();
    };
  }, []);

  // Always show if offline, only show temporarily when back online
  if (!showStatus && isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5">
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className="flex items-center gap-2 px-4 py-2 shadow-lg"
      >
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            <span>Back Online</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span>Offline Mode - Using Cached Data</span>
          </>
        )}
      </Badge>
    </div>
  );
}
