import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  Users, 
  Package, 
  FileText, 
  DollarSign, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  BarChart3,
  Wrench,
  Truck,
  ClipboardCheck,
  Percent,
  Globe,
  FileCheck,
  Receipt,
  Building,
  Shield
} from 'lucide-react'

const navigationItems = [
  {
    id: 'crm-sales',
    title: 'CRM & Sales',
    icon: Users,
    hasSubmenu: true,
    items: [
      { title: 'Prospecting', href: '/crm', icon: Users },
      { title: 'Sales Deals', href: '/deals', icon: FileText },
      { title: 'Quote Builder', href: '/quotes', icon: FileText }
    ]
  },
  {
    id: 'inventory-operations',
    title: 'Inventory & Operations',
    icon: Package,
    hasSubmenu: true,
    items: [
      { title: 'Inventory', href: '/inventory', icon: Package },
      { title: 'PDI Checklist', href: '/pdi', icon: ClipboardCheck },
      { title: 'Delivery Tracker', href: '/delivery', icon: Truck }
    ]
  },
  {
    id: 'finance-agreements',
    title: 'Finance & Agreements',
    icon: DollarSign,
    hasSubmenu: true,
    items: [
      { title: 'Finance', href: '/finance', icon: DollarSign },
      { title: 'Client Applications', href: '/client-applications', icon: FileCheck },
      { title: 'Agreements', href: '/agreements', icon: FileCheck },
      { title: 'Invoices', href: '/invoices', icon: Receipt }
    ]
  },
  {
    id: 'service-support',
    title: 'Service & Support',
    icon: Wrench,
    hasSubmenu: true,
    items: [
      { title: 'Service Ops', href: '/service', icon: Wrench },
      { title: 'Client Portal', href: '/portal', icon: Globe }
    ]
  },
  {
    id: 'management',
    title: 'Management',
    icon: BarChart3,
    hasSubmenu: true,
    items: [
      { title: 'Commission Engine', href: '/commissions', icon: Percent },
      { title: 'Reporting Suite', href: '/reports', icon: BarChart3 }
    ]
  },
  {
    id: 'administration',
    title: 'Administration',
    icon: Settings,
    hasSubmenu: true,
    items: [
      { title: 'Company Settings', href: '/settings', icon: Building },
      { title: 'Platform Admin', href: '/admin', icon: Shield }
    ]
  }
]

export default function Sidebar() {
  const location = useLocation()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (sectionId: string) => {
    // If the clicked section is already expanded, collapse it
    // Otherwise, expand the clicked section (this automatically collapses any other expanded section)
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center justify-center border-b border-slate-700 px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
            <Building className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold">Renter Insight</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {/* Dashboard - Always visible */}
        <Link
          to="/"
          className={cn(
            'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
            isActive('/') && location.pathname === '/'
              ? 'bg-slate-800 text-white'
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
          )}
        >
          <BarChart3 className="mr-3 h-5 w-5" />
          Dashboard
        </Link>

        {/* Navigation Items with Accordion Behavior */}
        {navigationItems.map((item) => (
          <div key={item.id}>
            {/* Main Section Header */}
            <button
              onClick={() => toggleSection(item.id)}
              className={cn(
                'group flex w-full items-center justify-between px-2 py-2 text-left text-sm font-medium rounded-md transition-colors',
                expandedSection === item.id
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              )}
            >
              <div className="flex items-center">
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </div>
              {item.hasSubmenu && (
                expandedSection === item.id ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              )}
            </button>

            {/* Submenu Items - Only show if this section is expanded */}
            {item.hasSubmenu && expandedSection === item.id && (
              <div className="ml-4 mt-1 space-y-1">
                {item.items?.map((subItem) => (
                  <Link
                    key={subItem.href}
                    to={subItem.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm rounded-md transition-colors',
                      isActive(subItem.href)
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                    )}
                  >
                    <subItem.icon className="mr-3 h-4 w-4" />
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4">
        <div className="text-xs text-slate-400">
          <div>CRM/DMS</div>
          <div>Version 1.0.0</div>
        </div>
      </div>
    </div>
  )
}