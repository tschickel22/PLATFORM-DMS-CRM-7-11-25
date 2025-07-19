import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Eye, X } from 'lucide-react'

interface Document {
  id: string
  name: string
  type: string
  url: string
  size: number
  uploadedAt: Date
}

interface DocumentViewerProps {
  document: Document
  onClose?: () => void
  onDownload?: (document: Document) => void
}

export function DocumentViewer({ document, onClose, onDownload }: DocumentViewerProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    // Return FileText icon for all document types
    return FileText
  }

  const FileIcon = getFileIcon(document.type)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileIcon className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-lg">{document.name}</CardTitle>
                <CardDescription>
                  {document.type} • {formatFileSize(document.size)} • 
                  {new Date(document.uploadedAt).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onDownload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(document)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[60vh] bg-muted/30 flex items-center justify-center">
            {document.type === 'application/pdf' ? (
              <iframe
                src={document.url}
                className="w-full h-full border-0"
                title={document.name}
              />
            ) : document.type.startsWith('image/') ? (
              <img
                src={document.url}
                alt={document.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center space-y-4">
                <FileIcon className="h-16 w-16 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Preview not available</p>
                  <p className="text-sm text-muted-foreground">
                    This file type cannot be previewed in the browser
                  </p>
                </div>
                {onDownload && (
                  <Button onClick={() => onDownload(document)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download to view
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}