import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTenant } from '@/contexts/TenantContext'

// Placeholder component for Phase 1
function ClientPortalPlaceholder() {
  const { tenant } = useTenant()
  
  const portalName = tenant?.branding?.portalName || 'Customer Portal'
  const portalLogo = tenant?.branding?.portalLogo || tenant?.branding?.logo
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            {portalLogo && (
              <div className="flex justify-center mb-4">
                <img 
                  src={portalLogo} 
                  alt="Portal Logo" 
                  className="h-16 w-auto object-contain"
                />
              </div>
            )}
            <CardTitle className="text-2xl">{portalName}</CardTitle>
            <CardDescription>
              Welcome to your customer portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Phase 1 Complete: Foundation Setup
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Portal Branding</h3>
                  <p className="text-sm text-muted-foreground">
                    Portal Name: {portalName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Logo: {portalLogo ? 'Configured' : 'Using default'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">
                    Agreements, Applications, and more...
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ClientPortal() {
  return (
    <Routes>
      <Route path="/" element={<ClientPortalPlaceholder />} />
      <Route path="/*" element={<ClientPortalPlaceholder />} />
    </Routes>
  )
}