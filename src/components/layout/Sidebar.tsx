import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  DollarSign, 
  Settings, 
  Wrench, 
  Truck, 
  ClipboardCheck, 
  CreditCard, 
  UserCheck, 
  Building, 
  Shield, 
  BarChart3, 
  X,
  ChevronRight
} from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavigationGroup {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  items?: NavigationItem[]
}

const navigation: NavigationGroup[] = [
  {
    name: 'Main',
    href: '/',
    icon: LayoutDashboard,
    items: []
  },
  {
    name: 'CRM & Sales',
    href: '/crm',
    icon: Users,
    items: [
      { name: 'CRM & Prospecting', href: '/crm', icon: Users },
      { name: 'Sales Deals', href: '/deals', icon: FileText },
      { name: 'Quote Builder', href: '/quotes', icon: FileText }
    ]
  },
  {
    name: 'Inventory & Delivery',
    href: '/inventory',
    icon: Package,
    items: [
      { name: 'Inventory Management', href: '/inventory', icon: Package },
      { name: 'PDI Checklist', href: '/pdi', icon: ClipboardCheck },
      { name: 'Delivery Tracker', href: '/delivery', icon: Truck }
    ]
  },
  {
    name: 'Service & Finance',
    href: '/finance',
    icon: DollarSign,
    items: [
      { name: 'Finance', href: '/finance', icon: DollarSign },
      { name: 'Invoice & Payments', href: '/invoices', icon: CreditCard },
      { name: 'Commission Engine', href: '/commissions', icon: DollarSign },
      { name: 'Service Operations', href: '/service', icon: Wrench }
    ]
  },
  {
    name: 'Agreements',
    href: '/agreements',
    icon: FileText,
    items: []
  },
  {
    name: 'Administration',
    href: '/settings',
    icon: Settings,
    items: [
      { name: 'Client Portal', href: '/portal', icon: UserCheck },
      { name: 'Company Settings', href: '/settings', icon: Building },
      { name: 'Platform Admin', href: '/admin', icon: Shield },
      { name: 'Platform Settings', href: '/admin/settings', icon: Settings },
      { name: 'Reporting Suite', href: '/reports', icon: BarChart3 }
    ]
  }
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  // Initialize open groups based on current route
  useEffect(() => {
    const currentPath = location.pathname
    const initialOpenGroups: Record<string, boolean> = {}
    
    navigation.forEach(group => {
      // Check if current path matches group or any of its items
      const isGroupActive = currentPath === group.href || 
        group.items?.some(item => currentPath.startsWith(item.href)) || false
      
      initialOpenGroups[group.name] = isGroupActive
    })
    
    setOpenGroups(initialOpenGroups)
  }, [location.pathname])

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RI</span>
              </div>
              <span className="font-semibold text-lg">Renter Insight</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navigation.map((group) => (
              <div key={group.name}>
                {/* Group Header */}
                <div className="flex items-center">
                  <Link
                    to={group.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose()
                      }
                    }}
                    className={cn(
                      "flex items-center flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActiveLink(group.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <group.icon className="mr-3 h-4 w-4" />
                    {group.name}
                  </Link>
                  
                  {/* Toggle arrow for groups with items */}
                  {group.items && group.items.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleGroup(group.name)}
                      className="p-1 h-8 w-8"
                    >
                      <ChevronRight 
                        className={cn(
                          "h-3 w-3 transition-transform",
                          openGroups[group.name] ? "rotate-90" : ""
                        )} 
                      />
                    </Button>
                  )}
                </div>

                {/* Submenu Items */}
                {group.items && group.items.length > 0 && openGroups[group.name] && (
                  <div className="mt-1 space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            onClose()
                          }
                        }}
                        className={cn(
                          "flex items-center pl-6 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          isActiveLink(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}