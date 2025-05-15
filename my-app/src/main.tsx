import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Отключаем HMR в продакшене
if (import.meta.env.PROD) {
  try {
    const ws = new WebSocket('ws://localhost:3000')
    ws.close()
  } catch (e) {
    console.log('WebSocket connection closed in production')
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
