import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter, TrendingUp, DollarSign, Users, Target } from 'lucide-react'
import { useDealManagement } from './hooks/useDealManagement'
import { DealForm } from './components/DealForm'
import { DealDetail } from './components/DealDetail'
import { DealPipeline } from './components/DealPipeline'
import { DealMetrics } from './components/DealMetrics'
import { formatCurrency, formatDate } from '@/lib/utils'

function CRMSalesDealDashboard() {
  const { deals, loading, getDealsMetrics } = useDealManagement()
  const [activeTab, setActiveTab] = useState('pipeline')

  // Define deal stages for the CRM pipeline
  const dealStages = [
    'New',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ]

  // Define sales reps for metrics
  const salesReps = [
    { id: 'rep-1', name: 'John Smith' },
    { id: 'rep-2', name: 'Sarah Johnson' },
    { id: 'rep-3', name: 'Mike Davis' },
    { id: 'rep-4', name: 'Lisa Chen' }
  ]
  const [showNewDealForm, setShowNewDealForm] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [repFilter, setRepFilter] = useState('all')

  // Define deal stages
  const dealStages = [
    'New',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ]

  // Placeholder sales reps - TODO: Replace with Supabase data when users module is migrated
  const salesReps = [
    { id: 'rep-1', name: 'John Smith' },
    { id: 'rep-2', name: 'Sarah Johnson' },
    { id: 'rep-3', name: 'Mike Davis' },
    { id: 'rep-4', name: 'Lisa Chen' }
  ]

  // Calculate metrics
  const metrics = React.useMemo(() => {
    if (loading) return null
    return getDealsMetrics()
  }, [deals, loading, getDealsMetrics])

  // Filter deals based on search and filters
  const filteredDeals = React.useMemo(() => {
    let filtered = deals

    if (searchQuery) {
      filtered = filtered.filter(deal =>
        deal.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.vehicle_info.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (stageFilter !== 'all') {
      filtered = filtered.filter(deal => deal.stage === stageFilter)
    }

    if (repFilter !== 'all') {
      filtered = filtered.filter(deal => deal.rep_id === repFilter)
    }

    return filtered
  }, [deals, searchQuery, stageFilter, repFilter])

  const handleCreateDeal = () => {
    setSelectedDeal(null)
    setShowNewDealForm(true)
  }

  const handleEditDeal = (deal: any) => {
    setSelectedDeal(deal)
    setShowNewDealForm(true)
  }

  const handleViewDeal = (deal: any) => {
    setSelectedDeal(deal)
    setShowNewDealForm(false)
  }

  const handleCloseForms = () => {
    setSelectedDeal(null)
    setShowNewDealForm(false)
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New':
        return 'bg-blue-100 text-blue-800'
      case 'Qualified':
        return 'bg-green-100 text-green-800'
      case 'Proposal':
        return 'bg-yellow-100 text-yellow-800'
      case 'Negotiation':
        return 'bg-orange-100 text-orange-800'
      case 'Closed Won':
        return 'bg-emerald-100 text-emerald-800'
      case 'Closed Lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (showNewDealForm) {
    return (
      <DealForm
        deal={selectedDeal}
        onSave={handleCloseForms}
        onCancel={handleCloseForms}
      />
    )
  }

  if (selectedDeal && !showNewDealForm) {
    return (
      <DealDetail
        deal={selectedDeal}
        onEdit={() => setShowNewDealForm(true)}
        onClose={handleCloseForms}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Sales Deals</h1>
            <p className="ri-page-description">
              Manage your sales pipeline and track deal progress
            </p>
          </div>
          <Button onClick={handleCreateDeal}>
            <Plus className="h-4 w-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="ri-stats-grid">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalDeals}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.activeDeals} active deals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.pipelineValue)}</div>
              <p className="text-xs text-muted-foreground">
                Total potential revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.winRate}%</div>
              <p className="text-xs text-muted-foreground">
                Closed won vs total closed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.avgDealSize)}</div>
              <p className="text-xs text-muted-foreground">
                Average deal value
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="deals">All Deals</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <DealPipeline
            deals={filteredDeals}
            onEditDeal={handleEditDeal}
            onViewDeal={handleViewDeal}
          />
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Deals</CardTitle>
              <CardDescription>
                Complete list of sales deals
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
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {dealStages.map(stage => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={repFilter} onValueChange={setRepFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by rep" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reps</SelectItem>
                    {salesReps.map(rep => (
                      <SelectItem key={rep.id} value={rep.id}>
                        {rep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Deals List */}
              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading deals...</p>
                  </div>
                )}

                {filteredDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="ri-table-row cursor-pointer"
                    onClick={() => handleViewDeal(deal)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold">{deal.customer_name}</h4>
                        <Badge className={getStageColor(deal.stage)}>
                          {deal.stage}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {deal.vehicle_info} • {formatCurrency(deal.amount || 0)}
                        {deal.expected_close_date && (
                          <span> • Expected: {formatDate(deal.expected_close_date)}</span>
                        )}
                      </div>
                    </div>
                    <div className="ri-action-buttons">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditDeal(deal)
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}

                {!loading && filteredDeals.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    {deals.length === 0 ? (
                      <>
                        <p>No deals yet</p>
                        <p className="text-sm">Create your first deal to get started</p>
                      </>
                    ) : (
                      <>
                        <p>No deals found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <DealMetrics dealStages={dealStages} salesReps={salesReps} />
        </TabsContent>
      </Tabs>
    </div>
          <DealPipeline dealStages={dealStages} />
}

export default function CRMSalesDeal() {
  return (
    <Routes>
      <Route path="/" element={<CRMSalesDealDashboard />} />
      <Route path="/*" element={<CRMSalesDealDashboard />} />
    </Routes>
  )
}