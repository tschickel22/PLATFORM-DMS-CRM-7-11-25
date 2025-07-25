import React from 'react'
import { Routes, Route } from 'react-router-dom'

function ServiceOpsDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Service Operations</h1>
            <p className="ri-page-description">
              Manage service tickets and operations
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Service Operations Module</h2>
        <p className="text-muted-foreground">
          This module is being configured with Supabase integration.
        </p>
      </div>
    </div>
  )
}

function ServiceOps() {
  return (
    <Routes>
      <Route path="/" element={<ServiceOpsDashboard />} />
      <Route path="/*" element={<ServiceOpsDashboard />} />
    </Routes>
  )
}

export default ServiceOps