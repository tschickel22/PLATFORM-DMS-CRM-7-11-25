import { useState, useCallback } from 'react'
import { AgreementTemplate, TemplateFile, TemplateField, TemplateStatus, TemplateCategory } from '../types/template'
import { useToast } from '@/hooks/use-toast'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

const STORAGE_KEY = 'agreement_templates'

export function useTemplateManagement() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<AgreementTemplate[]>(() => 
    loadFromLocalStorage(STORAGE_KEY, [])
  )
  const [loading, setLoading] = useState(false)

  const saveTemplates = useCallback((updatedTemplates: AgreementTemplate[]) => {
    setTemplates(updatedTemplates)
    saveToLocalStorage(STORAGE_KEY, updatedTemplates)
  }, [])

  const createTemplate = useCallback(async (templateData: {
    name: string
    category: TemplateCategory
    description?: string
    files: TemplateFile[]
  }) => {
    setLoading(true)
    try {
      const newTemplate: AgreementTemplate = {
        id: `template-${Date.now()}`,
        name: templateData.name,
        category: templateData.category,
        description: templateData.description,
        files: templateData.files,
        fields: [],
        status: TemplateStatus.DRAFT,
        createdBy: 'current-user', // In real app, get from auth context
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId: 'current-company' // In real app, get from tenant context
      }

      const updatedTemplates = [...templates, newTemplate]
      saveTemplates(updatedTemplates)

      toast({
        title: 'Template Created',
        description: `Template "${templateData.name}" has been created successfully.`
      })

      return newTemplate
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create template. Please try again.',
        variant: 'destructive'
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [templates, saveTemplates, toast])

  const updateTemplate = useCallback(async (templateId: string, updates: Partial<AgreementTemplate>) => {
    setLoading(true)
    try {
      const updatedTemplates = templates.map(template =>
        template.id === templateId
          ? { ...template, ...updates, updatedAt: new Date() }
          : template
      )
      saveTemplates(updatedTemplates)

      toast({
        title: 'Template Updated',
        description: 'Template has been updated successfully.'
      })

      return updatedTemplates.find(t => t.id === templateId)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update template. Please try again.',
        variant: 'destructive'
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [templates, saveTemplates, toast])

  const deleteTemplate = useCallback(async (templateId: string) => {
    setLoading(true)
    try {
      const updatedTemplates = templates.filter(template => template.id !== templateId)
      saveTemplates(updatedTemplates)

      toast({
        title: 'Template Deleted',
        description: 'Template has been deleted successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete template. Please try again.',
        variant: 'destructive'
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [templates, saveTemplates, toast])

  const duplicateTemplate = useCallback(async (templateId: string) => {
    setLoading(true)
    try {
      const originalTemplate = templates.find(t => t.id === templateId)
      if (!originalTemplate) {
        throw new Error('Template not found')
      }

      const duplicatedTemplate: AgreementTemplate = {
        ...originalTemplate,
        id: `template-${Date.now()}`,
        name: `${originalTemplate.name} (Copy)`,
        status: TemplateStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedTemplates = [...templates, duplicatedTemplate]
      saveTemplates(updatedTemplates)

      toast({
        title: 'Template Duplicated',
        description: `Template "${duplicatedTemplate.name}" has been created.`
      })

      return duplicatedTemplate
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate template. Please try again.',
        variant: 'destructive'
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [templates, saveTemplates, toast])

  const updateTemplateFields = useCallback(async (templateId: string, fields: TemplateField[]) => {
    return updateTemplate(templateId, { fields })
  }, [updateTemplate])

  const getTemplate = useCallback((templateId: string) => {
    return templates.find(template => template.id === templateId)
  }, [templates])

  const getTemplatesByCategory = useCallback((category: TemplateCategory) => {
    return templates.filter(template => template.category === category)
  }, [templates])

  const getActiveTemplates = useCallback(() => {
    return templates.filter(template => template.status === TemplateStatus.ACTIVE)
  }, [templates])

  return {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    updateTemplateFields,
    getTemplate,
    getTemplatesByCategory,
    getActiveTemplates
  }
}