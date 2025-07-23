import React from 'react'
import ReactDOM from 'react-dom/client'
import * as pdfjs from 'pdfjs-dist'
import App from './App.tsx'
import './index.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)