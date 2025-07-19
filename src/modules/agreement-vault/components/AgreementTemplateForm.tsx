import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, X, Save, Plus, Trash2, Settings } from 'lucide-react'
import { AgreementType } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { mockAgreements } from '@/mocks/agreementsMock'
import { mockAgreementTemplates } from '@/mocks/agreementTemplatesMock'
import { DocumentViewer } from './DocumentViewer'

interface AgreementTemplateFormProps {
  template?: any // For editing existing templates
  onSave: (templateData: any) => void
  onCancel: () => void
}

export function AgreementTemplateForm({ template, onSave, onCancel }: AgreementTemplateFormProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    type: template?.type || 'PURCHASE',
    category: template?.category || '',
    terms: template?.terms || '',
    tags: template?.tags || [],
    isActive: template?.isActive ?? true,
    version: template?.version || '1.0',
    documents: template?.documents || []
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string>(template?.documentUrl || '')
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDocumentViewer, setShowDocumentViewer] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>(
    template?.documents ? template.documents.map(doc => ({
      ...doc
    })) : []
  )
  const [documentFields, setDocumentFields] = useState<any[]>([])

  // Available options from mock data
  const agreementTypes = mockAgreements.agreementTypes
  const templateCategories = mockAgreementTemplates.templateCategories
  const mergeFields = mockAgreementTemplates.commonMergeFields.map(f => f.key)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a PDF or Word document.',
          variant: 'destructive'
        })
        return
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please upload a file smaller than 10MB.',
          variant: 'destructive'
        })
        return
      }

      setUploadedFile(file)
      
      // Create preview URL for display
      const previewUrl = URL.createObjectURL(file)
      setFilePreview(previewUrl)
      const newDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        size: file.size,
        uploadedAt: new Date().toISOString()
      }
      
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, newDocument]
      }))
      
      setUploadedDocuments(prev => [...prev, newDocument])
      setNewTag('')
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const handleConfigureFields = () => {
    if (!uploadedFile) {
      toast({
        title: 'No Document',
        description: 'Please upload a document first',
        variant: 'destructive'
      })
      return
    }
    setShowDocumentViewer(true)
  }

  const handleSaveTemplate = () => {
    const templateData = {
      ...formData,
      documentFields,
      mergeFields: documentFields
        .filter(field => field.mergeField)
        .map(field => field.mergeField)
    }
    onSave(templateData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Template name is required.',
        variant: 'destructive'
      })
      return
    }

    if (!formData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Template description is required.',
        variant: 'destructive'
      })
      return
    }

    if (!template && !uploadedFile) {
      toast({
        title: 'Validation Error',
        description: 'Please upload a document for the template.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    
    try {
      // In a real app, you would upload the file to a storage service here
      const templateData = {
        ...formData,
        documents: uploadedDocuments,
        id: template?.id || `template-${Date.now()}`,
        version: template?.version || '1.0',
        documentUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : template?.documentUrl,
        documentName: uploadedFile?.name || template?.documentName,
        documentSize: uploadedFile?.size || template?.documentSize,
        mergeFields: template?.mergeFields || [], // Will be populated in next phase
        usageCount: template?.usageCount || 0,
        createdAt: template?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user@company.com' // Would come from auth context
      }

      await onSave(templateData)
      
      // If documents were uploaded, navigate to document viewer for field configuration
      if (uploadedDocuments.length > 0) {
        setShowDocumentViewer(true)
      } else {
        // If no documents, just close the form
        onCancel()
      }
      
      toast({
        title: 'Success',
        description: `Template ${template ? 'updated' : 'created'} successfully.`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${template ? 'update' : 'create'} template.`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (showDocumentViewer && uploadedFile) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <DocumentViewer
          initialDocuments={uploadedDocuments}
          documentUrl={URL.createObjectURL(uploadedFile)}
          documentName={uploadedFile.name}
          fields={documentFields}
          onFieldsChange={setDocumentFields}
          onSave={() => {
            setShowDocumentViewer(false)
            handleSaveTemplate()
          }}
          templateType={formData.type}
          mergeFields={mergeFields}
        />
        <Button
          variant="outline"
          className="absolute top-4 right-4 z-10"
          onClick={() => setShowDocumentViewer(false)}
        >
          <X className="h-4 w-4 mr-2" />
          Close Viewer
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {template ? 'Edit Agreement Template' : 'Create New Agreement Template'}
              </CardTitle>
              <CardDescription>
                {template 
                  ? 'Update the template details and document'
                  : 'Upload a document and configure template settings'
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
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Standard RV Purchase Agreement"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Agreement Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select agreement type" />
                  </SelectTrigger>
                  <SelectContent>
                    {agreementTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {templateCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags?.map((tag, index) => (
                    <div key={index} className="flex items-center bg-muted/50 px-3 py-1 rounded-md">
                      <span className="mr-2">{tag}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0" 
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this template is used for..."
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Document Upload */}
            <div>
              <Label>Document Upload {!template && '*'}</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
                {filePreview ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium">
                          {uploadedFile?.name || template?.documentName || 'Document uploaded'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {uploadedFile?.size 
                            ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`
                            : template?.documentSize 
                              ? `${(template.documentSize / 1024 / 1024).toFixed(2)} MB`
                              : 'Size unknown'
                          }
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Replace
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Upload Agreement Document
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      PDF, DOC, or DOCX files up to 10MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: PDF, DOC, DOCX. Maximum file size: 10MB.
              </p>
              
              {uploadedFile && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleConfigureFields}
                  className="mt-3"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Document Fields
                </Button>
              )}
            </div>

            {/* Template Terms (Optional for now) */}
            <div>
              <Label htmlFor="terms">Template Terms (Optional)</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                placeholder="Enter template terms and conditions..."
                className="mt-1"
                rows={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can add or edit terms later using the document editor.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSaveTemplate} disabled={loading}>
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