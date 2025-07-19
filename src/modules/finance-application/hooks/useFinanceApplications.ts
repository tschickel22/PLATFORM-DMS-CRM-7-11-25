import { useState, useEffect } from 'react'
import { FinanceApplication, ApplicationTemplate, ApplicationData, UploadedFile } from '../types'
import { mockFinanceApplications } from '../mocks/financeApplicationMock'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export function useFinanceApplications() {
  const [applications, setApplications] = useState<FinanceApplication[]>([])
  const [templates, setTemplates] = useState<ApplicationTemplate[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedApplications = loadFromLocalStorage<FinanceApplication[]>('financeApplications', [])
    const savedTemplates = loadFromLocalStorage<ApplicationTemplate[]>('applicationTemplates', [])
    
    // Load mock applications if no saved applications exist
    if (savedApplications.length === 0) {
      setApplications(mockFinanceApplications.sampleApplications)
    } else {
      setApplications(savedApplications)
    }
    
    // Load mock templates if no saved templates exist
    if (savedTemplates.length === 0) {
      setTemplates(mockFinanceApplications.defaultTemplates)
    } else {
      setTemplates(savedTemplates)
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToLocalStorage('financeApplications', applications)
  }, [applications])

  useEffect(() => {
    saveToLocalStorage('applicationTemplates', templates)
  }, [templates])

  const createApplication = (data: Partial<FinanceApplication>): FinanceApplication => {
    const newApplication: FinanceApplication = {
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerId: data.customerId || '',
      customerName: data.customerName || '',
      customerEmail: data.customerEmail || '',
      customerPhone: data.customerPhone || '',
      templateId: data.templateId || templates[0]?.id || '',
      status: data.status || 'draft',
      data: data.data || {},
      uploadedFiles: data.uploadedFiles || [],
      fraudCheckStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: data.notes || ''
    }

    setApplications(prev => [newApplication, ...prev])
    return newApplication
  }

  const updateApplication = (id: string, updates: Partial<FinanceApplication>) => {
    setApplications(prev => prev.map(app => 
      app.id === id 
        ? { 
            ...app, 
            ...updates, 
            updatedAt: new Date().toISOString(),
            submittedAt: updates.status === 'submitted' && !app.submittedAt 
              ? new Date().toISOString() 
              : app.submittedAt
          }
        : app
    ))
  }

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id))
  }

  const getApplicationById = (id: string): FinanceApplication | undefined => {
    return applications.find(app => app.id === id)
  }

  const getApplicationsByCustomer = (customerId: string): FinanceApplication[] => {
    return applications.filter(app => app.customerId === customerId)
  }

  const createTemplate = (data: Partial<ApplicationTemplate>): ApplicationTemplate => {
    const newTemplate: ApplicationTemplate = {
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name || 'New Template',
      description: data.description || '',
      sections: data.sections || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setTemplates(prev => [newTemplate, ...prev])
    return newTemplate
  }

  const updateTemplate = (id: string, updates: Partial<ApplicationTemplate>) => {
    setTemplates(prev => prev.map(template => 
      template.id === id 
        ? { ...template, ...updates, updatedAt: new Date().toISOString() }
        : template
    ))
  }

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id))
  }

  const getTemplateById = (id: string): ApplicationTemplate | undefined => {
    return templates.find(template => template.id === id)
  }

  const uploadFile = (applicationId: string, fieldId: string, file: File): Promise<UploadedFile> => {
    return new Promise((resolve) => {
      // Mock file upload - in real app, this would upload to storage service
      const uploadedFile: UploadedFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fieldId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file), // Mock URL - in real app, this would be storage URL
        uploadedAt: new Date().toISOString()
      }

      // Add file to application
      updateApplication(applicationId, {
        uploadedFiles: [
          ...(getApplicationById(applicationId)?.uploadedFiles || []),
          uploadedFile
        ]
      })

      resolve(uploadedFile)
    })
  }

  const removeFile = (applicationId: string, fileId: string) => {
    const application = getApplicationById(applicationId)
    if (application) {
      const updatedFiles = application.uploadedFiles.filter(file => file.id !== fileId)
      updateApplication(applicationId, { uploadedFiles: updatedFiles })
    }
  }

  return {
    applications,
    templates,
    createApplication,
    updateApplication,
    deleteApplication,
    getApplicationById,
    getApplicationsByCustomer,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplateById,
    uploadFile,
    removeFile
  }
}