import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { mockCommissionEngine } from '@/mocks/commissionEngineMock'
import { uuidRegex } from '@/utils/useValidatedCompanyId'

interface Commission {
  id: string
  repId: string
  amount: number
  period: string
  ruleId: string
  saleAmount: number
  source?: 'supabase' | 'fallback' // Tag for debugging
  company_id?: string
  created_at?: string
  updated_at?: string
}

export function useCommissionsSupabase() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [connectionAttempted, setConnectionAttempted] = useState(false)
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean
    error?: string
    count: number
  }>({ connected: false, error: undefined, count: 0 })

  const fetchCommissions = async () => {
    console.log('🔄 [Commissions] Starting data load from Supabase...')
    console.log('📊 [Commissions] Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'NOT_SET')
    console.log('🔑 [Commissions] Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET')
    
    setLoading(true)
    setError(null)
    setConnectionAttempted(true)

    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('⚠️ [Commissions] Supabase not configured, using fallback')
      setCommissions(mockCommissionEngine.sampleCommissions.map(c => ({ ...c, source: 'fallback' })))
      setUsingFallback(true)
      setSupabaseStatus({ 
        connected: false, 
        error: 'Supabase not configured', 
        count: mockCommissionEngine.sampleCommissions.length 
      })
      setLoading(false)
      return
    }

    // Validate company_id
    const rawCompanyId = user?.tenantId // Assuming tenantId is the company_id
    const isValidCompanyId = typeof rawCompanyId === 'string' && uuidRegex.test(rawCompanyId)
    const companyId = isValidCompanyId ? rawCompanyId : null

    if (!companyId) {
      console.warn('⚠️ [Commissions] Invalid or missing company_id. Using fallback data.')
      setCommissions(mockCommissionEngine.sampleCommissions.map(c => ({ ...c, source: 'fallback' })))
      setUsingFallback(true)
      setSupabaseStatus({ 
        connected: false, 
        error: 'Invalid company ID', 
        count: mockCommissionEngine.sampleCommissions.length 
      })
      setLoading(false)
      return
    }

    try {
      console.log('⏳ [Commissions] Executing Supabase query for commissions...')
      const { data, error: supabaseError } = await supabase
        .from('commissions')
        .select('*')
        .eq('company_id', companyId) // Filter by company_id
        .order('created_at', { ascending: false })

      console.log('📊 [Commissions] Supabase response:', { 
        error: supabaseError?.message || null, 
        dataType: typeof data, 
        dataLength: Array.isArray(data) ? data.length : 'not array',
        isNull: data === null,
        isUndefined: data === undefined
      })

      if (supabaseError) {
        console.error('❌ [Commissions] Supabase error:', supabaseError.message)
        setError(new Error(supabaseError.message))
        setCommissions(mockCommissionEngine.sampleCommissions.map(c => ({ ...c, source: 'fallback' })))
        setUsingFallback(true)
        setSupabaseStatus({ 
          connected: false, 
          error: supabaseError.message, 
          count: mockCommissionEngine.sampleCommissions.length 
        })
      } else {
        if (!Array.isArray(data)) {
          console.warn('⚠️ [Commissions] Supabase returned non-array data:', typeof data)
          throw new Error('Invalid data format from Supabase')
        }

        console.log(`✅ [Commissions] Supabase connected successfully - ${data.length} commissions found`)
        
        // Transform data and add source tag
        const transformedData: Commission[] = data.map(row => ({
          id: row.id || `comm-${Date.now()}-${Math.random()}`,
          repId: row.rep_id || row.repId || '',
          amount: row.amount || 0,
          period: row.period || '',
          ruleId: row.rule_id || row.ruleId || '',
          saleAmount: row.sale_amount || row.saleAmount || 0,
          company_id: row.company_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          source: 'supabase'
        }))

        setCommissions(transformedData)
        setUsingFallback(false)
        setSupabaseStatus({ connected: true, count: transformedData.length })
      }
    } catch (err: any) {
      console.error('💥 [Commissions] Unexpected error during fetch:', err)
      setError(new Error('Failed to connect to Supabase or process data.'))
      setCommissions(mockCommissionEngine.sampleCommissions.map(c => ({ ...c, source: 'fallback' })))
      setUsingFallback(true)
      setSupabaseStatus({ 
        connected: false, 
        error: err.message, 
        count: mockCommissionEngine.sampleCommissions.length 
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommissions()
  }, [user?.tenantId]) // Re-fetch if tenantId changes

  const createCommission = async (newCommission: Omit<Commission, 'id' | 'source' | 'created_at' | 'updated_at'>) => {
    console.log('🚫 [Commissions] Create operation disabled in read-only mode')
    toast({
      title: 'Read-Only Mode',
      description: 'Creating commissions is disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    throw new Error('Create operations disabled in read-only mode')
  }

  const createCommissionLocal = async (newCommission: Omit<Commission, 'id' | 'source' | 'created_at' | 'updated_at'>) => {
    if (usingFallback) {
      const created = { 
        ...newCommission, 
        id: `mock-${Date.now()}`, 
        source: 'fallback',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Commission
      setCommissions(prev => [created, ...prev])
      return created
    }

    const rawCompanyId = user?.tenantId
    const companyId = uuidRegex.test(rawCompanyId || '') ? rawCompanyId : null
    if (!companyId) throw new Error('Invalid company ID for Supabase operation.')

    try {
      const { data, error: supabaseError } = await supabase
        .from('commissions')
        .insert([{ 
          ...newCommission, 
          company_id: companyId,
          rep_id: newCommission.repId,
          rule_id: newCommission.ruleId,
          sale_amount: newCommission.saleAmount
        }])
        .select()
        .single()

      if (supabaseError) throw supabaseError
      
      const created: Commission = { 
        ...data, 
        repId: data.rep_id,
        ruleId: data.rule_id,
        saleAmount: data.sale_amount,
        source: 'supabase' 
      }
      setCommissions(prev => [created, ...prev])
      return created
    } catch (error) {
      console.error('Error creating commission:', error)
      toast({
        title: 'Error',
        description: 'Failed to create commission',
        variant: 'destructive'
      })
      throw error
    }
  }

  const updateCommission = async (id: string, updates: Partial<Omit<Commission, 'id' | 'source'>>) => {
    console.log('🚫 [Commissions] Update operation disabled in read-only mode')
    toast({
      title: 'Read-Only Mode',
      description: 'Updating commissions is disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    return
  }

  const updateCommissionLocal = async (id: string, updates: Partial<Omit<Commission, 'id' | 'source'>>) => {
    if (usingFallback) {
      setCommissions(prev => prev.map(c => 
        c.id === id ? { ...c, ...updates, source: 'fallback', updated_at: new Date().toISOString() } : c
      ))
      return
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('commissions')
        .update({
          ...updates,
          rep_id: updates.repId,
          rule_id: updates.ruleId,
          sale_amount: updates.saleAmount
        })
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) throw supabaseError
      
      const updated: Commission = { 
        ...data, 
        repId: data.rep_id,
        ruleId: data.rule_id,
        saleAmount: data.sale_amount,
        source: 'supabase' 
      }
      setCommissions(prev => prev.map(c => c.id === id ? updated : c))
    } catch (error) {
      console.error('Error updating commission:', error)
      toast({
        title: 'Error',
        description: 'Failed to update commission',
        variant: 'destructive'
      })
      throw error
    }
  }

  const deleteCommission = async (id: string) => {
    console.log('🚫 [Commissions] Delete operation disabled in read-only mode')
    toast({
      title: 'Read-Only Mode',
      description: 'Deleting commissions is disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    return
  }

  const deleteCommissionLocal = async (id: string) => {
    if (usingFallback) {
      setCommissions(prev => prev.filter(c => c.id !== id))
      return
    }

    try {
      const { error: supabaseError } = await supabase
        .from('commissions')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError
      setCommissions(prev => prev.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting commission:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete commission',
        variant: 'destructive'
      })
      throw error
    }
  }

  return {
    commissions,
    loading,
    error,
    usingFallback,
    supabaseStatus,
    connectionAttempted,
    createCommission,
    updateCommission,
    deleteCommission,
    refetchCommissions: fetchCommissions, // Allow manual refetch
  }
}