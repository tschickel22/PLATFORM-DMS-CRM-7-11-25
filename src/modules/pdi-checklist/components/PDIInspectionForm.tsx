import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  X, 
  Save, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Camera, 
  ClipboardCheck, 
  Clock, 
  Image as ImageIcon,
  Plus,
  Trash2
} from 'lucide-react'
import { 
  PDIInspection, 
  PDIInspectionItem, 
  PDIInspectionItemStatus,
  PDIDefect,
  PDIDefectSeverity,
  PDIPhoto,
  PDIInspectionStatus
} from '../types'
import { Vehicle } from '@/types'
import { PdiChecklist, ChecklistItem } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useDropzone } from 'react-dropzone'

interface PDIInspectionFormProps {
  inspection?: PdiChecklist
  onSave: (data: Partial<PdiChecklist>) => void
  onCancel: () => void
}

export function PDIInspectionForm({ inspection, onSave, onCancel }: PDIInspectionFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<PdiChecklist>>({
    vehicle_id: '',
    technician: '',
    status: 'not_started',
    checklist_data: []
  })
  const [overallNotes, setOverallNotes] = useState('')

  // Initialize form with inspection data if editing
  useEffect(() => {
    if (inspection) {
      setFormData({
        vehicle_id: inspection.vehicle_id || '',
        technician: inspection.technician || '',
        status: inspection.status || 'not_started',
        checklist_data: inspection.checklist_data || []
      })
    }
  }, [inspection])

  const statusOptions = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'complete', label: 'Complete' },
    { value: 'failed', label: 'Failed' },
    { value: 'pending_review', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' }
  ]

  const technicianOptions = ['Mike Johnson', 'Sarah Davis', 'Tom Wilson', 'Lisa Chen']

  const stepStatusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'complete', label: 'Complete', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { value: 'failed', label: 'Failed', icon: AlertTriangle, color: 'bg-red-100 text-red-800' },
    { value: 'n/a', label: 'N/A', icon: X, color: 'bg-gray-100 text-gray-800' }
  ]

  const handleAddChecklistItem = () => {
    const newItem: ChecklistItem = {
      step: 'New inspection step',
      status: 'pending',
      notes: ''
    }
    
    setFormData(prev => ({
      ...prev,
      checklist_data: [...(prev.checklist_data || []), newItem]
    }))
  }

  const handleRemoveChecklistItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      checklist_data: (prev.checklist_data || []).filter((_, i) => i !== index)
    }))
  }

  const handleChecklistItemChange = (index: number, field: keyof ChecklistItem, value: string) => {
    setFormData(prev => {
      const updatedData = [...(prev.checklist_data || [])]
      updatedData[index] = { ...updatedData[index], [field]: value }
      return {
        ...prev,
        checklist_data: updatedData
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      updated_at: new Date().toISOString()
    })
  }

  const getStatusIcon = (status: string) => {
    const statusOption = stepStatusOptions.find(opt => opt.value === status)
    return statusOption ? statusOption.icon : Clock
  }

  const getStatusColor = (status: string) => {
    const statusOption = stepStatusOptions.find(opt => opt.value === status)
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {inspection ? 'Edit PDI Checklist' : 'New PDI Checklist'}
              </CardTitle>
              <CardDescription>
                Pre-delivery inspection checklist and findings
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="vehicle_id">Vehicle ID</Label>
                  <Input
                    id="vehicle_id"
                    value={formData.vehicle_id || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicle_id: e.target.value }))}
                    placeholder="Enter vehicle ID"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="technician">Technician</Label>
                  <Select
                    value={formData.technician || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, technician: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicianOptions.map(tech => (
                        <SelectItem key={tech} value={tech}>
                          {tech}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status || 'not_started'}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Checklist Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Checklist Items</h3>
                  <Button type="button" onClick={handleAddChecklistItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {(formData.checklist_data || []).map((item, index) => {
                    const StatusIcon = getStatusIcon(item.status)
                    return (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-medium">Step #{index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveChecklistItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label>Step Description</Label>
                            <Input
                              value={item.step}
                              onChange={(e) => handleChecklistItemChange(index, 'step', e.target.value)}
                              placeholder="e.g., Inspect exterior condition"
                            />
                          </div>
                          
                          <div>
                            <Label>Status</Label>
                            <Select
                              value={item.status}
                              onValueChange={(value) => handleChecklistItemChange(index, 'status', value)}
                            >
                              <SelectTrigger>
                                <SelectValue>
                                  <div className="flex items-center space-x-2">
                                    <StatusIcon className="h-4 w-4" />
                                    <span>{stepStatusOptions.find(opt => opt.value === item.status)?.label || item.status}</span>
                                  </div>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {stepStatusOptions.map(statusOpt => {
                                  const Icon = statusOpt.icon
                                  return (
                                    <SelectItem key={statusOpt.value} value={statusOpt.value}>
                                      <div className="flex items-center space-x-2">
                                        <Icon className="h-4 w-4" />
                                        <span>{statusOpt.label}</span>
                                      </div>
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Label>Notes</Label>
                          <Textarea
                            value={item.notes || ''}
                            onChange={(e) => handleChecklistItemChange(index, 'notes', e.target.value)}
                            placeholder="Additional notes about this step"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    )
                  })}
                  
                  {(!formData.checklist_data || formData.checklist_data.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      <p>No checklist items added yet</p>
                      <p className="text-sm">Click "Add Item" to start building the checklist</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="overallNotes">Notes</Label>
                <Textarea
                  id="overallNotes"
                  value={overallNotes}
                  onChange={(e) => setOverallNotes(e.target.value)}
                  placeholder="General notes about the inspection"
                  rows={4}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Inspection
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export { PDIInspectionForm }