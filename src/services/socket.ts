import { io, Socket } from 'socket.io-client';
import { debugStore } from '../modules/dev/debugStore';

// Inisialisasi koneksi Socket.io client
export const socket: Socket = io({
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

// Hook for Developer DebugBar (Development mode only)
if (import.meta.env.DEV) {
  socket.on('connect', () => {
    debugStore.setSocketStatus('connected', socket.id);
    debugStore.addSocketLog('info', 'connect', { socketId: socket.id });
  });

  socket.on('disconnect', (reason) => {
    debugStore.setSocketStatus('disconnected', '-');
    debugStore.addSocketLog('info', 'disconnect', { reason });
  });

  socket.on('connect_error', (err) => {
    debugStore.setSocketStatus('connecting', '-');
    debugStore.addSocketLog('info', 'connect_error', { message: err.message });
  });

  // Catch all incoming realtime events dynamically
  socket.onAny((event: string, ...args: unknown[]) => {
    debugStore.addSocketLog('in', event, args.length === 1 ? args[0] : args);
  });
}
