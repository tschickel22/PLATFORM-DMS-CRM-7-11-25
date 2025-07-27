import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Save, RefreshCw, Settings, Palette, Bell, Plug } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/components/ui/use-toast'
import BrandingSettings from './components/BrandingSettings'
import LabelOverrides from './components/LabelOverrides'
import NotificationTemplates from './components/NotificationTemplates'
import IntegrationSettings from './components/IntegrationSettings'

function CompanySettings() {
  const { tenant, loading, error, supabaseStatus, updateTenant, refetchTenant } = useTenant()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)

  // Form state for general settings
  const [formData, setFormData] = useState({
    name: tenant?.name || '',
    domain: tenant?.domain || '',
    timezone: tenant?.settings?.timezone || 'UTC',
    currency: tenant?.settings?.currency || 'USD',
    dateFormat: tenant?.settings?.dateFormat || 'MM/DD/YYYY',
    timeFormat: tenant?.settings?.timeFormat || '12h'
  })

  React.useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || '',
        domain: tenant.domain || '',
        timezone: tenant.settings?.timezone || 'UTC',
        currency: tenant.settings?.currency || 'USD',
        dateFormat: tenant.settings?.dateFormat || 'MM/DD/YYYY',
        timeFormat: tenant.settings?.timeFormat || '12h'
      })
    }
  }, [tenant])

  const handleSaveGeneral = async () => {
    setSaving(true)
    try {
      await updateTenant({
        name: formData.name,
        domain: formData.domain,
        settings: {
          ...tenant?.settings,
          timezone: formData.timezone,
          currency: formData.currency,
          dateFormat: formData.dateFormat,
          timeFormat: formData.timeFormat
        }
      })
      
      toast({
        title: "Settings saved",
        description: "Company settings have been updated successfully.",
      })
    } catch (err: any) {
      console.error('❌ [CompanySettings] Error saving general settings:', err)
      toast({
        title: "Error saving settings",
        description: err.message || "Failed to save company settings.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-3 text-muted-foreground">Loading company settings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>Failed to load company settings.</p>
        <p>{error.message}</p>
        <Button onClick={refetchTenant} className="mt-2">
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Supabase Status Banner */}
      <Alert>
        <AlertDescription>
          {tenant?.source === 'fallback' ? (
            <span>
              📊 <strong>Demo Mode:</strong> Using fallback data. {supabaseStatus.error && `Error: ${supabaseStatus.error}`}
            </span>
          ) : (
            <span>
              ✅ <strong>Live Data:</strong> Connected to Supabase successfully. Company: {tenant?.name}
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Company Settings</h1>
            <p className="ri-page-description">
              Manage your company information, branding, and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="labels" className="flex items-center gap-2">
            Label Overrides
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Basic information about your company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    value={formData.domain}
                    onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                    placeholder="company.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>
                Configure timezone, currency, and date formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={formData.timezone}
                    onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                    placeholder="UTC"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    placeholder="USD"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Input
                    id="dateFormat"
                    value={formData.dateFormat}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateFormat: e.target.value }))}
                    placeholder="MM/DD/YYYY"
                  />
                </div>
                <div>
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Input
                    id="timeFormat"
                    value={formData.timeFormat}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeFormat: e.target.value }))}
                    placeholder="12h"
                  />
                </div>
              </div>
              <Button onClick={handleSaveGeneral} disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save General Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <BrandingSettings />
        </TabsContent>

        <TabsContent value="labels">
          <LabelOverrides />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationTemplates />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CompanySettings