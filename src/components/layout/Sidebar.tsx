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
  Handshake,
  Wrench,
  Truck,
  ClipboardCheck,
  Calculator,
  Receipt,
  Percent,
  Globe,
  Settings,
  Shield,
  BarChart3,
  X,
  ChevronDown
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavigationGroup {
  name: string
  items: NavigationItem[]
}

const navigationGroups: NavigationGroup[] = [
  {
    name: "Main",
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard }
    ]
  },
  {
    name: "CRM & Sales",
    items: [
      { name: 'CRM & Prospecting', href: '/crm', icon: Users },
      { name: 'Sales Deals', href: '/deals', icon: Handshake },
      { name: 'Quote Builder', href: '/quotes', icon: Calculator }
    ]
  },
  {
    name: "Inventory & Delivery",
    items: [
      { name: 'Inventory Management', href: '/inventory', icon: Package },
      { name: 'PDI Checklist', href: '/pdi', icon: ClipboardCheck },
      { name: 'Delivery Tracker', href: '/delivery', icon: Truck }
    ]
  },
  {
    name: "Service & Finance",
    items: [
      { name: 'Finance', href: '/finance', icon: DollarSign },
      { name: 'Invoice & Payments', href: '/invoices', icon: Receipt },
      { name: 'Commission Engine', href: '/commissions', icon: Percent },
      { name: 'Service Operations', href: '/service', icon: Wrench }
    ]
  },
  {
    name: "Agreements",
    items: [
      { name: 'Agreement Vault', href: '/agreements', icon: FileText }
    ]
  },
  {
    name: "Administration",
    items: [
      { name: 'Client Portal', href: '/portal', icon: Globe },
      { name: 'Company Settings', href: '/settings', icon: Settings },
      { name: 'Platform Admin', href: '/admin', icon: Shield },
      { name: 'Platform Settings', href: '/admin/settings', icon: Settings },
      { name: 'Reporting Suite', href: '/reports', icon: BarChart3 }
    ]
  }
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Main": true,
    "CRM & Sales": true,
    "Inventory & Delivery": false,
    "Service & Finance": false,
    "Agreements": false,
    "Administration": false
  })

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
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
        "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
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
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigationGroups.map((group) => (
              <div key={group.name} className="space-y-1">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.name)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <span>{group.name}</span>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      openGroups[group.name] ? "rotate-180" : ""
                    )}
                  />
                </button>

                {/* Group Items */}
                {openGroups[group.name] && (
                  <div className="ml-3 space-y-1">
                    {group.items.map((item) => {
                      const isActive = isActiveRoute(item.href)
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={handleItemClick}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary border-r-2 border-primary"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          )}
                        >
                          <item.icon className={cn(
                            "h-4 w-4",
                            isActive ? "text-primary" : "text-gray-400"
                          )} />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="text-xs text-gray-500">
            <p>© 2024 Renter Insight</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  )
}