import React from 'react'
import ReactDOM from 'react-dom/client'
import { pdfjs } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker.min.js?url'
import App from './App.tsx'
import './index.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)