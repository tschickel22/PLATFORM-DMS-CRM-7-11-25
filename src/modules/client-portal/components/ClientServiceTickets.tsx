import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wrench, Eye, Calendar, User, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { useMockDataDiscovery } from '@/utils/mockDataDiscovery'
import { formatDate, formatCurrency } from '@/lib/utils'

export function ClientServiceTickets() {
  const { getCustomerId, getDisplayName } = usePortal()
  const customerId = getCustomerId()
  const customerName = getDisplayName()
  
  // Use the mock data discovery system
  const { customerData, loading } = useMockDataDiscovery(customerId, customerName)
  
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  
  // Get customer-specific data
  const customerTickets = customerData.serviceTickets || []
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'Waiting for Parts':
        return 'bg-orange-100 text-orange-800'
      case 'Customer Review':
        return 'bg-purple-100 text-purple-800'
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'bg-gray-100 text-gray-800'
      case 'Medium':
        return 'bg-blue-100 text-blue-800'
      case 'High':
        return 'bg-orange-100 text-orange-800'
      case 'Urgent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />
      case 'In Progress':
        return <Clock className="h-4 w-4" />
      case 'Open':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Wrench className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (selectedTicket) {
    const totalCost = selectedTicket.totalCost || 0
    const partsTotal = selectedTicket.parts?.reduce((sum: number, part: any) => sum + (part.cost * part.quantity), 0) || 0
    const laborTotal = selectedTicket.labor?.reduce((sum: number, labor: any) => sum + (labor.hours * labor.rate), 0) || 0

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => setSelectedTicket(null)}>
          ← Back to Service Tickets
        </Button>

        {/* Ticket Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            {getStatusIcon(selectedTicket.status)}
            <h1 className="text-2xl font-bold">{selectedTicket.title}</h1>
            <Badge className={getStatusColor(selectedTicket.status)}>
              {selectedTicket.status}
            </Badge>
            <Badge className={getPriorityColor(selectedTicket.priority)}>
              {selectedTicket.priority} Priority
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Ticket #{selectedTicket.id.slice(-6).toUpperCase()} • {selectedTicket.vehicleInfo}
          </p>
        </div>

        {/* Ticket Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p className="text-lg font-bold">{selectedTicket.category}</p>
                </div>
                <Wrench className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                  <p className="text-lg font-bold">{selectedTicket.assignedTechName || 'Unassigned'}</p>
                </div>
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scheduled Date</p>
                  <p className="text-lg font-bold">
                    {selectedTicket.scheduledDate ? formatDate(selectedTicket.scheduledDate) : 'TBD'}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estimated Cost</p>
                  <p className="text-lg font-bold">{formatCurrency(totalCost)}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Service Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{selectedTicket.description}</p>
            {selectedTicket.notes && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Additional Notes</h4>
                <p className="text-sm">{selectedTicket.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parts and Labor */}
        {(selectedTicket.parts?.length > 0 || selectedTicket.labor?.length > 0) && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Parts */}
            {selectedTicket.parts?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Parts</CardTitle>
                  <CardDescription>Parts used for this service</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedTicket.parts.map((part: any) => (
                      <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{part.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {part.quantity} × {formatCurrency(part.cost)}
                          </p>
                        </div>
                        <p className="font-semibold">{formatCurrency(part.quantity * part.cost)}</p>
                      </div>
                    ))}
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Parts Total:</span>
                        <span>{formatCurrency(partsTotal)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Labor */}
            {selectedTicket.labor?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Labor</CardTitle>
                  <CardDescription>Labor charges for this service</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedTicket.labor.map((labor: any) => (
                      <div key={labor.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{labor.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {labor.hours} hrs × {formatCurrency(labor.rate)}/hr
                          </p>
                        </div>
                        <p className="font-semibold">{formatCurrency(labor.hours * labor.rate)}</p>
                      </div>
                    ))}
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Labor Total:</span>
                        <span>{formatCurrency(laborTotal)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Timeline */}
        {selectedTicket.timeline && (
          <Card>
            <CardHeader>
              <CardTitle>Service Timeline</CardTitle>
              <CardDescription>Progress updates for this service ticket</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedTicket.timeline
                  .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((entry: any) => (
                    <div key={entry.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{entry.action}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(entry.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{entry.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">by {entry.user}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Service Tickets</h1>
            <p className="text-muted-foreground">
              Track your service requests and maintenance history
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Service Request
          </Button>
        </div>
      </div>

      {/* Service Stats */}
      {customerTickets.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                  <p className="text-2xl font-bold">{customerTickets.length}</p>
                </div>
                <Wrench className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">
                    {customerTickets.filter(ticket => ticket.status === 'In Progress').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {customerTickets.filter(ticket => ticket.status === 'Completed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Service Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Service Tickets</CardTitle>
          <CardDescription>
            View and track your service requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(ticket.status)}
                      <div>
                        <h4 className="font-semibold">{ticket.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Ticket #{ticket.id.slice(-6).toUpperCase()} • {ticket.vehicleInfo}
                        </p>
                      </div>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {ticket.description}
                    </p>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-semibold">{ticket.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned To</p>
                        <p className="font-semibold">{ticket.assignedTechName || 'Unassigned'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {ticket.status === 'Completed' ? 'Completed' : 'Scheduled'}
                        </p>
                        <p className="font-semibold">
                          {ticket.status === 'Completed' && ticket.completedDate
                            ? formatDate(ticket.completedDate)
                            : ticket.scheduledDate
                            ? formatDate(ticket.scheduledDate)
                            : 'TBD'
                          }
                        </p>
                      </div>
                    </div>
                    
                    {ticket.totalCost && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Estimated Cost:</span>
                          <span className="font-semibold">{formatCurrency(ticket.totalCost)}</span>
                        </div>
                        {ticket.customerApproved && (
                          <p className="text-xs text-green-600 mt-1">✓ Approved by customer</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {customerTickets.length === 0 && (
              <div className="text-center py-12">
                <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Service Tickets</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any service tickets yet.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Service Request
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}