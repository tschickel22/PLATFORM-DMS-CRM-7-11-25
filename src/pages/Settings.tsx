import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Settings as SettingsIcon, Save, Database, Bell, Shield } from 'lucide-react'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useToast } from '@/hooks/use-toast'

export default function Settings() {
  const { supabase, isConnected } = useSupabase()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // Settings state
  const [appName, setAppName] = useState('Test Config App')
  const [appDescription, setAppDescription] = useState('Development environment for API keys, feature flags, and test integrations')
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [enableLogging, setEnableLogging] = useState(true)
  const [logLevel, setLogLevel] = useState('info')
  const [autoTestInterval, setAutoTestInterval] = useState('60')

  const handleSaveSettings = async () => {
    setLoading(true)
    
    const settings = {
      app_name: appName,
      app_description: appDescription,
      enable_notifications: enableNotifications,
      enable_logging: enableLogging,
      log_level: logLevel,
      auto_test_interval: parseInt(autoTestInterval)
    }

    if (supabase) {
      try {
        const { error } = await supabase
          .from('app_settings')
          .upsert([{ id: 1, ...settings }])

        if (error) throw error
      } catch (error) {
        console.error('Error saving settings:', error)
      }
    }

    toast({
      title: 'Settings Saved',
      description: 'Your configuration has been updated successfully'
    })
    
    setLoading(false)
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your test environment settings
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <SettingsIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Database Connection Required</h3>
              <p className="text-muted-foreground">
                Please connect to Supabase to manage settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your test environment settings
        </p>
      </div>

      {/* Application Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2" />
            Application Settings
          </CardTitle>
          <CardDescription>
            Basic configuration for your test environment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="appName">Application Name</Label>
            <Input
              id="appName"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="appDescription">Description</Label>
            <Textarea
              id="appDescription"
              value={appDescription}
              onChange={(e) => setAppDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you receive alerts and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableNotifications">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts when tests fail or integrations go down
              </p>
            </div>
            <Switch
              id="enableNotifications"
              checked={enableNotifications}
              onCheckedChange={setEnableNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Logging Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Logging & Monitoring
          </CardTitle>
          <CardDescription>
            Configure logging and monitoring settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableLogging">Enable Detailed Logging</Label>
              <p className="text-sm text-muted-foreground">
                Log detailed information about API calls and tests
              </p>
            </div>
            <Switch
              id="enableLogging"
              checked={enableLogging}
              onCheckedChange={setEnableLogging}
            />
          </div>
          
          <div>
            <Label htmlFor="logLevel">Log Level</Label>
            <select
              id="logLevel"
              value={logLevel}
              onChange={(e) => setLogLevel(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="autoTestInterval">Auto-test Interval (minutes)</Label>
            <Input
              id="autoTestInterval"
              type="number"
              value={autoTestInterval}
              onChange={(e) => setAutoTestInterval(e.target.value)}
              min="5"
              max="1440"
            />
            <p className="text-sm text-muted-foreground mt-1">
              How often to automatically test integrations (5-1440 minutes)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Database Settings
          </CardTitle>
          <CardDescription>
            Supabase connection and database configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Supabase URL</Label>
              <Input
                value={import.meta.env.VITE_SUPABASE_URL || 'Not configured'}
                readOnly
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Connection Status</Label>
              <div className="flex items-center space-x-2 mt-2">
                {isConnected ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Connected</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Disconnected</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Database connection is managed through environment variables. 
              Use the "Connect to Supabase" button in the top right to configure your connection.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={loading}>
          {loading ? (
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
    </div>
  )
}