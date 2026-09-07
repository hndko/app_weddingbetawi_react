import { io, Socket } from 'socket.io-client';

// Inisialisasi koneksi Socket.io client
// Otomatis terhubung ke origin saat ini (mis. localhost:3000 yang diproxy ke port 5000 via Vite)
export const socket: Socket = io({
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('[Socket Client] Terhubung ke realtime gateway:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('[Socket Client] Terputus dari gateway:', reason);
});
