import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Menu,
  LayoutDashboard,
  Users,
  Package,
  DollarSign,
  FileText,
  Wrench,
  Truck,
  CheckSquare,
  Percent,
  Globe,
  Receipt,
  BarChart2,
  Settings,
  Shield,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationItem {
  name: string
  path?: string
  icon: React.ComponentType<any>
  children?: Array<{
    name: string
    path: string
    icon: React.ComponentType<any>
  }>
}

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const { tenant } = useTenant()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  // Navigation structure with sub-menus
  const navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard
    },
    {
      name: 'CRM & Sales',
      icon: Users,
      children: [
        { name: 'Prospecting', path: '/crm', icon: Users },
        { name: 'Sales Deals', path: '/deals', icon: DollarSign },
        { name: 'Quotes', path: '/quotes', icon: FileText }
      ]
    },
    {
      name: 'Inventory & Operations',
      icon: Package,
      children: [
        { name: 'Inventory', path: '/inventory', icon: Package },
        { name: 'PDI Checklist', path: '/pdi', icon: CheckSquare },
        { name: 'Delivery', path: '/delivery', icon: Truck }
      ]
    },
    {
      name: 'Finance & Agreements',
      icon: DollarSign,
      children: [
        { name: 'Finance', path: '/finance', icon: DollarSign },
        { name: 'Agreements', path: '/agreements', icon: FileText },
        { name: 'Applications', path: '/client-applications', icon: FileText },
        { name: 'Invoices', path: '/invoices', icon: Receipt }
      ]
    },
    {
      name: 'Service & Support',
      icon: Wrench,
      children: [
        { name: 'Service Ops', path: '/service', icon: Wrench },
        { name: 'Client Portal', path: '/portal', icon: Globe }
      ]
    },
    {
      name: 'Management',
      icon: BarChart2,
      children: [
        { name: 'Reports', path: '/reports', icon: BarChart2 },
        { name: 'Commissions', path: '/commissions', icon: Percent }
      ]
    },
    {
      name: 'Administration',
      icon: Settings,
      children: [
        { name: 'Company Settings', path: '/settings', icon: Settings },
        { name: 'Platform Admin', path: '/admin', icon: Shield }
      ]
    }
  ]

  // Auto-expand menu containing current page
  useEffect(() => {
    const currentPath = location.pathname
    const parentMenu = navigationItems.find(item => 
      item.children?.some(child => currentPath.startsWith(child.path))
    )
    
    if (parentMenu && !expandedMenus.includes(parentMenu.name)) {
      setExpandedMenus(prev => [...prev, parentMenu.name])
    }
  }, [location.pathname])

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    )
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const SidebarContent = () => {
    return (
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-4 py-6">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                {tenant?.name?.charAt(0) || 'R'}
              </span>
            </div>
            <span className="ml-2 text-lg font-semibold">
              {tenant?.name || 'Renter Insight'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navigationItems.map((item) => {
            if (item.children) {
              // Parent menu with children
              const isExpanded = expandedMenus.includes(item.name)
              const hasActiveChild = item.children.some(child => isActive(child.path))
              
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cn(
                      "w-full group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      hasActiveChild
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={cn(
                          "mr-3 flex-shrink-0 h-5 w-5",
                          hasActiveChild ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                      {item.name}
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded ? 'transform rotate-180' : '',
                        hasActiveChild ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  </button>
                  
                  {/* Sub-menu items */}
                  {isExpanded && (
                    <div className="mt-1 space-y-1">
                      {item.children.map((child) => {
                        const childActive = isActive(child.path)
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "group flex items-center pl-11 pr-2 py-2 text-sm font-medium rounded-md transition-colors",
                              childActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                          >
                            <child.icon
                              className={cn(
                                "mr-3 flex-shrink-0 h-4 w-4",
                                childActive ? 'text-primary-foreground' : 'text-muted-foreground'
                              )}
                            />
                            {child.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            } else {
              // Single menu item
              const active = isActive(item.path!)
              return (
                <Link
                  key={item.path}
                  to={item.path!}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      active ? 'text-primary-foreground' : 'text-muted-foreground'
                    )}
                  />
                  {item.name}
                </Link>
              )
            }
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
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
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
            <span className="ml-2 font-semibold">
              {tenant?.name || 'Renter Insight'}
            </span>
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