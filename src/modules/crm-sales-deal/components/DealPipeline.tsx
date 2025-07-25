import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Edit } from 'lucide-react'
import { Deal, useDealManagement } from '../hooks/useDealManagement'
import { DealForm } from './DealForm'
import { DealDetail } from './DealDetail'
import { formatCurrency } from '@/lib/utils'

export function DealPipeline() {
  const { deals, loading, getDealsMetrics } = useDealManagement()
  const [showNewDealForm, setShowNewDealForm] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [showDealDetail, setShowDealDetail] = useState(false)

  const dealStages = ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost']
  
  const getDealsByStage = (stage: string) => {
    return deals.filter(deal => deal.stage === stage)
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

  const handleViewDeal = (deal: Deal) => {
    setSelectedDeal(deal)
    setShowDealDetail(true)
  }

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal)
    setShowNewDealForm(true)
  }

  const handleDealSuccess = (deal: Deal) => {
    setShowNewDealForm(false)
    setSelectedDeal(null)
  }

  const handleDealUpdate = (updatedDeal: Deal) => {
    setSelectedDeal(updatedDeal)
  }

  const metrics = getDealsMetrics()

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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales Pipeline</h1>
          <p className="text-muted-foreground">
            Track deals through your sales process
          </p>
        </div>
        <Button onClick={() => setShowNewDealForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Deal
        </Button>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Deals</p>
                <p className="text-2xl font-bold">{metrics.totalDeals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Deal Size</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.avgDealSize)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading pipeline...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {dealStages.map((stage) => {
            const stageDeals = getDealsByStage(stage)
            const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.amount || 0), 0)
            
            return (
              <Card key={stage} className="min-h-[400px]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{stage}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {stageDeals.length}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {formatCurrency(stageValue)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => handleViewDeal(deal)}
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm truncate">
                          {deal.customer_name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {deal.vehicle_info || 'No vehicle specified'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {formatCurrency(deal.amount || 0)}
                          </span>
                          <Badge className={getStageColor(deal.stage)} variant="secondary">
                            {deal.probability || 0}%
                          </Badge>
                        </div>
                        {deal.rep_name && (
                          <p className="text-xs text-muted-foreground">
                            Rep: {deal.rep_name}
                          </p>
                        )}
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewDeal(deal)
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditDeal(deal)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {stageDeals.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-xs">No deals in this stage</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DealPipeline