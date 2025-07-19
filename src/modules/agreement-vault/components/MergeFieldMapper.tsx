import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Link2, Plus, Trash2, Save, Eye, Code, FileText } from 'lucide-react'
import { DocumentField } from '../types'
import { mockAgreementTemplates } from '@/mocks/agreementTemplatesMock'

interface MergeFieldMapperProps {
  fields: DocumentField[]
  onFieldsUpdate: (fields: DocumentField[]) => void
  onClose: () => void
  templateType: string
}

interface MergeFieldGroup {
  category: string
  fields: Array<{ key: string; label: string; description?: string }>
}

export function MergeFieldMapper({ fields, onFieldsUpdate, onClose, templateType }: MergeFieldMapperProps) {
  const [activeTab, setActiveTab] = useState('mapping')
  const [customMergeFields, setCustomMergeFields] = useState<Array<{ key: string; label: string; description: string }>>([])
  const [newFieldKey, setNewFieldKey] = useState('')
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [newFieldDescription, setNewFieldDescription] = useState('')
  const [previewData, setPreviewData] = useState<Record<string, string>>({})

  // Group merge fields by category
  const mergeFieldGroups: MergeFieldGroup[] = mockAgreementTemplates.mergeFieldCategories.map(category => ({
    category,
    fields: mockAgreementTemplates.commonMergeFields
      .filter(field => field.category === category)
      .map(field => ({
        key: field.key,
        label: field.label,
        description: `Used in ${field.category} section`
      }))
  }))

  const handleFieldMergeUpdate = (fieldId: string, mergeField: string) => {
    const updatedFields = fields.map(field =>
      field.id === fieldId ? { ...field, mergeField } : field
    )
    onFieldsUpdate(updatedFields)
  }

  const handleAddCustomMergeField = () => {
    if (!newFieldKey || !newFieldLabel) return
    
    const newField = {
      key: newFieldKey,
      label: newFieldLabel,
      description: newFieldDescription || `Custom field: ${newFieldLabel}`
    }
    
    setCustomMergeFields([...customMergeFields, newField])
    setNewFieldKey('')
    setNewFieldLabel('')
    setNewFieldDescription('')
  }

  const handleRemoveCustomField = (key: string) => {
    setCustomMergeFields(customMergeFields.filter(field => field.key !== key))
  }

  const handlePreviewDataChange = (key: string, value: string) => {
    setPreviewData({ ...previewData, [key]: value })
  }

  const getAllMergeFields = () => {
    const standardFields = mockAgreementTemplates.commonMergeFields.map(field => ({
      key: field.key,
      label: field.label,
      description: `${field.category}: ${field.label}`
    }))
    
    return [...standardFields, ...customMergeFields]
  }

  const getUsedMergeFields = () => {
    const usedFields = new Set(fields.map(field => field.mergeField).filter(Boolean))
    return Array.from(usedFields)
  }

  const getUnmappedFields = () => {
    return fields.filter(field => !field.mergeField)
  }

  const generatePreviewText = () => {
    let previewText = `SAMPLE ${templateType.toUpperCase()} AGREEMENT\n\n`
    
    const sampleData = {
      customer_name: previewData.customer_name || 'John Smith',
      customer_email: previewData.customer_email || 'john.smith@email.com',
      vehicle_info: previewData.vehicle_info || '2024 Forest River Cherokee 274RK',
      total_amount: previewData.total_amount || '$45,000.00',
      effective_date: previewData.effective_date || new Date().toLocaleDateString(),
      company_name: previewData.company_name || 'Demo RV Dealership',
      ...previewData
    }
    
    // Generate sample content with merge fields
    previewText += `Customer: {{customer_name}}\n`
    previewText += `Email: {{customer_email}}\n`
    previewText += `Vehicle: {{vehicle_info}}\n`
    previewText += `Amount: {{total_amount}}\n`
    previewText += `Date: {{effective_date}}\n\n`
    previewText += `This agreement is between {{company_name}} and {{customer_name}}...\n\n`
    
    // Add field mappings
    fields.forEach(field => {
      if (field.mergeField) {
        previewText += `${field.label}: {{${field.mergeField}}}\n`
      }
    })
    
    // Replace merge fields with sample data
    let processedText = previewText
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      processedText = processedText.replace(regex, value)
    })
    
    return processedText
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Link2 className="h-5 w-5 mr-2 text-primary" />
                Merge Field Mapper
              </CardTitle>
              <CardDescription>
                Map document fields to merge variables and preview the final output
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
              <TabsTrigger value="custom">Custom Fields</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            {/* Field Mapping Tab */}
            <TabsContent value="mapping" className="flex-1 flex gap-6">
              <div className="flex-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Document Fields</CardTitle>
                    <CardDescription>
                      Map each document field to a merge variable
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                    {fields.map(field => (
                      <div key={field.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{field.label}</h4>
                            <p className="text-sm text-muted-foreground">
                              Type: {field.type} • Position: {Math.round(field.position.x)}%, {Math.round(field.position.y)}%
                            </p>
                          </div>
                          <Badge variant={field.mergeField ? 'default' : 'secondary'}>
                            {field.mergeField ? 'Mapped' : 'Unmapped'}
                          </Badge>
                        </div>
                        
                        <div>
                          <Label htmlFor={`merge-${field.id}`}>Merge Field</Label>
                          <Select
                            value={field.mergeField || ''}
                            onValueChange={(value) => handleFieldMergeUpdate(field.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select merge field..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">No mapping</SelectItem>
                              {getAllMergeFields().map(mergeField => (
                                <SelectItem key={mergeField.key} value={mergeField.key}>
                                  {mergeField.label} ({mergeField.key})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                    
                    {fields.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No document fields to map. Add fields in the document viewer first.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="w-80 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Merge Fields</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    {mergeFieldGroups.map(group => (
                      <div key={group.category} className="mb-4">
                        <h4 className="font-medium text-sm mb-2">{group.category}</h4>
                        <div className="space-y-1">
                          {group.fields.map(field => (
                            <div key={field.key} className="text-xs p-2 bg-muted/50 rounded">
                              <div className="font-medium">{field.label}</div>
                              <div className="text-muted-foreground">{{field.key}}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mapping Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Fields:</span>
                        <span>{fields.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mapped:</span>
                        <span className="text-green-600">
                          {fields.filter(f => f.mergeField).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unmapped:</span>
                        <span className="text-orange-600">
                          {getUnmappedFields().length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Custom Fields Tab */}
            <TabsContent value="custom" className="flex-1">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Add Custom Merge Field</CardTitle>
                    <CardDescription>
                      Create custom merge fields for your specific needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fieldKey">Field Key</Label>
                      <Input
                        id="fieldKey"
                        value={newFieldKey}
                        onChange={(e) => setNewFieldKey(e.target.value)}
                        placeholder="e.g., custom_field_name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fieldLabel">Display Label</Label>
                      <Input
                        id="fieldLabel"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        placeholder="e.g., Custom Field Name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fieldDescription">Description</Label>
                      <Input
                        id="fieldDescription"
                        value={newFieldDescription}
                        onChange={(e) => setNewFieldDescription(e.target.value)}
                        placeholder="Optional description"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleAddCustomMergeField}
                      disabled={!newFieldKey || !newFieldLabel}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Custom Field
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Custom Merge Fields</CardTitle>
                    <CardDescription>
                      Manage your custom merge fields
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {customMergeFields.map(field => (
                        <div key={field.key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{field.label}</div>
                            <div className="text-sm text-muted-foreground">{{field.key}}</div>
                            {field.description && (
                              <div className="text-xs text-muted-foreground">{field.description}</div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCustomField(field.key)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      
                      {customMergeFields.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No custom merge fields created yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Preview Tab */}
            <TabsContent value="preview" className="flex-1 flex gap-6">
              <div className="flex-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Document Preview
                    </CardTitle>
                    <CardDescription>
                      Preview how your document will look with sample data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white border rounded-lg p-6 h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                      {generatePreviewText()}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="w-80">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sample Data</CardTitle>
                    <CardDescription>
                      Enter sample values to preview the final document
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {getUsedMergeFields().map(fieldKey => (
                      <div key={fieldKey}>
                        <Label htmlFor={`preview-${fieldKey}`}>{fieldKey}</Label>
                        <Input
                          id={`preview-${fieldKey}`}
                          value={previewData[fieldKey] || ''}
                          onChange={(e) => handlePreviewDataChange(fieldKey, e.target.value)}
                          placeholder={`Enter ${fieldKey}...`}
                        />
                      </div>
                    ))}
                    
                    {getUsedMergeFields().length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No merge fields mapped yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}