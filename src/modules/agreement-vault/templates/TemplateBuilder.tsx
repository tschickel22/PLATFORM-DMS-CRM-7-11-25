import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  ArrowLeft, 
  Type, 
  Calendar, 
  PenTool, 
  CheckSquare,
  Upload,
  Trash2,
  Move,
  Settings
} from 'lucide-react'
import { useTemplates } from './useTemplates'
import { useToast } from '@/hooks/use-toast'
import { Template, TemplateField, FieldType, FieldConfig } from './templateTypes'
import ErrorBoundary from '@/components/ErrorBoundary'

// Field configurations for the toolbox
const FIELD_CONFIGS: FieldConfig[] = [
  {
    type: FieldType.TEXT,
    label: 'Text Field',
    icon: 'Type',
    defaultSize: { width: 200, height: 30 }
  },
  {
    type: FieldType.DATE,
    label: 'Date Field',
    icon: 'Calendar',
    defaultSize: { width: 150, height: 30 }
  },
  {
    type: FieldType.SIGNATURE,
    label: 'Signature',
    icon: 'PenTool',
    defaultSize: { width: 200, height: 60 }
  },
  {
    type: FieldType.CHECKBOX,
    label: 'Checkbox',
    icon: 'CheckSquare',
    defaultSize: { width: 20, height: 20 }
  }
]

interface FieldIconProps {
  type: FieldType
  className?: string
}

function FieldIcon({ type, className = "h-4 w-4" }: FieldIconProps) {
  switch (type) {
    case FieldType.TEXT:
      return <Type className={className} />
    case FieldType.DATE:
      return <Calendar className={className} />
    case FieldType.SIGNATURE:
      return <PenTool className={className} />
    case FieldType.CHECKBOX:
      return <CheckSquare className={className} />
    default:
      return <Type className={className} />
  }
}

export default function TemplateBuilder() {
  const { templateId } = useParams<{ templateId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getTemplate, addTemplate, updateTemplate } = useTemplates()
  
  const [template, setTemplate] = useState<Template | null>(null)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [selectedField, setSelectedField] = useState<TemplateField | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfBase64, setPdfBase64] = useState<string>('')
  const [saving, setSaving] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load template if editing
  useEffect(() => {
    if (templateId) {
      const existingTemplate = getTemplate(templateId)
      if (existingTemplate) {
        setTemplate(existingTemplate)
        setTemplateName(existingTemplate.name)
        setTemplateDescription(existingTemplate.description || '')
        setPdfBase64(existingTemplate.pdfBase64)
      } else {
        toast({
          title: 'Template Not Found',
          description: 'The requested template could not be found.',
          variant: 'destructive'
        })
        navigate('/agreements/templates')
      }
    } else {
      // New template
      setTemplate({
        id: '',
        name: '',
        description: '',
        pdfBase64: '',
        fields: [],
        createdAt: '',
        updatedAt: '',
        isActive: true
      })
    }
  }, [templateId, getTemplate, navigate, toast])

  // Render PDF on canvas
  const renderPDF = useCallback(async () => {
    if (!pdfBase64 || !canvasRef.current) return

    try {
      // Dynamic import of PDF.js to avoid SSR issues
      const pdfjsLib = await import('pdfjs-dist')
      
      // Set worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      if (!context) return

      // Convert base64 to Uint8Array
      const binaryString = atob(pdfBase64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise
      const page = await pdf.getPage(1)
      
      const viewport = page.getViewport({ scale: 1.5 })
      canvas.width = viewport.width
      canvas.height = viewport.height

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }

      await page.render(renderContext).promise
    } catch (error) {
      console.error('Error rendering PDF:', error)
      toast({
        title: 'PDF Rendering Error',
        description: 'Failed to render the PDF. Please try uploading a different file.',
        variant: 'destructive'
      })
    }
  }, [pdfBase64, toast])

  // Render PDF when base64 changes
  useEffect(() => {
    if (pdfBase64) {
      renderPDF()
    }
  }, [pdfBase64, renderPDF])

  // Handle PDF file upload
  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a PDF file.',
        variant: 'destructive'
      })
      return
    }

    setPdfFile(file)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      const base64 = result.split(',')[1] // Remove data:application/pdf;base64, prefix
      setPdfBase64(base64)
    }
    reader.readAsDataURL(file)
  }

  // Add field to canvas
  const addField = (fieldType: FieldType, x: number, y: number) => {
    if (!template) return

    const config = FIELD_CONFIGS.find(c => c.type === fieldType)
    if (!config) return

    const newField: TemplateField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: fieldType,
      label: `${config.label} ${template.fields.length + 1}`,
      x,
      y,
      width: config.defaultSize.width,
      height: config.defaultSize.height,
      required: false,
      ...(fieldType === FieldType.TEXT && { defaultValue: '', placeholder: 'Enter text' }),
      ...(fieldType === FieldType.DATE && { format: 'MM/dd/yyyy' }),
      ...(fieldType === FieldType.CHECKBOX && { defaultChecked: false, checkboxLabel: 'Check this box' })
    } as TemplateField

    const updatedTemplate = {
      ...template,
      fields: [...template.fields, newField]
    }
    setTemplate(updatedTemplate)
    setSelectedField(newField)
  }

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check if clicking on an existing field
    const clickedField = template?.fields.find(field => 
      x >= field.x && x <= field.x + field.width &&
      y >= field.y && y <= field.y + field.height
    )

    if (clickedField) {
      setSelectedField(clickedField)
    } else {
      setSelectedField(null)
    }
  }

  // Handle field drag start
  const handleFieldMouseDown = (event: React.MouseEvent, field: TemplateField) => {
    event.stopPropagation()
    setSelectedField(field)
    setIsDragging(true)
    
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: event.clientX - rect.left - field.x,
        y: event.clientY - rect.top - field.y
      })
    }
  }

  // Handle field drag
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !selectedField || !containerRef.current || !template) return

    const rect = containerRef.current.getBoundingClientRect()
    const newX = Math.max(0, event.clientX - rect.left - dragOffset.x)
    const newY = Math.max(0, event.clientY - rect.top - dragOffset.y)

    const updatedFields = template.fields.map(field =>
      field.id === selectedField.id ? { ...field, x: newX, y: newY } : field
    )

    setTemplate({ ...template, fields: updatedFields })
    setSelectedField({ ...selectedField, x: newX, y: newY })
  }, [isDragging, selectedField, dragOffset, template])

  // Handle drag end
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Update field properties
  const updateFieldProperty = (fieldId: string, property: string, value: any) => {
    if (!template) return

    const updatedFields = template.fields.map(field =>
      field.id === fieldId ? { ...field, [property]: value } : field
    )

    const updatedTemplate = { ...template, fields: updatedFields }
    setTemplate(updatedTemplate)

    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, [property]: value })
    }
  }

  // Delete field
  const deleteField = (fieldId: string) => {
    if (!template) return

    const updatedFields = template.fields.filter(field => field.id !== fieldId)
    setTemplate({ ...template, fields: updatedFields })
    
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
  }

  // Save template
  const handleSave = async () => {
    if (!template || !templateName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a template name.',
        variant: 'destructive'
      })
      return
    }

    if (!pdfBase64) {
      toast({
        title: 'Validation Error',
        description: 'Please upload a PDF file.',
        variant: 'destructive'
      })
      return
    }

    setSaving(true)
    try {
      const templateData = {
        name: templateName,
        description: templateDescription,
        pdfBase64,
        fields: template.fields,
        isActive: true
      }

      if (templateId) {
        updateTemplate(templateId, templateData)
        toast({
          title: 'Template Updated',
          description: 'Template has been saved successfully.',
        })
      } else {
        addTemplate(templateData)
        toast({
          title: 'Template Created',
          description: 'Template has been created successfully.',
        })
      }

      navigate('/agreements/templates')
    } catch (error) {
      toast({
        title: 'Save Error',
        description: 'Failed to save template. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="ri-page-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/agreements/templates')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Templates
              </Button>
              <div>
                <h1 className="ri-page-title">
                  {templateId ? 'Edit Template' : 'Create Template'}
                </h1>
                <p className="ri-page-description">
                  Design your agreement template with interactive fields
                </p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Template Info & Toolbox */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Information */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Template Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="templateName">Template Name *</Label>
                  <Input
                    id="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                    className="shadow-sm"
                  />
                </div>
                
                <div>
                  <Label htmlFor="templateDescription">Description</Label>
                  <Textarea
                    id="templateDescription"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Enter template description"
                    className="shadow-sm"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>PDF Document</Label>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {pdfFile ? pdfFile.name : 'Upload PDF'}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Field Toolbox */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Field Toolbox</CardTitle>
                <CardDescription>
                  Click on a field type, then click on the PDF to place it
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {FIELD_CONFIGS.map((config) => (
                  <Button
                    key={config.type}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      // For demo, place field at center of canvas
                      const centerX = canvasRef.current ? canvasRef.current.width / 2 - config.defaultSize.width / 2 : 100
                      const centerY = canvasRef.current ? canvasRef.current.height / 2 - config.defaultSize.height / 2 : 100
                      addField(config.type, centerX, centerY)
                    }}
                  >
                    <FieldIcon type={config.type} className="h-4 w-4 mr-2" />
                    {config.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Field List */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Fields ({template.fields.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {template.fields.length > 0 ? (
                  <div className="space-y-2">
                    {template.fields.map((field) => (
                      <div
                        key={field.id}
                        className={`flex items-center justify-between p-2 rounded-md border cursor-pointer transition-colors ${
                          selectedField?.id === field.id ? 'bg-primary/10 border-primary' : 'hover:bg-accent'
                        }`}
                        onClick={() => setSelectedField(field)}
                      >
                        <div className="flex items-center space-x-2">
                          <FieldIcon type={field.type} className="h-3 w-3" />
                          <span className="text-sm font-medium">{field.label}</span>
                          {field.required && (
                            <Badge variant="secondary" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteField(field.id)
                          }}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No fields added yet. Use the toolbox to add fields.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Center - PDF Canvas */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Template Preview</CardTitle>
                <CardDescription>
                  Click to select fields, drag to move them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  ref={containerRef}
                  className="relative border rounded-lg overflow-auto bg-gray-50"
                  style={{ minHeight: '600px' }}
                  onClick={handleCanvasClick}
                >
                  {pdfBase64 ? (
                    <>
                      <canvas
                        ref={canvasRef}
                        className="block mx-auto"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                      
                      {/* Render fields as overlays */}
                      {template.fields.map((field) => (
                        <div
                          key={field.id}
                          className={`absolute border-2 cursor-move flex items-center justify-center text-xs font-medium bg-white/80 ${
                            selectedField?.id === field.id 
                              ? 'border-primary bg-primary/10' 
                              : 'border-gray-400 hover:border-gray-600'
                          }`}
                          style={{
                            left: field.x,
                            top: field.y,
                            width: field.width,
                            height: field.height,
                          }}
                          onMouseDown={(e) => handleFieldMouseDown(e, field)}
                        >
                          <FieldIcon type={field.type} className="h-3 w-3 mr-1" />
                          {field.label}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-96 text-muted-foreground">
                      <div className="text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4" />
                        <p>Upload a PDF to start designing your template</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Field Properties */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  <Settings className="h-4 w-4 mr-2 inline" />
                  Field Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedField ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fieldLabel">Field Label</Label>
                      <Input
                        id="fieldLabel"
                        value={selectedField.label}
                        onChange={(e) => updateFieldProperty(selectedField.id, 'label', e.target.value)}
                        className="shadow-sm"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fieldRequired"
                        checked={selectedField.required}
                        onCheckedChange={(checked) => updateFieldProperty(selectedField.id, 'required', checked)}
                      />
                      <Label htmlFor="fieldRequired">Required field</Label>
                    </div>

                    {selectedField.type === FieldType.TEXT && (
                      <>
                        <div>
                          <Label htmlFor="fieldDefaultValue">Default Value</Label>
                          <Input
                            id="fieldDefaultValue"
                            value={(selectedField as any).defaultValue || ''}
                            onChange={(e) => updateFieldProperty(selectedField.id, 'defaultValue', e.target.value)}
                            className="shadow-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="fieldPlaceholder">Placeholder</Label>
                          <Input
                            id="fieldPlaceholder"
                            value={(selectedField as any).placeholder || ''}
                            onChange={(e) => updateFieldProperty(selectedField.id, 'placeholder', e.target.value)}
                            className="shadow-sm"
                          />
                        </div>
                      </>
                    )}

                    {selectedField.type === FieldType.DATE && (
                      <div>
                        <Label htmlFor="fieldFormat">Date Format</Label>
                        <Input
                          id="fieldFormat"
                          value={(selectedField as any).format || 'MM/dd/yyyy'}
                          onChange={(e) => updateFieldProperty(selectedField.id, 'format', e.target.value)}
                          className="shadow-sm"
                        />
                      </div>
                    )}

                    {selectedField.type === FieldType.CHECKBOX && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="fieldDefaultChecked"
                            checked={(selectedField as any).defaultChecked || false}
                            onCheckedChange={(checked) => updateFieldProperty(selectedField.id, 'defaultChecked', checked)}
                          />
                          <Label htmlFor="fieldDefaultChecked">Default checked</Label>
                        </div>
                        <div>
                          <Label htmlFor="fieldCheckboxLabel">Checkbox Label</Label>
                          <Input
                            id="fieldCheckboxLabel"
                            value={(selectedField as any).checkboxLabel || ''}
                            onChange={(e) => updateFieldProperty(selectedField.id, 'checkboxLabel', e.target.value)}
                            className="shadow-sm"
                          />
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="fieldWidth">Width</Label>
                        <Input
                          id="fieldWidth"
                          type="number"
                          value={selectedField.width}
                          onChange={(e) => updateFieldProperty(selectedField.id, 'width', parseInt(e.target.value))}
                          className="shadow-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fieldHeight">Height</Label>
                        <Input
                          id="fieldHeight"
                          type="number"
                          value={selectedField.height}
                          onChange={(e) => updateFieldProperty(selectedField.id, 'height', parseInt(e.target.value))}
                          className="shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="fieldX">X Position</Label>
                        <Input
                          id="fieldX"
                          type="number"
                          value={selectedField.x}
                          onChange={(e) => updateFieldProperty(selectedField.id, 'x', parseInt(e.target.value))}
                          className="shadow-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fieldY">Y Position</Label>
                        <Input
                          id="fieldY"
                          type="number"
                          value={selectedField.y}
                          onChange={(e) => updateFieldProperty(selectedField.id, 'y', parseInt(e.target.value))}
                          className="shadow-sm"
                        />
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteField(selectedField.id)}
                      className="w-full"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete Field
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Select a field to edit its properties
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}