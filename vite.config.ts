import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },
  server: {
    port: 3000,
    host: true
  }
})