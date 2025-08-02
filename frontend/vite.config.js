import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // For local development only
  },
  build: {
    outDir: 'dist', // Required by Vercel to serve built files
    emptyOutDir: true,
  }
});
