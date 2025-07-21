import React from 'react'
import { Routes, Route, useSearchParams } from 'react-router-dom'
import { PortalProvider } from '@/contexts/PortalContext'
import { mockUsers } from '@/mocks/usersMock'
import ClientPortal from '@/ClientPortal'
import { ClientLoansView } from '@/modules/client-portal/components/ClientLoansView'
import { ClientAgreements } from '@/modules/client-portal/components/ClientAgreements'
import { PortalApplicationView } from '@/modules/finance-application/components/PortalApplicationView'
import { ClientSettings } from '@/modules/client-portal/components/ClientSettings'
import { ClientServiceTickets } from '@/modules/client-portal/components/ClientServiceTickets'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { usePortal } from '@/contexts/PortalContext'

function ClientDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your client portal
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card key={item}>
            <CardHeader>
              <CardTitle>Card {item}</CardTitle>
              <CardDescription>Card description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

  const impersonateClientId = searchParams.get('impersonateClientId')
  const impersonatedUser = mockUsers.sampleUsers.find(u => u.id === impersonateClientId)

  const clearImpersonation = () => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete('impersonateClientId')
    setSearchParams(newSearchParams)
  }

  return (
    <PortalProvider 
      impersonatedUser={impersonatedUser}
      fallbackUser={{
        name: 'Portal Customer',
        email: 'customer@portal.com'
      }}
    >
      <ClientPortal>
        {/* Impersonation Banner */}
        {impersonatedUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center justify-between mb-6">
            <p className="text-sm text-blue-700">
              <strong>Admin View:</strong> You are viewing the portal as {impersonatedUser.name} ({impersonatedUser.email})
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearImpersonation}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <X className="h-4 w-4 mr-2" />
              Exit Impersonation
            </Button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<ClientDashboard />} />
          <Route path="/loans" element={<ClientLoansView />} />
          <Route path="/agreements" element={<ClientAgreements />} />
          <Route path="/finance-applications" element={<PortalApplicationView />} />
          <Route path="/service-tickets" element={<ClientServiceTickets />} />
          <Route path="/settings" element={<ClientSettings />} />
          <Route path="*" element={<Navigate to="/portalclient/" replace />} />
        </Routes>
      </ClientPortal>
    </PortalProvider>
  )
}

export default ClientPortalLayout