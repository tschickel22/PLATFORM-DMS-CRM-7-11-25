import React from 'react'
import ReactDOM from 'react-dom/client'
import * as pdfjs from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import App from './App.tsx'
import './index.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = PdfWorker

// Bootstrap app in async wrapper
async function startApp() {
  try {
    if (import.meta.env.VITE_SENTRY_DSN) {
      const { default: Sentry, browserTracingIntegration } = await import('@sentry/react')
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
          browserTracingIntegration(), // 🔧 Proper tracing integration
        ],
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.0,
        replaysOnErrorSampleRate: 0.0,
        environment: import.meta.env.MODE,
        beforeSend(event) {
          // Skip noisy Sentry replays error
          if (event.exception?.values?.[0]?.value?.includes('getReplayId')) {
            return null
          }
          return event
        }
      })
      console.log('✅ [Sentry] Initialized successfully')
    } else {
      console.log('ℹ️ [Sentry] Skipped - VITE_SENTRY_DSN not configured')
    }
  } catch (error) {
    console.warn('⚠️ [Sentry] Failed to initialize:', error)
  }

  // ✅ Safe to render after async config
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

startApp()
