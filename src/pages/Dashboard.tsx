import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Key, Flag, Zap, Database, CheckCircle, XCircle } from 'lucide-react'
import { useSupabase } from '@/contexts/SupabaseContext'

export default function Dashboard() {
  const { isConnected, connectionError } = useSupabase()

  const stats = [
    {
      name: 'API Keys',
      value: '12',
      change: '+2 this week',
      icon: Key,
    },
    {
      name: 'Feature Flags',
      value: '8',
      change: '3 active',
      icon: Flag,
    },
    {
      name: 'Test Integrations',
      value: '5',
      change: 'All healthy',
      icon: Zap,
    },
    {
      name: 'Database Status',
      value: isConnected ? 'Connected' : 'Disconnected',
      change: isConnected ? 'Healthy' : 'Error',
      icon: Database,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Test Config Dashboard</h1>
        <p className="text-muted-foreground">
          Development environment for managing API keys, feature flags, and test integrations
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Supabase Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            {isConnected ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-600">Connected</p>
                  <p className="text-sm text-muted-foreground">Database connection is healthy</p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-600">Disconnected</p>
                  <p className="text-sm text-muted-foreground">
                    {connectionError || 'Unable to connect to Supabase'}
                  </p>
                </div>
              </>
            )}
          </div>
          
          {!isConnected && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Setup Required:</strong> Click the "Connect to Supabase" button in the top right to configure your database connection.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest configuration changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">API key created</p>
                  <p className="text-sm text-muted-foreground">
                    New development API key for testing
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2 hours ago
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Feature flag updated</p>
                  <p className="text-sm text-muted-foreground">
                    Enabled new dashboard layout
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    1 day ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Info</CardTitle>
            <CardDescription>
              Current development environment details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Environment</span>
                <Badge variant="secondary">Development</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Version</span>
                <span className="text-sm text-muted-foreground">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Last Deploy</span>
                <span className="text-sm text-muted-foreground">Today</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Database</span>
                <Badge variant={isConnected ? "default" : "destructive"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}