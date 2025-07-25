import React from 'react'
import { Routes, Route } from 'react-router-dom'

function PlatformAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Platform Admin</h1>
            <p className="ri-page-description">
              Platform administration and management
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Platform Admin Module</h2>
        <p className="text-muted-foreground">
          This module is being configured with Supabase integration.
        </p>
      </div>
    </div>
  )
}

export default function PlatformAdmin() {
  return (
    <Routes>
      <Route path="/" element={<PlatformAdminDashboard />} />
      <Route path="/*" element={<PlatformAdminDashboard />} />
    </Routes>
  )
}

export default PlatformAdmin