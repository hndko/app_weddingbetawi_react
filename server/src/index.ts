import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
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

// Load environment configuration
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const server = http.createServer(app);
const port = parseInt(process.env.SERVER_PORT || '5000', 10);

// Setup Socket.io Gateway
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
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
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory
const uploadsPath = path.resolve(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

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
app.use('/api/config', createConfigRouter(io));
app.use('/api/wishes', createWishesRouter(io));
app.use('/api/rsvps', createRsvpsRouter(io));
app.use('/api/guests', createGuestsRouter(io));
app.use('/api/upload', createUploadRouter());
app.use('/api/budget', createBudgetRouter(io));
app.use('/api/seating', createSeatingRouter(io));
app.use('/api/trivia', createTriviaRouter(io));

// Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`========================================================`);
  console.log(`🚀 REST API & Socket.io Gateway aktif di http://localhost:${port}`);
  console.log(`📁 Static uploads folder: ${uploadsPath}`);
  console.log(`🔌 Database: MySQL (${process.env.DB_NAME || 'db_weddingbetawi'})`);
  console.log(`========================================================`);
});
