import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Save, Settings as SettingsIcon } from 'lucide-react'
import { usePdiSupabase } from '@/hooks/usePdiSupabase'
import { useToast } from '@/hooks/use-toast'
import { mockPDI } from '@/mocks/pdiMock'

export default function PDISettings() {
  const { toast } = useToast()
  const {
    pdiSettings,
    loading,
    usingFallback,
    supabaseStatus,
    createPdiSetting,
    updatePdiSetting,
    deletePdiSetting,
    getSettingByKey
  } = usePdiSupabase()

  const [localSettings, setLocalSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  // Initialize local settings from Supabase data
  React.useEffect(() => {
    const settingsMap: Record<string, string> = {}
    if (Array.isArray(pdiSettings)) {
      pdiSettings.forEach(setting => {
        if (setting && setting.key) {
          settingsMap[setting.key] = setting.value || ''
        }
      })
    }
    setLocalSettings(settingsMap)
  }, [pdiSettings])

  const handleSettingChange = (key: string, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // Save each setting
      for (const [key, value] of Object.entries(localSettings)) {
        const existingSetting = getSettingByKey(key)
        
        if (existingSetting) {
          await updatePdiSetting(existingSetting.id, { value })
        } else {
          await createPdiSetting({ key, value })
        }
      }
      
      toast({
        title: 'Settings Saved',
        description: 'PDI settings have been updated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save PDI settings.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const getSettingValue = (key: string, defaultValue: string = '') => {
    return localSettings[key] || defaultValue
  }

  const settingDefinitions = mockPDI.settingDefinitions || {}

  return (
    <div className="space-y-6">
      {/* Supabase Status Banner */}
      <Alert>
        <AlertDescription>
          {loading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Connecting to Supabase PDI settings...
            </span>
          ) : !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY ? (
            <span>
              ⚙️ <strong>Configuration Required:</strong> Supabase environment variables not set. 
              {usingFallback ? 'Displaying demo data.' : 'No data available.'}
            </span>
          ) : usingFallback ? (
            <span>
              📊 <strong>Demo Mode:</strong> Supabase configured but using fallback data. 
              <code className="ml-2 text-xs">
                Settings: {supabaseStatus.settings.error || 'Connection issue'}
              </code>
            </span>
          ) : (
            <span>
              ✅ <strong>Live Data:</strong> Connected to Supabase successfully. 
              <code className="ml-2 text-xs">
                Settings: {supabaseStatus.settings.count}
              </code>
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">PDI Settings</h1>
            <p className="ri-page-description">
              Configure PDI checklist settings and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2" />
            PDI Configuration
          </CardTitle>
          <CardDescription>
            Customize how PDI checklists work in your system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(settingDefinitions).map(([key, definition]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{definition.label}</Label>
              
              {definition.type === 'select' && (
                <Select
                  value={getSettingValue(key, definition.options?.[0] || '')}
                  onValueChange={(value) => handleSettingChange(key, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${definition.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {definition.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {definition.type === 'boolean' && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id={key}
                    checked={getSettingValue(key, 'false') === 'true'}
                    onCheckedChange={(checked) => handleSettingChange(key, checked.toString())}
                  />
                  <Label htmlFor={key} className="font-normal">
                    {definition.label}
                  </Label>
                </div>
              )}
              
              {definition.type === 'text' && (
                <Input
                  id={key}
                  value={getSettingValue(key)}
                  onChange={(e) => handleSettingChange(key, e.target.value)}
                  placeholder={definition.label}
                />
              )}
              
              <p className="text-xs text-muted-foreground">
                {definition.description}
              </p>
            </div>
          ))}
          
          {Object.keys(settingDefinitions).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <SettingsIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No settings available</p>
              <p className="text-sm">Settings will appear here when configured</p>
            </div>
          )}
          
          {/* Save Button */}
          <div className="flex justify-end pt-6">
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
        </CardContent>
      </Card>
    </div>
  )
}