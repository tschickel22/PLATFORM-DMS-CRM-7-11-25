import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  Filter,
  MoreHorizontal,
  Tag,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react'
import { AgreementTemplate } from '@/types'
import { mockAgreementTemplates } from '@/mocks/agreementTemplatesMock'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import { AgreementTemplateForm } from './AgreementTemplateForm'
import { AgreementTemplateViewer } from './AgreementTemplateViewer'

export function AgreementTemplatesPage() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<AgreementTemplate[]>(mockAgreementTemplates.sampleTemplates)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTemplate, setSelectedTemplate] = useState<AgreementTemplate | null>(null)
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [showTemplateViewer, setShowTemplateViewer] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<AgreementTemplate | null>(null)

  const categories = ['All', ...mockAgreementTemplates.templateCategories]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setShowTemplateForm(true)
  }

  const handleEditTemplate = (template: AgreementTemplate) => {
    setEditingTemplate(template)
    setShowTemplateForm(true)
  }

  const handleViewTemplate = (template: AgreementTemplate) => {
    setSelectedTemplate(template)
    setShowTemplateViewer(true)
  }

  const handleDuplicateTemplate = (template: AgreementTemplate) => {
    const duplicatedTemplate: AgreementTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      version: '1.0',
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user@company.com'
    }
    
    setTemplates([...templates, duplicatedTemplate])
    toast({
      title: 'Template Duplicated',
      description: `"${template.name}" has been duplicated successfully.`
    })
  }

  const handleDeleteTemplate = (template: AgreementTemplate) => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      setTemplates(templates.filter(t => t.id !== template.id))
      toast({
        title: 'Template Deleted',
        description: `"${template.name}" has been deleted.`,
        variant: 'destructive'
      })
    }
  }

  const handleToggleActive = (template: AgreementTemplate) => {
    setTemplates(templates.map(t => 
      t.id === template.id ? { ...t, isActive: !t.isActive } : t
    ))
    
    toast({
      title: template.isActive ? 'Template Deactivated' : 'Template Activated',
      description: `"${template.name}" has been ${template.isActive ? 'deactivated' : 'activated'}.`
    })
  }

  const handleSaveTemplate = (templateData: Partial<AgreementTemplate>) => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...templateData, updatedAt: new Date().toISOString() }
          : t
      ))
      toast({
        title: 'Template Updated',
        description: `"${templateData.name}" has been updated successfully.`
      })
    } else {
      // Create new template
      const newTemplate: AgreementTemplate = {
        id: `template-${Date.now()}`,
        ...templateData,
        version: '1.0',
        isActive: true,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user@company.com'
      } as AgreementTemplate
      
      setTemplates([...templates, newTemplate])
      toast({
        title: 'Template Created',
        description: `"${templateData.name}" has been created successfully.`
      })
    }
    
    setShowTemplateForm(false)
    setEditingTemplate(null)
  }

  return (
    <>
      {/* Template Form Modal */}
      {showTemplateForm && (
        <AgreementTemplateForm
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setShowTemplateForm(false)
            setEditingTemplate(null)
          }}
        />
      )}

      {/* Template Viewer Modal */}
      {showTemplateViewer && selectedTemplate && (
        <AgreementTemplateViewer
          template={selectedTemplate}
          onClose={() => {
            setShowTemplateViewer(false)
            setSelectedTemplate(null)
          }}
          onEdit={() => {
            setShowTemplateViewer(false)
            handleEditTemplate(selectedTemplate)
          }}
        />
      )}

      <div className="space-y-6">
        {/* Page Header */}
        <div className="ri-page-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="ri-page-title">Agreement Templates</h1>
              <p className="ri-page-description">
                Manage reusable agreement templates with merge fields
              </p>
            </div>
            <Button onClick={handleCreateTemplate} className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="ri-stats-grid">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
              <p className="text-xs text-muted-foreground">
                {templates.filter(t => t.isActive).length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Used</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(...templates.map(t => t.usageCount || 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                {templates.find(t => t.usageCount === Math.max(...templates.map(t => t.usageCount || 0)))?.name}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length - 1}</div>
              <p className="text-xs text-muted-foreground">
                Template categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {templates.filter(t => {
                  const updatedDate = new Date(t.updatedAt)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return updatedDate > weekAgo
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Updated this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="ri-search-bar">
                <Search className="ri-search-icon" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ri-search-input"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="grid grid-cols-4 lg:grid-cols-8">
                    {categories.slice(0, 8).map(category => (
                      <TabsTrigger key={category} value={category} className="text-xs">
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{template.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {template.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewTemplate(template)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{template.type}</Badge>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  {!template.isActive && (
                    <Badge variant="destructive">Inactive</Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>Used {template.usageCount || 0} times</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(template.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    v{template.version} • {template.mergeFields.length} fields
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(template)}
                    >
                      {template.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== 'All' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first agreement template to get started.'
                }
              </p>
              {!searchTerm && selectedCategory === 'All' && (
                <Button onClick={handleCreateTemplate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}