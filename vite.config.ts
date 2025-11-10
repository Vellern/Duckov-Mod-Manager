import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite Configuration for Electron App
 *
 * Changes for Electron IPC migration:
 * - Removed proxy configuration (no backend server needed)
 * - React app communicates directly with Electron main process via IPC
 * - Vite dev server only serves the React frontend
 */
export default defineConfig({
  plugins: [react()],
  root: './web',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3001,
    // Proxy removed - all API calls now use Electron IPC instead of HTTP
    // The React frontend communicates with the main process via window.electronAPI
  },
})
