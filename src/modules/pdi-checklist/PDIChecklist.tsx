import React from 'react'
import { Routes, Route } from 'react-router-dom'

function PDIChecklistDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">PDI Checklist</h1>
            <p className="ri-page-description">
              Pre-delivery inspection management
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">PDI Checklist Module</h2>
        <p className="text-muted-foreground">
          This module is being configured with Supabase integration.
        </p>
      </div>
    </div>
  )
}

export default function PDIChecklist() {
  return (
    <Routes>
      <Route path="/" element={<PDIChecklistDashboard />} />
      <Route path="/*" element={<PDIChecklistDashboard />} />
    </Routes>
  )
}

export default PDIChecklist