import React from 'react'
import { Routes, Route } from 'react-router-dom'

function FinanceModuleDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Finance Module</h1>
            <p className="ri-page-description">
              Manage loans, payments, and financial operations
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Finance Module</h2>
        <p className="text-muted-foreground">
          This module is being configured with Supabase integration.
        </p>
      </div>
    </div>
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

export default FinanceModule