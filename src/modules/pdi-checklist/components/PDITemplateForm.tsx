import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Save, X, Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PDITemplate {
  id: string
  name: string
  description: string
  unitTypes: string[]
}

interface PDITemplateFormProps {
  templates: PDITemplate[]
  formDefaults: {
    unitId: string
    technicianId: string
    templateId: string
    status: string
    startedDate: string
    notes: string
    customerNotified: boolean
    deliveryApproved: boolean
  }
  onSave: (template: Partial<PDITemplate>) => void
  onCancel: () => void
  editingTemplate?: PDITemplate | null
  loading?: boolean
}

export function PDITemplateForm({
  templates,
  formDefaults,
  onSave,
  onCancel,
  editingTemplate = null,
  loading = false
}: PDITemplateFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: editingTemplate?.name || '',
    description: editingTemplate?.description || '',
    unitTypes: editingTemplate?.unitTypes || []
  })
  const [newUnitType, setNewUnitType] = useState('')

  const availableUnitTypes = [
    'Travel Trailer',
    'Motorhome', 
    'Fifth Wheel',
    'Toy Hauler',
    'Single Wide',
    'Double Wide',
    'Triple Wide',
    'Park Model'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Template name is required',
        variant: 'destructive'
      })
      return
    }

    if (formData.unitTypes.length === 0) {
      toast({
        title: 'Validation Error', 
        description: 'At least one unit type must be selected',
        variant: 'destructive'
      })
      return
    }

    onSave({
      id: editingTemplate?.id,
      name: formData.name.trim(),
      description: formData.description.trim(),
      unitTypes: formData.unitTypes
    })
  }

  const addUnitType = () => {
    if (newUnitType && !formData.unitTypes.includes(newUnitType)) {
      setFormData(prev => ({
        ...prev,
        unitTypes: [...prev.unitTypes, newUnitType]
      }))
      setNewUnitType('')
    }
  }

  const removeUnitType = (unitType: string) => {
    setFormData(prev => ({
      ...prev,
      unitTypes: prev.unitTypes.filter(type => type !== unitType)
    }))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {editingTemplate ? 'Edit PDI Template' : 'Create PDI Template'}
            </CardTitle>
            <CardDescription>
              {editingTemplate 
                ? 'Update the PDI template configuration'
                : 'Create a new pre-delivery inspection template'
              }
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Name */}
          <div>
            <Label htmlFor="templateName">Template Name *</Label>
            <Input
              id="templateName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter template name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this template is used for"
              rows={3}
            />
          </div>

          {/* Unit Types */}
          <div>
            <Label>Applicable Unit Types *</Label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Select
                  value={newUnitType}
                  onValueChange={setNewUnitType}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select unit type to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUnitTypes
                      .filter(type => !formData.unitTypes.includes(type))
                      .map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={addUnitType}
                  disabled={!newUnitType || formData.unitTypes.includes(newUnitType)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Selected Unit Types */}
              <div className="flex flex-wrap gap-2">
                {formData.unitTypes.map(unitType => (
                  <Badge key={unitType} variant="secondary" className="flex items-center gap-2">
                    {unitType}
                    <button
                      type="button"
                      onClick={() => removeUnitType(unitType)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              {formData.unitTypes.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No unit types selected. Please add at least one.
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onCancel}>
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
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}