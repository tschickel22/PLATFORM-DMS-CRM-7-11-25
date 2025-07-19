import React from 'react'
import ReactDOM from 'react-dom/client'
import * as pdfjsLib from 'pdfjs-dist'
import App from './App.tsx'
import './index.css'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)