import { useState, useEffect } from 'react'
import { AgreementTemplate, TemplateListItem, TemplateMetadata, TemplateField } from './templateTypes'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

const TEMPLATE_LIST_KEY = 'agreement_templates_list'
const TEMPLATE_KEY_PREFIX = 'agreement_template_'

export function useTemplates() {
  const [templates, setTemplates] = useState<TemplateListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load templates list on mount
  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = () => {
    try {
      const templatesList = loadFromLocalStorage<TemplateListItem[]>(TEMPLATE_LIST_KEY, [])
      setTemplates(templatesList)
    } catch (err) {
      setError('Failed to load templates')
      console.error('Error loading templates:', err)
    }
  }

  const getTemplates = (): TemplateListItem[] => {
    return templates
  }

  const getTemplateById = (id: string): AgreementTemplate | null => {
    try {
      const template = loadFromLocalStorage<AgreementTemplate | null>(`${TEMPLATE_KEY_PREFIX}${id}`, null)
      return template
    } catch (err) {
      console.error('Error loading template:', err)
      return null
    }
  }

  const saveTemplate = async (template: AgreementTemplate): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      // Save the full template data
      saveToLocalStorage(`${TEMPLATE_KEY_PREFIX}${template.metadata.id}`, template)
      
      // Update the templates list
      const updatedTemplates = templates.filter(t => t.id !== template.metadata.id)
      const listItem: TemplateListItem = {
        id: template.metadata.id,
        name: template.metadata.name,
        type: template.metadata.type,
        status: template.metadata.status,
        lastModified: template.metadata.updatedAt,
        createdBy: template.metadata.createdBy,
        fieldCount: template.fields.length
      }
      
      updatedTemplates.push(listItem)
      setTemplates(updatedTemplates)
      saveToLocalStorage(TEMPLATE_LIST_KEY, updatedTemplates)
      
      return true
    } catch (err) {
      setError('Failed to save template')
      console.error('Error saving template:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteTemplate = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      // Remove from localStorage
      localStorage.removeItem(`${TEMPLATE_KEY_PREFIX}${id}`)
      
      // Update templates list
      const updatedTemplates = templates.filter(t => t.id !== id)
      setTemplates(updatedTemplates)
      saveToLocalStorage(TEMPLATE_LIST_KEY, updatedTemplates)
      
      return true
    } catch (err) {
      setError('Failed to delete template')
      console.error('Error deleting template:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const createTemplate = (
    name: string, 
    type: 'PURCHASE' | 'LEASE' | 'SERVICE' | 'WARRANTY',
    description?: string
  ): AgreementTemplate => {
    const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date()
    
    return {
      metadata: {
        id,
        name,
        type,
        description,
        status: 'DRAFT',
        createdAt: now,
        updatedAt: now,
        createdBy: 'current_user', // In real app, get from auth context
        version: 1,
        tags: []
      },
      fields: [],
      mergeFields: {},
      settings: {
        allowEditing: true,
        requireAllFields: false,
        autoSave: true
      }
    }
  }

  const duplicateTemplate = async (templateId: string, newName: string): Promise<string | null> => {
    const originalTemplate = getTemplateById(templateId)
    if (!originalTemplate) return null

    const duplicatedTemplate = {
      ...originalTemplate,
      metadata: {
        ...originalTemplate.metadata,
        id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: newName,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      }
    }

    const success = await saveTemplate(duplicatedTemplate)
    return success ? duplicatedTemplate.metadata.id : null
  }

  const updateTemplateStatus = async (id: string, status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'): Promise<boolean> => {
    const template = getTemplateById(id)
    if (!template) return false

    template.metadata.status = status
    template.metadata.updatedAt = new Date()
    
    return await saveTemplate(template)
  }

  const getTemplatesByType = (type: string): TemplateListItem[] => {
    return templates.filter(template => template.type === type)
  }

  const getActiveTemplates = (): TemplateListItem[] => {
    return templates.filter(template => template.status === 'ACTIVE')
  }

  const searchTemplates = (query: string): TemplateListItem[] => {
    const lowercaseQuery = query.toLowerCase()
    return templates.filter(template => 
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.type.toLowerCase().includes(lowercaseQuery)
    )
  }

  return {
    templates,
    loading,
    error,
    getTemplates,
    getTemplateById,
    saveTemplate,
    deleteTemplate,
    createTemplate,
    duplicateTemplate,
    updateTemplateStatus,
    getTemplatesByType,
    getActiveTemplates,
    searchTemplates,
    loadTemplates
  }
}