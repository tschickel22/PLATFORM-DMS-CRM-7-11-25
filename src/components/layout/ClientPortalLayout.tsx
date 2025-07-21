import React from 'react'
import { Routes, Route, useSearchParams } from 'react-router-dom'
import { PortalProvider } from '@/contexts/PortalContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { mockUsers } from '@/mocks/usersMock'
import ClientPortal from '@/ClientPortal'
import { ClientLoansView } from '@/modules/client-portal/components/ClientLoansView'
import { ClientAgreements } from '@/modules/client-portal/components/ClientAgreements'
import { PortalApplicationView } from '@/modules/finance-application/components/PortalApplicationView'
import { ClientServiceTickets } from '@/modules/client-portal/components/ClientServiceTickets'
import { ClientSettings } from '@/modules/client-portal/components/ClientSettings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function ClientPortalRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ClientPortal><div /></ClientPortal>} />
      <Route path="/loans" element={
        <ClientPortal>
          <ClientLoansView />
        </ClientPortal>
      } />
      <Route path="/agreements" element={
        <ClientPortal>
          <ClientAgreements />
        </ClientPortal>
      } />
      <Route path="/finance-applications" element={
        <ClientPortal>
          <PortalApplicationView />
        </ClientPortal>
      } />
      <Route path="/service-tickets" element={
        <ClientPortal>
          <ClientServiceTickets />
        </ClientPortal>
      } />
      <Route path="/settings" element={
        <ClientPortal>
          <ClientSettings />
        </ClientPortal>
      } />
    </Routes>
  )
}

export default function ClientPortalLayout() {
  const [searchParams] = useSearchParams()
  const impersonateClientId = searchParams.get('impersonateClientId')

  // Find the impersonated user if ID is provided
  const impersonatedUser = impersonateClientId
    ? mockUsers.sampleUsers.find(user => user.id === impersonateClientId)
    : null

  return (
    <ErrorBoundary>
      <PortalProvider 
        impersonatedUser={impersonatedUser}
        fallbackUser={{
          name: 'Portal Customer',
          email: 'customer@portal.com'
        }}
      >
        <ClientPortalRoutes />
      </PortalProvider>
    </ErrorBoundary>
  )
}