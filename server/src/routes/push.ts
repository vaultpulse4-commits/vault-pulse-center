import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import webPush from 'web-push';

export const pushRouter = Router();

// Configure web-push only if VAPID keys are available
const hasVapidKeys = process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY;
if (hasVapidKeys) {
  webPush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@vaultclub.com',
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}

// Get VAPID public key
pushRouter.get('/vapid-public-key', (req: Request, res: Response) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// Subscribe to push notifications
pushRouter.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { endpoint, keys } = req.body;
    
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ error: 'Invalid subscription data' });
    }

    // Check if subscription already exists
    const existing = await prisma.pushSubscription.findUnique({
      where: { endpoint }
    });

    if (existing) {
      // Update existing subscription
      const updated = await prisma.pushSubscription.update({
        where: { endpoint },
        data: {
          userId,
          p256dh: keys.p256dh,
          auth: keys.auth,
          userAgent: req.headers['user-agent'],
          isActive: true,
          updatedAt: new Date()
        }
      });
      return res.json({ success: true, subscription: updated });
    }

    // Create new subscription
    const subscription = await prisma.pushSubscription.create({
      data: {
        userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: req.headers['user-agent']
      }
    });

    res.json({ success: true, subscription });
  } catch (error: any) {
    console.error('Failed to save push subscription:', error);
    res.status(500).json({ 
      error: 'Failed to save subscription',
      details: error.message 
    });
  }
});

// Unsubscribe from push notifications
pushRouter.post('/unsubscribe', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint required' });
    }

    await prisma.pushSubscription.update({
      where: { endpoint },
      data: { isActive: false }
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Failed to unsubscribe:', error);
    res.status(500).json({ 
      error: 'Failed to unsubscribe',
      details: error.message 
    });
  }
});

// Get user's subscriptions
pushRouter.get('/subscriptions', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        endpoint: true,
        userAgent: true,
        createdAt: true
      }
    });

    res.json({ subscriptions });
  } catch (error: any) {
    console.error('Failed to get subscriptions:', error);
    res.status(500).json({ 
      error: 'Failed to get subscriptions',
      details: error.message 
    });
  }
});

// Send push notification (internal use)
export async function sendPushNotification(
  userId: string,
  payload: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
  }
) {
  try {
    // Skip if VAPID keys not configured
    if (!hasVapidKeys) {
      console.log('Push notifications disabled: VAPID keys not configured');
      return { success: true, sent: 0 };
    }

    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId, isActive: true }
    });

    if (subscriptions.length === 0) {
      console.log(`No active push subscriptions for user ${userId}`);
      return { success: true, sent: 0 };
    }

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icon-192x192.png',
      badge: payload.badge || '/icon-72x72.png',
      tag: payload.tag || 'vault-notification',
      data: payload.data || {},
      timestamp: Date.now(),
      requireInteraction: payload.tag === 'critical'
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webPush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth
              }
            },
            notificationPayload
          );
          return { success: true, endpoint: sub.endpoint };
        } catch (error: any) {
          console.error(`Push failed for ${sub.endpoint}:`, error.message);
          
          // If subscription is invalid, deactivate it
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription.update({
              where: { id: sub.id },
              data: { isActive: false }
            });
          }
          
          throw error;
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Push notifications sent: ${successful} success, ${failed} failed`);

    return { success: true, sent: successful, failed };
  } catch (error: any) {
    console.error('Failed to send push notifications:', error);
    return { success: false, error: error.message };
  }
}

// Test push notification endpoint
pushRouter.post('/test', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await sendPushNotification(userId, {
      title: 'Test Notification',
      body: 'This is a test push notification from Vault Pulse!',
      tag: 'test'
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to send test notification',
      details: error.message 
    });
  }
});
