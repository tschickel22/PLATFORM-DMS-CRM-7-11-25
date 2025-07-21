import React, { useState } from 'react'
import { Routes, Route, useLocation, useSearchParams } from 'react-router-dom'
import { PortalProvider, usePortal } from '@/contexts/PortalContext'
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
  CreditCard
} from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useAuth } from '@/contexts/AuthContext'
import { mockUsers } from '@/mocks/usersMock'
import { PortalApplicationView } from '@/modules/finance-application/components/PortalApplicationView'
import { ClientLoansView } from './components/ClientLoansView'
import { ClientAgreements } from './components/ClientAgreements'

// Mock components for routes that aren't implemented yet
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
            <p>Settings page coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ClientDashboard() {
  const { tenant } = useTenant()
  const { user: authUser, logout } = useAuth()
  const [searchParams] = useSearchParams()
  const { getDisplayName, getDisplayEmail, isProxying, proxiedClient } = usePortal()

  // Check for impersonation
  const impersonateClientId = searchParams.get('impersonateClientId')
  const impersonatedUser = impersonateClientId 
    ? mockUsers.sampleUsers.find(u => u.id === impersonateClientId)
    : null
  
  // Use impersonated user if available, otherwise use authenticated user
  const user = impersonatedUser || authUser
  const isImpersonating = !!impersonatedUser

  return (
    <div className="space-y-6">
      {/* Impersonation Banner */}
      {isImpersonating && impersonatedUser && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-700">
            <strong>Admin View:</strong> You are viewing the portal as {impersonatedUser.name} ({impersonatedUser.email})
          </p>
        </div>
      )}
      
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Welcome back, {(user?.name || 'User').split(' ')[0]}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your account
        </p>
      </div>

      {/* Quick Stats */}
      {/* TODO: Update these stats to fetch dynamic data based on the proxied client ID for full implementation */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 active, 1 paid off
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agreements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              1 pending signature
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Tickets</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {/* TODO: Update this section to fetch dynamic data based on the proxied client ID for full implementation */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates on your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Loan payment processed
                </p>
                <p className="text-sm text-muted-foreground">
                  Your monthly payment of $450.00 was successfully processed.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  1 hour ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  New agreement available
                </p>
                <p className="text-sm text-muted-foreground">
                  A new service agreement is available for your review and signature.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  3 days ago
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ClientPortalContent() {
  const { tenant } = useTenant()
  const { user: authUser, logout } = useAuth()
  const [searchParams] = useSearchParams()
  const { getDisplayName, getDisplayEmail, isProxying, proxiedClient } = usePortal()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Check for impersonation
  const impersonateClientId = searchParams.get('impersonateClientId')
  const impersonatedUser = impersonateClientId 
    ? mockUsers.sampleUsers.find(u => u.id === impersonateClientId)
    : null
  
  // Use impersonated user if available, otherwise use authenticated user
  const user = impersonatedUser || authUser
  const isImpersonating = !!impersonatedUser

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
        {isImpersonating && impersonatedUser && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-700 font-medium">
              Viewing as: {impersonatedUser.name}
            </p>
          </div>
        )}
        
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
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
            <Route path="/settings" element={<ClientSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function ClientPortal() {
  const { user: authUser } = useAuth()
  const [searchParams] = useSearchParams()
  
  // Check for impersonation at the top level
  const impersonateClientId = searchParams.get('impersonateClientId')
  const impersonatedUser = impersonateClientId 
    ? mockUsers.sampleUsers.find(u => u.id === impersonateClientId)
    : null
  
  // Use impersonated user if available, otherwise use authenticated user
  const user = impersonatedUser || authUser
  
  return (
    <PortalProvider fallbackUser={{ name: user?.name || '', email: user?.email || '' }}>
      <ClientPortalContent />
    </PortalProvider>
  )
}