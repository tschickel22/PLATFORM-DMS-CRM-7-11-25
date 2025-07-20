import React, { useState } from 'react'
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
import { useTenant } from '@/contexts/TenantContext'

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

interface SidebarProps {
  sideMenuColor?: string | null
}

export default function Sidebar({ sideMenuColor }: SidebarProps) {
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
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {navigationItems.map((item) => (
                {/* Sub-navigation */}
                {item.children && isActive(item.href) && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                          isActive(child.href)
                            ? "bg-slate-700 text-white"
                            : "text-slate-400 hover:bg-slate-700 hover:text-white"
                        )}
                      >
                        <child.icon className="mr-3 h-4 w-4" />
                        {child.name}
                      </Link>
                    ))}
                  </div>
      {/* Footer */}
      <div className="border-t border-slate-700 p-4">
        <div className="text-xs text-slate-400">
          <p>Version 1.0.0</p>
        </div>
        </div>
    </>
      </nav>
}