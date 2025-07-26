import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, Plus, Trash2 } from 'lucide-react'
import { PdiChecklist, ChecklistItem } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface PDIInspectionFormProps {
  inspection: PdiChecklist
  onSave: (data: Partial<PdiChecklist>) => Promise<void>
  onCancel: () => void
}

export function PDIInspectionForm({ inspection, onSave, onCancel }: PDIInspectionFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<PdiChecklist>>({
    ...inspection
  })

  const statusOptions = [
    'not_started',
    'in_progress', 
    'complete',
    'failed',
    'pending_review',
    'approved'
  ]

  const technicianOptions = [
    'Mike Johnson',
    'Sarah Davis', 
    'Tom Wilson',
    'Lisa Chen'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.vehicle_id || !formData.technician) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: 'PDI inspection updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update PDI inspection',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChecklistItemChange = (index: number, field: keyof ChecklistItem, value: any) => {
    const updatedItems = [...(formData.checklist_data || [])]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    }
    setFormData(prev => ({ ...prev, checklist_data: updatedItems }))
  }

  const addChecklistItem = () => {
    const newItem: ChecklistItem = {
      step: '',
      status: 'pending',
      notes: ''
    }
    setFormData(prev => ({
      ...prev,
      checklist_data: [...(prev.checklist_data || []), newItem]
    }))
  }

  const removeChecklistItem = (index: number) => {
    const updatedItems = (formData.checklist_data || []).filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, checklist_data: updatedItems }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          <CardHeader className="shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Edit PDI Inspection</CardTitle>
                <CardDescription>
                  Update pre-delivery inspection details
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="vehicle_id">Vehicle ID *</Label>
                  <Input
                    id="vehicle_id"
                    value={formData.vehicle_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicle_id: e.target.value }))}
                    placeholder="Enter vehicle ID"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="technician">Technician *</Label>
                  <Select 
                    value={formData.technician} 
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
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Checklist Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Checklist Items</h3>
                  <Button type="button" onClick={addChecklistItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {(formData.checklist_data || []).map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeChecklistItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <Label>Step Description</Label>
                          <Input
                            value={item.step}
                            onChange={(e) => handleChecklistItemChange(index, 'step', e.target.value)}
                            placeholder="Enter step description"
                          />
                        </div>
                        
                        <div>
                          <Label>Status</Label>
                          <Select
                            value={item.status}
                            onValueChange={(value) => handleChecklistItemChange(index, 'status', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="pass">Pass</SelectItem>
                              <SelectItem value="fail">Fail</SelectItem>
                              <SelectItem value="n/a">N/A</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Notes</Label>
                        <Textarea
                          value={item.notes || ''}
                          onChange={(e) => handleChecklistItemChange(index, 'notes', e.target.value)}
                          placeholder="Add notes for this step"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                  
                  {(!formData.checklist_data || formData.checklist_data.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      <p>No checklist items added yet</p>
                      <p className="text-sm">Click "Add Item" to create your first checklist item</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}