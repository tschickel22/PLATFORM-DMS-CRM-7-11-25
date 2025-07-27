import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, DollarSign, Users, Settings, TrendingUp, RefreshCw } from 'lucide-react'
import { mockCommissionEngine } from '@/mocks/commissionEngineMock'
import { useCommissionsSupabase } from './hooks/useCommissionsSupabase'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'

function CommissionEngineDashboard() {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('commissions')
  const {
    commissions,
    loading,
    error,
    usingFallback,
    supabaseStatus,
    createCommission,
    updateCommission,
    deleteCommission,
    refetchCommissions
  } = useCommissionsSupabase()

  // Example of how to use the CRUD functions (you'll integrate these into your forms/tables)
  const handleCreateExample = async () => {
    try {
      const newComm = await createCommission({
        repId: 'rep-new',
        amount: 1500,
        period: 'July 2025',
        ruleId: 'rule-001',
        saleAmount: 30000,
      })
      console.log('Created new commission:', newComm)
    } catch (e) {
      console.error('Error creating commission:', e)
    }
  }

  // Get platform-specific labels
  const getModuleLabel = () => {
    const platformType = tenant?.settings?.platformType || 'mh'
    const labelOverrides = tenant?.settings?.labelOverrides || {}
    
    if (labelOverrides['commission.module']) {
      return labelOverrides['commission.module']
    }
    
    return 'Commission Engine'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-3 text-muted-foreground">Loading commissions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>Failed to load commissions data.</p>
        <p>{error.message}</p>
        <Button onClick={refetchCommissions} className="mt-2">
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
          {loading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Connecting to Supabase commissions...
            </span>
          ) : !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY ? (
            <span>
              ⚙️ <strong>Configuration Required:</strong> Supabase environment variables not set. 
              {usingFallback ? 'Displaying demo data.' : 'No data available.'}
              <code className="ml-2 text-xs">
                VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'MISSING'}, 
                VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'}
              </code>
            </span>
          ) : usingFallback ? (
            <span>
              📊 <strong>Demo Mode:</strong> Supabase configured but using fallback data. 
              <code className="ml-2 text-xs">
                Error: {supabaseStatus.error || 'Connection issue'}
              </code>
            </span>
          ) : (
            <span>
              ✅ <strong>Live Data:</strong> Connected to Supabase successfully. 
              <code className="ml-2 text-xs">
                Commissions: {supabaseStatus.count}
              </code>
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">{getModuleLabel()}</h1>
            <p className="ri-page-description">
              Manage sales commissions and payout rules
            </p>
          </div>
          <div>
            <Button onClick={handleCreateExample}>
              <Plus className="h-4 w-4 mr-2" />
              New Commission
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${commissions.reduce((sum, c) => sum + c.amount, 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : '+15% from last month'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reps</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(commissions.map(c => c.repId)).size}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Across all periods'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Commission</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(commissions.reduce((sum, c) => sum + c.amount, 0) / (commissions.length || 1)).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Per transaction'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rules</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCommissionEngine.sampleRules.length}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Active rules'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Commissions</CardTitle>
              <CardDescription>Latest commission calculations and payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissions.length > 0 ? (
                  commissions.map((commission) => (
                    <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Rep: {commission.repId}</h4>
                        <p className="text-sm text-muted-foreground">
                          Amount: ${commission.amount.toFixed(2)} • Period: {commission.period}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Source: {commission.source} • Sale: ${commission.saleAmount.toFixed(2)}
                        </p>
                      </div>
                      <Badge variant="secondary">Rule: {commission.ruleId}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    {!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY ? (
                      <>
                        <p>Supabase Configuration Required</p>
                        <p className="text-sm">Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables</p>
                      </>
                    ) : (
                      <>
                        <p>No commissions found</p>
                        <p className="text-sm">Add new commissions to get started</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Commission Rules</CardTitle>
              <CardDescription>Configure commission calculation rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCommissionEngine.sampleRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{rule.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Rate: {rule.rate}% • Type: {rule.type}
                      </p>
                    </div>
                    <Badge variant={rule.active ? "default" : "secondary"}>
                      {rule.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Commission Reports</CardTitle>
              <CardDescription>Generate and view commission reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="period">Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current Month</SelectItem>
                        <SelectItem value="last">Last Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rep">Sales Rep</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All reps" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Reps</SelectItem>
                        <SelectItem value="rep1">John Doe</SelectItem>
                        <SelectItem value="rep2">Jane Smith</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button>Generate Report</Button>
                  </div>
                </div>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Select criteria and generate a report</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function CommissionEngine() {
  return (
    <Routes>
      <Route path="/*" element={<CommissionEngineDashboard />} />
    </Routes>
  )
}