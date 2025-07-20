import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { isColorLight } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  Users,
  Package,
  FileText,
  DollarSign,
  Settings,
  Building,
  Wrench,
  Truck,
  ClipboardCheck,
  Percent,
  Globe,
  Receipt,
  BarChart3,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'CRM Prospecting', href: '/crm', icon: Users },
  { name: 'Inventory Management', href: '/inventory', icon: Package },
  { name: 'CRM Sales Deal', href: '/deals', icon: DollarSign },
  { name: 'Finance', href: '/finance', icon: CreditCard },
  { name: 'Quote Builder', href: '/quotes', icon: FileText },
  { name: 'Agreement Vault', href: '/agreements', icon: FileText },
  { name: 'Service Ops', href: '/service', icon: Wrench },
  { name: 'PDI Checklist', href: '/pdi', icon: ClipboardCheck },
  { name: 'Delivery Tracker', href: '/delivery', icon: Truck },
  { name: 'Commission Engine', href: '/commissions', icon: Percent },
  { name: 'Client Portal', href: '/portal', icon: Globe },
  { name: 'Invoice & Payments', href: '/invoices', icon: Receipt },
  { name: 'Client Applications', href: '/client-applications', icon: CreditCard },
  { name: 'Reporting Suite', href: '/reports', icon: BarChart3 },
]

const adminNavigation = [
  { name: 'Company Settings', href: '/settings', icon: Settings },
  { name: 'Platform Admin', href: '/admin', icon: Building },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { tenant } = useTenant()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  // Get the side menu color from tenant branding
  const sideMenuColor = tenant?.branding?.sideMenuColor
  const useDefaultColor = !sideMenuColor
  
  // Determine text color based on background
  const textColor = useDefaultColor 
    ? 'text-foreground' 
    : sideMenuColor && isColorLight(sideMenuColor)
      ? 'text-gray-900'
      : 'text-white'

  const sidebarStyle = useDefaultColor 
    ? {} 
    : { backgroundColor: sideMenuColor }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-4 py-4 border-b" style={sidebarStyle}>
        {tenant?.branding?.logo ? (
          <img 
            src={tenant.branding.logo} 
            alt={tenant.name || 'Company Logo'} 
            className="h-10 max-w-full object-contain"
          />
        ) : (
          <>
            <Building className={`h-8 w-8 ${textColor}`} />
            <span className={`ml-2 text-xl font-bold ${textColor}`}>
              Renter Insight
            </span>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto" style={sidebarStyle}>
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                active
                  ? useDefaultColor
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white/20 text-white'
                  : useDefaultColor
                    ? 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    : `${textColor} hover:bg-white/10`
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          )
        })}

        {/* Admin Section */}
        <div className="pt-4">
          <button
            onClick={() => toggleSection('admin')}
            className={cn(
              'group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors',
              useDefaultColor
                ? 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                : `${textColor} hover:bg-white/10`
            )}
          >
            {expandedSections.admin ? (
              <ChevronDown className="mr-3 h-5 w-5 flex-shrink-0" />
            ) : (
              <ChevronRight className="mr-3 h-5 w-5 flex-shrink-0" />
            )}
            Administration
          </button>
          
          {expandedSections.admin && (
            <div className="ml-6 space-y-1">
              {adminNavigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                      active
                        ? useDefaultColor
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/20 text-white'
                        : useDefaultColor
                          ? 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          : `${textColor} hover:bg-white/10`
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>

      {/* User Info */}
      <div className="border-t p-4" style={sidebarStyle}>
        <div className="flex items-center">
          <div className={`flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center ${textColor}`}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${textColor}`}>
              {user?.name || 'User'}
            </p>
            <p className={`text-xs truncate ${useDefaultColor ? 'text-muted-foreground' : 'text-white/70'}`}>
              {user?.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className={useDefaultColor ? '' : 'text-white hover:bg-white/10'}
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-background border-r shadow-lg">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-background border-r">
        <SidebarContent />
      </div>
    </>
  )
}