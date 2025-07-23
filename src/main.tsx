import React from 'react'
import ReactDOM from 'react-dom/client'
import * as pdfjs from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url'
import App from './App.tsx'
import './index.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)