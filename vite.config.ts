import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png', 'icons/*.svg'],
        manifest: {
          name: 'Mari Partner - Digital Wedding Invitation & Reception',
          short_name: 'MariPartner',
          description: 'Undangan Pernikahan Digital Eksklusif & Sistem Resepsi Hari-H',
          theme_color: '#5B7065',
          background_color: '#18221D',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/icons/maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/uploads\/.*\.(?:png|jpg|jpeg|webp|svg)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'wedding-uploads-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
            {
              urlPattern: /\/assets\/.*\.(?:mp3|wav|ogg)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'wedding-audio-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 60,
                },
              },
            },
            {
              urlPattern: /\/api\/config$/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'wedding-api-config-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 1,
                  maxAgeSeconds: 60 * 60 * 24,
                },
              },
            },
          ],
        },
      }),
    ],
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
              if (normalized.includes('/node_modules/socket.io-client/')) {
                return 'vendor-socket';
              }
              if (normalized.includes('/node_modules/jspdf/')) {
                return 'vendor-pdf';
              }
            }

            // Split admin backend modules away from client guest bundle
            if (normalized.includes('/src/modules/backend/')) {
              return 'admin-panel';
            }

            // Split each theme into its own dedicated chunk so guests only download the active theme
            const themeMatch = normalized.match(/\/src\/modules\/frontend\/themes\/([^/]+)\//);
            if (themeMatch) {
              const themeName = themeMatch[1];
              return `theme-${themeName}`;
            }

            // Split heavy live wishes projector
            if (normalized.includes('LiveWishesProjector')) {
              return 'live-projector';
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
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/socket.io': {
          target: 'http://localhost:5000',
          ws: true,
        },
      },
    },
  };
});
