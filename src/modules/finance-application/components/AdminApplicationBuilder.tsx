import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, GripVertical, Save, X } from 'lucide-react'
import { ApplicationTemplate, ApplicationSection, ApplicationField, FieldType } from '../types'
import { mockFinanceApplications } from '../mocks/financeApplicationMock'
import { useToast } from '@/hooks/use-toast'

interface AdminApplicationBuilderProps {
  templates: ApplicationTemplate[]
  onCreateTemplate: (template: Partial<ApplicationTemplate>) => ApplicationTemplate
  onUpdateTemplate: (id: string, updates: Partial<ApplicationTemplate>) => void
  onDeleteTemplate: (id: string) => void
}

export function AdminApplicationBuilder({
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate
}: AdminApplicationBuilderProps) {
  const { toast } = useToast()
  const [selectedTemplate, setSelectedTemplate] = useState<ApplicationTemplate | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<Partial<ApplicationTemplate> | null>(null)
  const [editingSection, setEditingSection] = useState<ApplicationSection | null>(null)
  const [editingField, setEditingField] = useState<ApplicationField | null>(null)

  const fieldTypes = mockFinanceApplications.fieldTypes

  const handleCreateTemplate = () => {
    const newTemplate = onCreateTemplate({
      name: 'New Template',
      description: '',
      sections: [],
      isActive: true
    })
    setSelectedTemplate(newTemplate)
    setEditingTemplate(newTemplate)
  }

  const handleSaveTemplate = () => {
    if (!editingTemplate || !selectedTemplate) return

    onUpdateTemplate(selectedTemplate.id, editingTemplate)
    setEditingTemplate(null)
    
    toast({
      title: 'Template Saved',
      description: 'Application template has been saved successfully'
    })
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      onDeleteTemplate(templateId)
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null)
        setEditingTemplate(null)
      }
      
      toast({
        title: 'Template Deleted',
        description: 'Application template has been deleted'
      })
    }
  }

  const handleAddSection = () => {
    if (!selectedTemplate) return

    const newSection: ApplicationSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: '',
      order: (selectedTemplate.sections?.length || 0) + 1,
      fields: []
    }

    const updatedSections = [...(selectedTemplate.sections || []), newSection]
    const updatedTemplate = { ...selectedTemplate, sections: updatedSections }
    
    setSelectedTemplate(updatedTemplate)
    setEditingTemplate(updatedTemplate)
    setEditingSection(newSection)
  }

  const handleSaveSection = (section: ApplicationSection) => {
    if (!selectedTemplate || !editingTemplate) return

    const updatedSections = editingTemplate.sections?.map(s => 
      s.id === section.id ? section : s
    ) || []

    const updatedTemplate = { ...editingTemplate, sections: updatedSections }
    setEditingTemplate(updatedTemplate)
    setSelectedTemplate(updatedTemplate)
    setEditingSection(null)
  }

  const handleDeleteSection = (sectionId: string) => {
    if (!selectedTemplate || !editingTemplate) return

    const updatedSections = editingTemplate.sections?.filter(s => s.id !== sectionId) || []
    const updatedTemplate = { ...editingTemplate, sections: updatedSections }
    
    setEditingTemplate(updatedTemplate)
    setSelectedTemplate(updatedTemplate)
  }

  const handleAddField = (sectionId: string) => {
    if (!selectedTemplate || !editingTemplate) return

    const newField: ApplicationField = {
      id: `field-${Date.now()}`,
      type: 'text',
      label: 'New Field',
      placeholder: '',
      required: false,
      order: 1
    }

    const updatedSections = editingTemplate.sections?.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: [...section.fields, { ...newField, order: section.fields.length + 1 }]
        }
      }
      return section
    }) || []

    const updatedTemplate = { ...editingTemplate, sections: updatedSections }
    setEditingTemplate(updatedTemplate)
    setSelectedTemplate(updatedTemplate)
    setEditingField(newField)
  }

  const handleSaveField = (sectionId: string, field: ApplicationField) => {
    if (!editingTemplate) return

    const updatedSections = editingTemplate.sections?.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: section.fields.map(f => f.id === field.id ? field : f)
        }
      }
      return section
    }) || []

    const updatedTemplate = { ...editingTemplate, sections: updatedSections }
    setEditingTemplate(updatedTemplate)
    setSelectedTemplate(updatedTemplate)
    setEditingField(null)
  }

  const handleDeleteField = (sectionId: string, fieldId: string) => {
    if (!editingTemplate) return

    const updatedSections = editingTemplate.sections?.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: section.fields.filter(f => f.id !== fieldId)
        }
      }
      return section
    }) || []

    const updatedTemplate = { ...editingTemplate, sections: updatedSections }
    setEditingTemplate(updatedTemplate)
    setSelectedTemplate(updatedTemplate)
  }

  if (selectedTemplate) {
    return (
      <div className="space-y-6">
        {/* Template Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => {
              setSelectedTemplate(null)
              setEditingTemplate(null)
            }}>
              ← Back to Templates
            </Button>
            <div>
              <h2 className="text-xl font-semibold">{selectedTemplate.name}</h2>
              <p className="text-muted-foreground">Template Builder</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {editingTemplate && (
              <>
                <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </>
            )}
            {!editingTemplate && (
              <Button onClick={() => setEditingTemplate(selectedTemplate)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Template
              </Button>
            )}
          </div>
        </div>

        {/* Template Settings */}
        {editingTemplate && (
          <Card>
            <CardHeader>
              <CardTitle>Template Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({
                      ...editingTemplate,
                      name: e.target.value
                    })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={editingTemplate.isActive}
                    onCheckedChange={(checked) => setEditingTemplate({
                      ...editingTemplate,
                      isActive: !!checked
                    })}
                  />
                  <Label htmlFor="isActive">Active Template</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="templateDescription">Description</Label>
                <Textarea
                  id="templateDescription"
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    description: e.target.value
                  })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Sections</h3>
            {editingTemplate && (
              <Button onClick={handleAddSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            )}
          </div>

          {selectedTemplate.sections?.map((section) => (
            <SectionEditor
              key={section.id}
              section={section}
              isEditing={!!editingTemplate}
              editingSection={editingSection}
              editingField={editingField}
              onEditSection={setEditingSection}
              onSaveSection={handleSaveSection}
              onDeleteSection={handleDeleteSection}
              onAddField={handleAddField}
              onEditField={setEditingField}
              onSaveField={handleSaveField}
              onDeleteField={handleDeleteField}
              fieldTypes={fieldTypes}
            />
          ))}

          {(!selectedTemplate.sections || selectedTemplate.sections.length === 0) && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No sections added yet</p>
                {editingTemplate && (
                  <Button onClick={handleAddSection} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Section
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Application Templates</CardTitle>
            <CardDescription>
              Create and manage finance application templates
            </CardDescription>
          </div>
          <Button onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h4 className="font-semibold">{template.name}</h4>
                  <Badge variant={template.isActive ? 'default' : 'secondary'}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {template.description || 'No description'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {template.sections?.length || 0} sections • 
                  {template.sections?.reduce((total, section) => total + section.fields.length, 0) || 0} fields
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {templates.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No templates created yet</p>
              <p className="text-sm">Create your first template to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Section Editor Component
interface SectionEditorProps {
  section: ApplicationSection
  isEditing: boolean
  editingSection: ApplicationSection | null
  editingField: ApplicationField | null
  onEditSection: (section: ApplicationSection) => void
  onSaveSection: (section: ApplicationSection) => void
  onDeleteSection: (sectionId: string) => void
  onAddField: (sectionId: string) => void
  onEditField: (field: ApplicationField) => void
  onSaveField: (sectionId: string, field: ApplicationField) => void
  onDeleteField: (sectionId: string, fieldId: string) => void
  fieldTypes: Array<{ value: string; label: string }>
}

function SectionEditor({
  section,
  isEditing,
  editingSection,
  editingField,
  onEditSection,
  onSaveSection,
  onDeleteSection,
  onAddField,
  onEditField,
  onSaveField,
  onDeleteField,
  fieldTypes
}: SectionEditorProps) {
  const [localSection, setLocalSection] = useState(section)

  const isEditingThis = editingSection?.id === section.id

  const handleSave = () => {
    onSaveSection(localSection)
  }

  const handleCancel = () => {
    setLocalSection(section)
    onEditSection(null as any)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isEditing && <GripVertical className="h-4 w-4 text-muted-foreground" />}
            <div>
              <h4 className="font-semibold">{section.title}</h4>
              {section.description && (
                <p className="text-sm text-muted-foreground">{section.description}</p>
              )}
            </div>
          </div>
          {isEditing && (
            <div className="flex items-center space-x-2">
              {!isEditingThis && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditSection(section)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              {isEditingThis && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditingThis ? (
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="sectionTitle">Section Title</Label>
              <Input
                id="sectionTitle"
                value={localSection.title}
                onChange={(e) => setLocalSection({
                  ...localSection,
                  title: e.target.value
                })}
              />
            </div>
            <div>
              <Label htmlFor="sectionDescription">Description</Label>
              <Textarea
                id="sectionDescription"
                value={localSection.description}
                onChange={(e) => setLocalSection({
                  ...localSection,
                  description: e.target.value
                })}
                rows={2}
              />
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-medium">Fields ({section.fields.length})</h5>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddField(section.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            )}
          </div>

          {section.fields.map((field) => (
            <FieldEditor
              key={field.id}
              field={field}
              sectionId={section.id}
              isEditing={isEditing}
              editingField={editingField}
              onEditField={onEditField}
              onSaveField={onSaveField}
              onDeleteField={onDeleteField}
              fieldTypes={fieldTypes}
            />
          ))}

          {section.fields.length === 0 && (
            <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
              <p className="text-sm">No fields added yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Field Editor Component
interface FieldEditorProps {
  field: ApplicationField
  sectionId: string
  isEditing: boolean
  editingField: ApplicationField | null
  onEditField: (field: ApplicationField) => void
  onSaveField: (sectionId: string, field: ApplicationField) => void
  onDeleteField: (sectionId: string, fieldId: string) => void
  fieldTypes: Array<{ value: string; label: string }>
}

function FieldEditor({
  field,
  sectionId,
  isEditing,
  editingField,
  onEditField,
  onSaveField,
  onDeleteField,
  fieldTypes
}: FieldEditorProps) {
  const [localField, setLocalField] = useState(field)
  const [newOption, setNewOption] = useState('')

  const isEditingThis = editingField?.id === field.id

  const handleSave = () => {
    onSaveField(sectionId, localField)
  }

  const handleCancel = () => {
    setLocalField(field)
    onEditField(null as any)
  }

  const addOption = () => {
    if (newOption.trim()) {
      setLocalField({
        ...localField,
        options: [...(localField.options || []), newOption.trim()]
      })
      setNewOption('')
    }
  }

  const removeOption = (index: number) => {
    setLocalField({
      ...localField,
      options: localField.options?.filter((_, i) => i !== index)
    })
  }

  if (isEditingThis) {
    return (
      <Card className="border-primary">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="fieldLabel">Field Label</Label>
                <Input
                  id="fieldLabel"
                  value={localField.label}
                  onChange={(e) => setLocalField({
                    ...localField,
                    label: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="fieldType">Field Type</Label>
                <Select
                  value={localField.type}
                  onValueChange={(value: FieldType) => setLocalField({
                    ...localField,
                    type: value,
                    options: ['select', 'radio', 'checkbox'].includes(value) ? localField.options : undefined
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="fieldPlaceholder">Placeholder Text</Label>
              <Input
                id="fieldPlaceholder"
                value={localField.placeholder}
                onChange={(e) => setLocalField({
                  ...localField,
                  placeholder: e.target.value
                })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="fieldRequired"
                checked={localField.required}
                onCheckedChange={(checked) => setLocalField({
                  ...localField,
                  required: !!checked
                })}
              />
              <Label htmlFor="fieldRequired">Required Field</Label>
            </div>

            {(['select', 'radio'] as FieldType[]).includes(localField.type) && (
              <div>
                <Label>Options</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add option"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addOption()
                        }
                      }}
                    />
                    <Button type="button" onClick={addOption}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {localField.options?.map((option, index) => (
                      <div key={index} className="flex items-center bg-muted px-2 py-1 rounded">
                        <span className="text-sm mr-2">{option}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeOption(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Field
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center space-x-3">
        {isEditing && <GripVertical className="h-4 w-4 text-muted-foreground" />}
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">{field.label}</span>
            {field.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
            <Badge variant="outline" className="text-xs">
              {fieldTypes.find(t => t.value === field.type)?.label}
            </Badge>
          </div>
          {field.placeholder && (
            <p className="text-sm text-muted-foreground">Placeholder: {field.placeholder}</p>
          )}
        </div>
      </div>
      {isEditing && (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditField(field)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteField(sectionId, field.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}