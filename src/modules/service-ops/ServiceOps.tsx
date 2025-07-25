import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Settings, Users, Calendar, FileText } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { ServiceTicketForm } from './components/ServiceTicketForm'
import { ServiceTicketDetail } from './components/ServiceTicketDetail'
import { ServiceRequest } from './types'
import { useServiceOps } from './hooks/useServiceOps'

function ServiceOpsDashboard() {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const [showNewTicketForm, setShowNewTicketForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(null)
  const [activeTab, setActiveTab] = useState('tickets')
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  
  const { serviceRequests, loading, loadServiceRequests } = useServiceOps()

  const filteredTickets = React.useMemo(() => {
    let currentTickets = serviceRequests

    // Search filter (title, description, customer name)
    if (searchQuery) {
      currentTickets = currentTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      currentTickets = currentTickets.filter(ticket => ticket.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      currentTickets = currentTickets.filter(ticket => ticket.priority === priorityFilter)
    }

    return currentTickets
  }, [serviceRequests, searchQuery, statusFilter, priorityFilter])

  // Calculate dynamic stats
  const totalTickets = serviceTickets.length
  const openTickets = serviceTickets.filter(ticket => ticket.status === 'Open' || ticket.status === 'In Progress').length
  const completedTickets = serviceTickets.filter(ticket => ticket.status === 'Completed').length
  const waitingForParts = serviceTickets.filter(ticket => ticket.status === 'Waiting for Parts').length

  const handleCreateTicket = (newTicket: ServiceRequest) => {
    // This will be handled by the useServiceOps hook in a later phase
    // For now, just update local state if needed or rely on re-fetch
    setShowNewTicketForm(false)
    toast({
      title: 'Ticket Created',
      description: 'Service ticket has been created successfully.',
    })
  }

  const handleUpdateTicket = (updatedTicket: ServiceTicket) => {
    setServiceTickets(prev => 
      prev.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    )
    setSelectedTicket(null)
    toast({
      title: 'Ticket Updated',
      description: 'Service ticket has been updated successfully.',
    })
  }

  const handleDeleteTicket = (ticketId: string) => {
    setServiceTickets(prev => prev.filter(ticket => ticket.id !== ticketId))
    setSelectedTicket(null)
    toast({
      title: 'Ticket Deleted',
      description: 'Service ticket has been deleted successfully.',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Waiting for Parts': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleViewTicket = (ticket: ServiceRequest) => {
    setSelectedTicket(ticket)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!tenant) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* New Ticket Form Modal */}
      {showNewTicketForm && (
        <ServiceTicketForm
          onClose={() => setShowNewTicketForm(false)}
          onSave={handleCreateTicket}
          tenantId={tenant.id}
        />
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <ServiceTicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={handleUpdateTicket}
          onDelete={handleDeleteTicket}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Service Operations</h1>
            <p className="ri-page-description">
              Manage service tickets and operations
            </p>
          </div>
          <Button onClick={() => setShowNewTicketForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              All service tickets
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets}</div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTickets}</div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting for Parts</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingForParts}</div>
            <p className="text-xs text-muted-foreground">
              Pending parts delivery
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Service Tickets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search tickets..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Waiting for Parts">Waiting for Parts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <Card>
            <CardHeader>
              <CardTitle>Service Tickets ({filteredTickets.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-4">Loading tickets...</div>
                )}
                
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{ticket.title}</h3>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {ticket.customer_id && (
                          <span>Customer ID: {ticket.customer_id} • </span>
                        )}
                        Created: {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
                
                {!loading && filteredTickets.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                      ? 'No tickets match your current filters.'
                      : 'No service tickets found. Create your first ticket to get started.'
                    }
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Service Analytics</CardTitle>
              <CardDescription>
                Analytics and reporting for service operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Service Settings</CardTitle>
              <CardDescription>
                Configure service operation settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Settings panel coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ServiceOps() {
  return (
    <Routes>
      <Route path="/" element={<ServiceOpsDashboard />} />
      <Route path="/*" element={<ServiceOpsDashboard />} />
    </Routes>
  )
}

export default ServiceOps