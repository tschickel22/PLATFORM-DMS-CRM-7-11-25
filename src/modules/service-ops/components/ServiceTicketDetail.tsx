// src/modules/service-ops/components/ServiceTicketDetail.tsx
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar, 
  User, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  Edit,
  Save,
  X
} from 'lucide-react'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface ServiceTicketDetailProps {
  ticketId: string
  onUpdate?: (ticketId: string, updates: any) => void
  onClose?: () => void
}

export function ServiceTicketDetail({ ticketId, onUpdate, onClose }: ServiceTicketDetailProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(mockServiceOps.formDefaults.status)
  const [notes, setNotes] = useState('')

  // Use mock ticket data as fallback when no real ticket is loaded
  const ticket = mockServiceOps.sampleTickets.find(t => t.id === ticketId) || mockServiceOps.sampleTickets[0]

  const getStatusColor = (status: string) => {
    return mockServiceOps.statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    return mockServiceOps.priorityColors[priority] || 'bg-gray-100 text-gray-800'
  }

  const handleStatusUpdate = async () => {
    setLoading(true)
    try {
      if (onUpdate) {
        onUpdate(ticketId, { status })
      }
      toast({
        title: "Status Updated",
        description: `Ticket status changed to ${status}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <p className="text-muted-foreground">Ticket #{ticket.id}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Status and Priority Badges */}
      <div className="flex items-center space-x-2">
        <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
        <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority} Priority</Badge>
      </div>

      {/* Ticket Info */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Customer:</span>
              <span className="font-medium">{ticket.customerName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Assigned to:</span>
              <span className="font-medium">{ticket.assignedTechName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Scheduled:</span>
              <span className="font-medium">{formatDateTime(ticket.scheduledDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Created:</span>
              <span className="font-medium">{formatDateTime(ticket.createdAt)}</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{ticket.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Status Update */}
      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockServiceOps.defaultStatuses.map(statusOption => (
                    <SelectItem key={statusOption} value={statusOption}>{statusOption}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleStatusUpdate} disabled={loading} size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Parts and Labor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parts */}
        <Card>
          <CardHeader>
            <CardTitle>Parts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ticket.parts.map((part) => (
                <div key={part.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{part.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {part.quantity}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(part.cost * part.quantity)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Labor */}
        <Card>
          <CardHeader>
            <CardTitle>Labor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ticket.labor.map((labor) => (
                <div key={labor.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{labor.description}</p>
                    <p className="text-sm text-muted-foreground">{labor.hours} hrs @ {formatCurrency(labor.rate)}/hr</p>
                  </div>
                  <p className="font-medium">{formatCurrency(labor.hours * labor.rate)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Cost */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Total Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(ticket.totalCost)}</div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ticket.timeline.map((entry) => (
              <div key={entry.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{entry.action}</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(entry.timestamp)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.details}</p>
                  <p className="text-xs text-muted-foreground">by {entry.user}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={ticket.notes || "Add notes about this service ticket..."}
              rows={4}
            />
            <Button onClick={() => console.log('Save notes:', notes)}>
              <Save className="h-4 w-4 mr-2" />
              Save Notes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}