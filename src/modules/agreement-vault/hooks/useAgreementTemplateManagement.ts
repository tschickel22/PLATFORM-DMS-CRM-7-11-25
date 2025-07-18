import { useState, useCallback } from 'react'
import { AgreementTemplate } from '@/types'
import { mockAgreementTemplates } from '@/mocks/agreementTemplatesMock'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

const STORAGE_KEY = 'agreement_templates'

export function useAgreementTemplateManagement() {
  const [templates, setTemplates] = useState<AgreementTemplate[]>(() => {
    const stored = loadFromLocalStorage(STORAGE_KEY, [])
    return stored.length > 0 ? stored : mockAgreementTemplates.sampleTemplates
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Save templates to localStorage whenever they change
  const saveTemplates = useCallback((newTemplates: AgreementTemplate[]) => {
    setTemplates(newTemplates)
    saveToLocalStorage(STORAGE_KEY, newTemplates)
  }, [])

  const createTemplate = useCallback(async (templateData: Partial<AgreementTemplate>): Promise<AgreementTemplate> => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newTemplate: AgreementTemplate = {
        id: `template-${Date.now()}`,
        name: templateData.name || '',
        description: templateData.description || '',
        type: templateData.type || 'PURCHASE',
        category: templateData.category || 'Custom',
        terms: templateData.terms || '',
        mergeFields: templateData.mergeFields || [],
        version: '1.0',
        isActive: true,
        usageCount: 0,
        tags: templateData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user@company.com' // In a real app, get from auth context
      }
      
      const updatedTemplates = [...templates, newTemplate]
      saveTemplates(updatedTemplates)
      
      return newTemplate
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create template'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [templates, saveTemplates])

  const updateTemplate = useCallback(async (id: string, templateData: Partial<AgreementTemplate>): Promise<AgreementTemplate> => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedTemplates = templates.map(template => 
        template.id === id 
          ? { 
              ...template, 
              ...templateData, 
              updatedAt: new Date().toISOString() 
            }
          : template
      )
      
      const updatedTemplate = updatedTemplates.find(t => t.id === id)
      if (!updatedTemplate) {
        throw new Error('Template not found')
      }
      
      saveTemplates(updatedTemplates)
      
      return updatedTemplate
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update template'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [templates, saveTemplates])

  const deleteTemplate = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const updatedTemplates = templates.filter(template => template.id !== id)
      saveTemplates(updatedTemplates)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete template'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [templates, saveTemplates])

  const duplicateTemplate = useCallback(async (id: string): Promise<AgreementTemplate> => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400))
      
      const originalTemplate = templates.find(t => t.id === id)
      if (!originalTemplate) {
        throw new Error('Template not found')
      }
      
      const duplicatedTemplate: AgreementTemplate = {
        ...originalTemplate,
        id: `template-${Date.now()}`,
        name: `${originalTemplate.name} (Copy)`,
        version: '1.0',
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user@company.com'
      }
      
      const updatedTemplates = [...templates, duplicatedTemplate]
      saveTemplates(updatedTemplates)
      
      return duplicatedTemplate
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate template'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [templates, saveTemplates])

  const toggleTemplateStatus = useCallback(async (id: string): Promise<AgreementTemplate> => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const updatedTemplates = templates.map(template => 
        template.id === id 
          ? { 
              ...template, 
              isActive: !template.isActive,
              updatedAt: new Date().toISOString() 
            }
          : template
      )
      
      const updatedTemplate = updatedTemplates.find(t => t.id === id)
      if (!updatedTemplate) {
        throw new Error('Template not found')
      }
      
      saveTemplates(updatedTemplates)
      
      return updatedTemplate
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle template status'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [templates, saveTemplates])

  const incrementUsageCount = useCallback(async (id: string): Promise<void> => {
    try {
      const updatedTemplates = templates.map(template => 
        template.id === id 
          ? { 
              ...template, 
              usageCount: (template.usageCount || 0) + 1,
              updatedAt: new Date().toISOString() 
            }
          : template
      )
      
      saveTemplates(updatedTemplates)
    } catch (err) {
      console.error('Failed to increment usage count:', err)
      // Don't throw error for usage count updates
    }
  }, [templates, saveTemplates])

  const getTemplateById = useCallback((id: string): AgreementTemplate | undefined => {
    return templates.find(template => template.id === id)
  }, [templates])

  const getActiveTemplates = useCallback((): AgreementTemplate[] => {
    return templates.filter(template => template.isActive)
  }, [templates])

  const getTemplatesByType = useCallback((type: string): AgreementTemplate[] => {
    return templates.filter(template => template.type === type && template.isActive)
  }, [templates])

  const getTemplatesByCategory = useCallback((category: string): AgreementTemplate[] => {
    return templates.filter(template => template.category === category)
  }, [templates])

  const searchTemplates = useCallback((query: string): AgreementTemplate[] => {
    const lowercaseQuery = query.toLowerCase()
    return templates.filter(template => 
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }, [templates])

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    toggleTemplateStatus,
    incrementUsageCount,
    getTemplateById,
    getActiveTemplates,
    getTemplatesByType,
    getTemplatesByCategory,
    searchTemplates
  }
}