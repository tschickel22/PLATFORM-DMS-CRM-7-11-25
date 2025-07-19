import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Eye, EyeOff, Settings, Upload, FileText, Trash2, ChevronDown, Play, Pause } from 'lucide-react'
import { useTemplateManagement } from '../hooks/useTemplateManagement'
import { TemplateCategory, TemplateStatus, TemplateField } from '../types/template'
import { PDFBuilderLite } from './PDFBuilderLite'
import { FileProcessor } from '../utils/fileProcessor'

export default function TemplateEditor({ templateId, onClose }: { templateId: string, onClose: () => void }) {
export function TemplateBuilder() {
  const [templates, setTemplates] = useState<LocalTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [activeTab, setActiveTab] = useState('builder')
  const [selectedFileIndex, setSelectedFileIndex] = useState(0)
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null)

  const { updateTemplate, updateTemplateFields } = useTemplateManagement()

  useEffect(() => {
    // Load templates from localStorage
    const savedTemplates = localStorage.getItem('agreement-templates')
    if (savedTemplates) {
      const parsedTemplates = JSON.parse(savedTemplates)
      setTemplates(parsedTemplates)
      
      if (templateId && templateId !== 'new') {
        const existingTemplate = parsedTemplates.find((t: LocalTemplate) => t.id === templateId)
        if (existingTemplate) {
          setTemplate(existingTemplate)
        }
      } else {
        // Create new template
        const newTemplate: LocalTemplate = {
          id: `template-${Date.now()}`,
          name: 'New Template',
          category: 'custom',
          status: 'draft' as TemplateStatus,
          files: [],
          fields: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setTemplate(newTemplate)
      }
    }
  }, [templateId])

  const saveTemplate = () => {
    if (!template) return
    
    const updatedTemplate = {
      ...template,
      updatedAt: new Date().toISOString()
    }
    
    const updatedTemplates = templateId === 'new' 
      ? [...templates, updatedTemplate]
      : templates.map(t => t.id === template.id ? updatedTemplate : t)
    
    setTemplates(updatedTemplates)
    localStorage.setItem('agreement-templates', JSON.stringify(updatedTemplates))
    setTemplate(updatedTemplate)
    
    toast({
      title: 'Template Saved',
      description: 'Your template has been saved successfully.',
    })
    
    if (templateId === 'new') {
      navigate(`/agreements/templates/${updatedTemplate.id}`)
    }
  }

  const loadMergedPdf = async () => {
    if (!template?.files || template.files.length === 0) {
      setMergedPdfUrl(null)
      return
    }

    setLoading(true)
    try {
      const pdfFiles = template.files.filter(file => file.type === 'application/pdf')
      
      if (pdfFiles.length === 0) {
        setMergedPdfUrl(null)
        return
      }

      // For now, just use the first PDF file
      // In a real implementation, you might want to merge multiple PDFs
      const firstPdfFile = pdfFiles[0]
      setMergedPdfUrl(firstPdfFile.url)
      
    } catch (error) {
      console.error('Error loading PDF:', error)
      toast({
        title: 'Error',
        description: 'Failed to load PDF files for editing.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !template) return

    setLoading(true)
    try {
      const newFiles = []
      
      for (const file of Array.from(files)) {
        // Only accept PDF files for now
        if (file.type === 'application/pdf') {
          const fileUrl = URL.createObjectURL(file)
          const newFile = {
            id: `file-${Date.now()}-${Math.random()}`,
            name: file.name,
            originalName: file.name,
            type: file.type,
            size: file.size,
            url: fileUrl
          }
          newFiles.push(newFile)
        } else {
          toast({
            title: 'Unsupported File Type',
            description: 'Only PDF files are currently supported.',
            variant: 'destructive'
          })
          continue
        }
      }

      if (newFiles.length > 0) {
        setTemplate(prev => prev ? {
          ...prev,
          files: [...prev.files, ...newFiles]
        } : null)
        
        // Set the first uploaded file as selected if none selected
        if (template.files.length === 0 && newFiles.length > 0) {
          setSelectedFileIndex(0)
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload files.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMergedPdf()

    // Cleanup function
    return () => {
      if (mergedPdfUrl) {
        URL.revokeObjectURL(mergedPdfUrl)
      }
    }
  }, [template?.files, toast])

  if (!template) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Template not found</h3>
          <Button onClick={onClose}>Go Back</Button>
        </div>
      </div>
    )
  }

  const handleSaveTemplate = async () => {
    try {
      saveTemplate()
      toast({
        title: 'Template Saved',
        description: 'Template has been saved successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save template.',
        variant: 'destructive'
      })
    }
  }

  const handleFieldsChange = async (fields: TemplateField[]) => {
    try {
      await updateTemplateFields(templateId, fields)
      setTemplate(prev => prev ? { ...prev, fields } : null)
    } catch (error) {
      console.error('Error updating fields:', error)
    }
  }

  const handlePublishTemplate = async () => {
    try {
      await updateTemplate(templateId, { status: TemplateStatus.ACTIVE })
      setTemplate(prev => prev ? { ...prev, status: TemplateStatus.ACTIVE } : null)
      
      toast({
        title: 'Template Published',
        description: 'Template is now active and can be used for agreements.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish template.',
        variant: 'destructive'
      })
    }
  }

  const handleUnpublishTemplate = async () => {
    try {
      await updateTemplate(templateId, { status: TemplateStatus.DRAFT })
      setTemplate(prev => prev ? { ...prev, status: TemplateStatus.DRAFT } : null)
      
      toast({
        title: 'Template Unpublished',
        description: 'Template is now in draft mode.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unpublish template.',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteFile = (fileId: string) => {
    if (!template) return
    
    const fileIndex = template.files.findIndex(f => f.id === fileId)
    
    setTemplate(prev => prev ? {
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    } : null)
    
    // Adjust selected file index if necessary
    if (fileIndex === selectedFileIndex && template.files.length > 1) {
      setSelectedFileIndex(Math.max(0, selectedFileIndex - 1))
    } else if (template.files.length === 1) {
      setSelectedFileIndex(0)
    }
  }

  const currentFile = template.files[selectedFileIndex]

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{template.name}</h1>
            <p className="text-sm text-muted-foreground">
              {template.category.charAt(0).toUpperCase() + template.category.slice(1)} Template
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Edit Mode
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </>
            )}
          </Button>

          {template.status === TemplateStatus.DRAFT ? (
            <Button size="sm" onClick={handlePublishTemplate}>
              <Play className="h-4 w-4 mr-2" />
              Publish
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleUnpublishTemplate}>
              <Pause className="h-4 w-4 mr-2" />
              Unpublish
            </Button>
          )}

          <Button size="sm" onClick={handleSaveTemplate}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
            <TabsTrigger value="builder" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              <FileText className="h-4 w-4 mr-2" />
              Document Builder
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              <Settings className="h-4 w-4 mr-2" />
              Template Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="flex-1 m-0">
            <div className="h-full flex flex-col">
              {/* File Selector */}
              {template.files.length > 1 && (
                <div className="p-4 border-b">
                  <Label>Select File</Label>
                  <Select
                    value={selectedFileIndex.toString()}
                    onValueChange={(value) => setSelectedFileIndex(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {template.files.map((file, index) => (
                        <SelectItem key={file.id} value={index.toString()}>
                          {file.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex-1">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Loading PDF...</p>
                    </div>
                  </div>
                ) : mergedPdfUrl ? (
                  <PDFBuilderLite
                    pdfUrl={mergedPdfUrl}
                    fields={template.fields}
                    onFieldsChange={handleFieldsChange}
                    readonly={previewMode}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No PDF Available</h3>
                      <p className="text-muted-foreground mb-4">
                        Upload PDF or DOCX files to start building your template.
                      </p>
                      <div>
                        <input
                          type="file"
                          multiple
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <Button asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Files
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 m-0 p-6">
            <div className="max-w-2xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Template Information</CardTitle>
                  <CardDescription>
                    Basic information about this template
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="templateName">Template Name</Label>
                    <Input
                      id="templateName"
                      value={template.name}
                      onChange={(e) => setTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="templateCategory">Category</Label>
                    <Select
                      value={template.category}
                      onValueChange={(value: TemplateCategory) => 
                        setTemplate(prev => prev ? { ...prev, category: value } : null)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TemplateCategory.PURCHASE}>Purchase Agreement</SelectItem>
                        <SelectItem value={TemplateCategory.LEASE}>Lease Agreement</SelectItem>
                        <SelectItem value={TemplateCategory.SERVICE}>Service Agreement</SelectItem>
                        <SelectItem value={TemplateCategory.WARRANTY}>Warranty Agreement</SelectItem>
                        <SelectItem value={TemplateCategory.CUSTOM}>Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="templateDescription">Description</Label>
                    <Textarea
                      id="templateDescription"
                      value={template.description || ''}
                      onChange={(e) => setTemplate(prev => prev ? { ...prev, description: e.target.value } : null)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Template Status</CardTitle>
                  <CardDescription>
                    Control the availability of this template
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Status: {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {template.status === TemplateStatus.ACTIVE 
                          ? 'This template is active and can be used for new agreements.'
                          : 'This template is in draft mode and cannot be used for agreements.'
                        }
                      </p>
                    </div>
                    {template.status === TemplateStatus.DRAFT ? (
                      <Button onClick={handlePublishTemplate}>
                        <Play className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={handleUnpublishTemplate}>
                        <Pause className="h-4 w-4 mr-2" />
                        Unpublish
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Template Files</CardTitle>
                  <CardDescription>
                    Files attached to this template
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {template.files.map((file, index) => (
                      <div 
                        key={file.id} 
                        className={`flex items-center justify-between p-2 border rounded cursor-pointer transition-colors ${
                          index === selectedFileIndex ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedFileIndex(index)}
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{file.originalName}</p>
                            <p className="text-sm text-muted-foreground">
                              {file.type.toUpperCase()} • {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          {index === selectedFileIndex && (
                            <Badge variant="secondary" className="text-xs">Active</Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteFile(file.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload-settings"
                      />
                      <label htmlFor="file-upload-settings" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload PDF files
                        </p>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Template Fields</CardTitle>
                  <CardDescription>
                    Fields configured in this template
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {template.fields.length > 0 ? (
                    <div className="space-y-2">
                      {template.fields.map((field, index) => (
                        <div key={field.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <span className="font-medium">{field.label}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({field.type})
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Page {field.page}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No fields configured yet. Use the Document Builder to add fields.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}