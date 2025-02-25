import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Ensure Vite binds to all network interfaces
    port: 3000,       // Explicitly set the frontend port
    strictPort: true, // Prevent port conflicts
  }
})