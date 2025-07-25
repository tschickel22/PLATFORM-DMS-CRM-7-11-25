import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/hooks/use-toast'

export interface Agreement {
  id: string
  customer_id: string
  title: string
  type: string
  status: string
  pdf_url?: string
  signed_at?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface AgreementTemplate {
  id: string
  name: string
  description?: string
  fields?: any
  created_at?: string
}

export interface AgreementSignature {
  id: string
  agreement_id: string
  signer_name: string
  signer_email: string
  signed_at?: string
  signature_url?: string
}

export function useAgreementVault() {
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [templates, setTemplates] = useState<AgreementTemplate[]>([])
  const [signatures, setSignatures] = useState<AgreementSignature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Load all data on mount
  useEffect(() => {
    loadAgreements()
    loadTemplates()
    loadSignatures()
  }, [])

  const loadAgreements = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('agreements')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      setAgreements(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load agreements'
      setError(errorMessage)
      console.error('Error loading agreements:', err)
      
      toast({
        title: 'Error',
        description: 'Failed to load agreements. Please try again.',
        variant: 'destructive'
      })
      
      // Set safe default
      setAgreements([])
    } finally {
      setLoading(false)
    }
  }

  const loadTemplates = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('agreement_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      setTemplates(data || [])
    } catch (err) {
      console.error('Error loading templates:', err)
      setTemplates([])
    }
  }

  const loadSignatures = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('agreement_signatures')
        .select('*')
        .order('signed_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      setSignatures(data || [])
    } catch (err) {
      console.error('Error loading signatures:', err)
      setSignatures([])
    }
  }

  const getAgreements = async (): Promise<Agreement[]> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('agreements')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      return data || []
    } catch (err) {
      console.error('Error getting agreements:', err)
      toast({
        title: 'Error',
        description: 'Failed to fetch agreements',
        variant: 'destructive'
      })
      return []
    }
  }

  const getAgreementById = async (id: string): Promise<Agreement | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('agreements')
        .select('*')
        .eq('id', id)
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      return data
    } catch (err) {
      console.error('Error getting agreement by ID:', err)
      toast({
        title: 'Error',
        description: 'Failed to fetch agreement details',
        variant: 'destructive'
      })
      return null
    }
  }

  const createAgreement = async (agreementData: Partial<Agreement>): Promise<Agreement | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('agreements')
        .insert([{
          title: agreementData.title || 'New Agreement',
          customer_id: agreementData.customer_id || '',
          type: agreementData.type || 'purchase',
          status: agreementData.status || 'draft',
          pdf_url: agreementData.pdf_url || null,
          notes: agreementData.notes || ''
        }])
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      // Update local state
      setAgreements(prev => [data, ...prev])
      
      toast({
        title: 'Success',
        description: 'Agreement created successfully'
      })

      return data
    } catch (err) {
      console.error('Error creating agreement:', err)
      toast({
        title: 'Error',
        description: 'Failed to create agreement',
        variant: 'destructive'
      })
      return null
    }
  }

  const updateAgreement = async (id: string, updates: Partial<Agreement>): Promise<Agreement | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('agreements')
        .update({
          title: updates.title,
          customer_id: updates.customer_id,
          type: updates.type,
          status: updates.status,
          pdf_url: updates.pdf_url,
          signed_at: updates.signed_at,
          notes: updates.notes
        })
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      // Update local state
      setAgreements(prev => prev.map(agreement => 
        agreement.id === id ? data : agreement
      ))
      
      toast({
        title: 'Success',
        description: 'Agreement updated successfully'
      })

      return data
    } catch (err) {
      console.error('Error updating agreement:', err)
      toast({
        title: 'Error',
        description: 'Failed to update agreement',
        variant: 'destructive'
      })
      return null
    }
  }

  const deleteAgreement = async (id: string): Promise<boolean> => {
    try {
      const { error: supabaseError } = await supabase
        .from('agreements')
        .delete()
        .eq('id', id)

      if (supabaseError) {
        throw supabaseError
      }

      // Update local state
      setAgreements(prev => prev.filter(agreement => agreement.id !== id))
      
      toast({
        title: 'Success',
        description: 'Agreement deleted successfully'
      })

      return true
    } catch (err) {
      console.error('Error deleting agreement:', err)
      toast({
        title: 'Error',
        description: 'Failed to delete agreement',
        variant: 'destructive'
      })
      return false
    }
  }

  const getTemplates = async (): Promise<AgreementTemplate[]> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('agreement_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      return data || []
    } catch (err) {
      console.error('Error getting templates:', err)
      return []
    }
  }

  const createTemplate = async (templateData: Partial<AgreementTemplate>): Promise<AgreementTemplate | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('agreement_templates')
        .insert([{
          name: templateData.name || 'New Template',
          description: templateData.description || '',
          fields: templateData.fields || []
        }])
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      setTemplates(prev => [data, ...prev])
      
      toast({
        title: 'Success',
        description: 'Template created successfully'
      })

      return data
    } catch (err) {
      console.error('Error creating template:', err)
      toast({
        title: 'Error',
        description: 'Failed to create template',
        variant: 'destructive'
      })
      return null
    }
  }

  const getSignaturesByAgreement = async (agreementId: string): Promise<AgreementSignature[]> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('agreement_signatures')
        .select('*')
        .eq('agreement_id', agreementId)
        .order('signed_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      return data || []
    } catch (err) {
      console.error('Error getting signatures:', err)
      return []
    }
  }

  const createSignature = async (signatureData: Partial<AgreementSignature>): Promise<AgreementSignature | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('agreement_signatures')
        .insert([{
          agreement_id: signatureData.agreement_id || '',
          signer_name: signatureData.signer_name || '',
          signer_email: signatureData.signer_email || '',
          signed_at: signatureData.signed_at || new Date().toISOString(),
          signature_url: signatureData.signature_url || null
        }])
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      setSignatures(prev => [data, ...prev])
      
      toast({
        title: 'Success',
        description: 'Signature recorded successfully'
      })

      return data
    } catch (err) {
      console.error('Error creating signature:', err)
      toast({
        title: 'Error',
        description: 'Failed to record signature',
        variant: 'destructive'
      })
      return null
    }
  }

  return {
    // State
    agreements,
    templates,
    signatures,
    loading,
    error,
    
    // Agreement operations
    getAgreements,
    getAgreementById,
    createAgreement,
    updateAgreement,
    deleteAgreement,
    
    // Template operations
    getTemplates,
    createTemplate,
    
    // Signature operations
    getSignaturesByAgreement,
    createSignature,
    
    // Utility
    refetch: () => {
      loadAgreements()
      loadTemplates()
      loadSignatures()
    }
  }
}