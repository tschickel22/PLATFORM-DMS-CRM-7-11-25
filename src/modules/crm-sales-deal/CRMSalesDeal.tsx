import React from 'react'
import { Routes, Route } from 'react-router-dom'

function CRMSalesDealDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">CRM Sales Deal Module</h1>
      <p>This is a placeholder view while Supabase hooks are being wired in.</p>
    </div>
  )
}

function CRMSalesDeal() {
  return (
    <Routes>
      <Route path="/" element={<CRMSalesDealDashboard />} />
      <Route path="/*" element={<CRMSalesDealDashboard />} />
    </Routes>
  )
}

export default CRMSalesDeal