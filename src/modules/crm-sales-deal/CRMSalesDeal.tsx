import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Target, Plus, Search, Filter, DollarSign, TrendingUp, Users, MapPin, Settings, BarChart3 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useDealManagement } from './hooks/useDealManagement'
import { DealPipeline } from './components/DealPipeline'
import { DealMetrics } from './components/DealMetrics'
import { WinLossAnalysis } from './components/WinLossAnalysis'
import { DealDetail } from './components/DealDetail'
import { TerritoryManagement } from './components/TerritoryManagement'
import { ApprovalWorkflows } from './components/ApprovalWorkflows'
import { DealForm } from './components/DealForm'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'

// Static configuration data
const dealStages = ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost']
const dealSources = ['Walk-in', 'Online', 'Referral', 'Trade Show', 'Phone Call', 'Email Campaign']
const dealTypes = ['New Sale', 'Trade-in', 'Lease', 'Financing']
const priorities = ['Low', 'Medium', 'High', 'Urgent']

const stageColors = {
  'New': 'bg-gray-100 text-gray-800',
  'Qualified': 'bg-blue-100 text-blue-800',
  'Proposal Sent': 'bg-yellow-100 text-yellow-800',
  'Negotiation': 'bg-orange-100 text-orange-800',
  'Closed Won': 'bg-green-100 text-green-800',
  'Closed Lost': 'bg-red-100 text-red-800'
}

const priorityColors = {
  'Low': 'bg-gray-100 text-gray-800',
  'Medium': 'bg-blue-100 text-blue-800',
  'High': 'bg-orange-100 text-orange-800',
  'Urgent': 'bg-red-100 text-red-800'
}

// Mock data for now - will be replaced with Supabase in future phases
const sampleDeals = [
  {
    id: 'deal-001',
    customerId: 'cust-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '(555) 123-4567',
    vehicleId: 'veh-001',
    vehicleInfo: '2023 Forest River Cherokee 274RK',
    stage: 'Qualified',
    amount: 35000,
    source: 'Referral',
    type: 'New Sale',
    priority: 'High',
    repId: 'rep-001',
    repName: 'Jamie Closer',
    probability: 75,
    expectedCloseDate: '2024-02-15',
    createdAt: '2024-01-10T09:30:00Z',
    updatedAt: '2024-01-20T14:22:00Z',
    notes: 'Customer very interested, ready to move forward with financing'
  },
  {
    id: 'deal-002',
    customerId: 'cust-002',
    customerName: 'Maria Rodriguez',
    customerEmail: 'maria.rodriguez@email.com',
    customerPhone: '(555) 987-6543',
    vehicleId: 'veh-002',
    vehicleInfo: '2024 Keystone Montana 3761FL',
    stage: 'Proposal Sent',
    amount: 62000,
    source: 'Trade Show',
    type: 'New Sale',
    priority: 'Medium',
    repId: 'rep-002',
    repName: 'Avery Seller',
    probability: 60,
    expectedCloseDate: '2024-02-28',
    createdAt: '2024-01-05T11:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    notes: 'Proposal sent, waiting for customer decision'
  }
]

// Define types for the component
interface Deal {
  id: string
  name: string
  customerName: string
  customerEmail: string
  customerPhone: string
  vehicleInfo: string
  stage: string
  amount: number
  source: string
  type: string
  priority: string
  repName: string
  probability: number
  expectedCloseDate: string
  createdAt: string
  updatedAt: string
  notes: string
  status: string
  value: number
  assignedTo: string
  territoryId?: string
  requiresApproval?: boolean
}

function DealsList({ deals = [] }: { deals?: Deal[] }) {
  const {
    territories,
    approvalWorkflows,
    winLossReports,
    stageHistory,
    createDeal,
    updateDealStage,
    assignTerritory,
    createApprovalWorkflow,
    createWinLossReport,
    getDealMetrics
  } = useDealManagement() || {}

  const { leads, salesReps } = useLeadManagement()
  const { vehicles } = useInventoryManagement()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [repFilter, setRepFilter] = useState<string>('all')
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  
  // Use sample deals for now - will be replaced with Supabase hook in future phases
  const [showDealForm, setShowDealForm] = useState(false)
  const [activeTab, setActiveTab] = useState('pipeline')
  const [showDealDetail, setShowDealDetail] = useState(false)
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'active': 'bg-blue-50 text-blue-700 border-blue-200',
      'won': 'bg-green-50 text-green-700 border-green-200',
      'lost': 'bg-red-50 text-red-700 border-red-200',
      'on_hold': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'cancelled': 'bg-gray-50 text-gray-700 border-gray-200'
    }
    return statusColors[status] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  // Use sample deals for now since useDealManagement might not be implemented yet
  const allDeals = deals.length > 0 ? deals : sampleDeals
  
  const filteredDeals = (allDeals || []).filter((deal: any) => {
    const matchesSearch = 
      (deal.name || deal.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStage = stageFilter === 'all' || deal.stage === stageFilter
    const matchesRep = repFilter === 'all' || deal.assignedTo === repFilter

    return matchesSearch && matchesStage && matchesRep
  })

  const handleDealStageChange = async (dealId: string, newStage: string) => {
    try {
      updateDealStage && await updateDealStage(dealId, newStage)

      // Show success toast
      const deal = allDeals.find((d: any) => d.id === dealId)
      if (deal) {
        toast({
          title: 'Deal Stage Updated',
          description: `${deal.name || deal.customerName} moved to ${newStage.replace('_', ' ').toLowerCase()}`,
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update deal stage',
        variant: 'destructive'
      })
    }
  }

  const handleDealClick = (deal: any) => {
    setSelectedDeal(deal)
    setShowDealDetail(true)
  }

  const handleCreateDeal = () => {
    setSelectedDeal(null)
    setShowDealForm(true)
  }

  const handleEditDeal = (deal: any) => {
    setSelectedDeal(deal)
    setShowDealForm(true)
  }

  const handleSaveDeal = async (dealData: any) => {
    if (selectedDeal) {
      // Update existing deal
      updateDealStage && await updateDealStage(selectedDeal.id, dealData.stage || selectedDeal.stage)
    } else {
      // Create new deal
      createDeal && await createDeal(dealData)
    }
    setShowDealForm(false)
    setSelectedDeal(null)
  }

  const handleCreateApproval = async (dealId: string, workflowType: string) => {
    createApprovalWorkflow && await createApprovalWorkflow(dealId, workflowType)
  }

  const handleCreateWinLossReport = async (dealId: string, outcome: 'won' | 'lost', reportData: any) => {
    createWinLossReport && await createWinLossReport(dealId, outcome, reportData)
  }

  const metrics = getDealMetrics ? getDealMetrics() : {
    totalValue: 0,
    totalDeals: 0,
    winRate: 0,
    wonDeals: 0,
    averageDealSize: 0,
    averageSalesCycle: 0
  }

  // Mock products for the form
  const mockProducts = (vehicles || []).map((vehicle: any) => ({
    id: vehicle.id,
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    price: vehicle.price,
    category: 'vehicle'
  })).concat([
    {
      id: 'prod-001',
      name: 'Extended Warranty Package',
      price: 3500,
      category: 'warranty'
    },
    {
      id: 'prod-002',
      name: 'Premium Interior Upgrade',
      price: 2200,
      category: 'upgrade'
    },
    {
      id: 'prod-003',
      name: 'Solar Panel Package',
      price: 3500,
      category: 'accessory'
    }
  ])

  return (
    <div className="space-y-8">
      {/* Deal Detail Modal */}
      {showDealDetail && selectedDeal && (
        <DealDetail
          deal={selectedDeal}
          onClose={() => setShowDealDetail(false)}
          onEdit={handleEditDeal}
        />
      )}

      {/* Deal Form Modal */}
      {showDealForm && (
        <DealForm
          deal={selectedDeal || undefined}
          customers={leads}
          salesReps={salesReps}
          territories={territories}
          products={mockProducts}
          onSave={handleSaveDeal}
          onCancel={() => {
            setShowDealForm(false)
            setSelectedDeal(null)
          }}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Sales Deal Management</h1>
            <p className="ri-page-description">
              Track deals through the sales pipeline with approvals and territory management
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleCreateDeal}>
            <Plus className="h-4 w-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(metrics.totalValue)}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {metrics.totalDeals} active deals
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{metrics.winRate.toFixed(1)}%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {metrics.wonDeals} won deals
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Avg Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{formatCurrency(metrics.averageDealSize)}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {metrics.averageSalesCycle.toFixed(0)} day cycle
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Territories</CardTitle>
            <MapPin className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{territories.length}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <Users className="h-3 w-3 mr-1" />
              Active territories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="territories">Territories</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          <DealPipeline 
            deals={allDeals} 
            onDealStageChange={handleDealStageChange} 
            onDealClick={handleDealClick}
          />
        </TabsContent>

        <TabsContent value="deals" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ri-search-input shadow-sm"
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {dealStages.map(stage => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={repFilter} onValueChange={setRepFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sales Rep" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reps</SelectItem>
                {(salesReps || []).map((rep: any) => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Deals Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Deals ({filteredDeals.length})</CardTitle>
              <CardDescription>
                Manage your sales pipeline and deal progression
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDeals.map((deal) => (
                  <div key={deal.id} className="ri-table-row cursor-pointer" onClick={() => handleEditDeal(deal)}>
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-foreground">{deal.customerName}</h3>
                          <Badge className={cn("ri-badge-status", stageColors[deal.stage as keyof typeof stageColors] || 'bg-gray-100 text-gray-800')}>
                            {deal.stage.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {deal.type}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-2 text-blue-500" />
                            {deal.customerName}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-2 text-green-500" />
                            {formatCurrency(deal.amount)}
                          </span>
                          <span className="flex items-center">
                            <Target className="h-3 w-3 mr-2 text-purple-500" />
                            {deal.probability}% probability
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-2 text-orange-500" />
                            {(territories || []).find((t: any) => t.id === deal.territoryId)?.name || 'No Territory'}
                          </span>
                        </div>
                        {deal.notes && (
                          <p className="text-sm text-muted-foreground mt-2 bg-muted/30 p-2 rounded-md">
                            {deal.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ri-action-buttons">
                      <Button variant="outline" size="sm" className="shadow-sm" onClick={(e) => {
                        e.stopPropagation()
                        handleDealClick(deal)
                      }}>
                        View
                      </Button>
                      {deal.requiresApproval && (
                        <Button variant="outline" size="sm" className="shadow-sm" onClick={(e) => {
                          e.stopPropagation()
                          handleCreateApproval(deal.id, 'deal_value')
                        }}>
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {filteredDeals.length === 0 && (
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No deals found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Tabs defaultValue="metrics" className="space-y-6">
            <TabsList>
              <TabsTrigger value="metrics">Deal Metrics</TabsTrigger>
              <TabsTrigger value="win-loss">Win/Loss Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics">
              <DealMetrics metrics={metrics} />
            </TabsContent>

            <TabsContent value="win-loss">
              <WinLossAnalysis 
                deals={allDeals} 
                winLossReports={winLossReports || []}
                onCreateReport={handleCreateWinLossReport}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="territories" className="space-y-6">
          <TerritoryManagement 
            territories={territories || []}
            salesReps={salesReps || []}
            deals={allDeals}
            onCreateTerritory={() => {}}
            onUpdateTerritory={() => {}}
            onDeleteTerritory={() => {}}
          />
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <ApprovalWorkflows 
            deals={allDeals}
            approvalWorkflows={approvalWorkflows || []}
            onApprove={() => {}}
            onReject={() => {}}
            onEscalate={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function CRMSalesDeal() {
  return (
    <Routes>
      <Route path="/" element={<DealsList />} />
      <Route path="/*" element={<DealsList />} />
    </Routes>
  )
}
}