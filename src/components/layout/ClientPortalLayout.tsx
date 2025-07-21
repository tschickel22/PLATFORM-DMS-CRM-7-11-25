import React from 'react'
import { Routes, Route, useSearchParams, Navigate } from 'react-router-dom'
import { PortalProvider } from '@/contexts/PortalContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import ClientPortal from '@/modules/client-portal/ClientPortal'
import { ClientLoansView } from '@/modules/client-portal/components/ClientLoansView'
import { ClientAgreements } from '@/modules/client-portal/components/ClientAgreements'
import { PortalApplicationView } from '@/modules/finance-application/components/PortalApplicationView'
import { mockUsers } from '@/mocks/usersMock'

function ClientDashboard() {
  return <ClientPortal />
}

function ClientSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>
      <div className="text-center py-12 text-muted-foreground">
        <p>Settings page coming soon</p>
      </div>
    </div>
  )
}

export default function ClientPortalLayout() {
  const [searchParams] = useSearchParams()
  const impersonateClientId = searchParams.get('impersonateClientId')
  
  // Find the impersonated user from mock data
  const impersonatedUser = impersonateClientId 
    ? mockUsers.sampleUsers.find(u => u.id === impersonateClientId) 
    : null
  
  return (
    <ProtectedRoute>
      <PortalProvider 
        impersonatedUser={impersonatedUser}
        fallbackUser={impersonatedUser ?? null}
      >
        <Routes>
          <Route path="/" element={<ClientDashboard />} />
          <Route path="loans" element={<ClientLoansView />} />
          <Route path="agreements" element={<ClientAgreements />} />
          <Route path="finance-applications" element={<PortalApplicationView />} />
          <Route path="settings" element={<ClientSettings />} />
          <Route path="*" element={<Navigate to="/portalclient/" replace />} />
        </Routes>
      </PortalProvider>
    </ProtectedRoute>
  )
}

export default ClientPortalLayout