import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import timeout from 'connect-timeout';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { equipmentRouter } from './routes/equipment';
import { authRouter } from './routes/auth';
import { eventBriefRouter } from './routes/eventBrief';
import { crewRouter } from './routes/crew';
import { maintenanceRouter } from './routes/maintenance';
import { incidentRouter } from './routes/incident';
import { proposalRouter } from './routes/proposal';
import { rndRouter } from './routes/rnd';
import { consumableRouter } from './routes/consumable';
import { supplierRouter } from './routes/supplier';
import { purchaseOrderRouter } from './routes/purchaseOrder';
import { alertRouter } from './routes/alert';
import { kpiRouter } from './routes/kpi';
import { notificationRouter } from './routes/notification';
import { pushRouter } from './routes/push';
import { permissionsRouter } from './routes/permissions';
import { analyticsRouter } from './routes/analytics';
import areaRouter from './routes/area';
import { setupWebSocket } from './websocket';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://vault-pulse-center.vercel.app',
    'https://vault-pulse-center-seven.vercel.app',
  ];
  
  // Support multiple origins via env (comma-separated)
  const frontendUrls = process.env.FRONTEND_URL;
  if (frontendUrls) {
    frontendUrls.split(',').forEach(url => {
      const trimmed = url.trim();
      if (trimmed && !origins.includes(trimmed)) {
        origins.push(trimmed);
      }
    });
  }
  
  return origins;
};

// CORS configuration with detailed logging
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = getAllowedOrigins();
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
// Log allowed origins on startup
console.log(`📋 CORS Allowed Origins: ${getAllowedOrigins().join(', ')}`);

// Request timeout middleware (30 seconds)
app.use(timeout('30s'));

app.use(express.json({ limit: '10mb' })); // Increase payload limit for base64 images
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Setup WebSocket
const io = setupWebSocket(httpServer);

// Make io available to routes
app.set('io', io);

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/event-briefs', eventBriefRouter);
app.use('/api/crew', crewRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/incidents', incidentRouter);
app.use('/api/proposals', proposalRouter);
app.use('/api/rnd', rndRouter);
app.use('/api/consumables', consumableRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/purchase-orders', purchaseOrderRouter);
app.use('/api/alerts', alertRouter);
app.use('/api/kpi', kpiRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/push', pushRouter);
app.use('/api/permissions', permissionsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/areas', areaRouter);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`⚡ WebSocket enabled`);
}).on('error', (err: any) => {
  console.error('❌ Server failed to start:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
