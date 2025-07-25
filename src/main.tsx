import React from 'react'
import ReactDOM from 'react-dom/client'
import * as pdfjs from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import App from './App.tsx'
import './index.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = PdfWorker

// Initialize Sentry with safe configuration and proper error handling
try {
  if (import.meta.env.VITE_SENTRY_DSN) {
    const { default: Sentry } = await import('@sentry/react')
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.0,
      replaysOnErrorSampleRate: 0.0,
      environment: import.meta.env.MODE,
      beforeSend(event) {
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
  // Continue without Sentry - don't block app startup
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)