import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building, Users, Settings, Activity, Edit, Trash2, AlertCircle } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { mockPlatformAdmin } from '@/mocks/platformAdminMock'

interface TenantDetailProps {
  tenantId: string
  onClose: () => void
}

export function TenantDetail({ tenantId, onClose }: TenantDetailProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // Use mock tenant data as fallback - in real app, this would come from API
  const tenant = mockPlatformAdmin.sampleTenants.find(t => t.id === tenantId) || mockPlatformAdmin.sampleTenants[0]

  const handleSuspendTenant = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: 'Tenant Suspended',
        description: `${tenant.name} has been suspended successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to suspend tenant',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTenant = async () => {
    if (!confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: 'Tenant Deleted',
        description: `${tenant.name} has been deleted successfully.`,
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete tenant',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'suspended':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">{tenant.name}</h1>
            <Badge className={getStatusColor(tenant.status)}>
              {tenant.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground">{tenant.domain}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSuspendTenant}
            disabled={loading}
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Suspend
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDeleteTenant}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Basic Info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Basic Information</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Type:</span>
                    <span>{mockPlatformAdmin.platformTypes.find(pt => pt.value === tenant.platformType)?.label || tenant.platformType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{formatDate(new Date(tenant.createdAt))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Activity:</span>
                    <span>{formatDate(new Date(tenant.lastActivity))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Users:</span>
                    <span>{tenant.userCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usage Statistics</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Storage Used:</span>
                    <span>{tenant.storageUsed} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">API Calls (Monthly):</span>
                    <span>{tenant.monthlyApiCalls.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span>{tenant.subscription.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={tenant.subscription.status === 'Active' ? 'default' : 'secondary'}>
                      {tenant.subscription.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span>{formatCurrency(tenant.subscription.amount)}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Billing:</span>
                    <span>{formatDate(new Date(tenant.subscription.nextBilling))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage users for this tenant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>User management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timezone:</span>
                    <span>{tenant.settings.timezone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Currency:</span>
                    <span>{tenant.settings.currency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(tenant.settings.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center justify-between">
                      <span className="capitalize">{feature.charAt(0).toUpperCase() + feature.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                      <Badge variant={enabled ? 'default' : 'secondary'}>
                        {enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent tenant activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No recent activity</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}