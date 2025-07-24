import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { SupabaseProvider } from '@/contexts/SupabaseContext'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import ApiKeys from '@/pages/ApiKeys'
import FeatureFlags from '@/pages/FeatureFlags'
import TestIntegrations from '@/pages/TestIntegrations'
import Settings from '@/pages/Settings'

function App() {
  return (
    <SupabaseProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/api-keys" element={<ApiKeys />} />
              <Route path="/feature-flags" element={<FeatureFlags />} />
              <Route path="/integrations" element={<TestIntegrations />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
          <Toaster />
        </div>
      </Router>
    </SupabaseProvider>
  )
}

export default App