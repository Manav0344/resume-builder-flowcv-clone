import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/resume-builder-flowcv-clone/',
  server: { port: 5173 },
  build: { chunkSizeWarningLimit: 1200 },
});