import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';

interface WebSocketContextType {
  socket: Socket | null;
  connected: boolean;
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

interface Notification {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  category: 'EQUIPMENT' | 'MAINTENANCE' | 'INVENTORY' | 'EVENT' | 'SYSTEM' | 'APPROVAL';
  title: string;
  message: string;
  data?: any;
  city?: string;
  read: boolean;
  readAt?: string;
  actionUrl?: string;
  createdAt: string;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connected: false,
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  deleteNotification: () => {}
});

export const useWebSocket = () => useContext(WebSocketContext);

const API_URL = import.meta.env.VITE_API_URL || 'https://vault-pulse-center-production.up.railway.app';

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // Get auth token
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

  // Fetch notifications from API
  const fetchNotifications = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    // Initialize socket connection
    const newSocket = io(API_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setConnected(true);
      fetchNotifications();
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setConnected(false);
    });

    newSocket.on('connected', (data) => {
      console.log('📡 WebSocket authenticated:', data);
    });

    // Handle notifications
    newSocket.on('notification', (notification: Notification) => {
      console.log('🔔 New notification:', notification);
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Show toast notification
      const variant = notification.type === 'CRITICAL' ? 'destructive' : 
                     notification.type === 'WARNING' ? 'default' : 
                     'default';

      toast({
        title: notification.title,
        description: notification.message,
        variant,
        duration: notification.type === 'CRITICAL' ? 10000 : 5000,
      });
    });

    // Handle critical alerts
    newSocket.on('notification:critical', (notification: Notification) => {
      console.log('🚨 Critical notification:', notification);
      
      // Play sound or show more prominent notification
      toast({
        title: `🚨 ${notification.title}`,
        description: notification.message,
        variant: 'destructive',
        duration: 15000,
      });
    });

    // Real-time updates
    newSocket.on('equipment:updated', (equipment) => {
      console.log('⚙️ Equipment updated:', equipment);
      // Trigger re-fetch in components listening to this
      window.dispatchEvent(new CustomEvent('equipment:updated', { detail: equipment }));
    });

    newSocket.on('kpi:updated', (kpi) => {
      console.log('📊 KPI updated:', kpi);
      window.dispatchEvent(new CustomEvent('kpi:updated', { detail: kpi }));
    });

    newSocket.on('alert:new', (alert) => {
      console.log('⚠️ New alert:', alert);
      window.dispatchEvent(new CustomEvent('alert:new', { detail: alert }));
    });

    // Ping/Pong for connection health
    const pingInterval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit('ping');
      }
    }, 30000); // Every 30 seconds

    newSocket.on('pong', (data) => {
      console.log('🏓 Pong received:', data);
    });

    setSocket(newSocket);

    return () => {
      clearInterval(pingInterval);
      newSocket.close();
    };
  }, []);

  const markAsRead = async (id: string) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        const wasUnread = notifications.find(n => n.id === id && !n.read);
        if (wasUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        connected,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}
