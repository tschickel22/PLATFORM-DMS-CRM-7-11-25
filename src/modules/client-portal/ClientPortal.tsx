import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  FileText, 
  CreditCard, 
  User, 
  Settings, 
  Bell,
  LogOut,
  Menu,
  X,
  DollarSign
} from 'lucide-react'
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

export default function ClientPortal() {
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
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center px-6 border-b">
              <div className="flex items-center space-x-3">
                {portalLogo && (
                  <img 
                    src={portalLogo} 
                    alt="Portal Logo" 
                    className="h-8 w-8 object-contain"
                  />
                )}
                <span className="text-lg font-semibold">{portalName}</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-4 py-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              ))}
            </nav>

            {/* User section */}
            <div className="border-t p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:pl-0">
          {/* Mobile header */}
          <div className="lg:hidden flex h-16 items-center justify-between px-4 border-b bg-card">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <span className="text-lg font-semibold">{portalName}</span>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={
                <div className="space-y-6">
                  {/* Welcome Section */}
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                    <p className="text-muted-foreground">
                      Here's what's happening with your account
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid gap-4 md:grid-cols-3">
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
                        <CardTitle className="text-sm font-medium">Applications</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">
                          Under review
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Messages</CardTitle>
                        <Bell className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">
                          2 unread
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Your latest account activity
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Finance application submitted</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                          </div>
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