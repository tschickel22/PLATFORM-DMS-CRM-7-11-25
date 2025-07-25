import React from 'react'
import { Routes, Route } from 'react-router-dom'
import DealPipeline from './components/DealPipeline'

function CRMSalesDeal() {
  return (
    <Routes>
      <Route path="/" element={<DealPipeline />} />
      <Route path="/*" element={<DealPipeline />} />
    </Routes>
  )
}

export default CRMSalesDeal