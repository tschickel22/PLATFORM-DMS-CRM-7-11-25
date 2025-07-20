import React from 'react'
import { Button } from '@/components/ui/button'
import { Bell, Search, User, LogOut } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { tenant } = useTenant()

  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Company Name */}
        <div className="flex items-center space-x-3">
          {tenant?.branding?.logo && (
            <img 
              src={tenant.branding.logo} 
              alt={`${tenant.name} Logo`}
              className="h-8 w-auto object-contain"
            />
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {tenant?.name || 'Renter Insight CRM/DMS'}
            </h1>
            <p className="text-sm text-gray-500">
              {tenant?.domain || 'CRM/DMS'}
            </p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side - Notifications and User Menu */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}