import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Search, FileText } from 'lucide-react'
import { Template } from './templateTypes'
import { useToast } from '@/hooks/use-toast'

interface TemplateListProps {
  templates: Template[]
  onCreateTemplate: () => void
  onEditTemplate: (template: Template) => void
  onDeleteTemplate: (templateId: string) => void
}

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate
}) => {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    if (window.confirm(`Are you sure you want to delete "${templateName}"? This action cannot be undone.`)) {
      onDeleteTemplate(templateId)
      toast({
        title: 'Template Deleted',
        description: `Template "${templateName}" has been deleted successfully.`
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Agreement Templates</CardTitle>
            <CardDescription>
              Manage reusable agreement templates for different contract types
            </CardDescription>
          </div>
          <Button onClick={onCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Templates List */}
        <div className="space-y-4">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{template.name}</h4>
                    <Badge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description || 'No description provided'}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <span>{template.fields?.length || 0} fields</span>
                    <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                    <span>Updated {new Date(template.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditTemplate(template)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id, template.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? (
                <>
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No templates found matching "{searchQuery}"</p>
                  <p className="text-sm">Try adjusting your search terms</p>
                </>
              ) : (
                <>
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No agreement templates created yet</p>
                  <p className="text-sm">Create your first template to get started</p>
                  <Button onClick={onCreateTemplate} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TemplateList