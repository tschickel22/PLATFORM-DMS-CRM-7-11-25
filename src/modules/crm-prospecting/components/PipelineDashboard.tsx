import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Users, DollarSign, Calendar, ArrowRight } from 'lucide-react'
import { Lead } from '@/types'
import { useLeadManagement } from '../hooks/useLeadManagement'

// Static configuration data
const pipelineStages = [
  { id: 'new', name: 'New Inquiry', color: 'bg-blue-100 text-blue-800' },
  { id: 'contacted', name: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'qualified', name: 'Qualified', color: 'bg-green-100 text-green-800' },
  { id: 'converted', name: 'Converted', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'lost', name: 'Lost', color: 'bg-red-100 text-red-800' }
]

export function PipelineDashboard() {
  const { leads, loading, error, getLeadStats } = useLeadManagement()

  const stats = getLeadStats()

  // Calculate pipeline data
  const pipelineData = React.useMemo(() => {
    return pipelineStages.map(stage => {
      const stageLeads = leads.filter(lead => lead.status === stage.id)
      const totalValue = stageLeads.reduce((sum, lead) => {
        const estimatedValue = lead.customFields?.estimatedValue || 0
        return sum + (typeof estimatedValue === 'number' ? estimatedValue : 0)
      }, 0)
      
      return {
        ...stage,
        count: stageLeads.length,
        value: totalValue,
        leads: stageLeads
      }
    })
  }, [leads])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Sales Pipeline</h1>
          <p className="ri-page-description">Track leads through your sales process</p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pipeline data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Sales Pipeline</h1>
          <p className="ri-page-description">Track leads through your sales process</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-red-600 mb-4">
              <TrendingUp className="h-12 w-12 mx-auto mb-2" />
              <p className="font-semibold">Error Loading Pipeline</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <h1 className="ri-page-title">Sales Pipeline</h1>
        <p className="ri-page-description">
          Track leads through your sales process
        </p>
      </div>

      {/* Pipeline Stats */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${pipelineData.reduce((sum, stage) => sum + stage.value, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all stages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round(((stats.byStatus.converted || 0) / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Leads to customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter(lead => !['converted', 'lost'].includes(lead.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <div className="grid gap-6 md:grid-cols-5">
        {pipelineData.map((stage, index) => (
          <Card key={stage.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                {index < pipelineData.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{stage.count}</div>
                <div className="text-xs text-muted-foreground">
                  ${stage.value.toLocaleString()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {stage.leads.slice(0, 3).map((lead) => (
                  <div
                    key={lead.id}
                    className="p-2 bg-muted/30 rounded-md text-sm"
                  >
                    <div className="font-medium">
                      {lead.firstName} {lead.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {lead.source}
                    </div>
                  </div>
                ))}
                
                {stage.leads.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center py-1">
                    +{stage.leads.length - 3} more
                  </div>
                )}
                
                {stage.leads.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    No leads in this stage
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Health</CardTitle>
          <CardDescription>
            Overview of lead progression through your sales pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {pipelineData.map((stage) => {
              const percentage = stats.total > 0 ? (stage.count / stats.total) * 100 : 0
              
              return (
                <div key={stage.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge className={stage.color}>
                        {stage.name}
                      </Badge>
                      <span className="text-sm font-medium">{stage.count} leads</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Lead Activity</CardTitle>
          <CardDescription>
            Latest updates from your sales team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads
              .filter(lead => lead.lastActivity)
              .sort((a, b) => {
                const dateA = a.lastActivity ? new Date(a.lastActivity).getTime() : 0
                const dateB = b.lastActivity ? new Date(b.lastActivity).getTime() : 0
                return dateB - dateA
              })
              .slice(0, 5)
              .map((lead) => (
                <div key={lead.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {lead.firstName} {lead.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status: {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lead.lastActivity ? new Date(lead.lastActivity).toLocaleDateString() : 'No activity'}
                    </p>
                  </div>
                </div>
              ))}
            
            {leads.filter(lead => lead.lastActivity).length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}