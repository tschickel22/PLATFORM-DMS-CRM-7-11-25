import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { PortalProvider, usePortal } from '@/contexts/PortalContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Home, 
  FileText, 
  CreditCard, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  User,
  CreditCard
  LogOut,
  Menu,
  X,
  DollarSign
} from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useAuth } from '@/contexts/AuthContext'
import { PortalApplicationView } from '@/modules/finance-application/components/PortalApplicationView'
import { ClientLoansView } from './components/ClientLoansView'
import { ClientAgreements } from './components/ClientAgreements'
import { mockUsers } from '@/mocks/usersMock'
import { mockFinance } from '@/mocks/financeMock'
import { mockAgreements } from '@/mocks/agreementsMock'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { mockFinanceApplications } from '@/modules/finance-application/mocks/financeApplicationMock'

// Mock components for routes that aren't implemented yet
function ClientSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Settings page coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ClientDashboard() {
  const { getDisplayName, getDisplayEmail, getCustomerId, isProxying, proxiedClient } = usePortal()
  
  // Debug logging for proxy functionality
  React.useEffect(() => {
    console.log('=== ClientDashboard Debug ===')
    console.log('getDisplayName():', getDisplayName())
    console.log('getDisplayEmail():', getDisplayEmail())
    console.log('getCustomerId():', getCustomerId())
    console.log('isProxying:', isProxying)
    console.log('proxiedClient:', proxiedClient)
    console.log('window.location.search:', window.location.search)
    console.log('=== End Debug ===')
  }, [getDisplayName, getDisplayEmail, getCustomerId, isProxying, proxiedClient])
  
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
import { useTenant } from '@/contexts/TenantContext'
import { useAuth } from '@/contexts/AuthContext'
import { PortalApplicationView } from '@/modules/finance-application/components/PortalApplicationView'
import { ClientLoansView } from './components/ClientLoansView'

// Mock components for routes that aren't implemented yet
function ClientProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your profile information</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Profile management coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ClientSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Account settings coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ClientAgreements() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agreements</h1>
        <p className="text-muted-foreground">View and manage your agreements</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Agreement management coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

  return (
    <div className="space-y-6">
      {/* Impersonation Banner - shown when proxying */}
      {isProxying && proxiedClient && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-700">
            <strong>Admin View:</strong> You are viewing the portal as {getDisplayName()} ({getDisplayEmail()})
          </p>
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

function ClientPortalContent() {
  const { tenant } = useTenant()
  const { logout } = useAuth()
  const { getDisplayName, getDisplayEmail, isProxying, proxiedClient } = usePortal()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, current: location.pathname === '/' },
    { name: 'Loans', href: '/loans', icon: DollarSign, current: location.pathname === '/loans' },
    { name: 'Agreements', href: '/agreements', icon: FileText, current: location.pathname === '/agreements' },
    { name: 'Finance Applications', href: '/finance-applications', icon: CreditCard, current: location.pathname === '/finance-applications' },
    { name: 'Settings', href: '/settings', icon: Settings, current: location.pathname === '/settings' },
  ]

  const SidebarContent = () => (
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
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`
              group flex items-center px-2 py-2 text-sm font-medium rounded-md
              ${item.current
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }
            `}
          >
            <item.icon
              className={`mr-3 flex-shrink-0 h-5 w-5 ${
                item.current ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}
            />
            {item.name}
          </a>
        ))}
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
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  )

  const { tenant } = useTenant()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/portalclient', icon: Home },
    { name: 'My Loans', href: '/portalclient/loans', icon: DollarSign },
    { name: 'Agreements', href: '/portalclient/agreements', icon: FileText },
    { name: 'Applications', href: '/portalclient/applications', icon: CreditCard },
    { name: 'Profile', href: '/portalclient/profile', icon: User },
    { name: 'Settings', href: '/portalclient/settings', icon: Settings },
  ]

  const portalName = tenant?.branding?.portalName || 'Customer Portal'
  const portalLogo = tenant?.branding?.portalLogo || tenant?.branding?.logo

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
          <Routes>
            <Route path="/" element={<ClientDashboard />} />
            <Route path="/loans" element={<ClientLoansView />} />
            <Route path="/agreements" element={<ClientAgreements />} />
            <Route path="/finance-applications" element={<PortalApplicationView />} />
            <Route path="/settings" element={<ClientSettingsPage />} />
          </Routes>
        </main>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Service agreement signed</p>
                            <p className="text-xs text-muted-foreground">1 day ago</p>
                          </div>
                          <Badge variant="outline">Completed</Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Purchase agreement created</p>
                            <p className="text-xs text-muted-foreground">3 days ago</p>
                          </div>
                          <Badge variant="secondary">Action Required</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>
                        Common tasks and shortcuts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2">
                        <Button variant="outline" className="justify-start h-auto p-4">
                          <div className="text-left">
                            <div className="font-medium">View Agreements</div>
                            <div className="text-sm text-muted-foreground">
                              Review and sign pending agreements
                            </div>
                          </div>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto p-4">
                          <div className="text-left">
                            <div className="font-medium">Check Application Status</div>
                            <div className="text-sm text-muted-foreground">
                              View your finance application progress
                            </div>
                          </div>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto p-4">
                          <div className="text-left">
                            <div className="font-medium">Update Profile</div>
                            <div className="text-sm text-muted-foreground">
                              Keep your information current
                            </div>
                          </div>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto p-4">
                          <div className="text-left">
                            <div className="font-medium">Contact Support</div>
                            <div className="text-sm text-muted-foreground">
                              Get help with your account
                            </div>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              } />
              <Route path="/loans" element={<ClientLoansView />} />
              <Route path="/agreements/*" element={<ClientAgreements />} />
              <Route path="/applications/*" element={<PortalApplicationView />} />
              <Route path="/profile" element={<ClientProfile />} />
              <Route path="/settings" element={<ClientSettings />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                © 2024 {tenant?.name || 'Your Company'}. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function ClientPortal() {
  const { user: authUser } = useAuth()
  const location = useLocation()
  
  // Debug logging for URL parameters
  console.log('=== ClientPortal Debug ===')
  console.log('Current location:', location)
  console.log('location.search:', location.search)
  console.log('location.pathname:', location.pathname)
  
  // Extract impersonation parameter from URL
  const searchParams = new URLSearchParams(location.search)
  const impersonateClientId = searchParams.get('impersonateClientId')
  
  console.log('Extracted impersonateClientId:', impersonateClientId)
  
  // Find the impersonated user from mock data (supports any user ID)
  const impersonatedUser = impersonateClientId 
    ? mockUsers.sampleUsers.find(u => u.id === impersonateClientId) 
    : null
  
  console.log('Found impersonated user:', impersonatedUser)
  console.log('Available mock users:', mockUsers.sampleUsers)
  console.log('=== End ClientPortal Debug ===')
  
  return (
    <PortalProvider 
      impersonatedUser={impersonatedUser}
      fallbackUser={{ 
        name: authUser?.name || '', 
        email: authUser?.email || '' 
      }}
    >
      <ClientPortalContent />
    </PortalProvider>
  )
}