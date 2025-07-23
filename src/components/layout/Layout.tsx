import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Home, 
  Users, 
  Package, 
  FileText, 
  DollarSign, 
  Wrench, 
  Truck, 
  ClipboardCheck, 
  Percent, 
  Globe, 
  Receipt, 
  Settings, 
  BarChart3, 
  CreditCard,
  LogOut,
  Menu,
  User
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const { tenant } = useTenant()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'CRM & Sales', href: '/crm', icon: Users },
    { name: 'Inventory & Operations', href: '/inventory', icon: Package },
    { name: 'Finance & Agreements', href: '/finance', icon: DollarSign },
    { name: 'Service & Support', href: '/service', icon: Wrench },
    { name: 'Management', href: '/reports', icon: BarChart3 },
    { name: 'Administration', href: '/admin', icon: Settings },
  ]

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
        {navigation.map((item) => {
          const current = location.pathname === item.href || 
                         (item.href !== '/' && location.pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              to={item.href}
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
          Sign out
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        {/* Desktop sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow border-r bg-card">
            <SidebarContent />
          </div>
        </div>

        {/* Mobile sidebar */}
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
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
      </Sheet>
    </div>
  )
}