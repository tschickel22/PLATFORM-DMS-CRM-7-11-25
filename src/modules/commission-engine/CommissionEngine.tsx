import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, DollarSign, TrendingUp, Users, Settings, Search } from 'lucide-react'
import { useCommissionManagement } from './hooks/useCommissionManagement'
import { CommissionList } from './components/CommissionList'
import { CommissionRuleForm } from './components/CommissionRuleForm'
import { useToast } from '@/hooks/use-toast'

export default function CommissionEngine() {
  console.log("CommissionEngine loaded")
  
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('commissions')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showNewRuleForm, setShowNewRuleForm] = useState(false)
  
  const {
    commissions,
    rules,
    loading: isLoading,
    error,
    usingFallback,
    supabaseStatus,
    createCommission,
    updateCommission,
    deleteCommission,
    createRule,
    updateRule,
    deleteRule
  } = useCommissionManagement()

  console.log({ isLoading, error, commissions, rules, usingFallback })

  // Show fallback mode toast once
  useEffect(() => {
    if (usingFallback) {
      toast({ 
        title: "Fallback Mode", 
        description: "Using test data. Supabase fetch failed or company ID missing." 
      })
    }
  }, [usingFallback, toast])

  // Calculate stats
  const totalCommissions = commissions.reduce((sum, comm) => sum + comm.amount, 0)
  const paidCommissions = commissions.filter(comm => comm.status === 'paid').reduce((sum, comm) => sum + comm.amount, 0)
  const pendingCommissions = commissions.filter(comm => comm.status === 'pending').reduce((sum, comm) => sum + comm.amount, 0)

  // Filter commissions based on search and status
  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = !searchQuery || 
      commission.repName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commission.dealId?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-blue-100 text-blue-800',
    'paid': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-3 text-muted-foreground">Loading commission data...</p>
      </div>
    )
  }

  if (error) {
    toast({
      title: "Error Loading Data",
      description: error.message || "Failed to load commission data",
      variant: "destructive"
    })
  }

  return (
    <div className="space-y-6">
      {/* Supabase Status Banner */}
      <Alert>
        <AlertDescription>
          {usingFallback ? (
            <span>
              📊 <strong>Demo Mode:</strong> Using fallback data. 
              {supabaseStatus.error && `Error: ${supabaseStatus.error}`}
            </span>
          ) : (
            <span>
              ✅ <strong>Live Data:</strong> Connected to Supabase successfully. 
              Commissions: {supabaseStatus.commissions.count}, Rules: {supabaseStatus.rules.count}
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Commission Engine</h1>
            <p className="ri-page-description">
              Manage sales commissions and commission rules
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowNewRuleForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Rule
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCommissions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Out</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paidCommissions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Completed payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingCommissions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
            <p className="text-xs text-muted-foreground">
              Commission rules
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Tracking</CardTitle>
              <CardDescription>
                Track and manage sales commission payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by rep name or deal ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <CommissionList
                commissions={filteredCommissions}
                statusColors={statusColors}
                loading={isLoading}
                onEdit={updateCommission}
                onDelete={deleteCommission}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          {showNewRuleForm && (
            <CommissionRuleForm
              rules={rules}
              onSave={(ruleData) => {
                createRule(ruleData)
                setShowNewRuleForm(false)
              }}
              onCancel={() => setShowNewRuleForm(false)}
            />
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Commission Rules</CardTitle>
              <CardDescription>
                Configure commission calculation rules and rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{rule.name}</h4>
                      <div className="text-sm text-muted-foreground mt-1">
                        Type: {rule.type} • Rate: {rule.rate}% • 
                        Criteria: {rule.criteria || 'All sales'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Active</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateRule(rule.id, rule)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteRule(rule.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                
                {rules.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No commission rules configured</p>
                    <p className="text-sm">Create your first rule to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Reports</CardTitle>
              <CardDescription>
                Generate and view commission reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>Commission reporting coming soon</p>
                <p className="text-sm">Advanced reporting features will be available in a future update</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}