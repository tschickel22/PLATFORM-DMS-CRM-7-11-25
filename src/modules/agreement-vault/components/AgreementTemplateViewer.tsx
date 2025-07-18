import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Edit, Copy, Download, Calendar, User, Tag, FileText } from 'lucide-react'
import { AgreementTemplate } from '@/types'
import { formatDate } from '@/lib/utils'

interface AgreementTemplateViewerProps {
  template: AgreementTemplate
  onClose: () => void
  onEdit: () => void
}

export function AgreementTemplateViewer({ template, onClose, onEdit }: AgreementTemplateViewerProps) {
  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(template.terms)
    // Could add toast notification here
  }

  const handleDownloadTemplate = () => {
    const blob = new Blob([template.terms], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const renderTermsWithHighlightedFields = () => {
    return template.terms.replace(
      /\{\{([^}]+)\}\}/g,
      '<span class="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-sm font-medium">{{$1}}</span>'
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <Badge variant={template.isActive ? "default" : "secondary"}>
                  {template.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription className="text-base">
                {template.description}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          {/* Template Metadata */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{template.type}</div>
                <div className="text-muted-foreground">Type</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{template.category}</div>
                <div className="text-muted-foreground">Category</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{template.usageCount || 0}</div>
                <div className="text-muted-foreground">Times Used</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{formatDate(template.updatedAt)}</div>
                <div className="text-muted-foreground">Last Updated</div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Merge Fields */}
          <div>
            <h3 className="text-sm font-medium mb-2">
              Merge Fields ({template.mergeFields.length})
            </h3>
            <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-md">
              {template.mergeFields.map((field, index) => (
                <Badge key={index} variant="secondary" className="font-mono">
                  {`{{${field}}}`}
                </Badge>
              ))}
              {template.mergeFields.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No merge fields defined for this template
                </div>
              )}
            </div>
          </div>

          {/* Template Content */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Template Content</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleCopyTemplate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-white max-h-96 overflow-y-auto">
              <div 
                className="prose max-w-none whitespace-pre-wrap text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: renderTermsWithHighlightedFields() 
                }}
              />
            </div>
          </div>

          {/* Template Metadata Footer */}
          <div className="border-t pt-4 text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Template ID: {template.id}</span>
              <span>Version: {template.version}</span>
            </div>
            <div className="flex justify-between">
              <span>Created: {formatDate(template.createdAt)}</span>
              <span>Created by: {template.createdBy}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}