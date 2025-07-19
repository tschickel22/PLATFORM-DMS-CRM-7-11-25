import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  DollarSign, 
  Wrench, 
  Truck, 
  CheckSquare, 
  Calculator, 
  Globe, 
  Receipt, 
  Settings, 
  Shield, 
  BarChart3,
  ChevronDown,
  ChevronRight,
  X,
  Building
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface MenuGroup {
  name: string
  icon: React.ComponentType<{ className?: string }>
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    name: 'CRM & Sales',
    icon: Users,
    items: [
      { name: 'Prospecting', href: '/crm', icon: Users },
      { name: 'Sales Deals', href: '/deals', icon: FileText },
      { name: 'Quote Builder', href: '/quotes', icon: Calculator },
    ]
  },
  {
    name: 'Inventory & Operations',
    icon: Package,
    items: [
      { name: 'Inventory', href: '/inventory', icon: Package },
      { name: 'PDI Checklist', href: '/pdi', icon: CheckSquare },
      { name: 'Delivery Tracker', href: '/delivery', icon: Truck },
    ]
  },
  {
    name: 'Finance & Agreements',
    icon: DollarSign,
    items: [
      { name: 'Finance', href: '/finance', icon: DollarSign },
      { name: 'Agreements', href: '/agreements', icon: FileText },
      { name: 'Invoices', href: '/invoices', icon: Receipt },
    ]
  },
  {
    name: 'Service & Support',
    icon: Wrench,
    items: [
      { name: 'Service Ops', href: '/service', icon: Wrench },
      { name: 'Client Portal', href: '/portal', icon: Globe },
    ]
  },
  {
    name: 'Management',
    icon: BarChart3,
    items: [
      { name: 'Commissions', href: '/commissions', icon: Calculator },
      { name: 'Reports', href: '/reports', icon: BarChart3 },
    ]
  },
  {
    name: 'Administration',
    icon: Settings,
    items: [
      { name: 'Company Settings', href: '/settings', icon: Building },
      { name: 'Platform Admin', href: '/admin', icon: Shield },
    ]
  }
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['CRM & Sales'])

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    )
  }

  const isGroupExpanded = (groupName: string) => expandedGroups.includes(groupName)

  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  const handleItemClick = () => {
    // Close sidebar on mobile when item is clicked
    if (window.innerWidth < 768) {
      onClose()
    }
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
        "fixed top-0 left-0 z-50 h-full w-64 bg-background border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header - Fixed at top */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Renter Insight</h1>
              <p className="text-xs text-muted-foreground">CRM/DMS</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation - Scrollable content */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Dashboard - Always visible */}
          <Link
            to="/"
            onClick={handleItemClick}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActiveRoute('/') && location.pathname === '/'
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>

          {/* Grouped Menu Items */}
          {menuGroups.map((group) => (
            <div key={group.name} className="space-y-1">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.name)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <group.icon className="h-4 w-4" />
                  <span>{group.name}</span>
                </div>
                {isGroupExpanded(group.name) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Group Items */}
              {isGroupExpanded(group.name) && (
                <div className="ml-4 space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={handleItemClick}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isActiveRoute(item.href)
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-background">
          <div className="text-xs text-muted-foreground text-center">
            <p>© 2025 Renter Insight</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  )
}