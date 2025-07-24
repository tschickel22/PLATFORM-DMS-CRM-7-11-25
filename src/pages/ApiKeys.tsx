import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Key, Eye, EyeOff, Copy, Trash2, Database } from 'lucide-react'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useToast } from '@/hooks/use-toast'

interface ApiKey {
  id: string
  name: string
  key: string
  environment: 'development' | 'staging' | 'production'
  service: string
  created_at: string
  last_used?: string
  is_active: boolean
}

export default function ApiKeys() {
  const { supabase, isConnected } = useSupabase()
  const { toast } = useToast()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewKeyForm, setShowNewKeyForm] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  
  // Form state
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyService, setNewKeyService] = useState('')
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<'development' | 'staging' | 'production'>('development')

  useEffect(() => {
    if (isConnected) {
      loadApiKeys()
    } else {
      setLoading(false)
    }
  }, [isConnected])

  const loadApiKeys = async () => {
    if (!supabase) return
    
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setApiKeys(data || [])
    } catch (error) {
      console.error('Error loading API keys:', error)
      // For demo purposes, use mock data if table doesn't exist
      setApiKeys([
        {
          id: '1',
          name: 'Stripe Test Key',
          key: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
          environment: 'development',
          service: 'Stripe',
          created_at: new Date().toISOString(),
          is_active: true
        },
        {
          id: '2',
          name: 'SendGrid API',
          key: 'SG.1234567890abcdef.1234567890abcdef1234567890abcdef',
          environment: 'development',
          service: 'SendGrid',
          created_at: new Date().toISOString(),
          is_active: true
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const generateApiKey = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const handleCreateApiKey = async () => {
    if (!newKeyName || !newKeyService) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: generateApiKey(),
      environment: newKeyEnvironment,
      service: newKeyService,
      created_at: new Date().toISOString(),
      is_active: true
    }

    if (supabase) {
      try {
        const { error } = await supabase
          .from('api_keys')
          .insert([newKey])

        if (error) throw error
      } catch (error) {
        console.error('Error creating API key:', error)
        // For demo, just add to local state
      }
    }

    setApiKeys([newKey, ...apiKeys])
    setNewKeyName('')
    setNewKeyService('')
    setNewKeyEnvironment('development')
    setShowNewKeyForm(false)
    
    toast({
      title: 'API Key Created',
      description: `${newKey.name} has been created successfully`
    })
  }

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys)
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId)
    } else {
      newVisibleKeys.add(keyId)
    }
    setVisibleKeys(newVisibleKeys)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard'
    })
  }

  const deleteApiKey = async (keyId: string) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('api_keys')
          .delete()
          .eq('id', keyId)

        if (error) throw error
      } catch (error) {
        console.error('Error deleting API key:', error)
      }
    }

    setApiKeys(apiKeys.filter(key => key.id !== keyId))
    toast({
      title: 'API Key Deleted',
      description: 'API key has been removed'
    })
  }

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4)
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your development API keys and credentials
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Database Connection Required</h3>
              <p className="text-muted-foreground">
                Please connect to Supabase to manage API keys
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
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your development API keys and credentials
          </p>
        </div>
        <Button onClick={() => setShowNewKeyForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New API Key
        </Button>
      </div>

      {/* New API Key Form */}
      {showNewKeyForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New API Key</CardTitle>
            <CardDescription>
              Add a new API key for development testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Stripe Test Key"
                />
              </div>
              <div>
                <Label htmlFor="service">Service</Label>
                <Input
                  id="service"
                  value={newKeyService}
                  onChange={(e) => setNewKeyService(e.target.value)}
                  placeholder="e.g., Stripe, SendGrid, Twilio"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="environment">Environment</Label>
              <select
                id="environment"
                value={newKeyEnvironment}
                onChange={(e) => setNewKeyEnvironment(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowNewKeyForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateApiKey}>
                Create API Key
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Your development API keys and credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading API keys...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <h4 className="font-semibold">{apiKey.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{apiKey.service}</Badge>
                          <Badge variant="secondary">{apiKey.environment}</Badge>
                          {apiKey.is_active && (
                            <Badge variant="default">Active</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                      </code>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {new Date(apiKey.created_at).toLocaleDateString()}
                      {apiKey.last_used && (
                        <span> • Last used {new Date(apiKey.last_used).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {visibleKeys.has(apiKey.id) ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteApiKey(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {apiKeys.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No API keys configured yet</p>
                  <p className="text-sm">Create your first API key to get started</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}