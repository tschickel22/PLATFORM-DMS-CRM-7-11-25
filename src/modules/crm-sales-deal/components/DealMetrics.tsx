import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { mockCrmSalesDeal } from '@/mocks/crmSalesDealMock'

export function DealMetrics() {
  // Safety check to ensure metrics data is available
  const metrics = mockCrmSalesDeal?.metrics
  
  if (!metrics) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading metrics...</p>
        </div>
      </div>
    )
  }

  const metricCards = [
    {
      title: 'Total Deals',
      value: metrics.totalDeals.toString(),
      icon: Target,
      trend: '+12%',
      trendDirection: 'up' as const
    },
    {
      title: 'Pipeline Value',
      value: formatCurrency(metrics.totalValue),
      icon: DollarSign,
      trend: '+8.5%',
      trendDirection: 'up' as const
    },
    {
      title: 'Average Deal Size',
      value: formatCurrency(metrics.avgDealSize),
      icon: TrendingUp,
      trend: '+5.2%',
      trendDirection: 'up' as const
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate}%`,
      icon: Users,
      trend: '-2.1%',
      trendDirection: 'down' as const
    },
    {
      title: 'Avg Sales Cycle',
      value: `${metrics.avgSalesCycle} days`,
      icon: Calendar,
      trend: '-3 days',
      trendDirection: 'up' as const
    },
    {
      title: 'Monthly Growth',
      value: `${metrics.monthlyGrowth}%`,
      icon: TrendingUp,
      trend: '+1.8%',
      trendDirection: 'up' as const
    }
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
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
              <div className="flex items-center space-x-1 mt-1">
                {metric.trendDirection === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={`text-xs ${
                  metric.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend}
                </span>
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline by Stage */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline by Stage</CardTitle>
          <CardDescription>
            Deal distribution across sales stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.pipelineByStage?.map((stage, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">{stage.stage}</Badge>
                  <span className="font-medium">{stage.count} deals</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(stage.value)}</div>
                  <div className="text-sm text-muted-foreground">
                    {((stage.value / metrics.totalValue) * 100).toFixed(1)}% of pipeline
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-4 text-muted-foreground">
                No pipeline data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
          <CardDescription>
            Deals closed and revenue by month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.monthlyPerformance?.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 text-center font-medium">{month.month}</div>
                  <div>
                    <div className="font-semibold">{month.deals} deals</div>
                    <div className="text-sm text-muted-foreground">closed</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(month.value)}</div>
                  <div className="text-sm text-muted-foreground">revenue</div>
                </div>
              </div>
            )) || (
              <div className="text-center py-4 text-muted-foreground">
                No performance data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}