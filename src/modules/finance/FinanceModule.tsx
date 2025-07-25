import React from 'react'
import { Routes, Route } from 'react-router-dom'
import FinanceApplication from '@/modules/finance-application/FinanceApplication'

function FinanceModuleDashboard() {
  return (
    <FinanceApplication />
  )
}

export default function FinanceModule() {
  return (
    <Routes>
      <Route path="/" element={<FinanceModuleDashboard />} />
      <Route path="/*" element={<FinanceModuleDashboard />} />
    </Routes>
  )
}
