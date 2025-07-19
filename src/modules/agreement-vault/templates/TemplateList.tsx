import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Search, 
  FileText, 
  Calendar,
  MoreVertical
} from 'lucide-react'
import { useTemplates } from './useTemplates'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'

export default function TemplateList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { templates, loading, deleteTemplate, duplicateTemplate } = useTemplates()
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateNew = () => {
    navigate('/agreements/templates/new')
  }

  const handleEdit = (templateId: string) => {
    navigate(`/agreements/templates/edit/${templateId}`)
  }

  const handleDuplicate = async (templateId: string) => {
    try {
      const duplicated = duplicateTemplate(templateId)
      toast({
        title: 'Template Duplicated',
        description: `Created "${duplicated.name}" successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate template.',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (templateId: string) => {
    try {
      deleteTemplate(templateId)
      setShowDeleteConfirm(null)
      toast({
        title: 'Template Deleted',
        description: 'Template has been removed successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete template.',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Agreement Templates</h1>
          <p className="ri-page-description">
            Manage your agreement templates
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Template</CardTitle>
              <CardDescription>
                Are you sure you want to delete this template? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(showDeleteConfirm)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Agreement Templates</h1>
            <p className="ri-page-description">
              Create and manage reusable agreement templates
            </p>
          </div>
          <Button onClick={handleCreateNew} className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ri-search-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.description && (
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(template.id)}
                    className="flex-1 mr-2"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicate(template.id)}
                      title="Duplicate"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(template.id)}
                      title="Delete"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'No templates found' : 'No templates yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first agreement template to get started'
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Template
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}