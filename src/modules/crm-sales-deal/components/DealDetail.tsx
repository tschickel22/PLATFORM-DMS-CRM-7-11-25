import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Edit, Trash2, DollarSign, Calendar, User, Phone, Mail, FileText } from 'lucide-react'
import { Deal, useDealManagement } from '../hooks/useDealManagement'
import { DealForm } from './DealForm'
import { formatCurrency, formatDate } from '@/lib/utils'

interface DealDetailProps {
  deal: Deal
  onClose: () => void
  onUpdate?: (deal: Deal) => void
}

export function DealDetail({ deal, onClose, onUpdate }: DealDetailProps) {
  const { updateDeal, deleteDeal } = useDealManagement()
  const [showEditForm, setShowEditForm] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
      setLoading(true)
      const success = await deleteDeal(deal.id)
      if (success) {
        onClose()
      }
      setLoading(false)
    }
  }

  const handleEditSuccess = (updatedDeal: Deal) => {
    setShowEditForm(false)
    if (onUpdate) {
      onUpdate(updatedDeal)
    }
  }

  if (showEditForm) {
    return (
      <DealForm
        deal={deal}
        onClose={() => setShowEditForm(false)}
        onSuccess={handleEditSuccess}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deals
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{deal.customer_name}</h1>
            <p className="text-muted-foreground">
              Deal #{deal.id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowEditForm(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Deal Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Stage</span>
              <Badge className={getStageColor(deal.stage)}>
                {deal.stage}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Priority</span>
              <Badge className={getPriorityColor(deal.priority || 'Medium')}>
                {deal.priority || 'Medium'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Type</span>
              <span className="text-sm">{deal.type || 'New Sale'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Source</span>
              <span className="text-sm">{deal.source || 'Not specified'}</span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Deal Amount</span>
              <span className="text-lg font-bold">
                {formatCurrency(deal.amount || 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Probability</span>
              <span className="text-sm">{deal.probability || 0}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Expected Close</span>
              <span className="text-sm">
                {deal.expected_close_date ? formatDate(deal.expected_close_date) : 'Not set'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{deal.customer_name}</p>
                <p className="text-xs text-muted-foreground">Customer</p>
              </div>
            </div>
            
            {deal.customer_email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">{deal.customer_email}</p>
                  <p className="text-xs text-muted-foreground">Email</p>
                </div>
              </div>
            )}
            
            {deal.customer_phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">{deal.customer_phone}</p>
                  <p className="text-xs text-muted-foreground">Phone</p>
                </div>
              </div>
            )}
            
            {deal.vehicle_info && (
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">{deal.vehicle_info}</p>
                  <p className="text-xs text-muted-foreground">Vehicle/Home</p>
                </div>
              </div>
            )}
            
            {deal.rep_name && (
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">{deal.rep_name}</p>
                  <p className="text-xs text-muted-foreground">Sales Rep</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {deal.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{deal.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Timeline</CardTitle>
          <CardDescription>
            Key events and milestones for this deal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Deal Created</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(deal.created_at)}
                </p>
              </div>
            </div>
            
            {deal.updated_at !== deal.created_at && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(deal.updated_at)}
                  </p>
                </div>
              </div>
            )}
            
            {deal.stage === 'Closed Won' && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Deal Won</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(deal.amount || 0)}
                  </p>
                </div>
              </div>
            )}
            
            {deal.stage === 'Closed Lost' && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Deal Lost</p>
                  <p className="text-xs text-muted-foreground">
                    Opportunity closed
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DealDetail