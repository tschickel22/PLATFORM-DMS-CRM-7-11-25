import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  BarChart3, 
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
  Settings, 
  Shield,
  TrendingUp,
  Building
} from 'lucide-react'

interface SidebarProps {
  sideMenuColor?: string | null
}

export default function Sidebar({ sideMenuColor }: SidebarProps) {
  const location = useLocation()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: BarChart3,
      current: location.pathname === '/'
    },
    {
      name: 'CRM & Sales',
      icon: Users,
      current: location.pathname.startsWith('/crm') || location.pathname.startsWith('/deals'),
      children: [
        { name: 'Prospecting', href: '/crm', current: location.pathname.startsWith('/crm') },
        { name: 'Sales Deals', href: '/deals', current: location.pathname.startsWith('/deals') }
      ]
    },
    {
      name: 'Inventory & Operations',
      icon: Package,
      current: location.pathname.startsWith('/inventory') || 
               location.pathname.startsWith('/pdi') || 
               location.pathname.startsWith('/delivery'),
      children: [
        { name: 'Inventory', href: '/inventory', current: location.pathname.startsWith('/inventory') },
        { name: 'PDI Checklist', href: '/pdi', current: location.pathname.startsWith('/pdi') },
        { name: 'Delivery Tracker', href: '/delivery', current: location.pathname.startsWith('/delivery') }
      ]
    },
    {
      name: 'Finance & Agreements',
      icon: DollarSign,
      current: location.pathname.startsWith('/finance') || 
               location.pathname.startsWith('/quotes') || 
               location.pathname.startsWith('/agreements') ||
               location.pathname.startsWith('/client-applications'),
      children: [
        { name: 'Finance', href: '/finance', current: location.pathname.startsWith('/finance') },
        { name: 'Quote Builder', href: '/quotes', current: location.pathname.startsWith('/quotes') },
        { name: 'Agreement Vault', href: '/agreements', current: location.pathname.startsWith('/agreements') },
        { name: 'Client Applications', href: '/client-applications', current: location.pathname.startsWith('/client-applications') }
      ]
    },
    {
      name: 'Service & Support',
      icon: Wrench,
      current: location.pathname.startsWith('/service') || location.pathname.startsWith('/portal'),
      children: [
        { name: 'Service Ops', href: '/service', current: location.pathname.startsWith('/service') },
        { name: 'Client Portal', href: '/portal', current: location.pathname.startsWith('/portal') }
      ]
    },
    {
      name: 'Management',
      icon: TrendingUp,
      current: location.pathname.startsWith('/commissions') || 
               location.pathname.startsWith('/invoices') || 
               location.pathname.startsWith('/reports'),
      children: [
        { name: 'Commission Engine', href: '/commissions', current: location.pathname.startsWith('/commissions') },
        { name: 'Invoice & Payments', href: '/invoices', current: location.pathname.startsWith('/invoices') },
        { name: 'Reporting Suite', href: '/reports', current: location.pathname.startsWith('/reports') }
      ]
    },
    {
      name: 'Administration',
      icon: Settings,
      current: location.pathname.startsWith('/settings') || location.pathname.startsWith('/admin'),
      children: [
        { name: 'Company Settings', href: '/settings', current: location.pathname.startsWith('/settings') },
        { name: 'Platform Admin', href: '/admin', current: location.pathname.startsWith('/admin') }
      ]
    }
  ]

  // Determine the background color
  const backgroundColor = sideMenuColor || '#1e293b'

  return (
    <div 
      className="w-64 flex flex-col"
      style={{ backgroundColor }}
    >
      {/* Logo/Brand */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Building className="h-8 w-8 text-white" />
          <span className="text-white font-bold text-lg">Renter Insight</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div className="space-y-1">
                <div className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-md">
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
                <div className="ml-6 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.href}
                      className={cn(
                        'block px-3 py-2 text-sm rounded-md transition-colors',
                        child.current
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  item.current
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4">
        <div className="text-xs text-slate-400 text-center">
          <div>CRM/DMS</div>
          <div>Version 1.0.0</div>
        </div>
      </div>
    </div>
  )
}