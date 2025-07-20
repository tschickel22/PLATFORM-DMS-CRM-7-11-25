import { useState, useEffect } from 'react'
import { FinanceApplication, ApplicationTemplate, ApplicationData, UploadedFile, ApplicationHistoryEntry } from '../types'
import { mockFinanceApplications } from '../mocks/financeApplicationMock'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export function useFinanceApplications() {
  const [applications, setApplications] = useState<FinanceApplication[]>([])
  const [templates, setTemplates] = useState<ApplicationTemplate[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    // Always load fresh mock data for testing purposes
    // This ensures the latest mock applications with all statuses are always available
    setApplications(mockFinanceApplications.sampleApplications)
    setTemplates(mockFinanceApplications.defaultTemplates)
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
      history: [{
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        action: 'Application Created',
        userId: 'current-user', // In real app, get from auth context
        userName: 'Current User', // In real app, get from auth context
        details: `Application created with status: ${data.status || 'draft'}`
      }],
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
              : app.submittedAt,
            history: [
              ...app.history,
              ...createHistoryEntries(app, updates)
            ]
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

  const createHistoryEntries = (oldApp: FinanceApplication, updates: Partial<FinanceApplication>): ApplicationHistoryEntry[] => {
    const entries: ApplicationHistoryEntry[] = []
    const timestamp = new Date().toISOString()
    const userId = 'current-user' // In real app, get from auth context
    const userName = 'Current User' // In real app, get from auth context

    // Track status changes
    if (updates.status && updates.status !== oldApp.status) {
      entries.push({
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp,
        action: 'Status Changed',
        userId,
        userName,
        details: `Status changed from ${oldApp.status} to ${updates.status}`,
        oldValue: oldApp.status,
        newValue: updates.status
      })
    }

    // Track admin notes changes
    if (updates.adminNotes !== undefined && updates.adminNotes !== oldApp.adminNotes) {
      entries.push({
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp,
        action: 'Admin Notes Updated',
        userId,
        userName,
        details: updates.adminNotes ? 'Admin notes added/updated' : 'Admin notes cleared',
        oldValue: oldApp.adminNotes || '',
        newValue: updates.adminNotes || ''
      })
    }

    // Track submission
    if (updates.status === 'submitted' && !oldApp.submittedAt) {
      entries.push({
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp,
        action: 'Application Submitted',
        userId,
        userName,
        details: 'Application submitted for review'
      })
    }

    // Track file uploads/removals
    if (updates.uploadedFiles) {
      const oldFileCount = oldApp.uploadedFiles.length
      const newFileCount = updates.uploadedFiles.length
      
      if (newFileCount > oldFileCount) {
        entries.push({
          id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp,
          action: 'Document Uploaded',
          userId,
          userName,
          details: `${newFileCount - oldFileCount} document(s) uploaded`
        })
      } else if (newFileCount < oldFileCount) {
        entries.push({
          id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp,
          action: 'Document Removed',
          userId,
          userName,
          details: `${oldFileCount - newFileCount} document(s) removed`
        })
      }
    }

    return entries
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