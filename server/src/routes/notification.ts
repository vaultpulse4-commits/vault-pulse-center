import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { emitNotification } from '../websocket';
import { sendPushNotification } from './push';

export const notificationRouter = Router();

// Get all notifications for current user
notificationRouter.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { read, limit = 50, offset = 0 } = req.query;
    
    const where: any = { userId };
    if (read !== undefined) {
      where.read = read === 'true';
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, read: false }
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get unread count
notificationRouter.get('/unread-count', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const count = await prisma.notification.count({
      where: { userId, read: false }
    });

    res.json({ count });
  } catch (error) {
    console.error('Failed to get unread count:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// Mark notification as read
notificationRouter.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true, readAt: new Date() }
    });

    res.json(updated);
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark all as read
notificationRouter.post('/mark-all-read', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to mark all as read:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

// Delete notification
notificationRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await prisma.notification.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Create notification (internal use / webhook)
notificationRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, userIds, role, city, type, category, title, message, data, actionUrl } = req.body;
    const io = req.app.get('io');

    // Create notifications for specific users or all users with criteria
    let targetUserIds: string[] = [];

    if (userId) {
      targetUserIds = [userId];
    } else if (userIds) {
      targetUserIds = userIds;
    } else {
      // Query users based on criteria
      const where: any = {};
      if (role) where.role = role;
      if (city) where.cities = { has: city };

      const users = await prisma.user.findMany({
        where,
        select: { id: true }
      });
      targetUserIds = users.map(u => u.id);
    }

    // Create notifications
    const notifications = await Promise.all(
      targetUserIds.map(uid =>
        prisma.notification.create({
          data: {
            userId: uid,
            type,
            category,
            title,
            message,
            data,
            city,
            actionUrl
          }
        })
      )
    );

    // Emit via WebSocket
    notifications.forEach(notification => {
      emitNotification(io, notification);
    });

    // Send push notifications
    await Promise.all(
      targetUserIds.map(uid =>
        sendPushNotification(uid, {
          title,
          body: message,
          tag: type.toLowerCase(),
          data: { notificationId: notifications.find(n => n.userId === uid)?.id, ...data }
        })
      )
    );

    res.status(201).json({ 
      success: true, 
      count: notifications.length 
    });
  } catch (error: any) {
    console.error('Failed to create notification:', error);
    res.status(500).json({ 
      error: 'Failed to create notification',
      details: error.message 
    });
  }
});
