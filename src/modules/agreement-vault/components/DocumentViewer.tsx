import React, { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ZoomIn, ZoomOut, MousePointer, Type, PenTool, Calendar, CheckSquare, ChevronDown, Trash2, Save, X, Brain, Link2 } from 'lucide-react'
import { DocumentField } from '../types'
import { AIFieldDetection } from './AIFieldDetection'
import { MergeFieldMapper } from './MergeFieldMapper'
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Type, 
  PenTool, 
  Calendar, 
  CheckSquare, 
  ChevronDown,
  Trash2,
  Settings,
  Eye,
  Save,
  Wand2
} from 'lucide-react'
import { cn } from '@/lib/utils'

  documentUrl: string
  documentName: string
  fields: DocumentField[]
  onFieldsChange: (fields: DocumentField[]) => void
  templateType: string
  onSave: () => void
  mergeFields: string[]
}

export function DocumentViewer({ documentUrl, onSave, onCancel, templateType, initialFields = [] }: DocumentViewerProps) {
  { type: 'text', label: 'Text Field', icon: Type, color: 'bg-blue-100 border-blue-300 text-blue-800' },
  { type: 'signature', label: 'Signature', icon: PenTool, color: 'bg-purple-100 border-purple-300 text-purple-800' },
  { type: 'date', label: 'Date Field', icon: Calendar, color: 'bg-green-100 border-green-300 text-green-800' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { type: 'dropdown', label: 'Dropdown', icon: ChevronDown, color: 'bg-pink-100 border-pink-300 text-pink-800' }
]

export function DocumentViewer({ 
  documentUrl, 
  documentName, 
  fields, 
  onFieldsChange, 
  onSave,
  mergeFields 
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [selectedField, setSelectedField] = useState<DocumentField | null>(null)
  const [isPlacingField, setIsPlacingField] = useState(false)
  const [showFieldProperties, setShowFieldProperties] = useState(false)
  const [showAIDetection, setShowAIDetection] = useState(false)
  const [showMergeMapper, setShowMergeMapper] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(1) // Will be dynamic when PDF parsing is implemented
  
  const documentRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50))

  const handleDocumentClick = useCallback((e: React.MouseEvent) => {
    if (!selectedTool || !isPlacingField) return

    const rect = documentRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const newField: DocumentField = {
      id: `field-${Date.now()}`,
      type: selectedTool as DocumentField['type'],
      x,
      y,
      width: selectedTool === 'checkbox' ? 3 : 15,
      height: selectedTool === 'checkbox' ? 3 : 4,
      page: currentPage,
      label: `${selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)} Field`,
      required: false
    }

    onFieldsChange([...fields, newField])
    setIsPlacingField(false)
    setSelectedField(newField)
    setShowFieldProperties(true)
  }, [selectedTool, isPlacingField, fields, onFieldsChange, currentPage])

  const handleFieldClick = (field: DocumentField, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedField(field)
    setShowFieldProperties(true)
  }

  const handleFieldUpdate = (updatedField: DocumentField) => {
    const updatedFields = fields.map(f => f.id === updatedField.id ? updatedField : f)
    onFieldsChange(updatedFields)
    setSelectedField(updatedField)
  }

  const handleFieldDelete = (fieldId: string) => {
    const updatedFields = fields.filter(f => f.id !== fieldId)
    onFieldsChange(updatedFields)
    setSelectedField(null)
    setShowFieldProperties(false)
  }

  const handleToolSelect = (toolType: string) => {
    setSelectedTool(toolType)
    setIsPlacingField(true)
    setShowFieldProperties(false)
  }

  const getFieldTypeConfig = (type: string) => {
    return FIELD_TYPES.find(ft => ft.type === type) || FIELD_TYPES[0]
  }

  const handleAIDetection = () => {
    // Placeholder for AI field detection
    console.log('AI field detection triggered')
    // This will integrate with OpenAI in the next phase
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Tools */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Document Fields</h3>
          <p className="text-sm text-muted-foreground">Add fields to your template</p>
        </div>

        {/* AI Detection */}
        <div className="p-4 border-b">
          <Button 
            onClick={handleAIDetection}
            className="w-full"
            variant="outline"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            AI Detect Fields
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Automatically detect form fields using AI
          </p>
        </div>

        {/* Field Tools */}
        <div className="p-4 border-b">
          <h4 className="font-medium mb-3">Field Types</h4>
          <div className="space-y-2">
            {FIELD_TYPES.map((fieldType) => (
              <Button
                key={fieldType.type}
                variant={selectedTool === fieldType.type ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleToolSelect(fieldType.type)}
              >
                <fieldType.icon className="h-4 w-4 mr-2" />
                {fieldType.label}
              </Button>
            ))}
          </div>
          {isPlacingField && (
            <div className="mt-3 p-2 bg-blue-50 rounded-md">
              <p className="text-xs text-blue-700">
                Click on the document to place the {selectedTool} field
              </p>
            </div>
          )}
        </div>

        {/* Field List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h4 className="font-medium mb-3">Placed Fields ({fields.length})</h4>
          <div className="space-y-2">
            {fields.map((field) => {
              const config = getFieldTypeConfig(field.type)
              return (
                <div
                  key={field.id}
                  className={cn(
                    "p-2 rounded-md border cursor-pointer transition-colors",
                    selectedField?.id === field.id 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => {
                    setSelectedField(field)
                    setShowFieldProperties(true)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <config.icon className="h-3 w-3" />
                      <span className="text-sm font-medium">{field.label}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Page {field.page}
                    </Badge>
                  </div>
                  {field.required && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      Required
                    </Badge>
                  )}
                </div>
              )
            })}
            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No fields added yet</p>
                <p className="text-xs">Select a field type and click on the document</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t space-y-2">
          <Button onClick={onSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
          <Button variant="outline" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            Preview Template
          </Button>
        </div>
      </div>

      {/* Main Document Area */}
      <div className="flex-1 flex flex-col">
        {/* Document Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="font-semibold">{documentName}</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[60px] text-center">
                  {zoom}%
                </span>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto">
            <div
              ref={documentRef}
              className="relative bg-white shadow-lg cursor-crosshair"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                minHeight: '800px',
                aspectRatio: '8.5 / 11' // Standard letter size
              }}
              onClick={handleDocumentClick}
            >
              {/* Document Content Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-lg font-medium text-gray-600">Document Preview</p>
                  <p className="text-sm text-gray-500">
                    PDF viewer will be implemented here
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Click to place fields when a tool is selected
                  </p>
                </div>
              </div>

              {/* Render Fields */}
              {fields.map((field) => {
                const config = getFieldTypeConfig(field.type)
                return (
                  <div
                    key={field.id}
                    className={cn(
                      "absolute border-2 border-dashed cursor-pointer transition-all",
                      config.color,
                      selectedField?.id === field.id 
                        ? "border-solid shadow-md" 
                        : "hover:border-solid"
                    )}
                    style={{
                      left: `${field.x}%`,
                      top: `${field.y}%`,
                      width: `${field.width}%`,
                      height: `${field.height}%`
                    }}
                    onClick={(e) => handleFieldClick(field, e)}
                  >
                    <div className="absolute -top-6 left-0 bg-white px-1 rounded text-xs font-medium border">
                      {field.label}
                    </div>
                    <div className="w-full h-full flex items-center justify-center">
                      <config.icon className="h-4 w-4 opacity-50" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Field Properties */}
      {showFieldProperties && selectedField && (
        <div className="w-80 bg-white border-l border-gray-200">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Field Properties</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFieldDelete(selectedField.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIDetection(true)}
              >
                <Brain className="h-4 w-4 mr-2" />
                AI Detect Fields
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMergeMapper(true)}
                disabled={fields.length === 0}
              >
                <Link2 className="h-4 w-4 mr-2" />
                Map Merge Fields
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <Label htmlFor="fieldLabel">Field Label</Label>
              <Input
                id="fieldLabel"
                value={selectedField.label}
                onChange={(e) => handleFieldUpdate({
                  ...selectedField,
                  label: e.target.value
                })}
              />
            </div>

            <div>
              <Label htmlFor="fieldType">Field Type</Label>
              <Select
                value={selectedField.type}
                onValueChange={(value) => handleFieldUpdate({
                  ...selectedField,
                  type: value as DocumentField['type']
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.type} value={type.type}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={selectedField.required}
                onCheckedChange={(checked) => handleFieldUpdate({
                  ...selectedField,
                  required: !!checked
                })}
              />
              <Label htmlFor="required">Required field</Label>
            </div>

            {selectedField.type === 'text' && (
              <div>
                <Label htmlFor="defaultValue">Default Value</Label>
                <Input
                  id="defaultValue"
                  value={selectedField.defaultValue || ''}
                  onChange={(e) => handleFieldUpdate({
                    ...selectedField,
                    defaultValue: e.target.value
                  })}
                />
              </div>
            )}

            {selectedField.type === 'dropdown' && (
              <div>
                <Label>Dropdown Options</Label>
                <div className="space-y-2">
                  {(selectedField.options || []).map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(selectedField.options || [])]
                          newOptions[index] = e.target.value
                          handleFieldUpdate({
                            ...selectedField,
                            options: newOptions
                          })
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOptions = (selectedField.options || []).filter((_, i) => i !== index)
                          handleFieldUpdate({
                            ...selectedField,
                            options: newOptions
                          })
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOptions = [...(selectedField.options || []), 'New Option']
                      handleFieldUpdate({
                        ...selectedField,
                        options: newOptions
                      })
                    }}
                  >
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            <Separator />

            <div>
              <Label htmlFor="mergeField">Link to Merge Field</Label>
              <Select
                value={selectedField.mergeField || ''}
                onValueChange={(value) => handleFieldUpdate({
                  ...selectedField,
                  mergeField: value || undefined
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select merge field..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {mergeFields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Width (%)</Label>
                <Input
                  type="number"
                  value={Math.round(selectedField.width)}
                  onChange={(e) => handleFieldUpdate({
                    ...selectedField,
                    width: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              <div>
                <Label>Height (%)</Label>
                <Input
                  type="number"
                  value={Math.round(selectedField.height)}
                  onChange={(e) => handleFieldUpdate({
                    ...selectedField,
                    height: parseInt(e.target.value) || 0
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Field Detection Modal */}
      {showAIDetection && (
        <AIFieldDetection
          documentUrl={documentUrl}
          onFieldsDetected={setFields}
          onClose={() => setShowAIDetection(false)}
          existingFields={fields}
        />
      )}
      
      {/* Merge Field Mapper Modal */}
      {showMergeMapper && (
        <MergeFieldMapper
          fields={fields}
          onFieldsUpdate={setFields}
          onClose={() => setShowMergeMapper(false)}
          templateType={templateType}
        />
      )}
    </div>
  )
}