import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/hooks/use-toast'
import { mockAgreements } from '@/mocks/agreementsMock'
import { mockTemplates } from '@/mocks/templateMocks'

export interface Agreement {
  id: string
  title: string
  status: string
  created_at: string
  updated_at: string
}

export interface AgreementTemplate {
  id: string
  name: string
  description: string
  pdf_base64?: string
  fields?: any
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AgreementSignature {
  id: string
  agreement_id: string
  signer_email: string
  signer_name?: string
  status: string
  signed_at?: string
  created_at: string
  updated_at: string
}

export function useAgreementVault() {
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [templates, setTemplates] = useState<AgreementTemplate[]>([])
  const [signatures, setSignatures] = useState<AgreementSignature[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const { toast } = useToast()

  // Load data from Supabase on mount
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    console.log('[Agreement Vault] Starting Supabase data load...')
    setLoading(true)
    
    try {
      await Promise.all([
        loadAgreements(),
        loadTemplates(), 
        loadSignatures()
      ])
      console.log('[Agreement Vault] ✅ All Supabase data loaded successfully')
    } catch (error) {
      console.error('[Agreement Vault] ❌ Failed to load data:', error)
      activateFallbackMode()
    } finally {
      setLoading(false)
    }
  }

  const loadAgreements = async () => {
    try {
      console.log('[Agreement Vault] Fetching agreements from Supabase...')
      const { data, error } = await supabase
        .from('agreements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      console.log(`[Agreement Vault] ✅ Loaded ${data?.length || 0} agreements from Supabase`)
      setAgreements(data || [])
      setUsingFallback(false)
    } catch (error) {
      console.warn('[Agreement Vault] ⚠️ Agreements fetch failed, using fallback:', error)
      setAgreements(mockAgreements.sampleAgreements.map(agreement => ({
        id: agreement.id,
        title: `${agreement.type} Agreement - ${agreement.customerName}`,
        status: agreement.status,
        created_at: agreement.createdAt,
        updated_at: agreement.updatedAt
      })))
      setUsingFallback(true)
      throw error
    }
  }

  const loadTemplates = async () => {
    try {
      console.log('[Agreement Vault] Fetching templates from Supabase...')
      const { data, error } = await supabase
        .from('agreement_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      console.log(`[Agreement Vault] ✅ Loaded ${data?.length || 0} templates from Supabase`)
      setTemplates(data || [])
    } catch (error) {
      console.warn('[Agreement Vault] ⚠️ Templates fetch failed, using fallback:', error)
      setTemplates(mockTemplates.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
        pdf_base64: template.pdfBase64,
        fields: template.fields,
        is_active: template.isActive,
        created_at: template.createdAt,
        updated_at: template.updatedAt
      })))
      throw error
    }
  }

  const loadSignatures = async () => {
    try {
      console.log('[Agreement Vault] Fetching signatures from Supabase...')
      const { data, error } = await supabase
        .from('agreement_signatures')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      console.log(`[Agreement Vault] ✅ Loaded ${data?.length || 0} signatures from Supabase`)
      setSignatures(data || [])
    } catch (error) {
      console.warn('[Agreement Vault] ⚠️ Signatures fetch failed, using fallback:', error)
      setSignatures([])
      throw error
    }
  }

  const activateFallbackMode = () => {
    console.log('[Agreement Vault] 🔄 Activating fallback mode with mock data')
    setUsingFallback(true)
    
    // Load mock data as fallback
    setAgreements(mockAgreements.sampleAgreements.map(agreement => ({
      id: agreement.id,
      title: `${agreement.type} Agreement - ${agreement.customerName}`,
      status: agreement.status,
      created_at: agreement.createdAt,
      updated_at: agreement.updatedAt
    })))
    
    setTemplates(mockTemplates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      pdf_base64: template.pdfBase64,
      fields: template.fields,
      is_active: template.isActive,
      created_at: template.createdAt,
      updated_at: template.updatedAt
    })))
    
    setSignatures([])
    
    toast({
      title: 'Using Offline Data',
      description: 'Connected to fallback data due to connection issues.',
      variant: 'default'
    })
  }

  const refresh = async () => {
    console.log('[Agreement Vault] 🔄 Manual refresh triggered')
    await loadAllData()
    
    if (!usingFallback) {
      toast({
        title: 'Data Refreshed',
        description: 'Agreement data has been updated from Supabase.'
      })
    }
  }

  // Disabled write operations for Phase 1
  const createAgreement = async (data: any) => {
    console.log('[Agreement Vault] ❌ Create operation disabled in Phase 1')
    toast({
      title: 'Feature Disabled',
      description: 'Create operations are disabled in Phase 1 (read-only mode).',
      variant: 'destructive'
    })
    return null
  }

  const updateAgreement = async (id: string, data: any) => {
    console.log('[Agreement Vault] ❌ Update operation disabled in Phase 1')
    toast({
      title: 'Feature Disabled',
      description: 'Update operations are disabled in Phase 1 (read-only mode).',
      variant: 'destructive'
    })
    return null
  }

  const deleteAgreement = async (id: string) => {
    console.log('[Agreement Vault] ❌ Delete operation disabled in Phase 1')
    toast({
      title: 'Feature Disabled',
      description: 'Delete operations are disabled in Phase 1 (read-only mode).',
      variant: 'destructive'
    })
    return false
  }

  const createTemplate = async (data: any) => {
    console.log('[Agreement Vault] ❌ Create template operation disabled in Phase 1')
    toast({
      title: 'Feature Disabled',
      description: 'Template creation is disabled in Phase 1 (read-only mode).',
      variant: 'destructive'
    })
    return null
  }

  const updateTemplate = async (id: string, data: any) => {
    console.log('[Agreement Vault] ❌ Update template operation disabled in Phase 1')
    toast({
      title: 'Feature Disabled',
      description: 'Template updates are disabled in Phase 1 (read-only mode).',
      variant: 'destructive'
    })
    return null
  }

  const deleteTemplate = async (id: string) => {
    console.log('[Agreement Vault] ❌ Delete template operation disabled in Phase 1')
    toast({
      title: 'Feature Disabled',
      description: 'Template deletion is disabled in Phase 1 (read-only mode).',
      variant: 'destructive'
    })
    return false
  }

  return {
    // Data
    agreements,
    templates,
    signatures,
    loading,
    usingFallback,
    
    // Read operations
    refresh,
    
    // Disabled write operations
    createAgreement,
    updateAgreement,
    deleteAgreement,
    createTemplate,
    updateTemplate,
    deleteTemplate
  }
}