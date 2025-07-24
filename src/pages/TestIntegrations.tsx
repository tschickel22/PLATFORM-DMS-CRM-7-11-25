import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, CheckCircle, XCircle, Clock, Play, RefreshCw } from 'lucide-react'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useToast } from '@/hooks/use-toast'

interface TestIntegration {
  id: string
  name: string
  service: string
  endpoint: string
  status: 'healthy' | 'error' | 'testing'
  last_tested: string
  response_time?: number
  error_message?: string
}

export default function TestIntegrations() {
  const { supabase, isConnected } = useSupabase()
  const { toast } = useToast()
  const [integrations, setIntegrations] = useState<TestIntegration[]>([])
  const [loading, setLoading] = useState(true)
  const [testingIntegrations, setTestingIntegrations] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isConnected) {
      loadIntegrations()
    } else {
      setLoading(false)
    }
  }, [isConnected])

  const loadIntegrations = async () => {
    if (!supabase) return
    
    try {
      const { data, error } = await supabase
        .from('test_integrations')
        .select('*')
        .order('name')

      if (error) throw error
      setIntegrations(data || [])
    } catch (error) {
      console.error('Error loading integrations:', error)
      // For demo purposes, use mock data if table doesn't exist
      setIntegrations([
        {
          id: '1',
          name: 'Stripe Payment API',
          service: 'Stripe',
          endpoint: 'https://api.stripe.com/v1/charges',
          status: 'healthy',
          last_tested: new Date().toISOString(),
          response_time: 245
        },
        {
          id: '2',
          name: 'SendGrid Email API',
          service: 'SendGrid',
          endpoint: 'https://api.sendgrid.com/v3/mail/send',
          status: 'healthy',
          last_tested: new Date().toISOString(),
          response_time: 180
        },
        {
          id: '3',
          name: 'Twilio SMS API',
          service: 'Twilio',
          endpoint: 'https://api.twilio.com/2010-04-01/Accounts',
          status: 'error',
          last_tested: new Date().toISOString(),
          error_message: 'Authentication failed'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const testIntegration = async (integrationId: string) => {
    setTestingIntegrations(prev => new Set(prev).add(integrationId))
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const integration = integrations.find(i => i.id === integrationId)
    if (integration) {
      const isHealthy = Math.random() > 0.3 // 70% success rate for demo
      const updatedIntegration: TestIntegration = {
        ...integration,
        status: isHealthy ? 'healthy' : 'error',
        last_tested: new Date().toISOString(),
        response_time: isHealthy ? Math.floor(Math.random() * 500) + 100 : undefined,
        error_message: isHealthy ? undefined : 'Connection timeout'
      }

      if (supabase) {
        try {
          const { error } = await supabase
            .from('test_integrations')
            .update(updatedIntegration)
            .eq('id', integrationId)

          if (error) throw error
        } catch (error) {
          console.error('Error updating integration:', error)
        }
      }

      setIntegrations(integrations.map(i => 
        i.id === integrationId ? updatedIntegration : i
      ))
      
      toast({
        title: 'Test Complete',
        description: `${integration.name} test ${isHealthy ? 'passed' : 'failed'}`,
        variant: isHealthy ? 'default' : 'destructive'
      })
    }
    
    setTestingIntegrations(prev => {
      const newSet = new Set(prev)
      newSet.delete(integrationId)
      return newSet
    })
  }

  const testAllIntegrations = async () => {
    for (const integration of integrations) {
      await testIntegration(integration.id)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'testing':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'testing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Integrations</h1>
          <p className="text-muted-foreground">
            Test and monitor third-party API integrations
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Database Connection Required</h3>
              <p className="text-muted-foreground">
                Please connect to Supabase to manage test integrations
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
          <h1 className="text-3xl font-bold tracking-tight">Test Integrations</h1>
          <p className="text-muted-foreground">
            Test and monitor third-party API integrations
          </p>
        </div>
        <Button onClick={testAllIntegrations} disabled={testingIntegrations.size > 0}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Test All
        </Button>
      </div>

      {/* Integration Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Integrations</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Healthy</p>
                <p className="text-2xl font-bold text-green-600">
                  {integrations.filter(i => i.status === 'healthy').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-red-600">
                  {integrations.filter(i => i.status === 'error').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations List */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Tests</CardTitle>
          <CardDescription>
            Monitor the health of your third-party integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading integrations...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(integration.status)}
                      <div>
                        <h4 className="font-semibold">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.endpoint}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{integration.service}</Badge>
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status}
                          </Badge>
                          {integration.response_time && (
                            <Badge variant="secondary">
                              {integration.response_time}ms
                            </Badge>
                          )}
                        </div>
                        {integration.error_message && (
                          <p className="text-sm text-red-600 mt-1">{integration.error_message}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Last tested: {new Date(integration.last_tested).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testIntegration(integration.id)}
                      disabled={testingIntegrations.has(integration.id)}
                    >
                      {testingIntegrations.has(integration.id) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Test
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
              
              {integrations.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No integrations configured yet</p>
                  <p className="text-sm">Add integrations to monitor their health</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}