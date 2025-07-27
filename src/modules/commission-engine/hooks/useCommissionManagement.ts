import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useEffectiveCompanyId } from '@/hooks/useEffectiveCompanyId'
import { useToast } from '@/hooks/use-toast'
import { mockCommissionEngine } from '@/mocks/commissionEngineMock'

interface CommissionRule {
  id: string
  company_id: string
  name: string
  type: string
  rate: number
  criteria: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface Commission {
  id: string
  company_id: string
  rep_id: string
  rep_name: string
  deal_id: string
  rule_id: string
  amount: number
  period: string
  sale_amount: number
  status: string
  created_at: string
  updated_at: string
}

interface CommissionManagementState {
  rules: CommissionRule[]
  commissions: Commission[]
  loading: boolean
  error: Error | null
  usingFallback: boolean
  supabaseStatus: {
    rules: { connected: boolean; error?: string; count: number }
    commissions: { connected: boolean; error?: string; count: number }
  }
}

export function useCommissionManagement() {
  const { companyId, usingFallback: companyIdFallback } = useEffectiveCompanyId()
  const { toast } = useToast()
  
  const [state, setState] = useState<CommissionManagementState>({
    rules: [],
    commissions: [],
    loading: true,
    error: null,
    usingFallback: false,
    supabaseStatus: {
      rules: { connected: false, error: undefined, count: 0 },
      commissions: { connected: false, error: undefined, count: 0 }
    }
  })

  const fetchRules = async () => {
    console.log('📋 [Commission Management] Fetching rules from Supabase...')
    
    if (companyIdFallback || !companyId) {
      console.warn('⚠️ [Commission Management] Invalid company ID, using fallback data')
      setState(prev => ({
        ...prev,
        rules: mockCommissionEngine.sampleRules.map(rule => ({
          ...rule,
          company_id: companyId || 'fallback',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })),
        usingFallback: true,
        supabaseStatus: {
          ...prev.supabaseStatus,
          rules: { connected: false, error: 'Invalid company ID', count: 0 }
        }
      }))
      return
    }

    try {
      const { data, error } = await supabase
        .from('commission_rules')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ [Commission Management] Supabase error fetching rules:', error.message)
        console.log('Supabase fetch failed for Commission Engine')
        setState(prev => ({
          ...prev,
          rules: mockCommissionEngine.sampleRules.map(rule => ({
            ...rule,
            company_id: companyId,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })),
          usingFallback: true,
          supabaseStatus: {
            ...prev.supabaseStatus,
            rules: { connected: false, error: error.message, count: 0 }
          }
        }))
        return
      }

      console.log(`✅ [Commission Management] Fetched ${data?.length || 0} rules from Supabase`)
      
      if (!data || data.length === 0) {
        // No data found, use fallback
        setState(prev => ({
          ...prev,
          rules: mockCommissionEngine.sampleRules.map(rule => ({
            ...rule,
            company_id: companyId,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })),
          usingFallback: true,
          supabaseStatus: {
            ...prev.supabaseStatus,
            rules: { connected: true, error: undefined, count: 0 }
          }
        }))
        return
      }

      // Transform Supabase data to match our types
      const transformedRules: CommissionRule[] = data.map(row => ({
        id: row.id,
        company_id: row.company_id,
        name: row.name,
        type: row.type,
        rate: row.rate,
        criteria: row.criteria,
        is_active: row.is_active,
        created_at: row.created_at,
        updated_at: row.updated_at
      }))

      setState(prev => ({
        ...prev,
        rules: transformedRules,
        usingFallback: false,
        supabaseStatus: {
          ...prev.supabaseStatus,
          rules: { connected: true, error: undefined, count: transformedRules.length }
        }
      }))
    } catch (err: any) {
      console.error('💥 [Commission Management] Unexpected error fetching rules:', err)
      console.log('Supabase fetch failed for Commission Engine')
      setState(prev => ({
        ...prev,
        rules: mockCommissionEngine.sampleRules.map(rule => ({
          ...rule,
          company_id: companyId || 'fallback',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })),
        usingFallback: true,
        error: new Error('Failed to fetch commission rules'),
        supabaseStatus: {
          ...prev.supabaseStatus,
          rules: { connected: false, error: err.message, count: 0 }
        }
      }))
    }
  }

  const fetchCommissions = async () => {
    console.log('💰 [Commission Management] Fetching commissions from Supabase...')
    
    if (companyIdFallback || !companyId) {
      console.warn('⚠️ [Commission Management] Invalid company ID for commissions, using fallback')
      setState(prev => ({
        ...prev,
        commissions: mockCommissionEngine.sampleCommissions.map(comm => ({
          ...comm,
          company_id: companyId || 'fallback',
          rep_name: mockCommissionEngine.salesReps.find(rep => rep.id === comm.repId)?.name || 'Unknown Rep',
          deal_id: 'deal-001',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })),
        supabaseStatus: {
          ...prev.supabaseStatus,
          commissions: { connected: false, error: 'Invalid company ID', count: 0 }
        }
      }))
      return
    }

    try {
      const { data, error } = await supabase
        .from('commissions')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ [Commission Management] Supabase error fetching commissions:', error.message)
        console.log('Supabase fetch failed for Commission Engine')
        setState(prev => ({
          ...prev,
          commissions: mockCommissionEngine.sampleCommissions.map(comm => ({
            ...comm,
            company_id: companyId,
            rep_name: mockCommissionEngine.salesReps.find(rep => rep.id === comm.repId)?.name || 'Unknown Rep',
            deal_id: 'deal-001',
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })),
          supabaseStatus: {
            ...prev.supabaseStatus,
            commissions: { connected: false, error: error.message, count: 0 }
          }
        }))
        return
      }

      console.log(`✅ [Commission Management] Fetched ${data?.length || 0} commissions from Supabase`)

      if (!data || data.length === 0) {
        // No commissions found, use fallback
        setState(prev => ({
          ...prev,
          commissions: mockCommissionEngine.sampleCommissions.map(comm => ({
            ...comm,
            company_id: companyId,
            rep_name: mockCommissionEngine.salesReps.find(rep => rep.id === comm.repId)?.name || 'Unknown Rep',
            deal_id: 'deal-001',
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })),
          supabaseStatus: {
            ...prev.supabaseStatus,
            commissions: { connected: true, error: undefined, count: 0 }
          }
        }))
        return
      }

      // Transform Supabase data to match our types
      const transformedCommissions: Commission[] = data.map(row => ({
        id: row.id,
        company_id: row.company_id,
        rep_id: row.rep_id,
        rep_name: row.rep_name,
        deal_id: row.deal_id,
        rule_id: row.rule_id,
        amount: row.amount,
        period: row.period,
        sale_amount: row.sale_amount,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at
      }))

      setState(prev => ({
        ...prev,
        commissions: transformedCommissions,
        supabaseStatus: {
          ...prev.supabaseStatus,
          commissions: { connected: true, error: undefined, count: transformedCommissions.length }
        }
      }))
    } catch (err: any) {
      console.error('💥 [Commission Management] Unexpected error fetching commissions:', err)
      console.log('Supabase fetch failed for Commission Engine')
      setState(prev => ({
        ...prev,
        commissions: mockCommissionEngine.sampleCommissions.map(comm => ({
          ...comm,
          company_id: companyId || 'fallback',
          rep_name: mockCommissionEngine.salesReps.find(rep => rep.id === comm.repId)?.name || 'Unknown Rep',
          deal_id: 'deal-001',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })),
        error: new Error('Failed to fetch commissions'),
        supabaseStatus: {
          ...prev.supabaseStatus,
          commissions: { connected: false, error: err.message, count: 0 }
        }
      }))
    }
  }

  const createRule = async (ruleData: Omit<CommissionRule, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (companyIdFallback || !companyId) {
      toast({
        title: 'Error',
        description: 'Invalid company ID. Cannot create rule.',
        variant: 'destructive'
      })
      return null
    }

    try {
      const { data, error } = await supabase
        .from('commission_rules')
        .insert([{
          ...ruleData,
          company_id: companyId
        }])
        .select()
        .single()

      if (error) {
        console.error('❌ [Commission Management] Error creating rule:', error.message)
        toast({
          title: 'Error',
          description: 'Failed to create commission rule',
          variant: 'destructive'
        })
        return null
      }

      const newRule: CommissionRule = {
        id: data.id,
        company_id: data.company_id,
        name: data.name,
        type: data.type,
        rate: data.rate,
        criteria: data.criteria,
        is_active: data.is_active,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      setState(prev => ({
        ...prev,
        rules: [newRule, ...prev.rules]
      }))

      return newRule
    } catch (err: any) {
      console.error('💥 [Commission Management] Unexpected error creating rule:', err)
      toast({
        title: 'Error',
        description: 'Failed to create commission rule',
        variant: 'destructive'
      })
      return null
    }
  }

  const updateRule = async (id: string, updates: Partial<CommissionRule>) => {
    try {
      const { data, error } = await supabase
        .from('commission_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ [Commission Management] Error updating rule:', error.message)
        toast({
          title: 'Error',
          description: 'Failed to update commission rule',
          variant: 'destructive'
        })
        return
      }

      const updatedRule: CommissionRule = {
        id: data.id,
        company_id: data.company_id,
        name: data.name,
        type: data.type,
        rate: data.rate,
        criteria: data.criteria,
        is_active: data.is_active,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      setState(prev => ({
        ...prev,
        rules: prev.rules.map(rule =>
          rule.id === id ? updatedRule : rule
        )
      }))
    } catch (err: any) {
      console.error('💥 [Commission Management] Unexpected error updating rule:', err)
      toast({
        title: 'Error',
        description: 'Failed to update commission rule',
        variant: 'destructive'
      })
    }
  }

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('commission_rules')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ [Commission Management] Error deleting rule:', error.message)
        toast({
          title: 'Error',
          description: 'Failed to delete commission rule',
          variant: 'destructive'
        })
        return
      }

      setState(prev => ({
        ...prev,
        rules: prev.rules.filter(rule => rule.id !== id)
      }))
    } catch (err: any) {
      console.error('💥 [Commission Management] Unexpected error deleting rule:', err)
      toast({
        title: 'Error',
        description: 'Failed to delete commission rule',
        variant: 'destructive'
      })
    }
  }

  const createCommission = async (commissionData: Omit<Commission, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (companyIdFallback || !companyId) {
      toast({
        title: 'Error',
        description: 'Invalid company ID. Cannot create commission.',
        variant: 'destructive'
      })
      return null
    }

    try {
      const { data, error } = await supabase
        .from('commissions')
        .insert([{
          ...commissionData,
          company_id: companyId
        }])
        .select()
        .single()

      if (error) {
        console.error('❌ [Commission Management] Error creating commission:', error.message)
        toast({
          title: 'Error',
          description: 'Failed to create commission',
          variant: 'destructive'
        })
        return null
      }

      const newCommission: Commission = {
        id: data.id,
        company_id: data.company_id,
        rep_id: data.rep_id,
        rep_name: data.rep_name,
        deal_id: data.deal_id,
        rule_id: data.rule_id,
        amount: data.amount,
        period: data.period,
        sale_amount: data.sale_amount,
        status: data.status,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      setState(prev => ({
        ...prev,
        commissions: [newCommission, ...prev.commissions]
      }))

      return newCommission
    } catch (err: any) {
      console.error('💥 [Commission Management] Unexpected error creating commission:', err)
      toast({
        title: 'Error',
        description: 'Failed to create commission',
        variant: 'destructive'
      })
      return null
    }
  }

  const updateCommission = async (id: string, updates: Partial<Commission>) => {
    try {
      const { data, error } = await supabase
        .from('commissions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ [Commission Management] Error updating commission:', error.message)
        toast({
          title: 'Error',
          description: 'Failed to update commission',
          variant: 'destructive'
        })
        return
      }

      const updatedCommission: Commission = {
        id: data.id,
        company_id: data.company_id,
        rep_id: data.rep_id,
        rep_name: data.rep_name,
        deal_id: data.deal_id,
        rule_id: data.rule_id,
        amount: data.amount,
        period: data.period,
        sale_amount: data.sale_amount,
        status: data.status,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      setState(prev => ({
        ...prev,
        commissions: prev.commissions.map(commission =>
          commission.id === id ? updatedCommission : commission
        )
      }))
    } catch (err: any) {
      console.error('💥 [Commission Management] Unexpected error updating commission:', err)
      toast({
        title: 'Error',
        description: 'Failed to update commission',
        variant: 'destructive'
      })
    }
  }

  // Load data when component mounts or company_id changes
  useEffect(() => {
    if (companyId) {
      setState(prev => ({ ...prev, loading: true }))
      Promise.all([fetchRules(), fetchCommissions()]).finally(() => {
        setState(prev => ({ ...prev, loading: false }))
      })
    }
  }, [companyId])

  return {
    rules: state.rules,
    commissions: state.commissions,
    loading: state.loading,
    error: state.error,
    usingFallback: state.usingFallback,
    supabaseStatus: state.supabaseStatus,
    createRule,
    updateRule,
    deleteRule,
    createCommission,
    updateCommission,
    refetch: () => {
      setState(prev => ({ ...prev, loading: true }))
      Promise.all([fetchRules(), fetchCommissions()]).finally(() => {
        setState(prev => ({ ...prev, loading: false }))
      })
    }
  }
}