import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Eye, Edit, Filter } from 'lucide-react'
import { useDealManagement, Deal } from './hooks/useDealManagement'
import { formatCurrency } from '@/lib/utils'
import { DealForm } from './components/DealForm'
import { DealDetail } from './components/DealDetail'
import { DealPipeline } from './components/DealPipeline'
import { DealMetrics } from './components/DealMetrics'
import { formatCurrency, formatDate } from '@/lib/utils'

function CRMSalesDealDashboard() {
  const { deals, loading, getDealsMetrics } = useDealManagement()
  const [activeView, setActiveView] = useState<'list' | 'pipeline' | 'metrics'>('list')
  const [showNewDealForm, setShowNewDealForm] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [showDealDetail, setShowDealDetail] = useState(false)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  // Deal stages - these should match your business process
  const dealStages = [
    'New',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ]

  // Placeholder sales reps - TODO: Replace with Supabase users table when migrated
  const salesReps = [
    { id: 'rep-1', name: 'John Smith' },
    { id: 'rep-2', name: 'Sarah Johnson' },
    { id: 'rep-3', name: 'Mike Davis' },
    { id: 'rep-4', name: 'Lisa Chen' }
  ]

  // Filter deals based on search and filters
  const filteredDeals = React.useMemo(() => {
    let filtered = deals

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(deal =>
        deal.customer_name.toLowerCase().includes(query) ||
        (deal.customer_email && deal.customer_email.toLowerCase().includes(query)) ||
        (deal.vehicle_info && deal.vehicle_info.toLowerCase().includes(query)) ||
        (deal.rep_name && deal.rep_name.toLowerCase().includes(query))
      )
    }

    // Stage filter
    if (stageFilter !== 'all') {
      filtered = filtered.filter(deal => deal.stage === stageFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(deal => deal.priority === priorityFilter)
    }

    return filtered
  }, [deals, searchQuery, stageFilter, priorityFilter])

  const handleViewDeal = (deal: Deal) => {
    setSelectedDeal(deal)
    setShowDealDetail(true)
  }

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal)
    setShowNewDealForm(true)
  }

  const handleDealSuccess = () => {
    setShowNewDealForm(false)
    setSelectedDeal(null)
  }

  const handleDealUpdate = (updatedDeal: Deal) => {
    setSelectedDeal(updatedDeal)
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New':
        return 'bg-gray-100 text-gray-800'
      case 'Qualified':
        return 'bg-blue-100 text-blue-800'
      case 'Proposal Sent':
        return 'bg-yellow-100 text-yellow-800'
      case 'Negotiation':
        return 'bg-orange-100 text-orange-800'
      case 'Closed Won':
        return 'bg-green-100 text-green-800'
      case 'Closed Lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'bg-gray-100 text-gray-800'
      case 'Medium':
        return 'bg-blue-100 text-blue-800'
      case 'High':
        return 'bg-orange-100 text-orange-800'
      case 'Urgent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (showDealDetail && selectedDeal) {
    return (
      <DealDetail
        deal={selectedDeal}
        onClose={() => {
          setShowDealDetail(false)
          setSelectedDeal(null)
        }}
        onUpdate={handleDealUpdate}
      />
    )
  }

  if (activeView === 'pipeline') {
    return <DealPipeline />
  }

  if (activeView === 'metrics') {
    return <DealMetrics />
  }

  const metrics = getDealsMetrics()

  return (
    <div className="space-y-6">
      {/* New Deal Form Modal */}
      {showNewDealForm && (
        <DealForm
          deal={selectedDeal || undefined}
          onClose={() => {
            setShowNewDealForm(false)
            setSelectedDeal(null)
          }}
          onSuccess={handleDealSuccess}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Sales Deals</h1>
            <p className="ri-page-description">
              Manage your sales pipeline and track deal progress
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex bg-muted p-1 rounded-lg">
              <Button
                variant={activeView === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('list')}
              >
                List
              </Button>
              <Button
                variant={activeView === 'pipeline' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('pipeline')}
              >
                Pipeline
              </Button>
              <Button
                variant={activeView === 'metrics' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('metrics')}
              >
                Metrics
              </Button>
            </div>
            <Button onClick={() => setShowNewDealForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Deal
            </Button>
          </div>
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
            <div className="text-2xl font-bold">{metrics.totalDeals}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'All time'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Total opportunity value'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : `${metrics.wonDeals} deals won`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.avgDealSize)}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Average deal value'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Deals List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Deals</CardTitle>
              <CardDescription>
                Manage and track your sales deals
              </CardDescription>
            </div>
          </div>
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
            <Select
              value={stageFilter}
              onValueChange={setStageFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                <SelectItem value="Negotiation">Negotiation</SelectItem>
                <SelectItem value="Closed Won">Closed Won</SelectItem>
                <SelectItem value="Closed Lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={priorityFilter}
              onValueChange={setPriorityFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                className="ri-table-row"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-semibold">{deal.customer_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {deal.vehicle_info || 'No vehicle specified'}
                      </p>
                    </div>
                    <Badge className={getStageColor(deal.stage)}>
                      {deal.stage}
                    </Badge>
                    <Badge className={getPriorityColor(deal.priority || 'Medium')} variant="outline">
                      {deal.priority || 'Medium'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">{formatCurrency(deal.amount || 0)}</span>
                    {deal.rep_name && <span> • Rep: {deal.rep_name}</span>}
                    <span> • Created: {formatDate(deal.created_at)}</span>
                    {deal.expected_close_date && (
                      <span> • Expected: {formatDate(deal.expected_close_date)}</span>
                    )}
                  </div>
                </div>
                <div className="ri-action-buttons">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDeal(deal)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditDeal(deal)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            
            {!loading && filteredDeals.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                {deals.length === 0 ? (
                  <>
                    <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No deals yet</p>
                    <p className="text-sm">Create your first deal to get started</p>
                  </>
                ) : (
                  <>
                    <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No deals found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CRMSalesDeal() {
  return (
    <Routes>
      <Route path="/" element={<CRMSalesDealDashboard />} />
      <Route path="/pipeline" element={<DealPipeline />} />
      <Route path="/metrics" element={<DealMetrics />} />
      <Route path="/*" element={<CRMSalesDealDashboard />} />
    </Routes>
  )
}