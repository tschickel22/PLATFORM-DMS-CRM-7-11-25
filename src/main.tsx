import React from 'react'
import ReactDOM from 'react-dom/client'
import * as pdfjs from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import App from './App.tsx'
import './index.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = PdfWorker

// Initialize Sentry with safe configuration (no Replay to avoid getReplayId errors)
try {
  // Only initialize if DSN is available
  if (import.meta.env.VITE_SENTRY_DSN) {
    const Sentry = await import('@sentry/react')
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        // 🛑 Removed Sentry.replayIntegration() to fix getReplayId error
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.0,
      replaysOnErrorSampleRate: 0.0,
      environment: import.meta.env.MODE,
      beforeSend(event) {
        // Filter out known non-critical errors
        if (event.exception?.values?.[0]?.value?.includes('getReplayId')) {
          return null
        }
        return event
      }
    })
    console.log('✅ [Sentry] Initialized successfully without Replay integration')
  } else {
    console.log('ℹ️ [Sentry] Skipped - no DSN configured')
  }
} catch (error) {
  console.warn('⚠️ [Sentry] Initialization failed:', error)
  // Continue without Sentry - don't block app startup
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)