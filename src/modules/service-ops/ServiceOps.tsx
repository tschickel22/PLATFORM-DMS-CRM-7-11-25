import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Wrench, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { useServiceOps } from './hooks/useServiceOps'
import { ServiceRequest } from './types'

function ServiceOpsDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const { serviceRequests, loading: serviceLoading, loadServiceRequests } = useServiceOps()

  const filteredTickets = React.useMemo(() => {
    let currentTickets = serviceRequests

    // Search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      currentTickets = currentTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(lowerCaseQuery) ||
        (ticket.description && ticket.description.toLowerCase().includes(lowerCaseQuery))
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'waiting_parts':
        return 'bg-orange-100 text-orange-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800'
      case 'medium':
        return 'bg-blue-100 text-blue-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'urgent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4" />
      case 'in_progress':
        return <Wrench className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Service Operations</h1>
            <p className="ri-page-description">
              Manage service tickets and maintenance requests
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Service Ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serviceLoading ? '...' : serviceRequests.filter(ticket => ticket.status === 'open').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {serviceLoading ? 'Loading...' : '+2 from yesterday'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serviceLoading ? '...' : serviceRequests.filter(ticket => ticket.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {serviceLoading ? 'Loading...' : 'Active work orders'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serviceLoading ? '...' : serviceRequests.filter(ticket => ticket.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {serviceLoading ? 'Loading...' : '+3 from yesterday'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
            <p className="text-xs text-muted-foreground">
              -0.5 days from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Service Tickets</CardTitle>
          <CardDescription>
            Manage and track service requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ri-search-input"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="waiting_parts">Waiting for Parts</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={priorityFilter}
              onValueChange={setPriorityFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {serviceLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading service tickets...</p>
              </div>
            )}
            
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="ri-table-row"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(ticket.status)}
                    <div>
                      <h4 className="font-semibold">{ticket.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {ticket.description || 'No description provided'}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {ticket.priority && (
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ri-action-buttons">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            
            {!serviceLoading && filteredTickets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                {serviceRequests.length === 0 ? (
                  <>
                    <p>No service tickets yet</p>
                    <p className="text-sm">Create your first service ticket to get started</p>
                  </>
                ) : (
                  <>
                    <p>No tickets found matching your criteria</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </>
                )}
              </div>
            )}
          </div>
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