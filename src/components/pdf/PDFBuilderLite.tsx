import React, { useEffect, useRef, useState } from 'react'
import * as pdfjs from 'pdfjs-dist'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Calendar, CheckSquare, ChevronDown, PenTool, Type } from 'lucide-react'

// Use remote worker to avoid Vite bundler crash
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'

type FieldType = 'text' | 'signature' | 'date' | 'checkbox' | 'dropdown'

interface Field {
  id: string
  type: FieldType
  label: string
  x: number
  y: number
  width: number
  height: number
  page: number
  mergeField?: string
  required?: boolean
  options?: string[]
}

const FIELD_TYPES: { type: FieldType; label: string; icon: any }[] = [
  { type: 'text', label: 'Text', icon: Type },
  { type: 'signature', label: 'Signature', icon: PenTool },
  { type: 'date', label: 'Date', icon: Calendar },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'dropdown', label: 'Dropdown', icon: ChevronDown },
]

interface PDFBuilderLiteProps {
  url: string
  fields: Field[]
  onFieldsChange: (fields: Field[]) => void
  previewMode?: boolean
  selectedField?: Field | null
  onFieldClick?: (field: Field) => void
}

export function PDFBuilderLite({ url, fields, onFieldsChange, previewMode = false, selectedField, onFieldClick }: PDFBuilderLiteProps) {
  const [pdf, setPdf] = useState<pdfjs.PDFDocumentProxy | null>(null)
  const [pages, setPages] = useState<number[]>([])
  const [scale, setScale] = useState(1)
  const [draggingType, setDraggingType] = useState<FieldType | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = async () => {
      const task = pdfjs.getDocument(url)
      const doc = await task.promise
      setPdf(doc)
      setPages(Array.from({ length: doc.numPages }, (_, i) => i + 1))
    }
    if (url) load()
  }, [url])

  const renderPage = async (pageNum: number, canvas: HTMLCanvasElement) => {
    if (!pdf) return
    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale })
    canvas.height = viewport.height
    canvas.width = viewport.width
    const ctx = canvas.getContext('2d')
    if (ctx) await page.render({ canvasContext: ctx, viewport }).promise
  }

  const addField = (x: number, y: number, page: number, type: FieldType) => {
    const field: Field = {
      id: uuidv4(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      x,
      y,
      width: type === 'checkbox' ? 25 : 140,
      height: 30,
      page,
    }
    onFieldsChange([...fields, field])
  }

  const handleDrop = (e: React.DragEvent, page: number) => {
    if (!draggingType || previewMode) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    addField(x, y, page, draggingType)
    setDraggingType(null)
  }

  const handleResize = (e: React.MouseEvent, field: Field) => {
    if (previewMode) return
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = field.width
    const startHeight = field.height
    const move = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      const updated = { ...field, width: Math.max(30, startWidth + dx), height: Math.max(20, startHeight + dy) }
      onFieldsChange(fields.map(f => f.id === field.id ? updated : f))
    }
    const up = () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }

  return (
    <div className="flex h-full">
      {!previewMode && (
        <div className="w-64 border-r bg-white p-4 space-y-4">
          <h2 className="font-bold text-lg">Fields</h2>
          {FIELD_TYPES.map(ft => (
            <div
              key={ft.type}
              draggable
              onDragStart={() => setDraggingType(ft.type)}
              className="flex items-center gap-2 border rounded px-2 py-1 bg-gray-50 cursor-move hover:bg-gray-100"
            >
              <ft.icon className="h-4 w-4 text-gray-700" />
              <span>{ft.label}</span>
            </div>
          ))}
          <div className="pt-4">
            <Button variant="outline" size="sm" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>-</Button>
            <span className="px-2 text-sm">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => setScale(s => Math.min(2, s + 0.1))}>+</Button>
          </div>
        </div>
      )}

      <div className="flex-1 bg-gray-100 p-6 overflow-auto" ref={containerRef}>
        <div className="max-w-4xl mx-auto space-y-8">
          {pages.map(page => (
            <div
              key={page}
              className="relative bg-white border shadow"
              style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, page)}
            >
              <canvas ref={el => el && renderPage(page, el)} />
              {fields.filter(f => f.page === page).map(field => (
                <div
                  key={field.id}
                  onClick={() => onFieldClick?.(field)}
                  className={`absolute border-2 ${selectedField?.id === field.id ? 'ring-2 ring-blue-500' : 'hover:border-blue-400'} bg-yellow-100 text-[10px] px-1 py-0.5`}
                  style={{
                    left: field.x,
                    top: field.y,
                    width: field.width,
                    height: field.height,
                  }}
                >
                  {previewMode ? (
                    <span>{field.mergeField ? `{{${field.mergeField}}}` : field.label}</span>
                  ) : (
                    <span>{field.label}</span>
                  )}
                  {!previewMode && (
                    <div
                      onMouseDown={(e) => handleResize(e, field)}
                      className="absolute bottom-0 right-0 w-2 h-2 bg-gray-500 cursor-nwse-resize"
                      style={{ transform: 'translate(50%, 50%)' }}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
