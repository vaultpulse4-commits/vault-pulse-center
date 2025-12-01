import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://vault-pulse-center-production.up.railway.app';

export function PushNotificationSettings() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkNotificationSupport();
    checkSubscriptionStatus();
  }, []);

  const checkNotificationSupport = () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }
    
    if (!('serviceWorker' in navigator)) {
      console.log('This browser does not support service workers');
      return false;
    }

    if (!('PushManager' in window)) {
      console.log('This browser does not support push notifications');
      return false;
    }

    setPermission(Notification.permission);
    return true;
  };

  const checkSubscriptionStatus = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      
      if (sub) {
        setSubscription(sub);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
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
  };

  const getAuthToken = (): string | null => {
    try {
      const authStorage = localStorage.getItem('vault-auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        return parsed.state?.accessToken || null;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return null;
  };

  const subscribe = async () => {
    if (!checkNotificationSupport()) {
      toast({
        title: 'Not Supported',
        description: 'Push notifications are not supported in this browser',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Request notification permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        toast({
          title: 'Permission Denied',
          description: 'Please enable notifications in your browser settings',
          variant: 'destructive'
        });
        return;
      }

      // Get VAPID public key
      const token = getAuthToken();
      if (!token) {
        toast({
          title: 'Error',
          description: 'Please login first',
          variant: 'destructive'
        });
        return;
      }

      const vapidResponse = await fetch(`${API_URL}/api/push/vapid-public-key`);
      const { publicKey } = await vapidResponse.json();

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // Send subscription to backend
      const response = await fetch(`${API_URL}/api/push/subscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(sub.getKey('p256dh')),
            auth: arrayBufferToBase64(sub.getKey('auth'))
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription');
      }

      setSubscription(sub);
      setIsSubscribed(true);

      toast({
        title: 'Success',
        description: 'Push notifications enabled!',
      });
    } catch (error: any) {
      console.error('Failed to subscribe:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to enable push notifications',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token || !subscription) {
        return;
      }

      // Unsubscribe from push service
      await subscription.unsubscribe();

      // Notify backend
      await fetch(`${API_URL}/api/push/unsubscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint
        })
      });

      setSubscription(null);
      setIsSubscribed(false);

      toast({
        title: 'Success',
        description: 'Push notifications disabled',
      });
    } catch (error: any) {
      console.error('Failed to unsubscribe:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to disable push notifications',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const testNotification = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/push/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Test Sent',
          description: `Push notification sent successfully!`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to send test notification',
        variant: 'destructive'
      });
    }
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer | null): string => {
    if (!buffer) return '';
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge className="bg-success"><Check className="h-3 w-3 mr-1" /> Enabled</Badge>;
      case 'denied':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" /> Denied</Badge>;
      default:
        return <Badge variant="outline">Not Set</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Receive real-time alerts even when the app is closed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="text-xs text-muted-foreground">
              {isSubscribed ? 'Subscribed to push notifications' : 'Not subscribed'}
            </p>
          </div>
          {getPermissionBadge()}
        </div>

        <div className="flex gap-2">
          {!isSubscribed ? (
            <Button 
              onClick={subscribe} 
              disabled={loading || permission === 'denied'}
              className="flex-1"
            >
              <Bell className="h-4 w-4 mr-2" />
              {loading ? 'Enabling...' : 'Enable Notifications'}
            </Button>
          ) : (
            <>
              <Button 
                onClick={unsubscribe} 
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                <BellOff className="h-4 w-4 mr-2" />
                {loading ? 'Disabling...' : 'Disable'}
              </Button>
              <Button 
                onClick={testNotification}
                variant="secondary"
              >
                Test
              </Button>
            </>
          )}
        </div>

        {permission === 'denied' && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <p className="font-medium">Notifications Blocked</p>
            <p className="mt-1 text-xs">
              Please enable notifications in your browser settings to use this feature.
            </p>
          </div>
        )}

        {!('Notification' in window) && (
          <div className="rounded-md bg-muted p-3 text-sm">
            <p className="font-medium">Not Supported</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your browser does not support push notifications.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
