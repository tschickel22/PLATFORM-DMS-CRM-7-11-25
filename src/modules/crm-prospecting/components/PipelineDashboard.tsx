import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock data for pipeline
const mockLeads = [
  {
    id: 'lead-001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    source: 'Website',
    status: 'New',
    score: 85,
    estimatedValue: 45000,
    lastActivity: '2024-01-20T10:30:00Z',
    assignedTo: 'Sales Rep 1',
    notes: 'Interested in Class A Motorhome',
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'lead-002',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@email.com',
    phone: '(555) 987-6543',
    source: 'Referral',
    status: 'Qualified',
    score: 92,
    estimatedValue: 62000,
    lastActivity: '2024-01-19T14:15:00Z',
    assignedTo: 'Sales Rep 2',
    notes: 'Looking for Fifth Wheel for retirement',
    createdAt: '2024-01-10T11:30:00Z'
  },
  {
    id: 'lead-003',
    firstName: 'David',
    lastName: 'Johnson',
    email: 'david.johnson@email.com',
    phone: '(555) 456-7890',
    source: 'Trade Show',
    status: 'Proposal',
    score: 78,
    estimatedValue: 38000,
    lastActivity: '2024-01-18T16:45:00Z',
    assignedTo: 'Sales Rep 1',
    notes: 'Needs financing options',
    createdAt: '2024-01-08T13:20:00Z'
  },
  {
    id: 'lead-004',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@email.com',
    phone: '(555) 234-5678',
    source: 'Phone Call',
    status: 'Negotiation',
    score: 95,
    estimatedValue: 75000,
    lastActivity: '2024-01-17T12:00:00Z',
    assignedTo: 'Sales Rep 3',
    notes: 'Ready to close, discussing final terms',
    createdAt: '2024-01-05T10:15:00Z'
  }
]

const pipelineStages = [
  { id: 'new', name: 'New', color: 'bg-gray-100 text-gray-800' },
  { id: 'contacted', name: 'Contacted', color: 'bg-blue-100 text-blue-800' },
  { id: 'qualified', name: 'Qualified', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'proposal', name: 'Proposal', color: 'bg-orange-100 text-orange-800' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-purple-100 text-purple-800' },
  { id: 'closed_won', name: 'Closed Won', color: 'bg-green-100 text-green-800' },
  { id: 'closed_lost', name: 'Closed Lost', color: 'bg-red-100 text-red-800' }
]

export default function PipelineDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [assignedToFilter, setAssignedToFilter] = useState('all')

  // Filter leads based on search and filters
  const filteredLeads = useMemo(() => {
    return mockLeads.filter(lead => {
      const matchesSearch = searchQuery === '' || 
        `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery)

      const matchesStatus = statusFilter === 'all' || 
        lead.status.toLowerCase() === statusFilter.toLowerCase()

      const matchesSource = sourceFilter === 'all' || 
        lead.source.toLowerCase() === sourceFilter.toLowerCase()

      const matchesAssignedTo = assignedToFilter === 'all' || 
        lead.assignedTo === assignedToFilter

      return matchesSearch && matchesStatus && matchesSource && matchesAssignedTo
    })
  }, [searchQuery, statusFilter, sourceFilter, assignedToFilter, mockLeads])

  // Calculate pipeline metrics
  const pipelineMetrics = useMemo(() => {
    const totalLeads = filteredLeads.length
    const totalValue = filteredLeads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0)
    const avgScore = totalLeads > 0 
      ? filteredLeads.reduce((sum, lead) => sum + (lead.score || 0), 0) / totalLeads 
      : 0
    
    const stageDistribution = pipelineStages.map(stage => {
      const stageLeads = filteredLeads.filter(lead => 
        lead.status.toLowerCase() === stage.id.replace('_', ' ').toLowerCase()
      )
      return {
        ...stage,
        count: stageLeads.length,
        value: stageLeads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0)
      }
    })

    return {
      totalLeads,
      totalValue,
      avgScore,
      stageDistribution
    }
  }, [filteredLeads])

  const getStatusColor = (status: string) => {
    const stage = pipelineStages.find(s => 
      s.name.toLowerCase() === status.toLowerCase()
    )
    return stage?.color || 'bg-gray-100 text-gray-800'
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Pipeline Dashboard</h1>
            <p className="ri-page-description">
              Track and manage your sales pipeline
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pipelineMetrics.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Active in pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pipelineMetrics.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Total estimated value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(pipelineMetrics.avgScore)}</div>
            <p className="text-xs text-muted-foreground">
              Lead quality score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Stages</CardTitle>
          <CardDescription>
            Distribution of leads across pipeline stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {pipelineMetrics.stageDistribution.map((stage) => (
              <div key={stage.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{stage.name}</span>
                  <Badge className={stage.color}>
                    {stage.count}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(stage.value)}
                </div>
                <Progress 
                  value={pipelineMetrics.totalLeads > 0 ? (stage.count / pipelineMetrics.totalLeads) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Pipeline</CardTitle>
          <CardDescription>
            Manage and track your sales leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ri-search-input"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {pipelineStages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="trade show">Trade Show</SelectItem>
                <SelectItem value="phone call">Phone Call</SelectItem>
              </SelectContent>
            </Select>

            <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Rep" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reps</SelectItem>
                <SelectItem value="Sales Rep 1">Sales Rep 1</SelectItem>
                <SelectItem value="Sales Rep 2">Sales Rep 2</SelectItem>
                <SelectItem value="Sales Rep 3">Sales Rep 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leads List */}
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="ri-table-row">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-semibold">
                        {lead.firstName} {lead.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {lead.email} • {lead.phone}
                      </p>
                    </div>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                    <Badge variant="outline">
                      {lead.source}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Value:</span>{' '}
                      <span className="font-medium">{formatCurrency(lead.estimatedValue)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Score:</span>{' '}
                      <span className={`font-medium ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Assigned to:</span>{' '}
                      <span className="font-medium">{lead.assignedTo}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last activity: {formatDate(lead.lastActivity)}
                    </div>
                  </div>
                  {lead.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {lead.notes}
                    </p>
                  )}
                </div>
                <div className="ri-action-buttons">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredLeads.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No leads found matching your criteria</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}