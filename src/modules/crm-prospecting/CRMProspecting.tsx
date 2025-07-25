import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { CRMContact } from '@/types'
import { useContacts, useDeals } from '@/hooks/useCrmSupabase'
import { useLeadManagement } from './hooks/useLeadManagement'
import { LeadIntakeFormBuilder } from './components/LeadIntakeForm'
import { NewLeadForm } from './components/NewLeadForm'
import { useToast } from '@/hooks/use-toast'
import { Lead } from '@/types'
import { Plus, Users, TrendingUp, Target, Search, Edit, Trash2 } from 'lucide-react'

function CRMProspectingDashboard() {
  const { contacts, loading: contactsLoading, createContact, updateContact, deleteContact } = useContacts()
  const { deals, loading: dealsLoading } = useDeals()
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState('leads')
  const [showNewLeadForm, setShowNewLeadForm] = useState(false)
  const [showLeadIntakeBuilder, setShowLeadIntakeBuilder] = useState(false)
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLead, setSelectedLead] = useState<CRMContact | null>(null)
  const [sourceFilter, setSourceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Filter contacts based on search and filters
  const filteredContacts = React.useMemo(() => {
    let filtered = contacts

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(contact =>
        contact.first_name.toLowerCase().includes(query) ||
        contact.last_name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter)
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(contact => contact.source === sourceFilter)
    }

    return filtered
  }, [contacts, searchQuery, statusFilter, sourceFilter])

  // Calculate metrics from live data
  const metrics = React.useMemo(() => {
    const totalLeads = contacts.length
    const newLeads = contacts.filter(c => c.status === 'new').length
    const qualifiedLeads = contacts.filter(c => c.status === 'qualified').length
    const convertedLeads = deals.filter(d => d.stage === 'Closed Won').length
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

    return {
      totalLeads,
      newLeads,
      qualifiedLeads,
      convertedLeads,
      conversionRate
    }
  }, [contacts, deals])

  const handleNewLeadSuccess = (newContact: CRMContact) => {
    setShowNewLeadForm(false)
    toast({
      title: 'Lead Created',
      description: `New lead ${newContact.first_name} ${newContact.last_name} has been added.`
    })
  }

  const handleEditLead = (contact: any) => {
    setSelectedLead(contact)
    setShowNewLeadForm(true)
  }

  const handleDeleteLead = async (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteContact(contactId)
        toast({
          title: 'Lead Deleted',
          description: 'Lead has been deleted successfully.'
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete lead.',
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
      case 'closed_won':
        return 'bg-emerald-100 text-emerald-800'
      case 'closed_lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'website':
        return 'bg-purple-100 text-purple-800'
      case 'referral':
        return 'bg-green-100 text-green-800'
      case 'phone':
        return 'bg-blue-100 text-blue-800'
      case 'walk_in':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (contactsLoading || dealsLoading) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">CRM Prospecting</h1>
          <p className="ri-page-description">Loading...</p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading CRM data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* New Lead Forms */}
      {showNewLeadForm && (
        <NewLeadForm
          lead={selectedLead}
          onClose={() => {
            setShowNewLeadForm(false)
            setSelectedLead(null)
          }}
          onSuccess={handleNewLeadSuccess}
        />
      )}

      {showLeadIntakeBuilder && (
        <LeadIntakeFormBuilder
          onClose={() => setShowLeadIntakeBuilder(false)}
          onSuccess={handleNewLeadSuccess}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">CRM Prospecting</h1>
            <p className="ri-page-description">
              Manage leads, prospects, and customer relationships
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowLeadIntakeBuilder(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Quick Add Lead
            </Button>
            <Button onClick={() => setShowNewLeadForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Active prospects in pipeline
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.newLeads}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting first contact
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.qualifiedLeads}</div>
            <p className="text-xs text-muted-foreground">
              Ready for sales process
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Leads to closed deals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lead Management</CardTitle>
                  <CardDescription>
                    Track and manage your sales prospects
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leads by name, email, or phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="closed_won">Closed Won</SelectItem>
                    <SelectItem value="closed_lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="walk_in">Walk-in</SelectItem>
                    <SelectItem value="trade_show">Trade Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Leads List */}
              <div className="space-y-4">
                {contactsLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading contacts...</p>
                  </div>
                )}
                
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold">
                            {contact.first_name} {contact.last_name}
                          </h4>
                          <Badge className={getStatusColor(contact.status)}>
                            {contact.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={getSourceColor(contact.source)}>
                            {contact.source.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {contact.email} • {contact.phone}
                          {contact.assigned_to && (
                            <span> • Assigned to: {contact.assigned_to}</span>
                          )}
                        </div>
                        {contact.notes && (
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            {contact.notes}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Created: {new Date(contact.created_at).toLocaleDateString()}
                          {contact.last_activity && (
                            <span> • Last Activity: {new Date(contact.last_activity).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditLead(contact)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLead(contact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    {contacts.length === 0 ? (
                      <>
                        <p>No leads yet</p>
                        <p className="text-sm">Create your first lead to get started</p>
                      </>
                    ) : (
                      <>
                        <p>No leads found matching your criteria</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Pipeline</CardTitle>
              <CardDescription>
                Visual overview of your sales pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                {['new', 'contacted', 'qualified', 'closed_won', 'closed_lost'].map((status) => {
                  const statusContacts = contacts.filter(c => c.status === status)
                  return (
                    <div key={status} className="space-y-3">
                      <div className="text-center">
                        <h3 className="font-semibold capitalize">
                          {status.replace('_', ' ')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {statusContacts.length} leads
                        </p>
                      </div>
                      <div className="space-y-2">
                        {statusContacts.slice(0, 3).map((contact) => (
                          <div
                            key={contact.id}
                            className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => handleEditLead(contact)}
                          >
                            <h4 className="font-medium text-sm">
                              {contact.first_name} {contact.last_name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {contact.source.replace('_', ' ')}
                            </p>
                          </div>
                        ))}
                        {statusContacts.length > 3 && (
                          <div className="text-center text-xs text-muted-foreground">
                            +{statusContacts.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Analytics</CardTitle>
              <CardDescription>
                Performance metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-4">Lead Sources</h3>
                  <div className="space-y-3">
                    {['website', 'referral', 'phone', 'walk_in', 'trade_show'].map((source) => {
                      const sourceCount = contacts.filter(c => c.source === source).length
                      const percentage = contacts.length > 0 ? (sourceCount / contacts.length) * 100 : 0
                      return (
                        <div key={source} className="flex items-center justify-between">
                          <span className="capitalize">{source.replace('_', ' ')}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12">
                              {sourceCount}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CRMProspecting() {
  return (
    <Routes>
      <Route path="/*" element={<CRMProspectingDashboard />} />
    </Routes>
  )
}

export default CRMProspecting