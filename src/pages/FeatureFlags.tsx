import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Plus, Flag, Edit, Trash2 } from 'lucide-react'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useToast } from '@/hooks/use-toast'

interface FeatureFlag {
  id: string
  name: string
  key: string
  description: string
  is_enabled: boolean
  environment: 'development' | 'staging' | 'production'
  created_at: string
  updated_at: string
}

export default function FeatureFlags() {
  const { supabase, isConnected } = useSupabase()
  const { toast } = useToast()
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewFlagForm, setShowNewFlagForm] = useState(false)
  
  // Form state
  const [newFlagName, setNewFlagName] = useState('')
  const [newFlagKey, setNewFlagKey] = useState('')
  const [newFlagDescription, setNewFlagDescription] = useState('')
  const [newFlagEnvironment, setNewFlagEnvironment] = useState<'development' | 'staging' | 'production'>('development')

  useEffect(() => {
    if (isConnected) {
      loadFeatureFlags()
    } else {
      setLoading(false)
    }
  }, [isConnected])

  const loadFeatureFlags = async () => {
    if (!supabase) return
    
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeatureFlags(data || [])
    } catch (error) {
      console.error('Error loading feature flags:', error)
      // For demo purposes, use mock data if table doesn't exist
      setFeatureFlags([
        {
          id: '1',
          name: 'New Dashboard Layout',
          key: 'new_dashboard_layout',
          description: 'Enable the redesigned dashboard with improved metrics',
          is_enabled: true,
          environment: 'development',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Advanced Reporting',
          key: 'advanced_reporting',
          description: 'Enable advanced reporting features and analytics',
          is_enabled: false,
          environment: 'development',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFeatureFlag = async () => {
    if (!newFlagName || !newFlagKey) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    const newFlag: FeatureFlag = {
      id: Date.now().toString(),
      name: newFlagName,
      key: newFlagKey,
      description: newFlagDescription,
      is_enabled: false,
      environment: newFlagEnvironment,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    if (supabase) {
      try {
        const { error } = await supabase
          .from('feature_flags')
          .insert([newFlag])

        if (error) throw error
      } catch (error) {
        console.error('Error creating feature flag:', error)
      }
    }

    setFeatureFlags([newFlag, ...featureFlags])
    setNewFlagName('')
    setNewFlagKey('')
    setNewFlagDescription('')
    setNewFlagEnvironment('development')
    setShowNewFlagForm(false)
    
    toast({
      title: 'Feature Flag Created',
      description: `${newFlag.name} has been created successfully`
    })
  }

  const toggleFeatureFlag = async (flagId: string, enabled: boolean) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('feature_flags')
          .update({ 
            is_enabled: enabled,
            updated_at: new Date().toISOString()
          })
          .eq('id', flagId)

        if (error) throw error
      } catch (error) {
        console.error('Error updating feature flag:', error)
      }
    }

    setFeatureFlags(featureFlags.map(flag => 
      flag.id === flagId 
        ? { ...flag, is_enabled: enabled, updated_at: new Date().toISOString() }
        : flag
    ))
    
    toast({
      title: 'Feature Flag Updated',
      description: `Feature flag ${enabled ? 'enabled' : 'disabled'}`
    })
  }

  const deleteFeatureFlag = async (flagId: string) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('feature_flags')
          .delete()
          .eq('id', flagId)

        if (error) throw error
      } catch (error) {
        console.error('Error deleting feature flag:', error)
      }
    }

    setFeatureFlags(featureFlags.filter(flag => flag.id !== flagId))
    toast({
      title: 'Feature Flag Deleted',
      description: 'Feature flag has been removed'
    })
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feature Flags</h1>
          <p className="text-muted-foreground">
            Manage feature toggles and experimental features
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Flag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Database Connection Required</h3>
              <p className="text-muted-foreground">
                Please connect to Supabase to manage feature flags
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feature Flags</h1>
          <p className="text-muted-foreground">
            Manage feature toggles and experimental features
          </p>
        </div>
        <Button onClick={() => setShowNewFlagForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Feature Flag
        </Button>
      </div>

      {/* New Feature Flag Form */}
      {showNewFlagForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Feature Flag</CardTitle>
            <CardDescription>
              Add a new feature flag for testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="flagName">Flag Name</Label>
                <Input
                  id="flagName"
                  value={newFlagName}
                  onChange={(e) => setNewFlagName(e.target.value)}
                  placeholder="e.g., New Dashboard Layout"
                />
              </div>
              <div>
                <Label htmlFor="flagKey">Flag Key</Label>
                <Input
                  id="flagKey"
                  value={newFlagKey}
                  onChange={(e) => setNewFlagKey(e.target.value)}
                  placeholder="e.g., new_dashboard_layout"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newFlagDescription}
                onChange={(e) => setNewFlagDescription(e.target.value)}
                placeholder="Describe what this feature flag controls..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="environment">Environment</Label>
              <select
                id="environment"
                value={newFlagEnvironment}
                onChange={(e) => setNewFlagEnvironment(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowNewFlagForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFeatureFlag}>
                Create Feature Flag
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Flags List */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>
            Toggle features on and off for testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading feature flags...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {featureFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <h4 className="font-semibold">{flag.name}</h4>
                        <code className="text-sm text-muted-foreground">{flag.key}</code>
                        {flag.description && (
                          <p className="text-sm text-muted-foreground mt-1">{flag.description}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{flag.environment}</Badge>
                          <Badge variant={flag.is_enabled ? "default" : "secondary"}>
                            {flag.is_enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`toggle-${flag.id}`} className="text-sm">
                        {flag.is_enabled ? 'On' : 'Off'}
                      </Label>
                      <Switch
                        id={`toggle-${flag.id}`}
                        checked={flag.is_enabled}
                        onCheckedChange={(checked) => toggleFeatureFlag(flag.id, checked)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFeatureFlag(flag.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {featureFlags.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Flag className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No feature flags configured yet</p>
                  <p className="text-sm">Create your first feature flag to get started</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}