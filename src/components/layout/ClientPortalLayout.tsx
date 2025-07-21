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
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  FileText, 
  Calendar, 
  Settings,
  X
} from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockFinance } from '@/mocks/financeMock'
import { mockAgreements } from '@/mocks/agreementsMock'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { mockFinanceApplications } from '@/modules/finance-application/mocks/financeApplicationMock'

function ClientDashboard() {
  const { getDisplayName, getDisplayEmail, getCustomerId, isProxying, proxiedClient } = usePortal()
  
  // Get customer-specific data based on the current customer ID
  const customerId = getCustomerId()
  
  // Filter data for the current customer
  const customerLoans = mockFinance.sampleLoans.filter(loan => 
    loan.customerId === customerId || loan.customerName === getDisplayName()
  )
  
  const customerAgreements = mockAgreements.sampleAgreements.filter(agreement => 
    agreement.customerId === customerId || agreement.customerName === getDisplayName()
  )
  
  const customerApplications = mockFinanceApplications.sampleApplications.filter(app => 
    app.customerId === customerId || app.customerName === getDisplayName()
  )
  
  const customerServiceTickets = mockServiceOps.sampleTickets.filter(ticket => 
    ticket.customerId === customerId || ticket.customerName === getDisplayName()
  )
  
  // Calculate dynamic stats
  const activeLoans = customerLoans.filter(loan => ['Current', 'Active'].includes(loan.status))
  const paidOffLoans = customerLoans.filter(loan => loan.status === 'Paid Off')
  const pendingAgreements = customerAgreements.filter(agreement => agreement.status === 'PENDING')
  const inProgressTickets = customerServiceTickets.filter(ticket => ticket.status === 'In Progress')

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Welcome back, {getDisplayName().split(' ')[0]}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your account
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerLoans.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeLoans.length} active, {paidOffLoans.length} paid off
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agreements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerAgreements.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingAgreements.length} pending signature
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Tickets</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerServiceTickets.length}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressTickets.length} in progress
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ClientLoans() {
  const { getDisplayName, getCustomerId } = usePortal()
  const customerId = getCustomerId()
  
  const customerLoans = mockFinance.sampleLoans.filter(loan => 
    loan.customerId === customerId || loan.customerName === getDisplayName()
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Loans</h1>
        <p className="text-muted-foreground">
          Manage your loan accounts and payments
        </p>
      </div>

      <div className="grid gap-4">
        {customerLoans.map((loan) => (
          <Card key={loan.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{loan.type}</CardTitle>
                <Badge variant={loan.status === 'Current' ? 'default' : 'secondary'}>
                  {loan.status}
                </Badge>
              </div>
              <CardDescription>
                Loan ID: {loan.id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Principal</p>
                  <p className="font-medium">${loan.principal.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Balance</p>
                  <p className="font-medium">${loan.balance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Interest Rate</p>
                  <p className="font-medium">{loan.interestRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Payment</p>
                  <p className="font-medium">{new Date(loan.nextPaymentDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ClientAgreements() {
  const { getDisplayName, getCustomerId } = usePortal()
  const customerId = getCustomerId()
  
  const customerAgreements = mockAgreements.sampleAgreements.filter(agreement => 
    agreement.customerId === customerId || agreement.customerName === getDisplayName()
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Agreements</h1>
        <p className="text-muted-foreground">
          Review and manage your agreements
        </p>
      </div>

      <div className="grid gap-4">
        {customerAgreements.map((agreement) => (
          <Card key={agreement.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{agreement.type}</CardTitle>
                <Badge variant={agreement.status === 'PENDING' ? 'destructive' : 'default'}>
                  {agreement.status}
                </Badge>
              </div>
              <CardDescription>
                Created: {new Date(agreement.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {agreement.description}
              </p>
              {agreement.status === 'PENDING' && (
                <Button size="sm">
                  Review & Sign
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ClientSettings() {
  const { getDisplayName, getDisplayEmail } = usePortal()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">{getDisplayName()}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-sm text-muted-foreground">{getDisplayEmail()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ClientPortalLayout() {
  const [searchParams, setSearchParams] = useSearchParams()
  const impersonateClientId = searchParams.get('impersonateClientId')
  const impersonatedUser = mockUsers.sampleUsers.find(u => u.id === impersonateClientId)

  const clearImpersonation = () => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete('impersonateClientId')
    setSearchParams(newSearchParams)
  }

  const [searchParams] = useSearchParams()
  const impersonateClientId = searchParams.get('impersonateClientId')
  
  // Find the impersonated user if ID is provided
  const impersonatedUser = impersonateClientId 
    ? mockUsers.sampleUsers.find(user => user.id === impersonateClientId)
    : null

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
          <Route path="/*" element={<div>Portal Dashboard</div>} />
        </Routes>
      </ClientPortal>
      <ErrorBoundary>
        <ClientPortal>
          <Routes>
            <Route path="/" element={<div>Portal Dashboard</div>} />
            <Route path="/loans" element={<ClientLoansView />} />
            <Route path="/agreements" element={<ClientAgreements />} />
            <Route path="/finance-applications" element={<PortalApplicationView />} />
            <Route path="/service-tickets" element={<ClientServiceTickets />} />
            <Route path="/settings" element={<ClientSettings />} />
            <Route path="/*" element={<div>Portal Dashboard</div>} />
          </Routes>
        </ClientPortal>
      </ErrorBoundary>
    </PortalProvider>
  )
}

export default ClientPortalLayout