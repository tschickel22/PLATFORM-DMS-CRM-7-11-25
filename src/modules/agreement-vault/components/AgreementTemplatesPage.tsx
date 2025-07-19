import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, FileText, Edit, Trash2, Eye, Search, Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { mockAgreementTemplates } from '@/mocks/agreementTemplatesMock'
import { AgreementTemplateForm } from './AgreementTemplateForm'
import { formatDate } from '@/lib/utils'

export function AgreementTemplatesPage() {
  const { toast } = useToast()
  
  // State management
  const [templates, setTemplates] = useState(mockAgreementTemplates.sampleTemplates)
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  // Get unique types and categories for filters
  const agreementTypes = ['all', ...new Set(templates.map(t => t.type))]
  const categories = ['all', ...new Set(templates.map(t => t.category))]

  // Filter templates based on search and filters
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || template.type === filterType
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory
    
    return matchesSearch && matchesType && matchesCategory
  })

  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setShowTemplateForm(true)
  }

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template)
    setShowTemplateForm(true)
  }

  const handleSaveTemplate = async (templateData: any) => {
    try {
      if (editingTemplate) {
        // Update existing template
        setTemplates(prev => prev.map(t => 
          t.id === editingTemplate.id ? templateData : t
        ))
        toast({
          title: 'Template Updated',
          description: 'The agreement template has been updated successfully.',
        })
      } else {
        // Add new template
        setTemplates(prev => [...prev, templateData])
        toast({
          title: 'Template Created',
          description: 'The new agreement template has been created successfully.',
        })
      }
      setShowTemplateForm(false)
      setEditingTemplate(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save the template. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleCancelForm = () => {
    setShowTemplateForm(false)
    setEditingTemplate(null)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId))
      toast({
        title: 'Template Deleted',
        description: 'The agreement template has been deleted successfully.',
      })
    }
  }

  const handleToggleActive = (templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, isActive: !t.isActive } : t
    ))
  }

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'PURCHASE': 'Purchase Agreement',
      'LEASE': 'Lease Agreement', 
      'SERVICE': 'Service Agreement',
      'WARRANTY': 'Warranty Agreement'
    }
    return typeMap[type] || type
  }

  return (
    <>
      {/* Template Form Modal */}
      {showTemplateForm && (
        <AgreementTemplateForm
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={handleCancelForm}
        />
      )}

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agreement Templates</h1>
            <p className="text-muted-foreground">
              Create and manage reusable agreement templates with document upload and field mapping
            </p>
          </div>
          <Button onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Template
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    {agreementTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type === 'all' ? 'All Types' : getTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Templates ({filteredTemplates.length})</CardTitle>
            <CardDescription>
              Manage your agreement templates and their configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTemplates.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {template.description}
                          </div>
                          {template.tags && template.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.tags.slice(0, 2).map((tag: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {template.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{template.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getTypeLabel(template.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.category}</TableCell>
                      <TableCell>{template.version}</TableCell>
                      <TableCell>{template.usageCount || 0} times</TableCell>
                      <TableCell>
                        <Badge 
                          variant={template.isActive ? "default" : "secondary"}
                          className={template.isActive ? "bg-green-100 text-green-800" : ""}
                        >
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(template.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // TODO: Implement template preview
                              toast({
                                title: 'Preview',
                                description: 'Template preview will be available in the next phase.',
                              })
                            }}
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
                            onClick={() => handleToggleActive(template.id)}
                          >
                            {template.isActive ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterType !== 'all' || filterCategory !== 'all' 
                    ? 'No templates match your search'
                    : 'No templates created yet'
                  }
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Create your first agreement template to get started.'
                  }
                </p>
                {(!searchTerm && filterType === 'all' && filterCategory === 'all') && (
                  <Button onClick={handleCreateTemplate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Template
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}