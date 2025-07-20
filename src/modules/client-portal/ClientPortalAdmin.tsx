import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Globe, Plus, Search, Filter, Users, Eye, Settings, MessageSquare, Mail, Phone, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PortalAdminUserForm } from './components/PortalAdminUserForm'
import { PortalAdminUserList } from './components/PortalAdminUserList'
import { PortalAdminSettings } from './components/PortalAdminSettings'
import { ClientAgreements } from './components/ClientAgreements'
import { ClientAgreementSign } from './components/ClientAgreementSign'

function ClientPortalAdminDashboard() {
  const [activeTab, setActiveTab] = useState('users')
  const [showUserForm, setShowUserForm] = useState(false)
  
  const handleAddUser = () => {
    setShowUserForm(true)
  }
  
  const handleImpersonateUser = (userId: string, userName: string) => {
    // Open customer portal in a new tab with impersonation parameter
    const customerPortalUrl = `/portalclient?impersonateClientId=${userId}`
    window.open(customerPortalUrl, '_blank')
  }

  return (
    <div className="space-y-8">
      {/* User Form Modal */}
      {showUserForm && (
        <PortalAdminUserForm
          onSave={() => {
            setShowUserForm(false)
          }}
          onCancel={() => setShowUserForm(false)}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Client Portal Management</h1>
            <p className="ri-page-description">
              Manage customer portal access and self-service features
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleAddUser}>
            <Plus className="h-4 w-4 mr-2" />
            Add Portal User
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Portal Users</TabsTrigger>
          <TabsTrigger value="settings">Portal Settings</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <PortalAdminUserList onImpersonate={handleImpersonateUser} />
        </TabsContent>

        <TabsContent value="settings">
          <PortalAdminSettings />
        </TabsContent>

        <TabsContent value="activity">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Portal Activity</CardTitle>
              <CardDescription>
                Recent user activity in the customer portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Activity items would go here */}
                <div className="text-center py-12 text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No recent activity to display</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ClientPortalAdmin() {
  return (
    <Routes>
      <Route path="/" element={<ClientPortalAdminDashboard />} />
      <Route path="/agreements" element={<ClientAgreements />} />
      <Route path="/agreements/:agreementId/sign" element={<ClientAgreementSign />} />
      <Route path="/*" element={<ClientPortalAdminDashboard />} />
    </Routes>
  )
}