import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/polai/',
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
  },
})
