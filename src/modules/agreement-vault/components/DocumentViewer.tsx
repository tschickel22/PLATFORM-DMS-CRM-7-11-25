import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  ZoomIn, 
  ZoomOut, 
  Type, 
  PenTool, 
  Calendar, 
  CheckSquare, 
  ChevronDown, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  FileText, 
  File,
  Eye,
  Brain,
  Play,
  Edit
} from 'lucide-react'
import { PDFBuilder, Field } from '@/components/pdf/PDFBuilder'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

// Type alias for compatibility
type DocumentField = Field

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
}

/*
 * BACKEND DEVELOPER NOTE: Document Merging for Signing
 * 
 * When multiple documents are uploaded to a template, they should be merged into a single PDF
 * for the signing process. This ensures:
 * 
 * 1. Consistent field positioning across all documents
 * 2. Single signature session for all documents
 * 3. Proper field mapping and validation
 * 
 * Implementation suggestions:
 * - Use a PDF library like PDFtk, PyPDF2, or similar to merge documents
 * - Maintain field coordinates relative to their original document pages
 * - Adjust field page numbers after merging (e.g., if doc1 has 2 pages and doc2 starts on page 3)
 * - Store original document boundaries for field validation
 * 
 * Example merge process:
 * 1. Convert all uploaded documents to PDF if needed
 * 2. Merge PDFs in upload order
 * 3. Update field page numbers: field.page += previousDocumentPageCount
 * 4. Store merged PDF for signing session
 * 5. Map completed fields back to original documents if needed
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
}: DocumentViewerProps) {
  const { toast } = useToast()
  const [selectedField, setSelectedField] = useState<DocumentField | null>(null)
  const [documents, setDocuments] = useState<UploadedDocument[]>(initialDocuments)
  const [showFieldProperties, setShowFieldProperties] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  
  // Document management state
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

  const handleFieldClick = (field: DocumentField) => {
    setSelectedField(field)
    setShowFieldProperties(true)
  }

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
    <div className="fixed inset-0 bg-black/50 flex z-50 p-4">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">Document Viewer</CardTitle>
            <p className="text-sm text-muted-foreground">Upload documents and add fields for mapping</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex overflow-hidden p-0">
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
                </div>
                {currentViewingDocument && (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={previewMode ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      {previewMode ? (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Mode
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Preview Mode
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Document Viewer */}
            <div className="flex-1 overflow-auto bg-gray-100 p-8">
              {currentViewingDocument && currentViewingDocument.type === 'application/pdf' ? (
                <PDFBuilder
                  url={currentViewingDocument.url}
                  fields={currentDocumentFields}
                  mergeFields={mergeFields}
                  onFieldsChange={onFieldsChange}
                  currentDocumentId={currentViewingDocumentId || ''}
                  previewMode={previewMode}
                  onFieldClick={handleFieldClick}
                  selectedField={selectedField}
                />
              ) : currentViewingDocument ? (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Required</h3>
                    <p className="text-gray-500 mb-6">
                      The PDF Builder only supports PDF files. Please upload a PDF document to use the field placement features.
                    </p>
                    <p className="text-sm text-gray-400">
                      Current file: {currentViewingDocument.name} ({currentViewingDocument.type})
                    </p>
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white shadow-lg rounded-lg p-12 text-center">
                    <Upload className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Selected</h3>
                    <p className="text-gray-500 mb-6">
                      Upload PDF documents to start creating your template. You can upload multiple files 
                      and they will be merged into a single document for signing.
                    </p>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
                    <div className="mt-4 text-xs text-gray-400">
                      Supported formats: PDF files only
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Field Properties */}
          {showFieldProperties && selectedField && !previewMode && (
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
                      <SelectItem value="text">Text Field</SelectItem>
                      <SelectItem value="signature">Signature</SelectItem>
                      <SelectItem value="date">Date Field</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
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

                <div className="border-t my-4" />

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
        </CardContent>
      </Card>
    </div>
  )
}