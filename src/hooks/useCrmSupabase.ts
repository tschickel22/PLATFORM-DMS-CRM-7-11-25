import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Deal, CRMContact } from '@/types'
import { useEffectiveCompanyId } from './useEffectiveCompanyId'

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const companyId = useEffectiveCompanyId()

  useEffect(() => {
    async function fetchDeals() {
      try {
        console.log('🔄 [useDeals] Fetching deals for company_id:', companyId)
        
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('❌ [useDeals] Supabase error:', error.message)
          setError(error.message)
          setDeals([])
        } else {
          console.log('✅ [useDeals] Loaded deals:', data?.length || 0)
          setDeals(data || [])
          setError(null)
        }
      } catch (err: any) {
        console.error('💥 [useDeals] Unexpected error:', err)
        setError(err.message)
        setDeals([])
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [companyId])

  return { deals, loading, error }
}

export function useContacts() {
  const [contacts, setContacts] = useState<CRMContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const companyId = useEffectiveCompanyId()

  useEffect(() => {
    async function fetchContacts() {
      try {
        console.log('🔄 [useContacts] Fetching contacts for company_id:', companyId)
        
        const { data, error } = await supabase
          .from('crm_contacts')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('❌ [useContacts] Supabase error:', error.message)
          setError(error.message)
          setContacts([])
        } else {
          console.log('✅ [useContacts] Loaded contacts:', data?.length || 0)
          setContacts(data || [])
          setError(null)
        }
      } catch (err: any) {
        console.error('💥 [useContacts] Unexpected error:', err)
        setError(err.message)
        setContacts([])
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [companyId])

  return { contacts, loading, error }
}