import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, Trash2, FileText } from 'lucide-react'
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
    switch (status) {
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
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p>No PDI inspections found</p>
        <p className="text-sm">Create your first inspection to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {inspections.map((inspection) => (
        <div
          key={inspection.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h4 className="font-semibold">
                Vehicle: {inspection.vehicle_id}
              </h4>
              <Badge className={getStatusColor(inspection.status)}>
                {inspection.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Technician: {inspection.technician} • 
              Created: {new Date(inspection.created_at).toLocaleDateString()}
              {inspection.updated_at && (
                <span> • Updated: {new Date(inspection.updated_at).toLocaleDateString()}</span>
              )}
            </div>
            {inspection.checklist_data && inspection.checklist_data.length > 0 && (
              <div className="text-sm text-muted-foreground mt-1">
                {inspection.checklist_data.length} checklist items
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
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
              onClick={() => onDeleteInspection(inspection.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}