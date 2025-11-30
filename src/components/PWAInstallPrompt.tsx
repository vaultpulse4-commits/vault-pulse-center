import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, X, Smartphone } from "lucide-react";
import { pwaManager } from "@/lib/pwa";

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app can be installed and not already installed
    const checkInstallability = () => {
      if (pwaManager.canInstall() && !pwaManager.isInstalled()) {
        // Show prompt after 30 seconds
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 30000);

        return () => clearTimeout(timer);
      }
    };

    checkInstallability();
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    const result = await pwaManager.promptInstall();
    
    if (result === 'accepted') {
      setShowPrompt(false);
    }
    
    setIsInstalling(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if dismissed in this session or already installed
  if (
    !showPrompt || 
    pwaManager.isInstalled() || 
    sessionStorage.getItem('pwa-prompt-dismissed')
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <Card className="border-primary/50 shadow-2xl bg-gradient-card backdrop-blur-sm">
        <CardHeader className="relative pb-3">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-6 w-6 p-0"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Install App</CardTitle>
              <CardDescription className="text-xs">Get quick access offline</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Install Vault Pulse Center for faster access and offline functionality.
          </p>
          
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-success" />
              <span>Works offline with cached data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-success" />
              <span>Faster loading times</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-success" />
              <span>Native app experience</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              {isInstalling ? 'Installing...' : 'Install'}
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1"
            >
              Not Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
