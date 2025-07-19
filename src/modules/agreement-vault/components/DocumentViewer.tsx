import React, { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ZoomIn, ZoomOut, MousePointer, Type, PenTool, Calendar, CheckSquare, ChevronDown, Trash2, Save, X, Brain, Link2, Settings, Eye, RotateCw, Download, Wand2, SeparatorVertical as Separator, Upload, FileText, File } from 'lucide-react'
import { DocumentField } from '../types'
import { AIFieldDetection } from './AIFieldDetection'
import { MergeFieldMapper } from './MergeFieldMapper'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface UploadedDocument {
  id: string
  name: string
  url: string
  type: string
  size: number
}

interface DocumentViewerProps {
  initialDocuments?: UploadedDocument[]
  fields: DocumentField[]
  onFieldsChange: (fields: DocumentField[]) => void
  templateType: string
  onSave: (documents: UploadedDocument[], fields: DocumentField[]) => void
  onCancel: () => void
  mergeFields: string[]
  initialFields?: DocumentField[]
  initialDocuments?: UploadedDocument[]
}
}

const FIELD_TYPES = [
  { type: 'text', label: 'Text Field', icon: Type, color: 'bg-blue-100 border-blue-300 text-blue-800' },
  { type: 'signature', label: 'Signature', icon: PenTool, color: 'bg-purple-100 border-purple-300 text-purple-800' },
  { type: 'date', label: 'Date Field', icon: Calendar, color: 'bg-green-100 border-green-300 text-green-800' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { type: 'dropdown', label: 'Dropdown', icon: ChevronDown, color: 'bg-pink-100 border-pink-300 text-pink-800' }
]

/*
 * BACKEND DEVELOPER NOTE: Document Merging for Signing
 * 
 * This component allows users to upload multiple documents and place fields on each.
 * When implementing the backend, you'll need to handle merging these documents into
 * a single, signable file. Here's what you'll need to do:
 * 
 * 1. DOCUMENT CONVERSION & MERGING:
 *    - Convert all uploaded documents (Word, images, etc.) to PDF format
 *    - Use libraries like:
 *      * Node.js: pdf-lib, puppeteer, or LibreOffice headless
 *      * Python: PyPDF2, reportlab, python-docx2pdf
 *      * Java: Apache PDFBox, iText
 *      * .NET: iTextSharp, Aspose
 * 
 * 2. FIELD POSITIONING:
 *    - Each DocumentField contains documentId, page, x, y coordinates (as percentages)
 *    - When merging documents, you'll need to:
 *      * Track the cumulative page count as you merge each document
 *      * Adjust field positions to account for the new page numbers in the merged PDF
 *      * Convert percentage-based coordinates to absolute positions based on page dimensions
 * 
 * 3. SIGNATURE FIELD MAPPING:
 *    - Map the placed fields to your e-signature provider's format (DocuSign, HelloSign, etc.)
 *    - Each field type maps to specific signature field types:
 *      * 'text' -> Text field
 *      * 'signature' -> Signature field
 *      * 'date' -> Date field
 *      * 'checkbox' -> Checkbox field
 *      * 'dropdown' -> List/Dropdown field
 * 
 * 4. EXAMPLE WORKFLOW:
 *    a) Receive documents array and fields array from frontend
 *    b) Convert each document to PDF and get page count
 *    c) Merge PDFs sequentially, tracking cumulative page numbers
 *    d) Adjust field page numbers: newPage = originalPage + cumulativePagesBefore
 *    e) Create signature envelope with merged PDF and adjusted field positions
 *    f) Send for signing via your e-signature provider
 * 
 * 5. STORAGE CONSIDERATIONS:
 *    - Store original documents separately for audit purposes
 *    - Cache converted PDFs to avoid re-processing
 *    - Store field configurations as JSON for template reuse
 */

export function DocumentViewer({ 
  fields, 
  onFieldsChange, 
  onSave,
  onCancel,
  mergeFields,
  templateType,
  initialFields = [],
  initialDocuments = []
export function DocumentViewer({ initialDocuments = [], onSave, onCancel }: DocumentViewerProps) {
  const { toast } = useToast()
  const [zoom, setZoom] = useState(100)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [selectedField, setSelectedField] = useState<DocumentField | null>(null)
  const [isPlacingField, setIsPlacingField] = useState(false)
  const [documents, setDocuments] = useState<UploadedDocument[]>(initialDocuments)
  const [showAIDetection, setShowAIDetection] = useState(false)
  const [showMergeMapper, setShowMergeMapper] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Document management state
  const [documents, setDocuments] = useState<UploadedDocument[]>(initialDocuments)
  const [currentViewingDocumentId, setCurrentViewingDocumentId] = useState<string | null>(
    initialDocuments.length > 0 ? initialDocuments[0].id : null
  )
  
  const documentRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Set initial viewing document when initialDocuments are provided
  useEffect(() => {
    if (initialDocuments.length > 0 && !currentViewingDocumentId) {
      setCurrentViewingDocumentId(initialDocuments[0].id)
    }
  }, [initialDocuments, currentViewingDocumentId])

  const currentViewingDocument = documents.find(doc => doc.id === currentViewingDocumentId)
  const currentDocumentFields = fields.filter(field => field.documentId === currentViewingDocumentId)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newDocuments: UploadedDocument[] = []
    
    Array.from(files).forEach(file => {
      // Check file size (limit to 10MB per file)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} is larger than 10MB and cannot be uploaded.`,
          variant: 'destructive'
        })
        return
      }

      const documentId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const documentUrl = URL.createObjectURL(file)
      
      const newDocument: UploadedDocument = {
        id: documentId,
        name: file.name,
        url: documentUrl,
        type: file.type,
        size: file.size
      }
      
      newDocuments.push(newDocument)

      // Show warning for non-PDF files
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Non-PDF Document',
          description: `${file.name} may have limited preview capabilities. PDF files provide the best experience.`,
          variant: 'default'
        })
      }
    })

    if (newDocuments.length > 0) {
      setDocuments(prev => [...prev, ...newDocuments])
      
      // If no document is currently being viewed, set the first new document as current
      if (!currentViewingDocumentId) {
        setCurrentViewingDocumentId(newDocuments[0].id)
      }

      toast({
        title: 'Documents Uploaded',
        description: `${newDocuments.length} document(s) uploaded successfully.`,
      })
    }

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveDocument = (documentId: string) => {
    // Remove the document
    setDocuments(prev => {
      const updated = prev.filter(doc => doc.id !== documentId)
      
      // Clean up the object URL to prevent memory leaks
      const docToRemove = prev.find(doc => doc.id === documentId)
      if (docToRemove) {
        URL.revokeObjectURL(docToRemove.url)
      }
      
      return updated
    })

    // Remove all fields associated with this document
    const updatedFields = fields.filter(field => field.documentId !== documentId)
    onFieldsChange(updatedFields)

    // If this was the currently viewed document, switch to another or clear
    if (currentViewingDocumentId === documentId) {
      const remainingDocs = documents.filter(doc => doc.id !== documentId)
      setCurrentViewingDocumentId(remainingDocs.length > 0 ? remainingDocs[0].id : null)
      setSelectedField(null)
      setShowFieldProperties(false)
    }

    toast({
      title: 'Document Removed',
      description: 'Document and associated fields have been removed.',
    })
  }

  const handleDocumentClick = useCallback((e: React.MouseEvent) => {
    if (!selectedTool || !isPlacingField || !currentViewingDocumentId) return

    const rect = documentRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const newField: DocumentField = {
      id: `field-${Date.now()}`,
      type: selectedTool as DocumentField['type'],
      documentId: currentViewingDocumentId,
      page: currentPage,
      x,
      y,
      width: selectedTool === 'checkbox' ? 3 : 15,
      height: selectedTool === 'checkbox' ? 3 : 4,
      label: `${selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)} Field`,
      required: false
    }

    onFieldsChange([...fields, newField])
    setIsPlacingField(false)
    setSelectedField(newField)
    setShowFieldProperties(true)
  }, [selectedTool, isPlacingField, fields, onFieldsChange, currentPage, currentViewingDocumentId])

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
    if (!currentViewingDocumentId) {
      toast({
        title: 'No Document Selected',
        description: 'Please upload and select a document before placing fields.',
        variant: 'destructive'
      })
      return
    }
    
    setSelectedTool(toolType)
    setIsPlacingField(true)
    setShowFieldProperties(false)
  }

  const getFieldTypeConfig = (type: string) => {
    return FIELD_TYPES.find(ft => ft.type === type) || FIELD_TYPES[0]
  }

  const handleAIDetection = () => {
    if (!currentViewingDocumentId) {
      toast({
        title: 'No Document Selected',
        description: 'Please select a document before using AI field detection.',
        variant: 'destructive'
      })
      return
    }
    setShowAIDetection(true)
  }

  const setFields = (newFields: DocumentField[]) => {
    onFieldsChange(newFields)
  }

  const handleSaveTemplate = () => {
    if (documents.length === 0) {
      toast({
        title: 'No Documents',
        description: 'Please upload at least one document before saving.',
        variant: 'destructive'
      })
      return
    }
    
    onSave(documents, fields)
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText
    if (type.includes('word') || type.includes('document')) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Tools */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Document Fields</h3>
          <p className="text-sm text-muted-foreground">Upload documents and add fields</p>
        </div>

        {/* Document Upload Section */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Documents ({documents.length})</h4>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.rtf,image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {documents.map((doc) => {
              const FileIcon = getFileIcon(doc.type)
              return (
                <div
                  key={doc.id}
                  className={cn(
                    "p-2 rounded-md border cursor-pointer transition-colors",
                    currentViewingDocumentId === doc.id 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => setCurrentViewingDocumentId(doc.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <FileIcon className="h-4 w-4 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveDocument(doc.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              )
            })}
            {documents.length === 0 && (
              <div className="text-center py-4 text-muted-foreground border-2 border-dashed rounded-lg">
                <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No documents uploaded</p>
                <p className="text-xs">Click Upload to add documents</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Detection */}
        <div className="p-4 border-b">
          <Button 
            onClick={handleAIDetection}
            className="w-full"
            variant="outline"
            disabled={!currentViewingDocumentId}
          >
            <Brain className="h-4 w-4 mr-2" />
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
                disabled={!currentViewingDocumentId}
              >
                <fieldType.icon className="h-4 w-4 mr-2" />
                {fieldType.label}
              </Button>
            ))}
          </div>
          {isPlacingField && currentViewingDocumentId && (
            <div className="mt-3 p-2 bg-blue-50 rounded-md">
              <p className="text-xs text-blue-700">
                Click on the document to place the {selectedTool} field
              </p>
            </div>
          )}
        </div>

        {/* Field List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h4 className="font-medium mb-3">
            Placed Fields ({currentDocumentFields.length})
            {currentViewingDocument && (
              <span className="text-xs text-muted-foreground ml-2">
                on {currentViewingDocument.name}
              </span>
            )}
          </h4>
          <div className="space-y-2">
            {currentDocumentFields.map((field) => {
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
            {currentDocumentFields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No fields added yet</p>
                {currentViewingDocument ? (
                  <p className="text-xs">Select a field type and click on the document</p>
                ) : (
                  <p className="text-xs">Upload and select a document first</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t space-y-2">
          <Button onClick={handleSaveTemplate} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
          <Button variant="outline" className="w-full" disabled={!currentViewingDocumentId}>
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
              <h2 className="font-semibold">
                {currentViewingDocument ? currentViewingDocument.name : 'No Document Selected'}
              </h2>
              {currentViewingDocument && (
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
              )}
            </div>
            {currentViewingDocument && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of 1
                </span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto">
            {currentViewingDocument ? (
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
                {/* Document Content */}
                <iframe
                  src={currentViewingDocument.url}
                  className="w-full h-full border-0"
                  title={currentViewingDocument.name}
                />

                {/* Warning for non-PDF files */}
                {!currentViewingDocument.type.includes('pdf') && (
                  <div className="absolute top-4 left-4 right-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Preview Limitation:</strong> This file type may not display perfectly. 
                      For best results, convert to PDF before uploading.
                    </p>
                  </div>
                )}

                {/* Render Fields */}
                {currentDocumentFields.map((field) => {
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
            ) : (
              <div className="bg-white shadow-lg rounded-lg p-12 text-center">
                <Upload className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Selected</h3>
                <p className="text-gray-500 mb-6">
                  Upload documents to start creating your template. You can upload multiple files 
                  and they will be merged into a single document for signing.
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
                <div className="mt-4 text-xs text-gray-400">
                  Supported formats: PDF, Word (.doc, .docx), Text (.txt, .rtf), Images
                </div>
              </div>
            )}
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
      {showAIDetection && currentViewingDocument && (
        <AIFieldDetection
          documentUrl={currentViewingDocument.url}
          onFieldsDetected={(detectedFields) => {
            // Add documentId to detected fields
            const fieldsWithDocId = detectedFields.map(field => ({
              ...field,
              documentId: currentViewingDocumentId!,
              page: 1
            }))
            setFields([...fields, ...fieldsWithDocId])
          }}
          onClose={() => setShowAIDetection(false)}
          existingFields={currentDocumentFields}
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