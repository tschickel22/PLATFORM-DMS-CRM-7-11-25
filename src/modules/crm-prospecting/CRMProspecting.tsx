import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Users, Plus, Search, Filter, TrendingUp, Phone, Mail, Calendar } from 'lucide-react'
import { Lead, LeadStatus } from '@/types'
import { useLeadManagement } from './hooks/useLeadManagement'
import { NewLeadForm } from './components/NewLeadForm'
import { PipelineDashboard } from './components/PipelineDashboard'
import { useToast } from '@/hooks/use-toast'

// Static configuration data
const leadSources = ['Walk-In', 'Referral', 'Website', 'Phone Call', 'Social Media', 'Trade Show']
const leadStatuses = ['new', 'contacted', 'qualified', 'lost', 'converted']

function CRMProspectingDashboard() {
  const { toast } = useToast()
  const {
    leads,
    loading,
    error,
    createLead,
    updateLead,
    deleteLead,
    searchLeads,
    getLeadStats,
    refreshLeads
  } = useLeadManagement()

  const [showNewLeadForm, setShowNewLeadForm] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')

  // Get filtered leads
  const filteredLeads = React.useMemo(() => {
    let result = searchQuery ? searchLeads(searchQuery) : leads

    if (statusFilter !== 'all') {
      result = result.filter(lead => lead.status === statusFilter)
    }

    if (sourceFilter !== 'all') {
      result = result.filter(lead => lead.source === sourceFilter)
    }

    return result
  }, [leads, searchQuery, statusFilter, sourceFilter, searchLeads])

  const stats = getLeadStats()

  const handleCreateLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead = await createLead(leadData)
    if (newLead) {
      setShowNewLeadForm(false)
      toast({
        title: 'Lead Created',
        description: `${newLead.firstName} ${newLead.lastName} has been added to your CRM.`
      })
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create lead. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
    const success = await updateLead(id, updates)
    if (success) {
      toast({
        title: 'Lead Updated',
        description: 'Lead information has been updated successfully.'
      })
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update lead. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteLead = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      const success = await deleteLead(id)
      if (success) {
        toast({
          title: 'Lead Deleted',
          description: 'Lead has been removed from your CRM.'
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete lead. Please try again.',
          variant: 'destructive'
        })
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'qualified':
        return 'bg-green-100 text-green-800'
      case 'lost':
        return 'bg-red-100 text-red-800'
      case 'converted':
        return 'bg-emerald-100 text-emerald-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Show error state
  if (error && leads.length === 0) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">CRM Prospecting</h1>
          <p className="ri-page-description">Manage your leads and prospects</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-red-600 mb-4">
              <Users className="h-12 w-12 mx-auto mb-2" />
              <p className="font-semibold">Error Loading Leads</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={refreshLeads}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* New Lead Form Modal */}
      {showNewLeadForm && (
        <NewLeadForm
          onClose={() => setShowNewLeadForm(false)}
          onSuccess={handleCreateLead}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">CRM Prospecting</h1>
            <p className="ri-page-description">
              Manage your leads and prospects
            </p>
          </div>
          <Button onClick={() => setShowNewLeadForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Active prospects'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byStatus.qualified || 0}</div>
            <p className="text-xs text-muted-foreground">
              Ready for conversion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.avgScore)}</div>
            <p className="text-xs text-muted-foreground">
              Lead quality score
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

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
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
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {leadStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {leadSources.map(source => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
          <CardDescription>
            {loading ? 'Loading leads...' : `${filteredLeads.length} leads found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading leads...</p>
            </div>
          ) : filteredLeads.length > 0 ? (
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="ri-table-row"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-semibold">
                          {lead.firstName} {lead.lastName}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {lead.email}
                          </span>
                          {lead.phone && (
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {lead.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lead.source}
                      </p>
                    </div>
                    
                    <div className="ri-action-buttons">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLead(lead)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteLead(lead.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              {leads.length === 0 ? (
                <>
                  <p>No leads yet</p>
                  <p className="text-sm">Create your first lead to get started</p>
                </>
              ) : (
                <>
                  <p>No leads found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Banner */}
      {error && leads.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-700">{error}</p>
              <Button variant="outline" size="sm" onClick={refreshLeads}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function CRMProspecting() {
  return (
    <Routes>
      <Route path="/" element={<CRMProspectingDashboard />} />
      <Route path="/pipeline" element={<PipelineDashboard />} />
      <Route path="/*" element={<CRMProspectingDashboard />} />
    </Routes>
  )
}