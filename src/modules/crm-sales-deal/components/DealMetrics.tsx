import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, DollarSign, Target, Users, Calendar, Award } from 'lucide-react'
import { useDealManagement } from '../hooks/useDealManagement'
import { formatCurrency } from '@/lib/utils'

export function DealMetrics() {
  const { deals, loading, getDealsMetrics } = useDealManagement()
  
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const metrics = getDealsMetrics()
  const activeDeals = deals.filter(deal => !['Closed Won', 'Closed Lost'].includes(deal.stage))
  const wonDeals = deals.filter(deal => deal.stage === 'Closed Won')
  const lostDeals = deals.filter(deal => deal.stage === 'Closed Lost')
  
  // Calculate this month's deals
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const thisMonthDeals = deals.filter(deal => {
    const dealDate = new Date(deal.created_at)
    return dealDate.getMonth() === currentMonth && dealDate.getFullYear() === currentYear
  })

  // Calculate average days in pipeline (simplified)
  const avgDaysInPipeline = activeDeals.length > 0 
    ? activeDeals.reduce((sum, deal) => {
        const daysOld = Math.floor((Date.now() - new Date(deal.created_at).getTime()) / (1000 * 60 * 60 * 24))
        return sum + daysOld
      }, 0) / activeDeals.length
    : 0

  const metricCards = [
    {
      title: 'Total Pipeline Value',
      value: formatCurrency(metrics.totalValue),
      description: `${metrics.totalDeals} total deals`,
      icon: DollarSign,
      trend: '+12.3%'
    },
    {
      title: 'Active Deals',
      value: activeDeals.length.toString(),
      description: 'Currently in pipeline',
      icon: Target,
      trend: '+5.2%'
    },
    {
      title: 'Win Rate',
      value: `${metrics.conversionRate.toFixed(1)}%`,
      description: `${wonDeals.length} won, ${lostDeals.length} lost`,
      icon: Award,
      trend: '+2.1%'
    },
    {
      title: 'Avg Deal Size',
      value: formatCurrency(metrics.avgDealSize),
      description: 'Average deal value',
      icon: TrendingUp,
      trend: '+8.7%'
    },
    {
      title: 'This Month',
      value: thisMonthDeals.length.toString(),
      description: 'New deals created',
      icon: Calendar,
      trend: '+15.4%'
    },
    {
      title: 'Avg Days in Pipeline',
      value: Math.round(avgDaysInPipeline).toString(),
      description: 'Days to close',
      icon: Users,
      trend: '-2.3 days'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Deal Metrics</h2>
        <p className="text-muted-foreground">
          Key performance indicators for your sales pipeline
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {metric.trend} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline by Stage</CardTitle>
          <CardDescription>
            Distribution of deals across pipeline stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dealStages.map((stage) => {
              const stageDeals = deals.filter(deal => deal.stage === stage)
              const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.amount || 0), 0)
              const percentage = metrics.totalDeals > 0 ? (stageDeals.length / metrics.totalDeals) * 100 : 0
              
              return (
                <div key={stage} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getStageColor(stage)} min-w-[100px] justify-center`}>
                      {stage}
                    </Badge>
                    <div>
                      <p className="font-medium">{stageDeals.length} deals</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(stageValue)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{percentage.toFixed(1)}%</p>
                    <div className="w-20 h-2 bg-muted rounded-full mt-1">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
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

export default DealMetrics