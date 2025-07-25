import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { X, Edit, DollarSign, Calendar, User, Phone, Mail, FileText } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface DealDetailProps {
  deal: any
  onClose: () => void
  onEdit: () => void
}

export function DealDetail({ deal, onClose, onEdit }: DealDetailProps) {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New':
        return 'bg-gray-100 text-gray-800'
      case 'Qualified':
        return 'bg-blue-100 text-blue-800'
      case 'Proposal Sent':
        return 'bg-yellow-100 text-yellow-800'
      case 'Negotiation':
        return 'bg-orange-100 text-orange-800'
      case 'Closed Won':
        return 'bg-green-100 text-green-800'
      case 'Closed Lost':
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-3">
                <span>{deal.customer_name || 'Unnamed Customer'}</span>
                <Badge className={getStageColor(deal.stage)}>
                  {deal.stage}
                </Badge>
              </CardTitle>
              <CardDescription>
                Deal #{deal.id?.slice(-6)?.toUpperCase()} • Created {formatDate(deal.created_at)}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto space-y-6">
          {/* Deal Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Deal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Deal Amount</Label>
                    <p className="text-lg font-semibold">{formatCurrency(deal.amount || 0)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Probability</Label>
                    <p className="text-lg font-semibold">{deal.probability || 0}%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Deal Type</Label>
                    <p>{deal.type || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                    <Badge className={getPriorityColor(deal.priority)} variant="outline">
                      {deal.priority || 'Medium'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Source</Label>
                    <p>{deal.source || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Expected Close</Label>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {deal.expected_close_date ? formatDate(deal.expected_close_date) : 'Not set'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Customer Name</Label>
                  <p className="text-lg font-semibold">{deal.customer_name || 'Not provided'}</p>
                </div>
                {deal.customer_email && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${deal.customer_email}`} className="text-primary hover:underline">
                        {deal.customer_email}
                      </a>
                    </p>
                  </div>
                )}
                {deal.customer_phone && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <a href={`tel:${deal.customer_phone}`} className="text-primary hover:underline">
                        {deal.customer_phone}
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Sales Rep</Label>
                  <p>{deal.rep_name || 'Unassigned'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Information */}
          {deal.vehicle_info && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vehicle/Home Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{deal.vehicle_info}</p>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {deal.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{deal.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deal Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Deal Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(deal.created_at)}
                    </p>
                  </div>
                </div>
                {deal.updated_at !== deal.created_at && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(deal.updated_at)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

function Label({ className, children, ...props }: any) {
  return (
    <label className={`text-sm font-medium ${className || ''}`} {...props}>
      {children}
    </label>
  )
}

export default DealDetail