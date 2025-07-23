import React, { useState } from 'react'
import { useLocation, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { usePortal } from '@/contexts/PortalContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Home, 
  DollarSign, 
  FileText, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu,
  User,
  CreditCard,
  X,
  Wrench
} from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useAuth } from '@/contexts/AuthContext'
import { mockUsers } from '@/mocks/usersMock'
import { mockFinance } from '@/mocks/financeMock'
import { mockAgreements } from '@/mocks/agreementsMock'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { mockFinanceApplications } from '@/modules/finance-application/mocks/financeApplicationMock'
import { useMockDataDiscovery, getPortalSectionsWithCounts } from '@/utils/mockDataDiscovery'

function ClientDashboard() {
  const { getDisplayName, getDisplayEmail, getCustomerId, isProxying, proxiedClient } = usePortal()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // Get customer-specific data based on the current customer ID
  const customerId = getCustomerId()
  const customerName = getDisplayName()
  
  // Use the new mock data discovery system
  const { customerData, getSectionCount, hasDataForSection } = useMockDataDiscovery(customerId, customerName)
  
  // Get data using the discovery system
  const customerLoans = customerData.loans || []
  const customerAgreements = customerData.agreements || []
  const customerApplications = customerData.financeApplications || []
  const customerServiceTickets = customerData.serviceTickets || []
  
  // Calculate dynamic stats
  const activeLoans = customerLoans.filter(loan => ['Current', 'Active'].includes(loan.status))
  const paidOffLoans = customerLoans.filter(loan => loan.status === 'Paid Off')
  const pendingAgreements = customerAgreements.filter(agreement => agreement.status === 'PENDING')
  const inProgressTickets = customerServiceTickets.filter(ticket => ticket.status === 'In Progress')
  
  // Get recent activity from various sources
  const recentActivity = [
    // Recent loan payments
    ...mockFinance.samplePayments
      .filter(payment => {
        const loan = customerLoans.find(l => l.id === payment.loanId)
        return loan && payment.status === 'Completed'
      })
      .slice(0, 2)
      .map(payment => {
        const loan = customerLoans.find(l => l.id === payment.loanId)
        return {
          id: `payment-${payment.id}`,
          type: 'payment',
          title: 'Loan payment processed',
          description: `Your monthly payment of $${payment.amount.toFixed(2)} was successfully processed.`,
          time: new Date(payment.paymentDate).toLocaleDateString()
        }
      }),
    
    // Recent agreements
    ...customerAgreements
      .filter(agreement => agreement.status === 'PENDING')
      .slice(0, 1)
      .map(agreement => ({
        id: `agreement-${agreement.id}`,
        type: 'agreement',
        title: 'New agreement available',
        description: `A new ${agreement.type.toLowerCase()} agreement is available for your review and signature.`,
        time: new Date(agreement.createdAt).toLocaleDateString()
      })),
    
    // Recent service tickets
    ...customerServiceTickets
      .slice(0, 1)
      .map(ticket => ({
        id: `ticket-${ticket.id}`,
        type: 'service',
        title: 'Service ticket update',
        description: `Service ticket "${ticket.title}" status: ${ticket.status}.`,
        time: new Date(ticket.updatedAt).toLocaleDateString()
      })),
    
    // Recent applications
    ...customerApplications
      .filter(app => ['submitted', 'under_review', 'approved'].includes(app.status))
      .slice(0, 1)
      .map(app => ({
        id: `app-${app.id}`,
        type: 'application',
        title: 'Finance application update',
        description: `Your finance application status: ${app.status.replace('_', ' ')}.`,
        time: new Date(app.updatedAt).toLocaleDateString()
      }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 3)

  const clearImpersonation = () => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete('impersonateClientId')
    navigate({ pathname: '/portalclient', search: newSearchParams.toString() })
  }

  return (
    <div className="space-y-6">
      {/* Impersonation Banner - shown when proxying */}
      {isProxying && proxiedClient && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center justify-between">
          <p className="text-sm text-blue-700">
            <strong>Admin View:</strong> You are viewing the portal as {getDisplayName()} ({getDisplayEmail()})
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
            <div className="text-2xl font-bold">{getSectionCount('loans')}</div>
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
            <div className="text-2xl font-bold">{getSectionCount('agreements')}</div>
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
            <div className="text-2xl font-bold">{getSectionCount('serviceTickets')}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressTickets.length} in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates on your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity</p>
              <p className="text-sm">Activity will appear here as you use the portal</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface ClientPortalContentProps {
  children: React.ReactNode
}

function ClientPortalContent({ children }: ClientPortalContentProps) {
  const { tenant } = useTenant()
  const { getDisplayName, getDisplayEmail, isProxying, proxiedClient } = usePortal()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Define navigation items with relative paths
  const navigationItems = [
    { name: 'Dashboard', path: '', icon: Home },
    { name: 'Loans', path: 'loans', icon: DollarSign },
    { name: 'Agreements', path: 'agreements', icon: FileText },
    { name: 'Finance Applications', path: 'finance-applications', icon: CreditCard },
    { name: 'Service Tickets', path: 'service-tickets', icon: Wrench },
    { name: 'Settings', path: 'settings', icon: Settings },
  ]

  const SidebarContent = () => {
    return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-4 py-6">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              {tenant?.name?.charAt(0) || 'T'}
            </span>
          </div>
          <span className="ml-2 text-lg font-semibold">{tenant?.name || 'Portal'}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigationItems.map((item) => {
          // For relative paths, we need to construct the full path for comparison
          const fullPath = item.path === '' ? '/portalclient' : `/portalclient/${item.path}`
          const current = location.pathname === fullPath || 
                         (item.path === '' && location.pathname === '/portalclient/')
          
          return (
          <Link
            key={item.name}
            to={item.path}
            className={`
              group flex items-center px-2 py-2 text-sm font-medium rounded-md
              ${current
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }
            `}
          >
            <item.icon
              className={`mr-3 flex-shrink-0 h-5 w-5 ${
                current ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}
            />
            {item.name}
          </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t p-4">
        {/* Impersonation indicator */}
        {isProxying && proxiedClient && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-700 font-medium">
              Viewing as: {getDisplayName()}
            </p>
          </div>
        )}
        
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{getDisplayName()}</p>
            <p className="text-xs text-muted-foreground truncate">{getDisplayEmail()}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => window.location.href = '/login'}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r bg-card">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <div className="flex items-center">
            <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">
                {tenant?.name?.charAt(0) || 'T'}
              </span>
            </div>
            <span className="ml-2 font-semibold">{tenant?.name || 'Portal'}</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function ClientPortal({ children }: { children: React.ReactNode }) {
  return <ClientPortalContent>{children}</ClientPortalContent>
}