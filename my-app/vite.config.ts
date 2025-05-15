import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion']
        }
      }
    }
  },
  server: {
    port: 3000
  },
  base: '/',
  // Отключаем HMR в продакшене
  optimizeDeps: {
    exclude: command === 'serve' ? [] : ['@vite/client', '@vite/env']
  }
}))
