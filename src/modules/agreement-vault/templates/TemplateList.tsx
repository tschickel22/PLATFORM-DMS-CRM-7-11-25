import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy, 
  Filter,
  MoreHorizontal,
  Eye,
  Archive,
  CheckCircle
} from 'lucide-react'
import { useTemplates } from './useTemplates'
import { TemplateListItem, TEMPLATE_TYPES, TEMPLATE_STATUS } from './templateTypes'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

interface CreateTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, type: string, description?: string) => void
}

function CreateTemplateModal({ isOpen, onClose, onSubmit }: CreateTemplateModalProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && type) {
      onSubmit(name, type, description || undefined)
      setName('')
      setType('')
      setDescription('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Template</CardTitle>
          <CardDescription>
            Create a new agreement template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Template Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Standard Purchase Agreement"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Template Type *</label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select template type" />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_TYPES.map(templateType => (
                    <SelectItem key={templateType.value} value={templateType.value}>
                      {templateType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Create Template
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TemplateList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const {
    templates,
    loading,
    error,
    createTemplate,
    saveTemplate,
    deleteTemplate,
    duplicateTemplate,
    updateTemplateStatus,
    searchTemplates
  } = useTemplates()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Filter templates based on search and filters
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.type.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter
    const matchesType = typeFilter === 'all' || template.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleCreateTemplate = async (name: string, type: string, description?: string) => {
    const newTemplate = createTemplate(name, type as any, description)
    const success = await saveTemplate(newTemplate)
    
    if (success) {
      toast({
        title: 'Template Created',
        description: `Template "${name}" has been created successfully.`,
      })
      // Navigate to template builder
      navigate(`/agreements/templates/${newTemplate.metadata.id}/edit`)
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create template.',
        variant: 'destructive'
      })
    }
  }

  const handleEditTemplate = (templateId: string) => {
    navigate(`/agreements/templates/${templateId}/edit`)
  }

  const handleDeleteTemplate = async (templateId: string, templateName: string) => {
    if (window.confirm(`Are you sure you want to delete "${templateName}"?`)) {
      const success = await deleteTemplate(templateId)
      
      if (success) {
        toast({
          title: 'Template Deleted',
          description: `Template "${templateName}" has been deleted.`,
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete template.',
          variant: 'destructive'
        })
      }
    }
  }

  const handleDuplicateTemplate = async (templateId: string, templateName: string) => {
    const newName = `${templateName} (Copy)`
    const newTemplateId = await duplicateTemplate(templateId, newName)
    
    if (newTemplateId) {
      toast({
        title: 'Template Duplicated',
        description: `Template "${newName}" has been created.`,
      })
    } else {
      toast({
        title: 'Error',
        description: 'Failed to duplicate template.',
        variant: 'destructive'
      })
    }
  }

  const handleStatusChange = async (templateId: string, newStatus: string) => {
    const success = await updateTemplateStatus(templateId, newStatus as any)
    
    if (success) {
      toast({
        title: 'Status Updated',
        description: `Template status changed to ${newStatus.toLowerCase()}.`,
      })
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update template status.',
        variant: 'destructive'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = TEMPLATE_STATUS.find(s => s.value === status)
    return (
      <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
        {statusConfig?.label || status}
      </Badge>
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Agreement Templates</h1>
          <p className="ri-page-description">Manage your agreement templates</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading templates: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Create Template Modal */}
      <CreateTemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTemplate}
      />

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Agreement Templates</h1>
            <p className="ri-page-description">
              Create and manage reusable agreement templates
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ri-search-input"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {TEMPLATE_STATUS.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
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
          </div>
        </CardContent>
      </Card>

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle>Templates ({filteredTemplates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading templates...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                {templates.length === 0 
                  ? "Get started by creating your first agreement template"
                  : "No templates match your current filters"
                }
              </p>
              {templates.length === 0 && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Template
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="ri-table-row">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          {getTypeBadge(template.type)}
                          {getStatusBadge(template.status)}
                          <span className="text-sm text-muted-foreground">
                            {template.fieldCount} fields
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Last modified: {formatDate(template.lastModified)} • Created by: {template.createdBy}
                    </div>
                  </div>
                  
                  <div className="ri-action-buttons">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTemplate(template.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    
                    <Select
                      value=""
                      onValueChange={(action) => {
                        switch (action) {
                          case 'duplicate':
                            handleDuplicateTemplate(template.id, template.name)
                            break
                          case 'activate':
                            handleStatusChange(template.id, 'ACTIVE')
                            break
                          case 'archive':
                            handleStatusChange(template.id, 'ARCHIVED')
                            break
                          case 'delete':
                            handleDeleteTemplate(template.id, template.name)
                            break
                        }
                      }}
                    >
                      <SelectTrigger className="w-[40px] h-9">
                        <MoreHorizontal className="h-4 w-4" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="duplicate">
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </SelectItem>
                        {template.status !== 'ACTIVE' && (
                          <SelectItem value="activate">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activate
                          </SelectItem>
                        )}
                        {template.status !== 'ARCHIVED' && (
                          <SelectItem value="archive">
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </SelectItem>
                        )}
                        <SelectItem value="delete" className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}