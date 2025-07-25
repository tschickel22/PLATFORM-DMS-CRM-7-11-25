import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, Trash2, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { PdiChecklist } from '@/types'

interface PDIInspectionListProps {
  inspections: PdiChecklist[]
  onEditInspection: (inspection: PdiChecklist) => void
  onDeleteInspection: (id: string) => void
  loading: boolean
}

export function PDIInspectionList({
  inspections,
  onEditInspection,
  onDeleteInspection,
  loading
}: PDIInspectionListProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'not_started':
        return 'bg-gray-100 text-gray-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'complete':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-emerald-100 text-emerald-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'not_started':
        return <Clock className="h-4 w-4" />
      case 'in_progress':
        return <AlertTriangle className="h-4 w-4" />
      case 'complete':
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'failed':
        return <XCircle className="h-4 w-4" />
      case 'pending_review':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getCompletedSteps = (checklistData: any[]) => {
    if (!Array.isArray(checklistData)) return 0
    return checklistData.filter(item => item.status === 'complete').length
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading inspections...</p>
      </div>
    )
  }

  if (inspections.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p>No PDI inspections found</p>
        <p className="text-sm">Inspections will appear here when they are created</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {inspections.map((inspection) => (
        <Card key={inspection.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(inspection.status)}
                  <div>
                    <h4 className="font-semibold">
                      Vehicle: {inspection.vehicle_id}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Technician: {inspection.technician}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(inspection.status)}>
                    {inspection.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Steps: {getCompletedSteps(inspection.checklist_data)}/{inspection.checklist_data?.length || 0} complete
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(inspection.created_at).toLocaleDateString()}
                  {inspection.updated_at && inspection.updated_at !== inspection.created_at && (
                    <span> • Updated: {new Date(inspection.updated_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditInspection(inspection)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this inspection?')) {
                      onDeleteInspection(inspection.id)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}