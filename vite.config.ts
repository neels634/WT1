import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' so the built folder works when opened from any path or static host
export default defineConfig({
  base: './',
  build: { chunkSizeWarningLimit: 1000 },
  plugins: [react(), tailwindcss()],
})
