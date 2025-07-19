import { useState, useEffect, useCallback } from 'react'
import { Template, TemplateField } from './templateTypes'
import { mockTemplates } from '@/mocks/templateMocks'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

const TEMPLATES_STORAGE_KEY = 'agreement_templates'

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load templates from localStorage on mount
  useEffect(() => {
    try {
      const storedTemplates = loadFromLocalStorage<Template[]>(TEMPLATES_STORAGE_KEY, [])
      
      if (storedTemplates.length === 0) {
        // Initialize with mock data if no templates exist
        setTemplates(mockTemplates)
        saveToLocalStorage(TEMPLATES_STORAGE_KEY, mockTemplates)
      } else {
        setTemplates(storedTemplates)
      }
    } catch (err) {
      console.error('Error loading templates:', err)
      setError('Failed to load templates')
      setTemplates(mockTemplates)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save templates to localStorage
  const saveTemplates = useCallback((updatedTemplates: Template[]) => {
    try {
      saveToLocalStorage(TEMPLATES_STORAGE_KEY, updatedTemplates)
      setTemplates(updatedTemplates)
      setError(null)
    } catch (err) {
      console.error('Error saving templates:', err)
      setError('Failed to save templates')
    }
  }, [])

  // Get all templates
  const getTemplates = useCallback(() => {
    return templates
  }, [templates])

  // Get template by ID
  const getTemplate = useCallback((id: string): Template | undefined => {
    return templates.find(template => template.id === id)
  }, [templates])

  // Add new template
  const addTemplate = useCallback((template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: Template = {
      ...template,
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedTemplates = [...templates, newTemplate]
    saveTemplates(updatedTemplates)
    return newTemplate
  }, [templates, saveTemplates])

  // Update existing template
  const updateTemplate = useCallback((id: string, updates: Partial<Template>) => {
    const updatedTemplates = templates.map(template => 
      template.id === id 
        ? { 
            ...template, 
            ...updates, 
            updatedAt: new Date().toISOString() 
          }
        : template
    )
    
    saveTemplates(updatedTemplates)
    return updatedTemplates.find(t => t.id === id)
  }, [templates, saveTemplates])

  // Delete template
  const deleteTemplate = useCallback((id: string) => {
    const updatedTemplates = templates.filter(template => template.id !== id)
    saveTemplates(updatedTemplates)
  }, [templates, saveTemplates])

  // Duplicate template
  const duplicateTemplate = useCallback((id: string) => {
    const templateToDuplicate = templates.find(template => template.id === id)
    
    if (!templateToDuplicate) {
      throw new Error('Template not found')
    }

    const duplicatedTemplate: Template = {
      ...templateToDuplicate,
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Copy of ${templateToDuplicate.name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Generate new IDs for all fields
      fields: templateToDuplicate.fields.map(field => ({
        ...field,
        id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    }

    const updatedTemplates = [...templates, duplicatedTemplate]
    saveTemplates(updatedTemplates)
    return duplicatedTemplate
  }, [templates, saveTemplates])

  // Update template fields
  const updateTemplateFields = useCallback((templateId: string, fields: TemplateField[]) => {
    updateTemplate(templateId, { fields })
  }, [updateTemplate])

  // Add field to template
  const addFieldToTemplate = useCallback((templateId: string, field: TemplateField) => {
    const template = getTemplate(templateId)
    if (!template) return

    const updatedFields = [...template.fields, field]
    updateTemplate(templateId, { fields: updatedFields })
  }, [getTemplate, updateTemplate])

  // Remove field from template
  const removeFieldFromTemplate = useCallback((templateId: string, fieldId: string) => {
    const template = getTemplate(templateId)
    if (!template) return

    const updatedFields = template.fields.filter(field => field.id !== fieldId)
    updateTemplate(templateId, { fields: updatedFields })
  }, [getTemplate, updateTemplate])

  // Update specific field in template
  const updateFieldInTemplate = useCallback((templateId: string, fieldId: string, updates: Partial<TemplateField>) => {
    const template = getTemplate(templateId)
    if (!template) return

    const updatedFields = template.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    )
    updateTemplate(templateId, { fields: updatedFields })
  }, [getTemplate, updateTemplate])

  return {
    templates,
    loading,
    error,
    getTemplates,
    getTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    updateTemplateFields,
    addFieldToTemplate,
    removeFieldFromTemplate,
    updateFieldInTemplate
  }
}

export default useTemplates