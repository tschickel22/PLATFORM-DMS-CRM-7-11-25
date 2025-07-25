import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, DollarSign, TrendingUp, Users, Target } from 'lucide-react'
import { Deal, CRMContact } from '@/types'
import { useCrmDeals } from '@/hooks/useCrmDeals'
import { useContacts } from '@/hooks/useCrmSupabase'
import { formatCurrency } from '@/lib/utils'

const dealStages = [
  { name: 'New', color: 'bg-gray-100 text-gray-800' },
  { name: 'Qualified', color: 'bg-blue-100 text-blue-800' },
  { name: 'Proposal', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { name: 'Closed Won', color: 'bg-green-100 text-green-800' },
  { name: 'Closed Lost', color: 'bg-red-100 text-red-800' }
]

export default function DealPipeline() {
  const { deals, loading, error, metrics } = useCrmDeals()
  const { contacts, loading: contactsLoading } = useContacts()
  
  const [selectedStage, setSelectedStage] = useState<string>('all')
  const [showNewDealForm, setShowNewDealForm] = useState(false)

  const handleNewDeal = () => {
    setShowNewDealForm(true)
  }

  // Get contact name by customer_id
  const getContactName = (customerId?: string): string => {
    if (!customerId) return ''
    const contact = contacts.find(c => c.id === customerId)
    return contact ? `${contact.first_name} ${contact.last_name}` : ''
  }

  // Filter deals by selected stage
  const filteredDeals = selectedStage === 'all' 
    ? deals 
    : deals.filter(deal => deal.stage === selectedStage)

  return (
    <div className="space-y-6">
      {/* Supabase Status Banner */}
      <Alert>
        <AlertDescription>
          {loading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Loading deals from Supabase...
            </span>
          ) : error ? (
            <span>
              ⚠️ <strong>Connection Issue:</strong> {error}. Using mock data for demonstration.
            </span>
          ) : (
            <span>
              ✅ <strong>Live Data:</strong> Connected to Supabase successfully. 
              <code className="ml-2 text-xs">
                Deals: {deals.length}, Contacts: {contacts.length}
              </code>
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Deal Pipeline</h1>
            <p className="text-muted-foreground">
              Track and manage your sales opportunities
            </p>
          </div>
          <Button onClick={handleNewDeal}>
            <Plus className="h-4 w-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalDeals}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.avgDealSize)}
            </div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.winRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stage Filter */}
      <div className="flex space-x-2">
        <Button
          variant={selectedStage === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStage('all')}
        >
          All Stages
        </Button>
        {dealStages.map((stage) => (
          <Button
            key={stage.name}
            variant={selectedStage === stage.name ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStage(stage.name)}
          >
            {stage.name}
          </Button>
        ))}
      </div>

      {/* Deals List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedStage === 'all' ? 'All Deals' : `${selectedStage} Deals`}
          </CardTitle>
          <CardDescription>
            {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading deals...</p>
            </div>
          )}
          
          {!loading && (
            <>
          <div className="space-y-4">
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">
                      {deal.customer_id && getContactName(deal.customer_id) 
                        ? getContactName(deal.customer_id)
                        : deal.customer_name}
                    </h4>
                    <Badge className={dealStages.find(stage => stage.name === deal.stage)?.color}>
                      {deal.stage}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {deal.vehicle_info || 'No vehicle specified'}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span>Rep: {deal.rep_name}</span>
                    <span>Probability: {deal.probability}%</span>
                    <span>Expected Close: {deal.expected_close_date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {formatCurrency(deal.amount || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {deal.source}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredDeals.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No deals found</p>
              <p className="text-sm">Create your first deal to get started</p>
            </div>
          )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}