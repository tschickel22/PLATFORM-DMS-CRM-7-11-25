@@ .. @@
 import React, { useState } from 'react'
 import { Routes, Route } from 'react-router-dom'
+import { PortalProvider, usePortal } from '@/contexts/PortalContext'
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
 import { Button } from '@/components/ui/button'
 import { Badge } from '@/components/ui/badge'
@@ .. @@
 import { PortalApplicationView } from '@/modules/finance-application/components/PortalApplicationView'
 import { ClientLoansView } from './components/ClientLoansView'
+import { ClientAgreements } from './components/ClientAgreements'

 // Mock components for routes that aren't implemented yet
@@ .. @@
   )
 }

-function ClientAgreements() {
-  return (
-    <div className="space-y-6">
-      <div>
-        <h1 className="text-2xl font-bold">Agreements</h1>
-        <p className="text-muted-foreground">View and manage your agreements</p>
-      </div>
-      <Card>
-        <CardContent className="pt-6">
-          <div className="text-center py-12 text-muted-foreground">
-            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
-            <p>Agreement management coming soon</p>
-          </div>
-        </CardContent>
-      </Card>
-    </div>
-  )
-}
-
-export default function ClientPortal() {
+function ClientPortalContent() {
   const { tenant } = useTenant()
   const { user, logout } = useAuth()
+  const { getDisplayName, getDisplayEmail, isProxying, proxiedClient } = usePortal()
   const [sidebarOpen, setSidebarOpen] = useState(false)

@@ .. @@
             {/* User section */}
             <div className="border-t p-4">
+              {/* Proxy indicator */}
+              {isProxying && proxiedClient && (
+                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
+                  <p className="text-xs text-blue-700 font-medium">
+                    Viewing as: {proxiedClient.name}
+                  </p>
+                </div>
+              )}
+              
               <div className="flex items-center space-x-3 mb-3">
                 <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                   <User className="h-4 w-4" />
                 </div>
                 <div className="flex-1 min-w-0">
-                  <p className="text-sm font-medium truncate">{user?.name}</p>
-                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
+                  <p className="text-sm font-medium truncate">{getDisplayName()}</p>
+                  <p className="text-xs text-muted-foreground truncate">{getDisplayEmail()}</p>
                 </div>
               </div>
               <Button
@@ .. @@
                 <div className="space-y-6">
                   {/* Welcome Section */}
                   <div className="space-y-2">
-                    <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
+                    <h1 className="text-2xl font-bold">Welcome back, {getDisplayName().split(' ')[0]}!</h1>
                     <p className="text-muted-foreground">
                       Here's what's happening with your account
                     </p>
+                    {isProxying && proxiedClient && (
+                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
+                        <p className="text-sm text-blue-700">
+                          <strong>Admin View:</strong> You are viewing the portal as {proxiedClient.name}
+                        </p>
+                      </div>
+                    )}
                   </div>

                   {/* Quick Stats */}
+                  {/* TODO: Update these stats to fetch dynamic data based on the proxied client ID for full implementation */}
                   <div className="grid gap-4 md:grid-cols-3">
@@ .. @@
                   {/* Recent Activity */}
+                  {/* TODO: Update this section to fetch dynamic data based on the proxied client ID for full implementation */}
                   <Card>
@@ .. @@
     </div>
   )
 }
+
+export default function ClientPortal() {
+  const { user } = useAuth()
+  
+  return (
+    <PortalProvider fallbackUser={{ name: user?.name || '', email: user?.email || '' }}>
+      <ClientPortalContent />
+    </PortalProvider>
+  )
+}