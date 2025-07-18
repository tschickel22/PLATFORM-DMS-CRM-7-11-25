import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import { AgreementTemplate, AgreementType } from '@/types'
import { mockAgreementTemplates } from '@/mocks/agreementTemplatesMock'
import { useToast } from '@/hooks/use-toast'

interface AgreementTemplateFormProps {
  template?: AgreementTemplate | null
  onSave: (template: Partial<AgreementTemplate>) => void
  onCancel: () => void
}

export function AgreementTemplateForm({ template, onSave, onCancel }: AgreementTemplateFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState<Partial<AgreementTemplate>>({
    name: '',
    description: '',
    type: AgreementType.PURCHASE,
    category: 'Custom',
    terms: '',
    mergeFields: [],
    tags: [],
    ...mockAgreementTemplates.defaultTemplate
  })

  const [newTag, setNewTag] = useState('')
  const [detectedMergeFields, setDetectedMergeFields] = useState<string[]>([])

  // Initialize form with template data if editing
  useEffect(() => {
    if (template) {
      setFormData({
        ...template
      })
    }
  }, [template])

  // Auto-detect merge fields in terms
  useEffect(() => {
    if (formData.terms) {
      const mergeFieldRegex = /\{\{([^}]+)\}\}/g
      const detected: string[] = []
      let match
      
      while ((match = mergeFieldRegex.exec(formData.terms)) !== null) {
        const fieldName = match[1].trim()
        if (!detected.includes(fieldName)) {
          detected.push(fieldName)
        }
      }
      
      setDetectedMergeFields(detected)
      
      // Auto-update merge fields if they've changed
      if (JSON.stringify(detected.sort()) !== JSON.stringify(formData.mergeFields?.sort())) {
        setFormData(prev => ({
          ...prev,
          mergeFields: detected
        }))
      }
    }
  }, [formData.terms])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.description || !formData.terms) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    if (formData.terms.length < mockAgreementTemplates.templateValidation.termsMinLength) {
      toast({
        title: 'Validation Error',
        description: `Terms must be at least ${mockAgreementTemplates.templateValidation.termsMinLength} characters long`,
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${template ? 'update' : 'create'} template`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }))
  }

  const insertMergeField = (field: string) => {
    const mergeField = `{{${field}}}`
    setFormData(prev => ({
      ...prev,
      terms: prev.terms + mergeField
    }))
  }

  const renderPreview = () => {
    if (!formData.terms) return <div className="text-muted-foreground">No content to preview</div>
    
    // Simple preview with merge fields highlighted
    const previewContent = formData.terms.replace(
      /\{\{([^}]+)\}\}/g, 
      '<span class="bg-blue-100 text-blue-800 px-1 rounded">{{$1}}</span>'
    )
    
    return (
      <div 
        className="prose max-w-none whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: previewContent }}
      />
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{template ? 'Edit Template' : 'Create Agreement Template'}</CardTitle>
              <CardDescription>
                {template ? 'Update template details and content' : 'Create a new reusable agreement template'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content & Fields</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Template Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Standard RV Purchase Agreement"
                      maxLength={mockAgreementTemplates.templateValidation.nameMaxLength}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.name?.length || 0}/{mockAgreementTemplates.templateValidation.nameMaxLength} characters
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Agreement Type *</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value: AgreementType) => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AgreementType.PURCHASE}>Purchase Agreement</SelectItem>
                        <SelectItem value={AgreementType.LEASE}>Lease Agreement</SelectItem>
                        <SelectItem value={AgreementType.SERVICE}>Service Agreement</SelectItem>
                        <SelectItem value={AgreementType.WARRANTY}>Warranty Agreement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this template is used for..."
                    rows={3}
                    maxLength={mockAgreementTemplates.templateValidation.descriptionMaxLength}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.description?.length || 0}/{mockAgreementTemplates.templateValidation.descriptionMaxLength} characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAgreementTemplates.templateCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-4 w-4 p-0 hover:bg-transparent" 
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Content & Fields Tab */}
              <TabsContent value="content" className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="terms">Agreement Terms *</Label>
                    <div className="flex items-center space-x-2">
                      <Select
                        value=""
                        onValueChange={(value) => insertMergeField(value)}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Insert merge field" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockAgreementTemplates.mergeFieldCategories.map(category => (
                            <div key={category}>
                              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                                {category}
                              </div>
                              {mockAgreementTemplates.commonMergeFields
                                .filter(field => field.category === category)
                                .map(field => (
                                  <SelectItem key={field.key} value={field.key}>
                                    {field.label}
                                  </SelectItem>
                                ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Textarea
                    id="terms"
                    value={formData.terms}
                    onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                    placeholder="Enter the agreement terms with merge fields like {{customer_name}}, {{total_amount}}, etc."
                    rows={20}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use double curly braces for merge fields: {`{{field_name}}`}
                  </p>
                </div>

                {detectedMergeFields.length > 0 && (
                  <div>
                    <Label>Detected Merge Fields ({detectedMergeFields.length})</Label>
                    <div className="flex flex-wrap gap-2 mt-2 p-3 bg-muted/30 rounded-md">
                      {detectedMergeFields.map((field, index) => (
                        <Badge key={index} variant="outline">
                          {`{{${field}}}`}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      These merge fields were automatically detected in your terms
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Template Preview</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </div>
                
                {showPreview && (
                  <div className="border rounded-lg p-6 bg-white max-h-96 overflow-y-auto">
                    <div className="mb-4 pb-4 border-b">
                      <h3 className="text-lg font-semibold">{formData.name}</h3>
                      <p className="text-sm text-muted-foreground">{formData.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge>{formData.type}</Badge>
                        <Badge variant="outline">{formData.category}</Badge>
                      </div>
                    </div>
                    {renderPreview()}
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Template Statistics:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Characters: {formData.terms?.length || 0}</li>
                    <li>Merge Fields: {detectedMergeFields.length}</li>
                    <li>Tags: {formData.tags?.length || 0}</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {template ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {template ? 'Update Template' : 'Create Template'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}