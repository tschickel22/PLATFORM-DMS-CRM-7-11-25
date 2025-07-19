import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Type,
  Mail,
  Phone,
  Calendar,
  Hash,
  PenTool,
  CheckSquare,
  ChevronDown,
  Trash2,
  Move,
  RotateCw
} from 'lucide-react'
import { TemplateField, TemplateFieldType, FieldPosition, FieldSize } from '../types/template'
import * as pdfjsLib from 'pdfjs-dist'

// Set up PDF.js worker from local file to avoid CORS issues
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

interface PDFBuilderLiteProps {
  pdfUrl: string
  fields: TemplateField[]
  onFieldsChange: (fields: TemplateField[]) => void
  readonly?: boolean
}

interface DragState {
  isDragging: boolean
  dragType: 'move' | 'resize'
  fieldId: string | null
  startPos: { x: number; y: number }
  startFieldPos: FieldPosition
  startFieldSize: FieldSize
}

export function PDFBuilderLite({ pdfUrl, fields, onFieldsChange, readonly = false }: PDFBuilderLiteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [pdf, setPdf] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [loading, setLoading] = useState(true)
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: 'move',
    fieldId: null,
    startPos: { x: 0, y: 0 },
    startFieldPos: { x: 0, y: 0 },
    startFieldSize: { width: 0, height: 0 }
  })

  // Field types with icons
  const fieldTypes = [
    { type: TemplateFieldType.TEXT, label: 'Text', icon: Type },
    { type: TemplateFieldType.EMAIL, label: 'Email', icon: Mail },
    { type: TemplateFieldType.PHONE, label: 'Phone', icon: Phone },
    { type: TemplateFieldType.DATE, label: 'Date', icon: Calendar },
    { type: TemplateFieldType.NUMBER, label: 'Number', icon: Hash },
    { type: TemplateFieldType.SIGNATURE, label: 'Signature', icon: PenTool },
    { type: TemplateFieldType.CHECKBOX, label: 'Checkbox', icon: CheckSquare },
    { type: TemplateFieldType.DROPDOWN, label: 'Dropdown', icon: ChevronDown }
  ]

  // Load PDF
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true)
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@latest/build/pdf.worker.min.js'
        const pdfDoc = await loadingTask.promise
        setPdf(pdfDoc)
        setTotalPages(pdfDoc.numPages)
        setCurrentPage(1)
      } catch (error) {
        console.error('Error loading PDF:', error)
      } finally {
        setLoading(false)
      }
    }

    if (pdfUrl) {
      loadPDF()
    }
  }, [pdfUrl])

  // Render current page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return

      try {
        const page = await pdf.getPage(currentPage)
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        
        const viewport = page.getViewport({ scale })
        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        }

        await page.render(renderContext).promise
      } catch (error) {
        console.error('Error rendering page:', error)
      }
    }

    renderPage()
  }, [pdf, currentPage, scale])

  const addField = useCallback((type: TemplateFieldType) => {
    if (readonly) return

    const newField: TemplateField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      position: { x: 100, y: 100 },
      size: { width: 150, height: 30 },
      page: currentPage
    }

    onFieldsChange([...fields, newField])
    setSelectedField(newField.id)
  }, [fields, onFieldsChange, currentPage, readonly])

  const updateField = useCallback((fieldId: string, updates: Partial<TemplateField>) => {
    if (readonly) return

    const updatedFields = fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    )
    onFieldsChange(updatedFields)
  }, [fields, onFieldsChange, readonly])

  const deleteField = useCallback((fieldId: string) => {
    if (readonly) return

    const updatedFields = fields.filter(field => field.id !== fieldId)
    onFieldsChange(updatedFields)
    if (selectedField === fieldId) {
      setSelectedField(null)
    }
  }, [fields, onFieldsChange, selectedField, readonly])

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readonly) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    // Check if clicking on an existing field
    const clickedField = fields.find(field => {
      if (field.page !== currentPage) return false
      
      return x >= field.position.x && 
             x <= field.position.x + field.size.width &&
             y >= field.position.y && 
             y <= field.position.y + field.size.height
    })

    setSelectedField(clickedField?.id || null)
  }, [fields, currentPage, scale, readonly])

  const handleMouseDown = useCallback((e: React.MouseEvent, fieldId: string, dragType: 'move' | 'resize') => {
    if (readonly) return

    e.preventDefault()
    e.stopPropagation()

    const field = fields.find(f => f.id === fieldId)
    if (!field) return

    setDragState({
      isDragging: true,
      dragType,
      fieldId,
      startPos: { x: e.clientX, y: e.clientY },
      startFieldPos: { ...field.position },
      startFieldSize: { ...field.size }
    })

    setSelectedField(fieldId)
  }, [fields, readonly])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || readonly) return

    const deltaX = e.clientX - dragState.startPos.x
    const deltaY = e.clientY - dragState.startPos.y

    if (dragState.dragType === 'move') {
      updateField(dragState.fieldId!, {
        position: {
          x: Math.max(0, dragState.startFieldPos.x + deltaX / scale),
          y: Math.max(0, dragState.startFieldPos.y + deltaY / scale)
        }
      })
    } else if (dragState.dragType === 'resize') {
      updateField(dragState.fieldId!, {
        size: {
          width: Math.max(50, dragState.startFieldSize.width + deltaX / scale),
          height: Math.max(20, dragState.startFieldSize.height + deltaY / scale)
        }
      })
    }
  }, [dragState, scale, updateField, readonly])

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      dragType: 'move',
      fieldId: null,
      startPos: { x: 0, y: 0 },
      startFieldPos: { x: 0, y: 0 },
      startFieldSize: { width: 0, height: 0 }
    })
  }, [])

  // Add global mouse event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp])

  const currentPageFields = fields.filter(field => field.page === currentPage)
  const selectedFieldData = selectedField ? fields.find(f => f.id === selectedField) : null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Toolbar */}
      {!readonly && (
        <div className="w-64 border-r bg-muted/30 p-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Add Fields</h3>
            <div className="grid grid-cols-2 gap-2">
              {fieldTypes.map(({ type, label, icon: Icon }) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  onClick={() => addField(type)}
                  className="flex flex-col items-center p-2 h-auto"
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Field Properties */}
          {selectedFieldData && (
            <div className="space-y-3">
              <h3 className="font-semibold">Field Properties</h3>
              
              <div>
                <Label htmlFor="fieldLabel">Label</Label>
                <Input
                  id="fieldLabel"
                  value={selectedFieldData.label}
                  onChange={(e) => updateField(selectedField!, { label: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fieldPlaceholder">Placeholder</Label>
                <Input
                  id="fieldPlaceholder"
                  value={selectedFieldData.placeholder || ''}
                  onChange={(e) => updateField(selectedField!, { placeholder: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="fieldRequired"
                  checked={selectedFieldData.required}
                  onChange={(e) => updateField(selectedField!, { required: e.target.checked })}
                />
                <Label htmlFor="fieldRequired">Required</Label>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteField(selectedField!)}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Field
              </Button>
            </div>
          )}
        </div>
      )}

      {/* PDF Viewer */}
      <div className="flex-1 flex flex-col">
        {/* Controls */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale(Math.min(2.0, scale + 0.1))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Canvas Container */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto p-4 bg-gray-100"
        >
          <div className="relative inline-block bg-white shadow-lg">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="block"
              style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
            />
            
            {/* Field Overlays */}
            {currentPageFields.map((field) => (
              <div
                key={field.id}
                className={`absolute border-2 bg-blue-100/50 cursor-move ${
                  selectedField === field.id 
                    ? 'border-blue-500 bg-blue-200/50' 
                    : 'border-blue-300'
                }`}
                style={{
                  left: field.position.x * scale,
                  top: field.position.y * scale,
                  width: field.size.width * scale,
                  height: field.size.height * scale,
                  pointerEvents: readonly ? 'none' : 'auto'
                }}
                onMouseDown={(e) => handleMouseDown(e, field.id, 'move')}
              >
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-blue-700 pointer-events-none">
                  {field.label}
                </div>
                
                {/* Resize Handle */}
                {!readonly && selectedField === field.id && (
                  <div
                    className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
                    onMouseDown={(e) => handleMouseDown(e, field.id, 'resize')}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}