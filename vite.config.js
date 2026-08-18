import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    port: 5173,
  strictPort: true,
  open: false,
  allowedHosts: true,
  cors: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  middlewareMode: false,
  hmr: {
    clientPort: 5173,
  protocol: 'ws',
    host: 'localhost',
    port: 5173,
  },
  fs: {
    strict: false,
  },
  origin: 'http://localhost:5173',
  },
  preview: {
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    cors: true,
  },
  appType: 'spa',
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
