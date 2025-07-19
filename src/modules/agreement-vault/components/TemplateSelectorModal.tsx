import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, Search, FileText, Calendar, Plus } from 'lucide-react'
import { useTemplates } from '../templates/useTemplates'
import { Template } from '../templates/templateTypes'
import { formatDate } from '@/lib/utils'

interface TemplateSelectorModalProps {
  onSelect: (template: Template) => void
  onClose: () => void
  onCreateNew?: () => void
}

export function TemplateSelectorModal({ onSelect, onClose, onCreateNew }: TemplateSelectorModalProps) {
  const { templates, loading } = useTemplates()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTemplates = templates.filter(template =>
    template.isActive && (
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const handleSelectTemplate = (template: Template) => {
    onSelect(template)
    onClose()
  }

  const handleCreateNew = () => {
    onClose()
    if (onCreateNew) {
      onCreateNew()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Select Agreement Template</CardTitle>
              <CardDescription>
                Choose a template to start your new agreement
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 shadow-sm"
            />
          </div>

          {/* Templates Grid */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredTemplates.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          {template.description && (
                            <CardDescription className="mt-1 text-sm">
                              {template.description}
                            </CardDescription>
                          )}
                        </div>
                        <Badge variant="default" className="ml-2">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {template.fields.length} fields
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(template.updatedAt)}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectTemplate(template)
                          }}
                        >
                          Use This Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? 'No templates found' : 'No templates available'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Create your first template to get started'
                  }
                </p>
                {onCreateNew && (
                  <Button onClick={handleCreateNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Template
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="h-4 w-4 mr-1" />
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            </div>
            <div className="flex space-x-3">
              {onCreateNew && (
                <Button variant="outline" onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Template
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TemplateSelectorModal