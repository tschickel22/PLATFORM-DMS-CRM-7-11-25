import React from 'react'
import { Routes, Route } from 'react-router-dom'

function CommissionEngineDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Commission Engine</h1>
            <p className="ri-page-description">
              Manage sales commissions and payouts
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Commission Engine Module</h2>
        <p className="text-muted-foreground">
          This module is being configured with Supabase integration.
        </p>
      </div>
    </div>
  )
}

export default function CommissionEngine() {
  return (
    <Routes>
      <Route path="/" element={<CommissionEngineDashboard />} />
      <Route path="/*" element={<CommissionEngineDashboard />} />
    </Routes>
  )
}

export default CommissionEngine