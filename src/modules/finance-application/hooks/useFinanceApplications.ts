import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { FinanceApplication, ApplicationTemplate, ApplicationData, UploadedFile, ApplicationHistoryEntry } from '../types'
import { useToast } from '@/hooks/use-toast'
import { mockFinanceApplications } from '../mocks/financeApplicationMock'

export function useFinanceApplications() {
  const [applications, setApplications] = useState<FinanceApplication[]>([])
  const [templates, setTemplates] = useState<ApplicationTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const { toast } = useToast()

  // Load data from Supabase on mount
  useEffect(() => {
    console.log('[Finance Applications] Starting data load from Supabase...')
    loadApplications()
    loadTemplates()
  }, [])

  const loadApplications = async () => {
    console.log('[Finance Applications] Fetching applications from Supabase...')
    try {
      const { data, error } = await supabase
        .from('finance_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('[Finance Applications] Supabase error:', error)
        throw error
      }

      if (!data) {
        console.warn('[Finance Applications] Supabase returned null data')
        throw new Error('No data returned from Supabase')
      }

      console.log('[Finance Applications] Supabase fetch successful:', data.length, 'applications')
      // Transform Supabase data to application format
      const transformedApplications: FinanceApplication[] = (data || []).map(row => ({
        id: row.id,
        customerId: row.customer_id,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        templateId: row.template_id,
        status: row.status,
        data: row.data || {},
        uploadedFiles: row.uploaded_files || [],
        history: row.history || [],
        fraudCheckStatus: row.fraud_check_status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        submittedAt: row.submitted_at,
        reviewedAt: row.reviewed_at,
        reviewedBy: row.reviewed_by,
        notes: row.notes,
        adminNotes: row.admin_notes
      }))

      setApplications(transformedApplications)
      setUsingFallback(false)
    } catch (error) {
      console.error('[Finance Applications] Supabase fetch failed, activating fallback:', error)
      console.log('[Finance Applications] Using mock data fallback')
      
      // Use mock data as fallback
      setApplications(mockFinanceApplications.sampleApplications)
      setUsingFallback(true)
      
      toast({
        title: 'Using Demo Data',
        description: 'Connected to demo data. Live data will be available when Supabase is configured.',
      })
    } finally {
      setLoading(false)
    }
  }

  const loadTemplates = async () => {
    console.log('[Finance Applications] Fetching templates from Supabase...')
    try {
      const { data, error } = await supabase
        .from('application_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('[Finance Applications] Templates Supabase error:', error)
        throw error
      }

      if (!data) {
        console.warn('[Finance Applications] Templates Supabase returned null data')
        throw new Error('No template data returned from Supabase')
      }

      console.log('[Finance Applications] Templates Supabase fetch successful:', data.length, 'templates')

      // Transform Supabase data to template format
      const transformedTemplates: ApplicationTemplate[] = (data || []).map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        sections: row.sections || [],
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))

      setTemplates(transformedTemplates)
    } catch (error) {
      console.error('[Finance Applications] Templates Supabase fetch failed, activating fallback:', error)
      console.log('[Finance Applications] Using mock templates fallback')
      
      // Use mock data as fallback
      setTemplates(mockFinanceApplications.defaultTemplates)
      
      toast({
        title: 'Using Demo Templates',
        description: 'Connected to demo templates. Live data will be available when Supabase is configured.',
      })
    }
  }

  const createApplication = async (data: Partial<FinanceApplication>): Promise<FinanceApplication> => {
    console.log('[Finance Applications] Create operation disabled in read-only mode')
    toast({
      title: 'Read-Only Mode',
      description: 'Creating applications is disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    throw new Error('Create operations disabled in read-only mode')
  }

  const createApplicationLocal = async (data: Partial<FinanceApplication>): Promise<FinanceApplication> => {
    try {
      const applicationData = {
        customer_id: data.customerId || '',
        customer_name: data.customerName || '',
        customer_email: data.customerEmail || '',
        customer_phone: data.customerPhone || '',
        template_id: data.templateId || null,
        status: data.status || 'draft',
        data: data.data || {},
        uploaded_files: data.uploadedFiles || [],
        history: [{
          id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          action: 'Application Created',
          userId: 'current-user',
          userName: 'Current User',
          details: `Application created with status: ${data.status || 'draft'}`
        }],
        fraud_check_status: 'pending',
        notes: data.notes || ''
      }

      // Create local mock application for demo purposes
      const mockId = `app-${Date.now()}`
      const insertedData = {
        id: mockId,
        ...applicationData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const newApplication: FinanceApplication = {
        id: insertedData.id,
        customerId: insertedData.customer_id,
        customerName: insertedData.customer_name,
        customerEmail: insertedData.customer_email,
        customerPhone: insertedData.customer_phone,
        templateId: insertedData.template_id,
        status: insertedData.status,
        data: insertedData.data || {},
        uploadedFiles: insertedData.uploaded_files || [],
        history: insertedData.history || [],
        fraudCheckStatus: insertedData.fraud_check_status,
        createdAt: insertedData.created_at,
        updatedAt: insertedData.updated_at,
        submittedAt: insertedData.submitted_at,
        reviewedAt: insertedData.reviewed_at,
        reviewedBy: insertedData.reviewed_by,
        notes: insertedData.notes,
        adminNotes: insertedData.admin_notes
      }

      setApplications(prev => [newApplication, ...prev])
      return newApplication
    } catch (error) {
      console.error('Error creating application:', error)
      toast({
        title: 'Error',
        description: 'Failed to create finance application',
        variant: 'destructive'
      })
      throw error
    }
  }

  const updateApplication = async (id: string, updates: Partial<FinanceApplication>) => {
    console.log('[Finance Applications] Update operation disabled in read-only mode')
    toast({
      title: 'Read-Only Mode',
      description: 'Updating applications is disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    return
  }

  const updateApplicationLocal = async (id: string, updates: Partial<FinanceApplication>) => {
    try {
      // Get current application for history tracking
      const currentApp = applications.find(app => app.id === id)
      if (!currentApp) throw new Error('Application not found')

      // Create history entries for changes
      const newHistoryEntries = createHistoryEntries(currentApp, updates)
      const updatedHistory = [...currentApp.history, ...newHistoryEntries]

      const updateData = {
        customer_id: updates.customerId,
        customer_name: updates.customerName,
        customer_email: updates.customerEmail,
        customer_phone: updates.customerPhone,
        template_id: updates.templateId,
        status: updates.status,
        data: updates.data,
        uploaded_files: updates.uploadedFiles,
        history: updatedHistory,
        fraud_check_status: updates.fraudCheckStatus,
        notes: updates.notes,
        admin_notes: updates.adminNotes,
        submitted_at: updates.status === 'submitted' && !currentApp.submittedAt 
          ? new Date().toISOString() 
          : updates.submittedAt || currentApp.submittedAt,
        reviewed_at: updates.reviewedAt,
        reviewed_by: updates.reviewedBy
      }

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData]
        }
      })

      // Update local state for demo purposes
      const data = {
        id,
        ...updateData,
        updated_at: new Date().toISOString()
      }

      // Transform and update local state
      const updatedApplication: FinanceApplication = {
        id: data.id,
        customerId: data.customer_id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        templateId: data.template_id,
        status: data.status,
        data: data.data || {},
        uploadedFiles: data.uploaded_files || [],
        history: data.history || [],
        fraudCheckStatus: data.fraud_check_status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        submittedAt: data.submitted_at,
        reviewedAt: data.reviewed_at,
        reviewedBy: data.reviewed_by,
        notes: data.notes,
        adminNotes: data.admin_notes
      }

      setApplications(prev => prev.map(app => 
        app.id === id ? updatedApplication : app
      ))
    } catch (error) {
      console.error('Error updating application:', error)
      toast({
        title: 'Error',
        description: 'Failed to update finance application',
        variant: 'destructive'
      })
      throw error
    }
  }

  const deleteApplication = async (id: string) => {
    console.log('[Finance Applications] Delete operation disabled in read-only mode')
    toast({
      title: 'Read-Only Mode',
      description: 'Deleting applications is disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    return
  }

  const deleteApplicationLocal = async (id: string) => {
    try {

      setApplications(prev => prev.filter(app => app.id !== id))
    } catch (error) {
      console.error('Error deleting application:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete finance application',
        variant: 'destructive'
      })
      throw error
    }
  }

  const getApplicationById = (id: string): FinanceApplication | undefined => {
    return applications.find(app => app.id === id)
  }

  const getApplicationsByCustomer = (customerId: string): FinanceApplication[] => {
    return applications.filter(app => app.customerId === customerId)
  }

  const createTemplate = async (data: Partial<ApplicationTemplate>): Promise<ApplicationTemplate> => {
    console.log('[Finance Applications] Create template operation disabled in read-only mode')
    toast({
      title: 'Read-Only Mode',
      description: 'Creating templates is disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    throw new Error('Create operations disabled in read-only mode')
  }

  const createTemplateLocal = async (data: Partial<ApplicationTemplate>): Promise<ApplicationTemplate> => {
    try {
      const templateData = {
        name: data.name || 'New Template',
        description: data.description || '',
        sections: data.sections || [],
        is_active: data.isActive !== undefined ? data.isActive : true
      }

      // Create local mock template for demo purposes
      const mockId = `template-${Date.now()}`
      const insertedData = {
        id: mockId,
        ...templateData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const newTemplate: ApplicationTemplate = {
        id: insertedData.id,
        name: insertedData.name,
        description: insertedData.description,
        sections: insertedData.sections || [],
        isActive: insertedData.is_active,
        createdAt: insertedData.created_at,
        updatedAt: insertedData.updated_at
      }

      setTemplates(prev => [newTemplate, ...prev])
      return newTemplate
    } catch (error) {
      console.error('Error creating template:', error)
      toast({
        title: 'Error',
        description: 'Failed to create application template',
        variant: 'destructive'
      })
      throw error
    }
  }

  const updateTemplate = async (id: string, updates: Partial<ApplicationTemplate>) => {
    console.log('[Finance Applications] Update template operation disabled in read-only mode')
    toast({
      title: 'Read-Only Mode',
      description: 'Updating templates is disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    return
  }

  const updateTemplateLocal = async (id: string, updates: Partial<ApplicationTemplate>) => {
    try {
      const updateData = {
        name: updates.name,
        description: updates.description,
        sections: updates.sections,
        is_active: updates.isActive
      }

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData]
        }
      })

      // Update local state for demo purposes
      const data = {
        id,
        ...updateData,
        updated_at: new Date().toISOString()
      }

      const updatedTemplate: ApplicationTemplate = {
        id: data.id,
        name: data.name,
        description: data.description,
        sections: data.sections || [],
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }

      setTemplates(prev => prev.map(template => 
        template.id === id ? updatedTemplate : template
      ))
    } catch (error) {
      console.error('Error updating template:', error)
      toast({
        title: 'Error',
        description: 'Failed to update application template',
        variant: 'destructive'
      })
      throw error
    }
  }

  const deleteTemplate = async (id: string) => {
    console.log('[Finance Applications] Delete template operation disabled in read-only mode')
    toast({
      title: 'Read-Only Mode',
      description: 'Deleting templates is disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    return
  }

  const deleteTemplateLocal = async (id: string) => {
    try {

      setTemplates(prev => prev.filter(template => template.id !== id))
    } catch (error) {
      console.error('Error deleting template:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete application template',
        variant: 'destructive'
      })
      throw error
    }
  }

  const getTemplateById = (id: string): ApplicationTemplate | undefined => {
    return templates.find(template => template.id === id)
  }

  const uploadFile = async (applicationId: string, fieldId: string, file: File): Promise<UploadedFile> => {
    console.log('[Finance Applications] File upload operation disabled in read-only mode')
    toast({
      title: 'Read-Only Mode',
      description: 'File uploads are disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    throw new Error('Upload operations disabled in read-only mode')
  }

  const uploadFileLocal = async (applicationId: string, fieldId: string, file: File): Promise<UploadedFile> => {
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${applicationId}/${fieldId}/${Date.now()}.${fileExt}`
      
      // Mock file upload for demo purposes
      const publicUrl = `/mock/uploads/${fileName}`

      const uploadedFile: UploadedFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fieldId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: publicUrl,
        uploadedAt: new Date().toISOString()
      }

      // Update application with new file
      const application = getApplicationById(applicationId)
      if (application) {
        const updatedFiles = [...application.uploadedFiles, uploadedFile]
        await updateApplicationLocal(applicationId, { uploadedFiles: updatedFiles })
      }

      return uploadedFile
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive'
      })
      throw error
    }
  }

  const removeFile = async (applicationId: string, fileId: string) => {
    console.log('[Finance Applications] File removal operation disabled in read-only mode')
    toast({
      title: 'Read-Only Mode',
      description: 'File removal is disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    return
  }

  const removeFileLocal = async (applicationId: string, fileId: string) => {
    try {
      const application = getApplicationById(applicationId)
      if (application) {
        const fileToRemove = application.uploadedFiles.find(file => file.id === fileId)
        
        // Remove from Supabase Storage if it exists
        if (fileToRemove && fileToRemove.url.includes('supabase')) {
          const fileName = fileToRemove.url.split('/').pop()
          if (fileName) {
            // Mock file removal for demo purposes
            console.log('Mock file removal:', fileName)
          }
        }

        const updatedFiles = application.uploadedFiles.filter(file => file.id !== fileId)
        await updateApplicationLocal(applicationId, { uploadedFiles: updatedFiles })
      }
    } catch (error) {
      console.error('Error removing file:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove file',
        variant: 'destructive'
      })
      throw error
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
    loading,
    usingFallback,
    createApplication: createApplicationLocal,
    updateApplication: updateApplicationLocal,
    deleteApplication: deleteApplicationLocal,
    getApplicationById,
    getApplicationsByCustomer,
    createTemplate: createTemplateLocal,
    updateTemplate: updateTemplateLocal,
    deleteTemplate: deleteTemplateLocal,
    getTemplateById,
    uploadFile: uploadFileLocal,
    removeFile: removeFileLocal,
    loadApplications,
    loadTemplates
  }
}