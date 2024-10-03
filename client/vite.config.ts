import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/polai/',
  plugins: [react()],
  server: {
    host: true, // Set to true to listen on all local IPs,
    strictPort: true,
    open: true
}
})
