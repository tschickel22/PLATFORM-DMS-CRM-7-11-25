import React, { ReactNode, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useTenant } from '@/contexts/TenantContext'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Home, 
  Users, 
  Package, 
  FileText, 
  DollarSign, 
  Wrench, 
  Truck, 
  ClipboardCheck, 
  Calculator, 
  Globe, 
  Receipt, 
  Settings, 
  BarChart3,
  CreditCard,
  LogOut,
  Menu
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { tenant } = useTenant()
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Properties', path: '/properties', icon: Package },
    { name: 'Tenants', path: '/tenants', icon: Users },
    { name: 'Leases', path: '/leases', icon: FileText },
    { name: 'Rent Collection', path: '/rent-collection', icon: DollarSign },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Vendors', path: '/vendors', icon: Truck },
    { name: 'Inspections', path: '/inspections', icon: ClipboardCheck },
    { name: 'Accounting', path: '/accounting', icon: Calculator },
    { name: 'Website', path: '/website', icon: Globe },
    { name: 'Receipts', path: '/receipts', icon: Receipt },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  const getPageTitle = () => {
    const currentItem = navigationItems.find(item => 
      location.pathname === item.path || location.pathname.startsWith(item.path + '/')
    )
    return currentItem?.name || 'Dashboard'
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-4 py-6">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              {tenant?.name?.charAt(0) || 'R'}
            </span>
          </div>
          <span className="ml-2 text-lg font-semibold">{tenant?.name || 'Renter Insight'}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigationItems.map((item) => {
          const current = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
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
              onClick={() => setSidebarOpen(false)}
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
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign out
        </button>
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
                {tenant?.name?.charAt(0) || 'R'}
              </span>
            </div>
            <span className="ml-2 font-semibold">{tenant?.name || 'Renter Insight'}</span>
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