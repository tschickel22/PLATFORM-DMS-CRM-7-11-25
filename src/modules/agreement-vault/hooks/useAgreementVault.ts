import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/hooks/use-toast'

export interface Agreement {
  id: string
  customer_id: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  vehicle_id?: string
  vehicle_info?: string
  quote_id?: string
  title: string
  type: string
  status: string
  pdf_url?: string
  signed_at?: string
  signed_by?: string
  ip_address?: string
  signature_data?: string
  documents?: any[]
  terms?: string
  effective_date?: string
  expiration_date?: string
  notes?: string
  created_by?: string
  total_amount?: number
  down_payment?: number
  financing_amount?: number
  monthly_payment?: number
  security_deposit?: number
  annual_fee?: number
  coverage_level?: string
  created_at: string
  updated_at: string
}

export interface AgreementTemplate {
  id: string
  name: string
  description?: string
  pdf_base64?: string
  fields?: any[]
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
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Load data from Supabase on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      await Promise.all([
        loadAgreements(),
        loadTemplates(),
        loadSignatures()
      ])
    } catch (err) {
      console.error('Error loading agreement vault data:', err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadAgreements = async () => {
    try {
      const { data, error } = await supabase
        .from('agreements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading agreements:', error)
        return
      }

      setAgreements(data || [])
    } catch (error) {
      console.error('Error loading agreements:', error)
    }
  }

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('agreement_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading templates:', error)
        return
      }

      setTemplates(data || [])
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  }

  const loadSignatures = async () => {
    try {
      const { data, error } = await supabase
        .from('agreement_signatures')
        .select('*')
        .order('signed_at', { ascending: false })

      if (error) {
        console.error('Error loading signatures:', error)
        return
      }

      setSignatures(data || [])
    } catch (error) {
      console.error('Error loading signatures:', error)
    }
  }

  const createAgreement = async (agreementData: Partial<Agreement>): Promise<Agreement | null> => {
    try {
      const { data, error } = await supabase
        .from('agreements')
        .insert([{
          customer_id: agreementData.customer_id || '',
          customer_name: agreementData.customer_name || '',
          customer_email: agreementData.customer_email || '',
          customer_phone: agreementData.customer_phone || '',
          vehicle_id: agreementData.vehicle_id || '',
          vehicle_info: agreementData.vehicle_info || '',
          quote_id: agreementData.quote_id || '',
          title: agreementData.title || 'New Agreement',
          type: agreementData.type || 'PURCHASE',
          status: agreementData.status || 'draft',
          terms: agreementData.terms || '',
          effective_date: agreementData.effective_date || '',
          expiration_date: agreementData.expiration_date || '',
          notes: agreementData.notes || '',
          created_by: agreementData.created_by || '',
          total_amount: agreementData.total_amount || 0,
          down_payment: agreementData.down_payment || 0,
          financing_amount: agreementData.financing_amount || 0,
          monthly_payment: agreementData.monthly_payment || 0,
          security_deposit: agreementData.security_deposit || 0,
          annual_fee: agreementData.annual_fee || 0,
          coverage_level: agreementData.coverage_level || '',
          documents: agreementData.documents || []
        }])
        .select()
        .single()

      if (error) throw error

      const newAgreement = data as Agreement
      setAgreements(prev => [newAgreement, ...prev])
      
      toast({
        title: 'Agreement Created',
        description: 'New agreement has been created successfully'
      })
      
      return newAgreement
    } catch (error) {
      console.error('Error creating agreement:', error)
      toast({
        title: 'Error',
        description: 'Failed to create agreement',
        variant: 'destructive'
      })
      return null
    }
  }

  const updateAgreement = async (id: string, updates: Partial<Agreement>) => {
    try {
      const { data, error } = await supabase
        .from('agreements')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const updatedAgreement = data as Agreement
      setAgreements(prev => prev.map(agreement => 
        agreement.id === id ? updatedAgreement : agreement
      ))
      
      toast({
        title: 'Agreement Updated',
        description: 'Agreement has been updated successfully'
      })
    } catch (error) {
      console.error('Error updating agreement:', error)
      toast({
        title: 'Error',
        description: 'Failed to update agreement',
        variant: 'destructive'
      })
    }
  }

  const deleteAgreement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agreements')
        .delete()
        .eq('id', id)

      if (error) throw error

      setAgreements(prev => prev.filter(agreement => agreement.id !== id))
      
      toast({
        title: 'Agreement Deleted',
        description: 'Agreement has been deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting agreement:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete agreement',
        variant: 'destructive'
      })
    }
  }

  const createTemplate = async (templateData: Partial<AgreementTemplate>): Promise<AgreementTemplate | null> => {
    try {
      const { data, error } = await supabase
        .from('agreement_templates')
        .insert([{
          name: templateData.name || 'New Template',
          description: templateData.description || '',
          pdf_base64: templateData.pdf_base64 || '',
          fields: templateData.fields || [],
          is_active: templateData.is_active !== undefined ? templateData.is_active : true
        }])
        .select()
        .single()

      if (error) throw error

      const newTemplate = data as AgreementTemplate
      setTemplates(prev => [newTemplate, ...prev])
      
      toast({
        title: 'Template Created',
        description: 'New template has been created successfully'
      })
      
      return newTemplate
    } catch (error) {
      console.error('Error creating template:', error)
      toast({
        title: 'Error',
        description: 'Failed to create template',
        variant: 'destructive'
      })
      return null
    }
  }

  const updateTemplate = async (id: string, updates: Partial<AgreementTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('agreement_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const updatedTemplate = data as AgreementTemplate
      setTemplates(prev => prev.map(template => 
        template.id === id ? updatedTemplate : template
      ))
      
      toast({
        title: 'Template Updated',
        description: 'Template has been updated successfully'
      })
    } catch (error) {
      console.error('Error updating template:', error)
      toast({
        title: 'Error',
        description: 'Failed to update template',
        variant: 'destructive'
      })
    }
  }

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agreement_templates')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTemplates(prev => prev.filter(template => template.id !== id))
      
      toast({
        title: 'Template Deleted',
        description: 'Template has been deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting template:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive'
      })
    }
  }

  const createSignature = async (signatureData: Partial<AgreementSignature>): Promise<AgreementSignature | null> => {
    try {
      const { data, error } = await supabase
        .from('agreement_signatures')
        .insert([{
          agreement_id: signatureData.agreement_id || '',
          signer_email: signatureData.signer_email || '',
          signer_name: signatureData.signer_name || '',
          status: signatureData.status || 'pending'
        }])
        .select()
        .single()

      if (error) throw error

      const newSignature = data as AgreementSignature
      setSignatures(prev => [newSignature, ...prev])
      
      return newSignature
    } catch (error) {
      console.error('Error creating signature:', error)
      toast({
        title: 'Error',
        description: 'Failed to create signature request',
        variant: 'destructive'
      })
      return null
    }
  }

  const updateSignature = async (id: string, updates: Partial<AgreementSignature>) => {
    try {
      const { data, error } = await supabase
        .from('agreement_signatures')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const updatedSignature = data as AgreementSignature
      setSignatures(prev => prev.map(signature => 
        signature.id === id ? updatedSignature : signature
      ))
    } catch (error) {
      console.error('Error updating signature:', error)
      toast({
        title: 'Error',
        description: 'Failed to update signature',
        variant: 'destructive'
      })
    }
  }

  // Calculate stats from real data
  const stats = {
    totalAgreements: agreements.length,
    pendingSignatures: signatures.filter(sig => sig.status === 'pending').length,
    signedThisMonth: signatures.filter(sig => {
      if (!sig.signed_at) return false
      const signedDate = new Date(sig.signed_at)
      const now = new Date()
      return signedDate.getMonth() === now.getMonth() && 
             signedDate.getFullYear() === now.getFullYear()
    }).length,
    activeTemplates: templates.filter(template => template.is_active).length
  }

  return {
    agreements,
    templates,
    signatures,
    loading,
    error,
    stats,
    createAgreement,
    updateAgreement,
    deleteAgreement,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createSignature,
    updateSignature,
    loadData
  }
}