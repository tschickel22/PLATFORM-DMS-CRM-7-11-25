import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Search, X } from 'lucide-react'
import { useTemplates } from '../templates/useTemplates'
import { TemplateListItem, TEMPLATE_TYPES } from '../templates/templateTypes'
import { formatDate } from '@/lib/utils'

interface TemplateSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (templateId: string) => void
  agreementType?: string
}

export function TemplateSelectorModal({ 
  isOpen, 
  onClose, 
  onSelectTemplate, 
  agreementType 
}: TemplateSelectorModalProps) {
  const { getActiveTemplates, getTemplatesByType } = useTemplates()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState(agreementType || 'all')

  if (!isOpen) return null

  // Get templates based on filters
  let templates = getActiveTemplates()
  
  if (typeFilter !== 'all') {
    templates = templates.filter(template => template.type === typeFilter)
  }

  if (searchQuery) {
    templates = templates.filter(template =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = TEMPLATE_TYPES.find(t => t.value === type)
    return (
      <Badge variant="outline">
        {typeConfig?.label || type}
      </Badge>
    )
  }

  const handleSelectTemplate = (templateId: string) => {
    onSelectTemplate(templateId)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Agreement Template</CardTitle>
              <CardDescription>
                Choose a template to create a new agreement
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {TEMPLATE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Templates List */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {templates.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || typeFilter !== 'all' 
                    ? "No templates match your current filters"
                    : "No active templates available. Create a template first."
                  }
                </p>
              </div>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {getTypeBadge(template.type)}
                        <span className="text-sm text-muted-foreground">
                          {template.fieldCount} fields
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Last modified: {formatDate(template.lastModified)}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Select Template
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                // Navigate to create new template
                window.location.href = '/agreements/templates'
              }}
            >
              Create New Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}