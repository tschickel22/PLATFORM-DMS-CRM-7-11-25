import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  FileText, 
  Edit, 
  Copy, 
  Trash2, 
  Eye,
  Filter,
  MoreHorizontal
} from 'lucide-react'
import { useTemplateManagement } from '../hooks/useTemplateManagement'
import { TemplateCategory, TemplateStatus } from '../types/template'
import { NewTemplateModal } from './NewTemplateModal'
import { TemplateBuilder } from './TemplateBuilder'
import { formatDate } from '@/lib/utils'

export function TemplateManagement() {
  const {
    templates,
    loading,
    deleteTemplate,
    duplicateTemplate
  } = useTemplateManagement()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<TemplateStatus | 'all'>('all')
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null)

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || template.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      await deleteTemplate(templateId)
    }
  }

  const handleDuplicateTemplate = async (templateId: string) => {
    await duplicateTemplate(templateId)
  }

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

  const getStatusColor = (status: TemplateStatus) => {
    const colors = {
      [TemplateStatus.DRAFT]: 'bg-yellow-100 text-yellow-800',
      [TemplateStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [TemplateStatus.ARCHIVED]: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (editingTemplate) {
    return (
      <TemplateBuilder
        templateId={editingTemplate}
        onClose={() => setEditingTemplate(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* New Template Modal */}
      {showNewTemplateModal && (
        <NewTemplateModal
          onClose={() => setShowNewTemplateModal(false)}
          onSuccess={(template) => {
            setShowNewTemplateModal(false)
            setEditingTemplate(template.id)
          }}
        />
      )}

      {/* Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Agreement Templates</h1>
            <p className="ri-page-description">
              Create and manage reusable agreement templates
            </p>
          </div>
          <Button onClick={() => setShowNewTemplateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
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
            
            <div className="flex gap-2">
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

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as TemplateStatus | 'all')}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value={TemplateStatus.DRAFT}>Draft</option>
                <option value={TemplateStatus.ACTIVE}>Active</option>
                <option value={TemplateStatus.ARCHIVED}>Archived</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTemplate(template.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getCategoryColor(template.category)}>
                  {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                </Badge>
                <Badge className={getStatusColor(template.status)}>
                  {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 mr-2" />
                  {template.files.length} file(s)
                </div>
                <div className="text-sm text-muted-foreground">
                  {template.fields.length} field(s)
                </div>
                <div className="text-sm text-muted-foreground">
                  Updated {formatDate(template.updatedAt)}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setEditingTemplate(template.id)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first agreement template to get started'
                }
              </p>
              {!searchTerm && selectedCategory === 'all' && selectedStatus === 'all' && (
                <Button onClick={() => setShowNewTemplateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}