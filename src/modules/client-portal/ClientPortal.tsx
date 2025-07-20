import React, { useState } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { ClientAgreements } from './components/ClientAgreements'
import { PortalApplicationView } from '../finance-application/components/PortalApplicationView'
import { mockAgreements } from '@/mocks/agreementsMock'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/contexts/TenantContext'
import { useAuth } from '@/contexts/AuthContext'
import { 
  FileText, 
  CreditCard, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Placeholder components for client features
function ClientDashboard() {
  const { tenant } = useTenant()
  const { user } = useAuth()
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your account with {tenant?.name}
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Agreements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 pending signature</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Finance Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Service Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">All up to date</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Finance application submitted for review</span>
              <span className="text-muted-foreground ml-auto">2 days ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Purchase agreement signed</span>
              <span className="text-muted-foreground ml-auto">1 week ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ClientProfile() {
  const { user } = useAuth()
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Name</label>
              <p className="text-sm text-muted-foreground">{user?.name || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">{user?.email || 'Not provided'}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            Edit Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ClientPortal() {
  const { tenant } = useTenant()
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Get portal branding from tenant context
  const portalName = tenant?.branding?.portalName || 'Customer Portal'
  const portalLogo = tenant?.branding?.portalLogo || tenant?.branding?.logo
  const primaryColor = tenant?.branding?.primaryColor || '#3b82f6'

  // Navigation items
  const navigation = [
    {
      name: 'Dashboard',
      href: '/portalclient',
      icon: Home,
      current: location.pathname === '/portalclient'
    },
    {
      name: 'Agreements',
      href: '/portalclient/agreements',
      icon: FileText,
      current: location.pathname.startsWith('/portalclient/agreements')
    },
    {
      name: 'Finance Applications',
      href: '/portalclient/applications',
      icon: CreditCard,
      current: location.pathname.startsWith('/portalclient/applications')
    },
    {
      name: 'Profile',
      href: '/portalclient/profile',
      icon: User,
      current: location.pathname.startsWith('/portalclient/profile')
    }
  ]

  const handleLogout = () => {
    logout()
    // In a real app, this might redirect to a different login page for the portal
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            {portalLogo && (
              <img 
                src={portalLogo} 
                alt={portalName}
                className="w-8 h-8 object-contain"
              />
            )}
            <h1 className="text-lg font-semibold">{portalName}</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                item.current
                  ? "text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              style={item.current ? { backgroundColor: primaryColor } : {}}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:shadow-sm">
        <div className="flex items-center space-x-3 p-6 border-b">
          {portalLogo && (
            <img 
              src={portalLogo} 
              alt={portalName}
              className="w-10 h-10 object-contain"
            />
          )}
          <h1 className="text-xl font-semibold">{portalName}</h1>
        </div>
        
        <nav className="p-6 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                item.current
                  ? "text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              style={item.current ? { backgroundColor: primaryColor } : {}}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-gray-50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header for mobile */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              {portalLogo && (
                <img 
                  src={portalLogo} 
                  alt={portalName}
                  className="w-6 h-6 object-contain"
                />
              )}
              <h1 className="text-lg font-semibold">{portalName}</h1>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<ClientDashboard />} />
            <Route path="/agreements/*" element={<ClientAgreements />} />
            <Route path="/applications/*" element={<PortalApplicationView />} />
            <Route path="/profile" element={
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Profile management (Coming Soon)
                </p>
              </div>
            } />
                </p>
              </div>
            } />
            <Route path="/profile" element={<ClientProfile />} />
            <Route path="*" element={<Navigate to="/portalclient" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  {portalLogo && (
                    <img 
                      src={portalLogo} 
                      alt={portalName}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <h3 className="font-semibold">{tenant?.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your trusted partner for quality homes and RVs.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/portalclient" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
                  <li><Link to="/portalclient/agreements" className="text-muted-foreground hover:text-foreground">Agreements</Link></li>
                  <li><Link to="/portalclient/applications" className="text-muted-foreground hover:text-foreground">Applications</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact Support</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Contact</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>support@company.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>123 Main St, City, ST</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2024 {tenant?.name}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}