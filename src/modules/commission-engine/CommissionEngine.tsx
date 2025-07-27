import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Search, DollarSign, TrendingUp, Users, Calculator, Settings, RefreshCw, Loader2 } from 'lucide-react'
import { useCommissionManagement } from './hooks/useCommissionManagement'
import { useToast } from '@/hooks/use-toast'
import { Commission, CommissionRule } from './types'

// Mock components for now
const CommissionList = ({ commissions, onEdit, onDelete }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Commissions</CardTitle>
      <CardDescription>
        Manage all sales commissions ({commissions.length})
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {commissions.map((commission: any) => (
          <div key={commission.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Commission for {commission.sales_rep_id}</h4>
              <p className="text-sm text-muted-foreground">Amount: ${commission.amount}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit?.(commission)}>
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete?.(commission.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

const CommissionRulesList = ({ rules, onEdit, onDelete }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Commission Rules</CardTitle>
      <CardDescription>
        Define and manage commission calculation rules ({rules.length})
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {rules.map((rule: any) => (
          <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">{rule.rule_name}</h4>
              <p className="text-sm text-muted-foreground">Type: {rule.type} | Rate: {rule.rate}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit?.(rule)}>
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete?.(rule.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

function CommissionEngine() {
  const [activeTab, setActiveTab] = useState('commissions');
  const { commissions, rules, loading, error, usingFallback, refetchData } = useCommissionManagement();
  const { toast } = useToast();

  // Display error toast if there's an error
  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Error loading commission data',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  return (
    <div className="space-y-6">
      {/* Supabase Status Banner */}
      <Alert>
        <AlertDescription>
          {/* Supabase Status Banner */}
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading commission data...
            </span>
          ) : usingFallback ? (
            <span>
              📊 <strong>Demo Mode:</strong> Using fallback commission data.
            </span>
          ) : (
            <span>
              ✅ <strong>Live Data:</strong> Connected to Supabase for Commissions.
            </span>
          )}
        </AlertDescription>
      </Alert>
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Commission Engine</h1>
            <p className="ri-page-description">
              Manage commission rules and track payments
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div> {/* End ri-page-header */}

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-2xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : commissions.length}</div>
            <p className="text-xs text-muted-foreground">
              {/* Dynamic data for stats */}
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${commissions.reduce((sum: number, c: any) => sum + c.amount, 0).toFixed(2)}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {/* Dynamic data for stats */}
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-2xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : rules.length}</div>
            <p className="text-xs text-muted-foreground">
              {/* Dynamic data for stats */}
              All rules active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="commissions" className="space-y-4">
          <CommissionList commissions={commissions} /> {/* Pass commissions */}
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <CommissionRulesList rules={rules} /> {/* Pass rules */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function CommissionEngine() {
  const { toast } = useToast()
  const {
    rules,
    commissions,
    loading,
    error,
    usingFallback,
    supabaseStatus,
    createRule,
    updateRule,
    deleteRule,
    createCommission,
    updateCommission
  } = useCommissionManagement()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewRuleForm, setShowNewRuleForm] = useState(false)
  const [showNewCommissionForm, setShowNewCommissionForm] = useState(false)
  
  // Form state for new rule
  const [newRuleForm, setNewRuleForm] = useState({
    name: '',
    type: 'percentage',
    rate: 0,
    criteria: '',
    is_active: true
  })
  
  // Form state for new commission
  const [newCommissionForm, setNewCommissionForm] = useState({
    rep_id: '',
    rep_name: '',
    deal_id: '',
    rule_id: '',
    amount: 0,
    period: '',
    sale_amount: 0,
    status: 'pending'
  })

  const handleCreateRule = async () => {
    if (!newRuleForm.name || !newRuleForm.type || newRuleForm.rate <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    const newRule = await createRule({
      name: newRuleForm.name,
      type: newRuleForm.type,
      rate: newRuleForm.rate,
      criteria: newRuleForm.criteria,
      is_active: newRuleForm.is_active
    })

    if (newRule) {
      setNewRuleForm({
        name: '',
        type: 'percentage',
        rate: 0,
        criteria: '',
        is_active: true
      })
      setShowNewRuleForm(false)
      toast({
        title: 'Success',
        description: 'Commission rule created successfully'
      })
    }
  }

  const handleCreateCommission = async () => {
    if (!newCommissionForm.rep_id || !newCommissionForm.deal_id || newCommissionForm.amount <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    const newCommission = await createCommission({
      rep_id: newCommissionForm.rep_id,
      rep_name: newCommissionForm.rep_name,
      deal_id: newCommissionForm.deal_id,
      rule_id: newCommissionForm.rule_id,
      amount: newCommissionForm.amount,
      period: newCommissionForm.period,
      sale_amount: newCommissionForm.sale_amount,
      status: newCommissionForm.status
    })

    if (newCommission) {
      setNewCommissionForm({
        rep_id: '',
        rep_name: '',
        deal_id: '',
        rule_id: '',
        amount: 0,
        period: '',
        sale_amount: 0,
        status: 'pending'
      })
      setShowNewCommissionForm(false)
      toast({
        title: 'Success',
        description: 'Commission created successfully'
      })
    }
  }

  const handleDeleteRule = async (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this commission rule?')) {
      await deleteRule(ruleId)
      toast({
        title: 'Success',
        description: 'Commission rule deleted successfully'
      })
    }
  }

  const handleUpdateRuleStatus = async (ruleId: string, isActive: boolean) => {
    await updateRule(ruleId, { is_active: isActive })
    toast({
      title: 'Success',
      description: `Commission rule ${isActive ? 'activated' : 'deactivated'} successfully`
    })
  }

  const handleUpdateCommissionStatus = async (commissionId: string, status: string) => {
    await updateCommission(commissionId, { status })
    toast({
      title: 'Success',
      description: 'Commission status updated successfully'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-3 text-muted-foreground">Loading commission data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Supabase Status Banner */}
      <Alert>
        <AlertDescription>
          {usingFallback ? (
            <span>
              📊 <strong>Demo Mode:</strong> Using fallback data. 
              Rules: {supabaseStatus.rules.error || 'Connection issue'}, 
              Commissions: {supabaseStatus.commissions.error || 'Connection issue'}
            </span>
          ) : (
            <span>
              ✅ <strong>Live Data:</strong> Connected to Supabase successfully. 
              Rules: {supabaseStatus.rules.count}, 
              Commissions: {supabaseStatus.commissions.count}
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
              Manage commission rules and track payments
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search commissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rules</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
            <p className="text-xs text-muted-foreground">
              Active commission rules
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commissions.length}</div>
            <p className="text-xs text-muted-foreground">
              This period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payout</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${commissions.reduce((total, comm) => total + comm.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total commissions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Reps</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(commissions.map(c => c.rep_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Sales representatives
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Commissions</CardTitle>
                <CardDescription>Latest commission payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commissions.slice(0, 5).map((commission) => (
                    <div key={commission.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{commission.rep_name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${commission.amount.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">{commission.status}</Badge>
                    </div>
                  ))}
                  {commissions.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No commissions yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Rules</CardTitle>
                <CardDescription>Current commission rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rules.filter(rule => rule.is_active).slice(0, 5).map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {rule.rate}% • {rule.type}
                        </p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  ))}
                  {rules.filter(rule => rule.is_active).length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No active rules
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Commission Rules</CardTitle>
                  <CardDescription>
                    Configure how commissions are calculated
                  </CardDescription>
                </div>
                <Button onClick={() => setShowNewRuleForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold">{rule.name}</h4>
                        <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                          {rule.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">{rule.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Rate: {rule.rate}% • Created: {new Date(rule.created_at).toLocaleDateString()}
                      </div>
                      {rule.criteria && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Criteria: {rule.criteria}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateRuleStatus(rule.id, !rule.is_active)}
                      >
                        {rule.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                
                {rules.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No commission rules found</p>
                    <p className="text-sm">Create your first commission rule to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Commission Payments</CardTitle>
                  <CardDescription>
                    Track and manage commission payments
                  </CardDescription>
                </div>
                <Button onClick={() => setShowNewCommissionForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Commission
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissions.map((commission) => (
                  <div
                    key={commission.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold">{commission.rep_name}</h4>
                        <Badge variant="outline">{commission.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Amount: ${commission.amount.toLocaleString()} • 
                        Period: {commission.period} • 
                        Sale: ${commission.sale_amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Deal: {commission.deal_id} • Rule: {commission.rule_id}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={commission.status}
                        onValueChange={(newStatus) => handleUpdateCommissionStatus(commission.id, newStatus)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
                
                {commissions.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No commissions found</p>
                    <p className="text-sm">Commissions will appear here when deals are closed</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Rule Form Modal */}
      {showNewRuleForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>New Commission Rule</CardTitle>
              <CardDescription>
                Create a new commission calculation rule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ruleName">Rule Name</Label>
                <Input
                  id="ruleName"
                  value={newRuleForm.name}
                  onChange={(e) => setNewRuleForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter rule name"
                />
              </div>
              
              <div>
                <Label htmlFor="ruleType">Rule Type</Label>
                <Select
                  value={newRuleForm.type}
                  onValueChange={(value) => setNewRuleForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="tiered">Tiered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="ruleRate">Rate</Label>
                <Input
                  id="ruleRate"
                  type="number"
                  value={newRuleForm.rate}
                  onChange={(e) => setNewRuleForm(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                  placeholder={newRuleForm.type === 'percentage' ? 'Enter percentage (e.g., 5 for 5%)' : 'Enter flat amount'}
                  step="0.01"
                />
              </div>
              
              <div>
                <Label htmlFor="ruleCriteria">Criteria (Optional)</Label>
                <Textarea
                  id="ruleCriteria"
                  value={newRuleForm.criteria}
                  onChange={(e) => setNewRuleForm(prev => ({ ...prev, criteria: e.target.value }))}
                  placeholder="Enter any specific criteria for this rule"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowNewRuleForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateRule}>
                  Create Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Commission Form Modal */}
      {showNewCommissionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>New Commission</CardTitle>
              <CardDescription>
                Create a new commission payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="repId">Sales Rep ID</Label>
                <Input
                  id="repId"
                  value={newCommissionForm.rep_id}
                  onChange={(e) => setNewCommissionForm(prev => ({ ...prev, rep_id: e.target.value }))}
                  placeholder="Enter sales rep ID"
                />
              </div>
              
              <div>
                <Label htmlFor="repName">Sales Rep Name</Label>
                <Input
                  id="repName"
                  value={newCommissionForm.rep_name}
                  onChange={(e) => setNewCommissionForm(prev => ({ ...prev, rep_name: e.target.value }))}
                  placeholder="Enter sales rep name"
                />
              </div>
              
              <div>
                <Label htmlFor="dealId">Deal ID</Label>
                <Input
                  id="dealId"
                  value={newCommissionForm.deal_id}
                  onChange={(e) => setNewCommissionForm(prev => ({ ...prev, deal_id: e.target.value }))}
                  placeholder="Enter deal ID"
                />
              </div>
              
              <div>
                <Label htmlFor="ruleId">Commission Rule</Label>
                <Select
                  value={newCommissionForm.rule_id}
                  onValueChange={(value) => setNewCommissionForm(prev => ({ ...prev, rule_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select commission rule" />
                  </SelectTrigger>
                  <SelectContent>
                    {rules.filter(rule => rule.is_active).map((rule) => (
                      <SelectItem key={rule.id} value={rule.id}>
                        {rule.name} ({rule.rate}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="amount">Commission Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newCommissionForm.amount}
                    onChange={(e) => setNewCommissionForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="saleAmount">Sale Amount</Label>
                  <Input
                    id="saleAmount"
                    type="number"
                    value={newCommissionForm.sale_amount}
                    onChange={(e) => setNewCommissionForm(prev => ({ ...prev, sale_amount: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="period">Period</Label>
                <Input
                  id="period"
                  value={newCommissionForm.period}
                  onChange={(e) => setNewCommissionForm(prev => ({ ...prev, period: e.target.value }))}
                  placeholder="e.g., January 2024"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowNewCommissionForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateCommission}>
                  Create Commission
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}