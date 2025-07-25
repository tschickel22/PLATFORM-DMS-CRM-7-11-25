import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useServiceManagement } from './hooks/useServiceManagement'
import { mockServiceOps } from '@/mocks/serviceOpsMock'

function ServiceOpsDashboard() {
  const {
    tickets,
    loading,
    error,
    usingFallback,
    createTicket,
    refreshData
  } = useServiceManagement()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Filter tickets based on search and filters
  const filteredTickets = React.useMemo(() => {
    let filtered = tickets

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query) ||
        ticket.customer_name?.toLowerCase().includes(query) ||
        ticket.assigned_tech_name?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter)
    }

    return filtered
  }, [tickets, searchQuery, statusFilter, priorityFilter, categoryFilter])

  // Calculate stats
  const stats = React.useMemo(() => {
    const totalTickets = tickets.length
    const openTickets = tickets.filter(t => ['Open', 'In Progress'].includes(t.status)).length
    const completedTickets = tickets.filter(t => t.status === 'Completed').length
    const urgentTickets = tickets.filter(t => t.priority === 'Urgent').length

    return {
      total: totalTickets,
      open: openTickets,
      completed: completedTickets,
      urgent: urgentTickets
    }
  }, [tickets])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertTriangle className="h-4 w-4" />
      case 'In Progress':
        return <Clock className="h-4 w-4" />
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />
      case 'Cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <Wrench className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    return mockServiceOps.statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    return mockServiceOps.priorityColors[priority] || 'bg-gray-100 text-gray-800'
  }

  const handleCreateTicket = () => {
    createTicket({
      title: 'New Service Ticket',
      description: '',
      category: 'Maintenance',
      priority: 'Medium',
      status: 'Open'
    })
  }

  return (
    <div className="space-y-6">
      {/* Supabase Status Banner */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Service Operations:</strong> {usingFallback ? 
            'Using fallback data (Supabase connection failed)' : 
            'Connected to live Supabase table: service_tickets'
          }
          {error && <span className="block mt-1 text-red-600">{error}</span>}
        </AlertDescription>
      </Alert>

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Service Operations</h1>
            <p className="ri-page-description">
              Manage service tickets and maintenance requests
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={refreshData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleCreateTicket}>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All service tickets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.open}</div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.urgent}</div>
            <p className="text-xs text-muted-foreground">
              High priority tickets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Service Tickets</CardTitle>
          <CardDescription>
            Manage and track service requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search tickets, customers, or technicians..."
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
                {mockServiceOps.defaultStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {mockServiceOps.priorityOptions.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {mockServiceOps.categoryOptions.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading service tickets...</p>
            </div>
          )}

          {/* Tickets List */}
          {!loading && (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="ri-table-row"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(ticket.status)}
                      <h4 className="font-semibold">{ticket.title}</h4>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {ticket.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      {ticket.customer_name && (
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{ticket.customer_name}</span>
                        </div>
                      )}
                      {ticket.assigned_tech_name && (
                        <div className="flex items-center space-x-1">
                          <Wrench className="h-3 w-3" />
                          <span>{ticket.assigned_tech_name}</span>
                        </div>
                      )}
                      {ticket.scheduled_date && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(ticket.scheduled_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Created {new Date(ticket.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ri-action-buttons">
                    <Button variant="outline" size="sm" disabled>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredTickets.length === 0 && !loading && (
                <div className="text-center py-12 text-muted-foreground">
                  <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  {tickets.length === 0 ? (
                    <>
                      <p>No service tickets found</p>
                      <p className="text-sm">Service tickets will appear here when available</p>
                    </>
                  ) : (
                    <>
                      <p>No tickets match your filters</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ServiceOps() {
  return (
    <Routes>
      <Route path="/" element={<ServiceOpsDashboard />} />
      <Route path="/*" element={<ServiceOpsDashboard />} />
    </Routes>
  )
}