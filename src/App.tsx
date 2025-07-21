import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { TenantProvider } from '@/contexts/TenantContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import ClientPortal from '@/modules/client-portal/ClientPortal'
import MainApp from './MainApp'

function ClientPortalApp() {
  const location = useLocation()
  
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/*" element={<ClientPortal />} />
      </Routes>
    </ProtectedRoute>
  )
}

function App() {
  const location = useLocation()
  const isPortalClient = location.pathname.startsWith('/portalclient')

  if (isPortalClient) {
    return <ClientPortalApp />
  }

  return <MainApp />
}

function AppWrapper() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="renter-insight-theme">
      <AuthProvider>
        <Router basename={window.location.pathname.startsWith('/portalclient') ? '/portalclient' : undefined}>
          <TenantProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={<App />} />
              </Routes>
              <Toaster />
            </div>
          </TenantProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default AppWrapper