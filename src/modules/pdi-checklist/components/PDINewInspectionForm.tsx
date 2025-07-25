import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { X, Save } from 'lucide-react'
import { PdiChecklist, ChecklistItem } from '@/types'

interface PDINewInspectionFormProps {
  onSave: (data: Partial<PdiChecklist>) => void
  onCancel: () => void
}

export function PDINewInspectionForm({ onSave, onCancel }: PDINewInspectionFormProps) {
  const [formData, setFormData] = useState<Partial<PdiChecklist>>({
    vehicle_id: '',
    technician: '',
    status: 'not_started',
    checklist_data: []
  })
  const [notes, setNotes] = useState('')

  const statusOptions = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'complete', label: 'Complete' },
    { value: 'failed', label: 'Failed' },
    { value: 'pending_review', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' }
  ]

  const technicianOptions = ['Mike Johnson', 'Sarah Davis', 'Tom Wilson', 'Lisa Chen']

  // Default checklist items for new inspections
  const defaultChecklistItems: ChecklistItem[] = [
    { step: 'Exterior inspection', status: 'pending' },
    { step: 'Interior inspection', status: 'pending' },
    { step: 'Electrical systems check', status: 'pending' },
    { step: 'Plumbing systems check', status: 'pending' },
    { step: 'HVAC systems check', status: 'pending' },
    { step: 'Safety equipment check', status: 'pending' },
    { step: 'Final walkthrough', status: 'pending' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Initialize with default checklist items if none exist
    const checklistData = formData.checklist_data && formData.checklist_data.length > 0 
      ? formData.checklist_data 
      : defaultChecklistItems
    
    onSave({
      ...formData,
      checklist_data: checklistData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>New PDI Inspection</CardTitle>
                <CardDescription>
                  Create a new pre-delivery inspection checklist
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="vehicle_id">Vehicle ID *</Label>
                  <Input
                    id="vehicle_id"
                    value={formData.vehicle_id || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicle_id: e.target.value }))}
                    placeholder="Enter vehicle ID"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="technician">Technician *</Label>
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
                  <Label htmlFor="status">Initial Status</Label>
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
              
              <div>
                <Label htmlFor="notes">Initial Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any initial notes or special instructions"
                  rows={3}
                />
              </div>
              
              {/* Preview of default checklist items */}
              <div>
                <Label>Default Checklist Items</Label>
                <div className="mt-2 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    The following items will be added to your checklist:
                  </p>
                  <ul className="text-sm space-y-1">
                    {defaultChecklistItems.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
                        <span>{item.step}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    You can modify these items after creating the inspection.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Create Inspection
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}