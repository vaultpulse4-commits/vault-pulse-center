import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

interface SocketUser {
  userId: string;
  email: string;
  role: string;
  cities: string[];
}

export function setupWebSocket(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vault-secret-key') as SocketUser;
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user as SocketUser;
    console.log(`✅ User connected: ${user.email} (${socket.id})`);

    // Join user-specific room
    socket.join(`user:${user.userId}`);

    // Join role-specific room
    socket.join(`role:${user.role}`);

    // Join city-specific rooms
    user.cities.forEach(city => {
      socket.join(`city:${city}`);
      console.log(`📍 User ${user.email} joined room: city:${city}`);
    });

    // Handle custom events
    socket.on('subscribe:city', (city: string) => {
      if (user.cities.includes(city)) {
        socket.join(`city:${city}`);
        console.log(`📍 User ${user.email} subscribed to: city:${city}`);
      }
    });

    socket.on('unsubscribe:city', (city: string) => {
      socket.leave(`city:${city}`);
      console.log(`📍 User ${user.email} unsubscribed from: city:${city}`);
    });

    // Acknowledge connection
    socket.emit('connected', {
      message: 'Connected to Vault Pulse real-time server',
      userId: user.userId,
      rooms: Array.from(socket.rooms)
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${user.email} (${socket.id})`);
    });

    // Ping/Pong for connection health
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });
  });

  return io;
}

// Helper function to emit notifications
export function emitNotification(io: Server, notification: any) {
  const { city, userId, role, type, ...data } = notification;

  // Emit to specific city
  if (city) {
    io.to(`city:${city}`).emit('notification', notification);
  }

  // Emit to specific user
  if (userId) {
    io.to(`user:${userId}`).emit('notification', notification);
  }

  // Emit to specific role
  if (role) {
    io.to(`role:${role}`).emit('notification', notification);
  }

  // Emit critical alerts to all
  if (type === 'CRITICAL') {
    io.emit('notification:critical', notification);
  }
}

// Helper to emit real-time updates
export function emitUpdate(io: Server, event: string, data: any, city?: string) {
  if (city) {
    io.to(`city:${city}`).emit(event, data);
  } else {
    io.emit(event, data);
  }
}
