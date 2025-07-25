import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Filter, TrendingUp, Users, DollarSign, Target } from 'lucide-react'
import { useDeals, useApprovalWorkflows, useTerritories } from '@/hooks/useCrmSupabase'
import { createDeal, updateDealStage, createApprovalWorkflow, createWinLossReport } from './hooks/useDealManagement'
import { useToast } from '@/hooks/use-toast'
import { DealForm } from './components/DealForm'
import { DealDetail } from './components/DealDetail'
import { DealPipeline } from './components/DealPipeline'
import { DealMetrics } from './components/DealMetrics'
import { TerritoryManagement } from './components/TerritoryManagement'
import { ApprovalWorkflows } from './components/ApprovalWorkflows'
import { WinLossAnalysis } from './components/WinLossAnalysis'
import { mockCrmSalesDeal } from '@/mocks/crmSalesDealMock'

function CRMSalesDealDashboard() {
  const { deals, loading: dealsLoading } = useDeals()
  const { approvalWorkflows, loading: workflowsLoading } = useApprovalWorkflows()
  const { territories, loading: territoriesLoading } = useTerritories()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('deals')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showDealForm, setShowDealForm] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<any>(null)

  // Filter deals based on search and status
  const filteredDeals = React.useMemo(() => {
    if (dealsLoading) return []
    
    let currentDeals = deals

    // Search filter
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      currentDeals = currentDeals.filter(deal =>
        (deal.customer_name && deal.customer_name.toLowerCase().includes(lowerCaseQuery)) ||
        (deal.vehicle_info && deal.vehicle_info.toLowerCase().includes(lowerCaseQuery)) ||
        (deal.rep_name && deal.rep_name.toLowerCase().includes(lowerCaseQuery))
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      currentDeals = currentDeals.filter(deal => deal.stage === statusFilter)
    }

    return currentDeals
  }, [deals, dealsLoading, searchQuery, statusFilter])

  const handleCreateDeal = async (dealData: any) => {
    try {
      await createDeal(dealData)
      toast({
        title: 'Deal Created',
        description: 'New deal has been created successfully.'
      })
      setShowDealForm(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create deal. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateDealStage = async (dealId: string, newStage: string) => {
    try {
      await updateDealStage(dealId, newStage)
      toast({
        title: 'Deal Updated',
        description: 'Deal stage has been updated successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update deal stage. Please try again.',
        variant: 'destructive'
      })
    }
  }

  if (dealsLoading || workflowsLoading || territoriesLoading) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">CRM Sales & Deals</h1>
          <p className="ri-page-description">Loading...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">CRM Sales & Deals</h1>
            <p className="ri-page-description">
              Manage your sales pipeline, track deals, and analyze performance
            </p>
          </div>
          <Button onClick={() => setShowDealForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deals.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).length}</div>
            <p className="text-xs text-muted-foreground">
              Pipeline value: $2.4M
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deals.filter(d => d.stage === 'Closed Won').length}</div>
            <p className="text-xs text-muted-foreground">
              $485K total value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Deal Form Modal */}
      {showDealForm && (
        <DealForm
          onSave={handleCreateDeal}
          onCancel={() => setShowDealForm(false)}
        />
      )}

      {/* Deal Detail Modal */}
      {selectedDeal && (
        <DealDetail
          deal={selectedDeal}
          onUpdateStage={handleUpdateDealStage}
          onClose={() => setSelectedDeal(null)}
        />
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="territories">Territories</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="deals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deals Management</CardTitle>
              <CardDescription>
                Track and manage your sales deals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="ri-search-bar">
                  <Search className="ri-search-icon" />
                  <Input
                    placeholder="Search deals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ri-search-input"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Stages</option>
                  {mockCrmSalesDeal.dealStages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                {filteredDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="ri-table-row cursor-pointer"
                    onClick={() => setSelectedDeal(deal)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold">{deal.customer_name || 'Unnamed Deal'}</h4>
                        <Badge className={mockCrmSalesDeal.stageColors[deal.stage] || 'bg-gray-100 text-gray-800'}>
                          {deal.stage}
                        </Badge>
                        <Badge className={mockCrmSalesDeal.priorityColors[deal.priority] || 'bg-gray-100 text-gray-800'}>
                          {deal.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {deal.vehicle_info && <span>{deal.vehicle_info} • </span>}
                        ${deal.amount?.toLocaleString() || '0'} • {deal.rep_name || 'Unassigned'}
                      </div>
                    </div>
                    <div className="ri-action-buttons">
                      <span className="text-sm text-muted-foreground">
                        {new Date(deal.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                {filteredDeals.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    {deals.length === 0 ? (
                      <>
                        <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No deals yet</p>
                        <p className="text-sm">Create your first deal to get started</p>
                      </>
                    ) : (
                      <>
                        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No deals found matching your criteria</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <DealPipeline deals={filteredDeals} onUpdateStage={handleUpdateDealStage} />
        </TabsContent>

        <TabsContent value="territories" className="space-y-4">
          <TerritoryManagement territories={territories} loading={territoriesLoading} />
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <ApprovalWorkflows workflows={approvalWorkflows} loading={workflowsLoading} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <DealMetrics deals={deals} loading={dealsLoading} />
          <WinLossAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function CRMSalesDeal() {
  return (
    <Routes>
      <Route path="/" element={<CRMSalesDealDashboard />} />
      <Route path="/*" element={<CRMSalesDealDashboard />} />
    </Routes>
  )
}