import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  DollarSign, 
  Wrench, 
  Truck, 
  ClipboardCheck, 
  Receipt, 
  Percent, 
  FileSignature, 
  Globe, 
  Settings, 
  Shield, 
  BarChart3,
  ChevronRight,
  X
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
    icon: LayoutDashboard
  },
  {
    name: 'CRM & Sales',
    href: '/deals',
    icon: Users,
    items: [
      { name: 'Sales Deals', href: '/deals', icon: Users },
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
      { name: 'Invoice & Payments', href: '/invoices', icon: Receipt },
      { name: 'Commission Engine', href: '/commissions', icon: Percent },
      { name: 'Service Operations', href: '/service', icon: Wrench }
    ]
  },
  {
    name: 'Agreements',
    href: '/agreements',
    icon: FileSignature
  },
  {
    name: 'Administration',
    href: '/portal',
    icon: Settings,
    items: [
      { name: 'Client Portal', href: '/portal', icon: Globe },
      { name: 'Company Settings', href: '/settings', icon: Settings },
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

  // Auto-expand the group that contains the current route
  useEffect(() => {
    const currentPath = location.pathname
    const newOpenGroups: Record<string, boolean> = {}
    
    navigation.forEach(group => {
      if (group.items) {
        const hasActiveItem = group.items.some(item => 
          currentPath.startsWith(item.href) && item.href !== '/'
        ) || (currentPath === '/' && group.href === '/')
        
        if (hasActiveItem) {
          newOpenGroups[group.name] = true
        }
      }
    })
    
    setOpenGroups(newOpenGroups)
  }, [location.pathname])

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }

  const handleLinkClick = () => {
    // Close sidebar on mobile after clicking any link
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RI</span>
            </div>
            <span className="font-semibold text-gray-900">Renter Insight</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((group) => (
            <div key={group.name} className="mb-2">
              {/* Group Header */}
              <div className="flex items-center">
                <Link
                  to={group.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActiveRoute(group.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <group.icon className="mr-3 h-5 w-5" />
                  {group.name}
                </Link>
                
                {/* Toggle button - only show if group has submenu items */}
                {group.items && (
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className="p-1 rounded-md hover:bg-gray-100 ml-1"
                  >
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openGroups[group.name] ? "rotate-90" : ""
                      )}
                    />
                  </button>
                )}
              </div>

              {/* Submenu items */}
              {group.items && openGroups[group.name] && (
                <div className="mt-1 space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center pl-6 pr-3 py-2 text-sm rounded-md transition-colors",
                        isActiveRoute(item.href)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
    </>
  )
}