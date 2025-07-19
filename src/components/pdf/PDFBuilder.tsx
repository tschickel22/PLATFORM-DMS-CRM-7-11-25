import React, { useEffect, useRef, useState } from 'react'
import * as pdfjs from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.entry?url'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Trash2, Type, PenTool, Calendar, CheckSquare, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

const FIELD_TYPES = [
  { type: 'text', label: 'Text Field', icon: Type, color: 'bg-blue-100 border-blue-300 text-blue-800' },
  { type: 'signature', label: 'Signature', icon: PenTool, color: 'bg-purple-100 border-purple-300 text-purple-800' },
  { type: 'date', label: 'Date Field', icon: Calendar, color: 'bg-green-100 border-green-300 text-green-800' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { type: 'dropdown', label: 'Dropdown', icon: ChevronDown, color: 'bg-pink-100 border-pink-300 text-pink-800' }
]

export interface Field {
  id: string
  type: 'text' | 'signature' | 'date' | 'checkbox' | 'dropdown'
  label: string
  x: number
  y: number
  width: number
  height: number
  page: number
  documentId: string
  required?: boolean
  defaultValue?: string
  options?: string[]
  mergeField?: string
}

interface PDFBuilderProps {
  url: string
  fields: Field[]
  mergeFields: string[]
  onFieldsChange: (fields: Field[]) => void
  currentDocumentId: string
  previewMode?: boolean
  onFieldClick: (field: Field) => void
  selectedField?: Field | null
}

export function PDFBuilder({ 
  url, 
  fields, 
  mergeFields, 
  onFieldsChange, 
  currentDocumentId,
  previewMode = false,
  onFieldClick,
  selectedField
}: PDFBuilderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pdf, setPdf] = useState<pdfjs.PDFDocumentProxy | null>(null)
  const [scale, setScale] = useState(1)
  const [pages, setPages] = useState<number[]>([])
  const [draggingFieldType, setDraggingFieldType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPdf = async () => {
      if (!url) return
      
      try {
        setLoading(true)
        setError(null)
        const loadingTask = pdfjs.getDocument(url)
        const doc = await loadingTask.promise
        setPdf(doc)
        setPages(Array.from({ length: doc.numPages }, (_, i) => i + 1))
      } catch (err) {
        console.error('Error loading PDF:', err)
        setError('Failed to load PDF document')
      } finally {
        setLoading(false)
      }
    }
    
    loadPdf()
  }, [url])

  const renderPage = async (pageNum: number, canvas: HTMLCanvasElement) => {
    if (!pdf) return
    
    try {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale })
      const context = canvas.getContext('2d')
      
      if (!context) return
      
      canvas.height = viewport.height
      canvas.width = viewport.width
      
      await page.render({ canvasContext: context, viewport }).promise
    } catch (err) {
      console.error('Error rendering page:', err)
    }
  }

  const addField = (type: string, page: number, x: number, y: number) => {
    if (!currentDocumentId) return
    
    const newField: Field = {
      id: uuidv4(),
      type: type as Field['type'],
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      x,
      y,
      width: type === 'checkbox' ? 30 : 120,
      height: type === 'checkbox' ? 30 : 30,
      page,
      documentId: currentDocumentId,
      required: false
    }
    onFieldsChange([...fields, newField])
  }

  const handleDrop = (e: React.DragEvent, page: number) => {
    if (!draggingFieldType || previewMode) return
    
    e.preventDefault()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    addField(draggingFieldType, page, x, y)
    setDraggingFieldType(null)
  }

  const handleDrag = (e: React.MouseEvent, field: Field) => {
    if (previewMode) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const startX = e.clientX
    const startY = e.clientY
    const startLeft = field.x
    const startTop = field.y

    const move = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      const updated = { ...field, x: Math.max(0, startLeft + deltaX), y: Math.max(0, startTop + deltaY) }
      onFieldsChange(fields.map(f => f.id === field.id ? updated : f))
    }

    const up = () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }

  const handleResize = (e: React.MouseEvent, field: Field) => {
    if (previewMode) return
    
    e.stopPropagation()
    e.preventDefault()
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = field.width
    const startHeight = field.height

    const move = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      const updated = { 
        ...field, 
        width: Math.max(30, startWidth + deltaX), 
        height: Math.max(20, startHeight + deltaY) 
      }
      onFieldsChange(fields.map(f => f.id === field.id ? updated : f))
    }

    const up = () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }

  const handleFieldClick = (e: React.MouseEvent, field: Field) => {
    if (previewMode) return
    
    e.stopPropagation()
    onFieldClick(field)
  }

  const getFieldTypeConfig = (type: string) => {
    return FIELD_TYPES.find(ft => ft.type === type) || FIELD_TYPES[0]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading PDF...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Left Toolbox */}
      {!previewMode && (
        <div className="w-64 border-r bg-white p-4 space-y-4 flex-shrink-0">
          <h2 className="text-lg font-semibold">Field Types</h2>
          <div className="space-y-2">
            {FIELD_TYPES.map(fieldType => (
              <div
                key={fieldType.type}
                draggable
                onDragStart={() => setDraggingFieldType(fieldType.type)}
                className="cursor-move p-3 border rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <fieldType.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{fieldType.label}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Zoom</h3>
            <div className="flex items-center justify-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
              >
                -
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setScale(s => Math.min(2, s + 0.1))}
              >
                +
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground pt-2">
            Drag field types onto the PDF to place them
          </div>
        </div>
      )}

      {/* PDF Canvas + Fields */}
      <div className="flex-1 overflow-auto p-8 bg-gray-100" ref={containerRef}>
        <div className="max-w-4xl mx-auto space-y-8">
          {pages.map(page => (
            <div
              key={page}
              className="relative bg-white shadow-lg inline-block"
              style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, page)}
            >
              <canvas 
                ref={(el) => el && renderPage(page, el)} 
                className="block"
              />

              {/* Render Fields for this page */}
              {fields.filter(f => f.page === page).map(field => {
                const config = getFieldTypeConfig(field.type)
                const isSelected = selectedField?.id === field.id
                
                return (
                  <div
                    key={field.id}
                    className={cn(
                      "absolute border-2 border-dashed cursor-pointer transition-all",
                      config.color,
                      isSelected ? "border-solid shadow-md ring-2 ring-blue-500" : "hover:border-solid",
                      previewMode ? "cursor-default" : "cursor-move"
                    )}
                    style={{
                      top: field.y,
                      left: field.x,
                      width: field.width,
                      height: field.height
                    }}
                    onClick={(e) => handleFieldClick(e, field)}
                    onMouseDown={(e) => handleDrag(e, field)}
                  >
                    {/* Field Label */}
                    <div className="absolute -top-6 left-0 bg-white px-1 rounded text-xs font-medium border shadow-sm">
                      {field.label}
                    </div>

                    {/* Field Content */}
                    <div className="w-full h-full flex items-center justify-center p-1">
                      {previewMode ? (
                        <span className="text-xs text-gray-600 truncate">
                          {field.mergeField ? `{{${field.mergeField}}}` : field.label}
                        </span>
                      ) : (
                        <config.icon className="h-4 w-4 opacity-50" />
                      )}
                    </div>

                    {/* Resize Handle */}
                    {!previewMode && (
                      <div
                        onMouseDown={(e) => handleResize(e, field)}
                        className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 cursor-nwse-resize opacity-50 hover:opacity-100"
                        style={{ transform: 'translate(50%, 50%)' }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
          
          {pages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <span>No PDF pages to display</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}