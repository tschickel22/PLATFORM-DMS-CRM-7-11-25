import React from 'react'
import { Routes, Route } from 'react-router-dom'

function CRMSalesDealDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">CRM Sales Deal</h1>
            <p className="ri-page-description">
              Manage sales deals and pipeline
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">CRM Sales Deal Module</h2>
        <p className="text-muted-foreground">
          This module is being configured with Supabase integration.
        </p>
      </div>
    </div>
  )
}

export default function CRMSalesDeal() {
  return (
    <Routes>
      <Route path="/" element={<CRMSalesDealDashboard />} />
      <Route path="/*" element={<CRMSalesDealDashboard />} />
    </Routes>
  )
}