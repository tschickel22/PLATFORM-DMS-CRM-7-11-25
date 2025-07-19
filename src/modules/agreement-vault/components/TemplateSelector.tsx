import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, FileText, Eye, Check } from 'lucide-react'
import { useTemplateManagement } from '../hooks/useTemplateManagement'
import { AgreementTemplate, TemplateCategory } from '../types/template'
import { formatDate } from '@/lib/utils'

interface TemplateSelectorProps {
  onSelect: (template: AgreementTemplate) => void
  onCancel: () => void
  selectedTemplateId?: string
}

export function TemplateSelector({ onSelect, onCancel, selectedTemplateId }: TemplateSelectorProps) {
  const { getActiveTemplates } = useTemplateManagement()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all')

  const activeTemplates = getActiveTemplates()
  
  const filteredTemplates = activeTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: TemplateCategory) => {
    const colors = {
      [TemplateCategory.PURCHASE]: 'bg-blue-100 text-blue-800',
      [TemplateCategory.LEASE]: 'bg-green-100 text-green-800',
      [TemplateCategory.SERVICE]: 'bg-orange-100 text-orange-800',
      [TemplateCategory.WARRANTY]: 'bg-purple-100 text-purple-800',
      [TemplateCategory.CUSTOM]: 'bg-gray-100 text-gray-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Agreement Template</CardTitle>
              <CardDescription>
                Choose a template to use for this agreement
              </CardDescription>
            </div>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ri-search-input"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as TemplateCategory | 'all')}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              <option value={TemplateCategory.PURCHASE}>Purchase</option>
              <option value={TemplateCategory.LEASE}>Lease</option>
              <option value={TemplateCategory.SERVICE}>Service</option>
              <option value={TemplateCategory.WARRANTY}>Warranty</option>
              <option value={TemplateCategory.CUSTOM}>Custom</option>
            </select>
          </div>

          {/* Templates List */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplateId === template.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onSelect(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                        </Badge>
                        {selectedTemplateId === template.id && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      {template.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {template.files.length} file(s)
                        </span>
                        <span>{template.fields.length} field(s)</span>
                        <span>Updated {formatDate(template.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // TODO: Implement preview
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No active templates available. Create a template first.'
                }
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                const selected = filteredTemplates.find(t => t.id === selectedTemplateId)
                if (selected) onSelect(selected)
              }}
              disabled={!selectedTemplateId}
            >
              Use Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}