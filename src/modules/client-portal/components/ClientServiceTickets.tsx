import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wrench, Calendar, Clock, Eye, Plus, AlertCircle } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { formatDate } from '@/lib/utils'

export function ClientServiceTickets() {
  const { getDisplayName, getCustomerId } = usePortal()
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  
  // Get customer-specific service tickets
  const customerId = getCustomerId()
  const customerTickets = mockServiceOps.sampleTickets.filter(ticket => 
    ticket.customerId === customerId || ticket.customerName === getDisplayName()
  )

  const getStatusColor = (status: string) => {
    return mockServiceOps.statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    return mockServiceOps.priorityColors[priority] || 'bg-gray-100 text-gray-800'
  }

  if (selectedTicket) {
    const ticket = customerTickets.find(t => t.id === selectedTicket)
    
    if (!ticket) return null

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedTicket(null)}>
              ← Back to Service Tickets
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Service Ticket Details</h1>
              <p className="text-muted-foreground">{ticket.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status}
            </Badge>
            <Badge className={getPriorityColor(ticket.priority)}>
              {ticket.priority} Priority
            </Badge>
          </div>
        </div>

        {/* Ticket Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Information</CardTitle>
            <CardDescription>
              Service request details and current status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-3">Ticket Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ticket ID:</span>
                    <span className="font-mono">{ticket.id.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{ticket.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                      {ticket.priority}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(ticket.status)} variant="outline">
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Service Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle:</span>
                    <span>{ticket.vehicleInfo || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Technician:</span>
                    <span>{ticket.assignedTechName || 'Not assigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled:</span>
                    <span>{ticket.scheduledDate ? formatDate(ticket.scheduledDate) : 'Not scheduled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Description</h4>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm">{ticket.description}</p>
              </div>
            </div>

            {ticket.notes && (
              <div>
                <h4 className="font-semibold mb-3">Notes</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm">{ticket.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        {ticket.timeline && ticket.timeline.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Service Timeline</CardTitle>
              <CardDescription>
                Progress updates and activity history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticket.timeline
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-primary" />
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
                        <p className="text-xs text-muted-foreground mt-2">by {entry.user}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Parts and Labor */}
        {(ticket.parts.length > 0 || ticket.labor.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Parts & Labor</CardTitle>
              <CardDescription>
                Service costs and materials used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {ticket.parts.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Parts</h4>
                  <div className="space-y-2">
                    {ticket.parts.map((part) => (
                      <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{part.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {part.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${part.cost.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {ticket.labor.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Labor</h4>
                  <div className="space-y-2">
                    {ticket.labor.map((labor) => (
                      <div key={labor.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{labor.description}</p>
                          <p className="text-sm text-muted-foreground">{labor.hours} hours @ ${labor.rate}/hr</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${labor.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {ticket.totalCost && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Cost:</span>
                    <span className="text-lg font-bold">${ticket.totalCost.toFixed(2)}</span>
                  </div>
                  {ticket.customerApproved && (
                    <p className="text-sm text-green-600 mt-2">✓ Customer approved</p>
                  )}
                </div>
              )}
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
              Track your service requests and maintenance
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Service Request
          </Button>
        </div>
      </div>

      {/* Service Summary */}
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
                    {customerTickets.filter(t => t.status === 'In Progress').length}
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
                    {customerTickets.filter(t => t.status === 'Completed').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
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
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold">{ticket.title}</h4>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-medium">{ticket.category}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Technician</p>
                        <p className="font-medium">{ticket.assignedTechName || 'Not assigned'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">{formatDate(ticket.createdAt)}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ticket.description}
                    </p>
                    
                    {ticket.scheduledDate && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <p className="text-sm text-blue-800">
                          <Calendar className="h-4 w-4 inline mr-2" />
                          Scheduled for {formatDate(ticket.scheduledDate)}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTicket(ticket.id)}
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
                  You don't have any service requests at this time.
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

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Service?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Emergency Service</h4>
              <p className="text-sm text-muted-foreground">
                24/7 emergency service available for urgent issues
              </p>
              <Button variant="outline" size="sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                Emergency Contact
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Schedule Service</h4>
              <p className="text-sm text-muted-foreground">
                Schedule routine maintenance or repairs
              </p>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}