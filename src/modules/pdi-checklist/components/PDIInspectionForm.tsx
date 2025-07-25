import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Save, X, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react'
import { PdiChecklist, ChecklistItem } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface PDIInspectionFormProps {
  inspection?: PdiChecklist
  onSave: (data: Partial<PdiChecklist>) => void
  onCancel: () => void
}

export default function PDIInspectionForm({ inspection, onSave, onCancel }: PDIInspectionFormProps) {
  const { toast } = useToast()
  const [vehicleId, setVehicleId] = useState(inspection?.vehicle_id || '')
  const [technician, setTechnician] = useState(inspection?.technician || '')
  const [status, setStatus] = useState(inspection?.status || 'not_started')
  const [checklistData, setChecklistData] = useState<ChecklistItem[]>(
    inspection?.checklist_data || []
  )

  const statusOptions = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'complete', label: 'Complete' },
    { value: 'failed', label: 'Failed' },
    { value: 'pending_review', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' }
  ]

  const stepStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'complete', label: 'Complete' },
    { value: 'failed', label: 'Failed' },
    { value: 'n/a', label: 'N/A' }
  ]

  const getStatusIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'n/a':
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (stepStatus: string) => {
    switch (stepStatus) {
      case 'complete':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'n/a':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddStep = () => {
    const newStep: ChecklistItem = {
      step: '',
      status: 'pending',
      notes: ''
    }
    setChecklistData([...checklistData, newStep])
  }

  const handleRemoveStep = (index: number) => {
    setChecklistData(checklistData.filter((_, i) => i !== index))
  }

  const handleStepChange = (index: number, field: keyof ChecklistItem, value: string) => {
    const updatedData = checklistData.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    )
    setChecklistData(updatedData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!vehicleId.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Vehicle ID is required',
        variant: 'destructive'
      })
      return
    }

    if (!technician.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Technician name is required',
        variant: 'destructive'
      })
      return
    }

    if (checklistData.some(item => !item.step.trim())) {
      toast({
        title: 'Validation Error',
        description: 'All checklist steps must have a description',
        variant: 'destructive'
      })
      return
    }

    const formData: Partial<PdiChecklist> = {
      vehicle_id: vehicleId,
      technician,
      status,
      checklist_data: checklistData
    }

    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          <CardHeader className="shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {inspection ? 'Edit PDI Inspection' : 'New PDI Inspection'}
                </CardTitle>
                <CardDescription>
                  {inspection ? 'Update inspection details and checklist items' : 'Create a new PDI inspection checklist'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <div className="flex-1 overflow-y-auto">
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="vehicleId">Vehicle ID *</Label>
                    <Input
                      id="vehicleId"
                      value={vehicleId}
                      onChange={(e) => setVehicleId(e.target.value)}
                      placeholder="Enter vehicle ID"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="technician">Technician *</Label>
                    <Input
                      id="technician"
                      value={technician}
                      onChange={(e) => setTechnician(e.target.value)}
                      placeholder="Enter technician name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Checklist Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Checklist Items</h3>
                    <Button type="button" onClick={handleAddStep} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {checklistData.map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-2">
                            {getStatusIcon(item.status)}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="grid gap-3 md:grid-cols-2">
                              <div>
                                <Label htmlFor={`step-${index}`}>Step Description *</Label>
                                <Input
                                  id={`step-${index}`}
                                  value={item.step}
                                  onChange={(e) => handleStepChange(index, 'step', e.target.value)}
                                  placeholder="Enter step description"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor={`status-${index}`}>Status</Label>
                                <Select
                                  value={item.status}
                                  onValueChange={(value) => handleStepChange(index, 'status', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {stepStatusOptions.map(option => (
                                      <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center space-x-2">
                                          <Badge className={getStatusColor(option.value)} variant="outline">
                                            {option.label}
                                          </Badge>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            {item.notes !== undefined && (
                              <div>
                                <Label htmlFor={`notes-${index}`}>Notes</Label>
                                <Input
                                  id={`notes-${index}`}
                                  value={item.notes || ''}
                                  onChange={(e) => handleStepChange(index, 'notes', e.target.value)}
                                  placeholder="Optional notes"
                                />
                              </div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveStep(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}

                    {checklistData.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                        <p>No checklist items added yet</p>
                        <p className="text-sm">Click "Add Step" to create your first checklist item</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {inspection ? 'Update Inspection' : 'Create Inspection'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  )
}