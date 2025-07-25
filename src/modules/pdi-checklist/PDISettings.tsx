import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Settings, Save, Shield, AlertTriangle } from 'lucide-react'
import { usePdiChecklists } from '@/hooks/usePdiSupabase'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { mockPDI } from '@/mocks/pdiMock'

export default function PDISettings() {
  const { user } = useAuth()
  const { tenant } = useTenant()
  const { toast } = useToast()
  const {
    pdiSettings,
    settingsLoading,
    supabaseStatus,
    loadPdiSettings,
    updatePdiSetting,
    getPdiSetting
  } = usePdiChecklists()

  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({})

  const companyId = user?.tenantId || tenant?.id || 'tenant-1'
  const isAdmin = user?.role === 'admin' || user?.role === 'manager'

  // Load settings on component mount
  useEffect(() => {
    loadPdiSettings(companyId)
  }, [companyId])

  // Initialize local settings when PDI settings load
  useEffect(() => {
    const initialSettings: Record<string, string> = {}
    Object.keys(mockPDI.settingDefinitions).forEach(key => {
      initialSettings[key] = getPdiSetting(companyId, key, getDefaultValue(key))
    })
    setLocalSettings(initialSettings)
  }, [pdiSettings, companyId])

  const getDefaultValue = (key: string): string => {
    const definition = mockPDI.settingDefinitions[key]
    if (!definition) return ''
    
    switch (key) {
      case 'default_inspection_status':
        return 'not_started'
      case 'allow_custom_steps':
      case 'auto_complete_on_all_pass':
        return 'true'
      case 'require_technician_signature':
        return 'false'
      default:
        return ''
    }
  }

  const handleSettingChange = (key: string, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
  }

  const handleSaveSettings = async () => {
    if (!isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'Only administrators can modify PDI settings',
        variant: 'destructive'
      })
      return
    }

    setSaving(true)
    try {
      // Save all changed settings
      for (const [key, value] of Object.entries(localSettings)) {
        const currentValue = getPdiSetting(companyId, key, getDefaultValue(key))
        if (value !== currentValue) {
          await updatePdiSetting(companyId, key, value)
        }
      }

      setHasChanges(false)
      toast({
        title: 'Settings Saved',
        description: 'PDI settings have been updated successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save PDI settings',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const renderSettingControl = (key: string) => {
    const definition = mockPDI.settingDefinitions[key]
    if (!definition) return null

    const value = localSettings[key] || getDefaultValue(key)

    switch (definition.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={key}
              checked={value === 'true'}
              onCheckedChange={(checked) => handleSettingChange(key, checked ? 'true' : 'false')}
              disabled={!isAdmin}
            />
            <Label htmlFor={key} className="font-normal">
              {definition.label}
            </Label>
          </div>
        )

      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={key}>{definition.label}</Label>
            <Select
              value={value}
              onValueChange={(newValue) => handleSettingChange(key, newValue)}
              disabled={!isAdmin}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {definition.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Access Control Alert */}
      {!isAdmin && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Read-Only Access:</strong> You can view PDI settings but only administrators can make changes.
          </AlertDescription>
        </Alert>
      )}

      {/* Supabase Status */}
      <Alert>
        <AlertDescription>
          {settingsLoading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Loading PDI settings...
            </span>
          ) : !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY ? (
            <span>
              ⚙️ <strong>Configuration Required:</strong> Supabase environment variables not set. 
              Displaying demo settings.
            </span>
          ) : supabaseStatus.settings.connected ? (
            <span>
              ✅ <strong>Live Data:</strong> Connected to Supabase successfully. 
              <code className="ml-2 text-xs">
                Settings: {supabaseStatus.settings.count}
              </code>
            </span>
          ) : (
            <span>
              📊 <strong>Demo Mode:</strong> Using fallback settings data. 
              <code className="ml-2 text-xs">
                Error: {supabaseStatus.settings.error || 'Connection issue'}
              </code>
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Settings Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Inspection Defaults */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Inspection Defaults
            </CardTitle>
            <CardDescription>
              Configure default settings for new PDI inspections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderSettingControl('default_inspection_status')}
            
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                {mockPDI.settingDefinitions['default_inspection_status']?.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Settings</CardTitle>
            <CardDescription>
              Configure inspection workflow behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {renderSettingControl('allow_custom_steps')}
              <p className="text-sm text-muted-foreground">
                {mockPDI.settingDefinitions['allow_custom_steps']?.description}
              </p>
            </div>

            <div className="space-y-4">
              {renderSettingControl('auto_complete_on_all_pass')}
              <p className="text-sm text-muted-foreground">
                {mockPDI.settingDefinitions['auto_complete_on_all_pass']?.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>Security & Compliance</CardTitle>
            <CardDescription>
              Configure security and compliance requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {renderSettingControl('require_technician_signature')}
              <p className="text-sm text-muted-foreground">
                {mockPDI.settingDefinitions['require_technician_signature']?.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Settings Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
            <CardDescription>
              Overview of your current PDI settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(mockPDI.settingDefinitions).map(([key, definition]) => {
                const value = localSettings[key] || getDefaultValue(key)
                const displayValue = definition.type === 'boolean' 
                  ? (value === 'true' ? 'Enabled' : 'Disabled')
                  : value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                
                return (
                  <div key={key} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <span className="text-sm font-medium">{definition.label}</span>
                    <Badge variant="outline">
                      {displayValue}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      {isAdmin && hasChanges && (
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Settings Help</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">Default Inspection Status</h4>
              <p>Sets the initial status for newly created PDI inspections. This helps standardize your workflow and ensures consistency across all inspections.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Allow Custom Steps</h4>
              <p>When enabled, technicians can add custom checklist steps during an inspection. This provides flexibility for unique situations while maintaining the standard checklist.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Auto-Complete on All Pass</h4>
              <p>Automatically marks an inspection as complete when all checklist items have a "Pass" status. This streamlines the workflow for successful inspections.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Require Technician Signature</h4>
              <p>When enabled, technicians must provide a digital signature before an inspection can be marked as complete. This ensures accountability and compliance.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}