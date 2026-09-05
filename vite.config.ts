import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalized = id.replace(/\\/g, '/');
            if (normalized.includes('/node_modules/')) {
              if (
                normalized.includes('/node_modules/react/') ||
                normalized.includes('/node_modules/react-dom/') ||
                normalized.includes('/node_modules/react-helmet-async/') ||
                normalized.includes('/node_modules/scheduler/')
              ) {
                return 'vendor-react';
              }
              if (normalized.includes('/node_modules/firebase/') || normalized.includes('/node_modules/@firebase/')) {
                return 'vendor-firebase';
              }
              if (normalized.includes('/node_modules/motion/') || normalized.includes('/node_modules/framer-motion/')) {
                return 'vendor-motion';
              }
              if (normalized.includes('/node_modules/lucide-react/')) {
                return 'vendor-icons';
              }
              if (normalized.includes('/node_modules/react-player/')) {
                return 'vendor-player';
              }
              if (normalized.includes('/node_modules/jsqr/') || normalized.includes('/node_modules/qrcode/')) {
                return 'vendor-scanner';
              }
              if (normalized.includes('/node_modules/xlsx/')) {
                return 'vendor-xlsx';
              }
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
