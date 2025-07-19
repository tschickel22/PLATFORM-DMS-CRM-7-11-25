import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Save, 
  Upload, 
  ArrowLeft, 
  Type, 
  Calendar, 
  PenTool, 
  CheckSquare, 
  Hash, 
  Mail,
  Trash2,
  Move,
  Settings,
  FileText
} from 'lucide-react'
import { useTemplates } from './useTemplates'
import { AgreementTemplate, TemplateField, FIELD_TYPES, DEFAULT_MERGE_FIELDS } from './templateTypes'
import { useToast } from '@/hooks/use-toast'

interface FieldToolboxProps {
  onAddField: (type: TemplateField['type']) => void
}

function FieldToolbox({ onAddField }: FieldToolboxProps) {
  return (
    <Card className="w-64 h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Field Toolbox</CardTitle>
        <CardDescription>
          Drag fields to add them to your template
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {FIELD_TYPES.map((fieldType) => {
          const IconComponent = {
            Type,
            Calendar,
            PenTool,
            CheckSquare,
            Hash,
            Mail
          }[fieldType.icon] || Type

          return (
            <Button
              key={fieldType.value}
              variant="outline"
              className="w-full justify-start"
              onClick={() => onAddField(fieldType.value)}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {fieldType.label}
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}

interface FieldPropertiesProps {
  field: TemplateField | null
  onUpdateField: (field: TemplateField) => void
  onDeleteField: () => void
}

function FieldProperties({ field, onUpdateField, onDeleteField }: FieldPropertiesProps) {
  if (!field) {
    return (
      <Card className="w-64 h-fit">
        <CardHeader>
          <CardTitle className="text-lg">Field Properties</CardTitle>
          <CardDescription>
            Select a field to edit its properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No field selected
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-64 h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Field Properties</CardTitle>
        <CardDescription>
          Configure the selected field
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="fieldLabel">Label</Label>
          <Input
            id="fieldLabel"
            value={field.label}
            onChange={(e) => onUpdateField({ ...field, label: e.target.value })}
            placeholder="Field label"
          />
        </div>

        <div>
          <Label htmlFor="fieldType">Type</Label>
          <Select
            value={field.type}
            onValueChange={(value: TemplateField['type']) => 
              onUpdateField({ ...field, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FIELD_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(field.type === 'text' || field.type === 'email') && (
          <div>
            <Label htmlFor="fieldPlaceholder">Placeholder</Label>
            <Input
              id="fieldPlaceholder"
              value={field.placeholder || ''}
              onChange={(e) => onUpdateField({ ...field, placeholder: e.target.value })}
              placeholder="Placeholder text"
            />
          </div>
        )}

        <div>
          <Label htmlFor="fieldDefault">Default Value</Label>
          <Input
            id="fieldDefault"
            value={field.defaultValue || ''}
            onChange={(e) => onUpdateField({ ...field, defaultValue: e.target.value })}
            placeholder="Default value"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fieldRequired"
            checked={field.required}
            onCheckedChange={(checked) => 
              onUpdateField({ ...field, required: !!checked })
            }
          />
          <Label htmlFor="fieldRequired">Required field</Label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="fieldWidth">Width</Label>
            <Input
              id="fieldWidth"
              type="number"
              value={field.width}
              onChange={(e) => onUpdateField({ ...field, width: parseInt(e.target.value) || 100 })}
              min="50"
              max="500"
            />
          </div>
          <div>
            <Label htmlFor="fieldHeight">Height</Label>
            <Input
              id="fieldHeight"
              type="number"
              value={field.height}
              onChange={(e) => onUpdateField({ ...field, height: parseInt(e.target.value) || 30 })}
              min="20"
              max="200"
            />
          </div>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteField}
          className="w-full"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Field
        </Button>
      </CardContent>
    </Card>
  )
}

interface PDFViewerProps {
  pdfFile: File | null
  pdfDataUrl: string | null
  pdfError: string | null
  fields: TemplateField[]
  selectedField: TemplateField | null
  onFieldSelect: (field: TemplateField) => void
  onFieldMove: (fieldId: string, x: number, y: number) => void
  onAddField: (type: TemplateField['type'], x: number, y: number) => void
  onPdfUpload: () => void
}

function PDFViewer({ 
  pdfFile, 
  pdfDataUrl,
  pdfError,
  fields, 
  selectedField, 
  onFieldSelect, 
  onFieldMove, 
  onAddField,
  onPdfUpload
}: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        // Check if clicking on an existing field
        const clickedField = fields.find(field => 
          x >= field.x && x <= field.x + field.width &&
          y >= field.y && y <= field.y + field.height
        )
        
        if (clickedField) {
          onFieldSelect(clickedField)
        }
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>, field: TemplateField) => {
    e.preventDefault()
    setIsDragging(true)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - field.x,
        y: e.clientY - rect.top - field.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && selectedField) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const newX = e.clientX - rect.left - dragOffset.x
        const newY = e.clientY - rect.top - dragOffset.y
        onFieldMove(selectedField.id, Math.max(0, newX), Math.max(0, newY))
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="flex-1 relative">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Template Preview</CardTitle>
          <CardDescription>
            {pdfFile ? `Editing: ${pdfFile.name}` : 'Upload a PDF to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative bg-gray-50 min-h-[600px] flex items-center justify-center">
            {pdfDataUrl ? (
              <div className="relative w-full h-full">
                {/* PDF Preview using iframe */}
                <iframe
                  src={pdfDataUrl}
                  className="w-full h-[600px] border border-gray-200 bg-white shadow-sm"
                  title="PDF Preview"
                  onError={() => {}}
                />
                
                {/* Canvas overlay for field positioning */}
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-auto"
                  onClick={handleCanvasClick}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ 
                    cursor: isDragging ? 'crosshair' : 'default',
                    background: 'transparent'
                  }}
                  width={800}
                  height={600}
                />
                
                {/* Render fields on top of PDF */}
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className={`absolute border-2 bg-blue-100/50 cursor-move ${
                      selectedField?.id === field.id ? 'border-blue-500' : 'border-blue-300'
                    }`}
                    style={{
                      left: `${field.x}px`,
                      top: `${field.y}px`,
                      width: `${field.width}px`,
                      height: `${field.height}px`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onFieldSelect(field)
                    }}
                    onMouseDown={(e) => handleMouseDown(e, field)}
                  >
                    <div className="text-xs text-blue-700 p-1 truncate">
                      {field.label || field.type}
                      {field.required && '*'}
                    </div>
                  </div>
                ))}
              </div>
            ) : pdfError ? (
              <div className="flex flex-col items-center justify-center text-red-600">
                <FileText className="h-16 w-16 mb-4 text-red-300" />
                <p className="text-lg font-medium">PDF Error</p>
                <p className="text-sm text-red-500">{pdfError}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={onPdfUpload}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <FileText className="h-16 w-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">PDF Preview</p>
                <p className="text-sm text-gray-400">(Upload a PDF to see preview)</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TemplateBuilder() {
  const { templateId } = useParams<{ templateId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getTemplateById, saveTemplate } = useTemplates()
  
  const [template, setTemplate] = useState<AgreementTemplate | null>(null)
  const [selectedField, setSelectedField] = useState<TemplateField | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (templateId) {
      const loadedTemplate = getTemplateById(templateId)
      if (loadedTemplate) {
        setTemplate(loadedTemplate)
        if (loadedTemplate.pdfFile) {
          // If template has a PDF file stored as base64, convert it back
          if (typeof loadedTemplate.pdfFile === 'string') {
            setPdfDataUrl(loadedTemplate.pdfFile)
          }
        }
      } else {
        toast({
          title: 'Template Not Found',
          description: 'The requested template could not be found.',
          variant: 'destructive'
        })
        navigate('/agreements/templates')
      }
    }
  }, [templateId, getTemplateById, navigate, toast])

  // Handle PDF file upload
  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
      setPdfError(null)
      
      // Convert to data URL for preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPdfDataUrl(result)
        setTemplate(prev => ({
          ...prev!,
          pdfFile: result,
          fileName: file.name
        }))
      }
      reader.onerror = () => {
        setPdfError('Failed to read PDF file')
      }
      reader.readAsDataURL(file)
    } else {
      setPdfError('Please select a valid PDF file')
    }
  }

  const handleSaveTemplate = async () => {
    if (!template) return

    setLoading(true)
    try {
      const updatedTemplate = {
        ...template,
        metadata: {
          ...template.metadata,
          updatedAt: new Date()
        },
        pdfFile: pdfDataUrl || undefined
      }

      const success = await saveTemplate(updatedTemplate)
      if (success) {
        toast({
          title: 'Template Saved',
          description: 'Your template has been saved successfully.',
        })
      } else {
        toast({
          title: 'Save Failed',
          description: 'Failed to save template. Please try again.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while saving the template.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddField = (type: TemplateField['type'], x = 100, y = 100) => {
    if (!template) return

    const newField: TemplateField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      x,
      y,
      width: type === 'signature' ? 200 : 150,
      height: type === 'signature' ? 60 : 30,
      page: 1
    }

    setTemplate({
      ...template,
      fields: [...template.fields, newField]
    })
    setSelectedField(newField)
  }

  const handleUpdateField = (updatedField: TemplateField) => {
    if (!template) return

    setTemplate({
      ...template,
      fields: template.fields.map(field => 
        field.id === updatedField.id ? updatedField : field
      )
    })
    setSelectedField(updatedField)
  }

  const handleDeleteField = () => {
    if (!template || !selectedField) return

    setTemplate({
      ...template,
      fields: template.fields.filter(field => field.id !== selectedField.id)
    })
    setSelectedField(null)
  }

  const handleFieldMove = (fieldId: string, x: number, y: number) => {
    if (!template) return

    setTemplate({
      ...template,
      fields: template.fields.map(field => 
        field.id === fieldId ? { ...field, x, y } : field
      )
    })

    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, x, y })
    }
  }

  const handlePDFUploadClick = () => {
    setPdfError(null)
    fileInputRef.current?.click()
  }

  if (!template) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Template Builder</h1>
          <p className="ri-page-description">Loading template...</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading template...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/agreements/templates')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <div>
              <h1 className="ri-page-title">{template.metadata.name}</h1>
              <p className="ri-page-description">
                Template Builder • {template.fields.length} fields
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handlePDFUploadClick}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload PDF
            </Button>
            <Button onClick={handleSaveTemplate} disabled={loading}>
              {loading ? (
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
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handlePdfUpload}
        className="hidden"
      />

      {/* Template Builder Layout */}
      <div className="flex gap-6">
        {/* Left Sidebar - Field Toolbox */}
        <FieldToolbox onAddField={handleAddField} />

        {/* Center - PDF Viewer */}
        <PDFViewer
          pdfFile={pdfFile}
          pdfDataUrl={pdfDataUrl}
          pdfError={pdfError}
          fields={template.fields}
          selectedField={selectedField}
          onFieldSelect={setSelectedField}
          onFieldMove={handleFieldMove}
          onAddField={handleAddField}
          onPdfUpload={handlePDFUploadClick}
        />

        {/* Right Sidebar - Field Properties */}
        <FieldProperties
          field={selectedField}
          onUpdateField={handleUpdateField}
          onDeleteField={handleDeleteField}
        />
      </div>
    </div>
  )
}