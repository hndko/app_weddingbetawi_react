import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

import { createConfigRouter } from './routes/config';
import { createWishesRouter } from './routes/wishes';
import { createRsvpsRouter } from './routes/rsvps';
import { createGuestsRouter } from './routes/guests';
import { createUploadRouter } from './routes/upload';
import { createBudgetRouter } from './routes/budget';
import { createSeatingRouter } from './routes/seating';
import { createTriviaRouter } from './routes/trivia';
import { createAuthRouter } from './routes/auth';
import { createCheckinsRouter } from './routes/checkins';
import { debugTrackerMiddleware } from './middleware/debugTracker';

// Load environment configuration
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const server = http.createServer(app);
const port = parseInt(process.env.PORT || process.env.SERVER_PORT || '5000', 10);
const allowedOrigin = process.env.CORS_ORIGIN || '*';
const corsOriginConfig = allowedOrigin === '*' ? '*' : allowedOrigin.split(',').map((s) => s.trim());

// Setup Socket.io Gateway
const io = new SocketIOServer(server, {
  cors: {
    origin: corsOriginConfig,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cors({
  origin: corsOriginConfig,
  credentials: true,
  exposedHeaders: ['X-Debug-Queries', 'Server-Timing', 'Retry-After'],
}));
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(debugTrackerMiddleware);

// Static uploads directory dengan Cache-Control 30 hari (optimasi loading gambar)
const uploadsPath = path.resolve(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath, {
  maxAge: '30d',
  etag: true,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=86400');
  },
}));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Mari Partner REST API & Realtime Gateway',
    database: 'MySQL Laragon',
  });
});

// Mount modular API routers
app.use('/api/auth', createAuthRouter());
app.use('/api/config', createConfigRouter(io));
app.use('/api/wishes', createWishesRouter(io));
app.use('/api/rsvps', createRsvpsRouter(io));
app.use('/api/guests', createGuestsRouter(io));
app.use('/api/upload', createUploadRouter());
app.use('/api/budget', createBudgetRouter(io));
app.use('/api/seating', createSeatingRouter(io));
app.use('/api/trivia', createTriviaRouter(io));
app.use('/api/checkins', createCheckinsRouter(io));

// Serve frontend static build if dist directory exists (Production SPA support)
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html') || filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  }));
  app.use((req, res, next) => {
    if (
      req.method === 'GET' &&
      !req.path.startsWith('/api') &&
      !req.path.startsWith('/uploads') &&
      !req.path.startsWith('/socket.io')
    ) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`========================================================`);
  console.log(`🚀 REST API & Socket.io Gateway aktif di http://localhost:${port}`);
  console.log(`📁 Static uploads folder: ${uploadsPath}`);
  console.log(`🔌 Database: MySQL (${process.env.DB_NAME || 'db_weddingbetawi'})`);
  console.log(`========================================================`);
});
