import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Listen on all IPv4 interfaces (127.0.0.1, localhost, and LAN)
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 5173,
    },
  },
});
