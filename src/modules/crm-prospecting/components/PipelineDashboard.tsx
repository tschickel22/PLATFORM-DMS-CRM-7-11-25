import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Users, DollarSign, Calendar, ArrowRight } from 'lucide-react'
import { Lead } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { mockCrmProspecting } from '@/mocks/crmProspectingMock'

interface PipelineDashboardProps {
  leads: Lead[]
  onLeadMove?: (leadId: string, newStage: string) => void
}

export function PipelineDashboard({ leads, onLeadMove }: PipelineDashboardProps) {
  // Use mock data as fallback for pipeline stages
  const pipelineStages = mockCrmProspecting.pipelines
  
  const [stageData, setStageData] = useState<Array<{
    stage: string
    value: number
    conversionRate: number
  }>>([])

  useEffect(() => {
    // Calculate stage metrics
    const data = mockCrmProspecting.pipelines.map(stage => {
      const stageLeads = leads.filter(lead => mockCrmProspecting.pipelines.includes(lead.customFields?.pipelineStage))
      const value = stageLeads.reduce((sum, lead) => sum + (lead.customFields?.estimatedValue || 0), 0)
      
      return {
        stage,
        count: stageLeads.length,
        value,
        conversionRate: Math.random() * 100 // Mock conversion rate
      }
    })
    
    setStageData(data)
  }, [leads, pipelineStages])

  const totalValue = stageData.reduce((sum, stage) => sum + stage.value, 0)
  const totalLeads = stageData.reduce((sum, stage) => sum + stage.count, 0)

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue / Math.max(totalLeads, 1))}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Pipeline</CardTitle>
          <CardDescription>
            Track leads through your sales process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {mockCrmProspecting.pipelines.map((stage, index) => {
              const data = stageData.find(s => s.stage === stage)
              const isLast = index === mockCrmProspecting.pipelines.length - 1
              
              return (
                <div key={stage} className="flex items-center">
                  <div className="flex-1">
                    <Card className="h-32">
                      <CardContent className="p-4 h-full flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-sm mb-1">{stage}</h3>
                          <div className="text-2xl font-bold">{data?.count || 0}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(data?.value || 0)}
                          </div>
                          <Progress 
                            value={data?.conversionRate || 0} 
                            className="h-1 mt-1"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  {!isLast && (
                    <div className="mx-2 flex-shrink-0">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Pipeline Activity</CardTitle>
          <CardDescription>
            Latest updates and movements in your pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                  <Badge variant="secondary">
                    {lead.customFields?.pipelineStage || 'New Inquiry'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {formatCurrency(lead.customFields?.estimatedValue || 0)}
                  </span>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}