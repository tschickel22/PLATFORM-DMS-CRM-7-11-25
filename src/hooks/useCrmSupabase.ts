import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Deal, CRMContact } from '@/types'
import useEffectiveCompanyId from '@/hooks/useEffectiveCompanyId'

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Get resolved company ID (handles fallback internally)
  const companyId = useEffectiveCompanyId()

  useEffect(() => {
    async function fetchDeals() {
      try {
        console.log('🔄 [useDeals] Fetching deals for company_id:', companyId)
        
        const { data, error: supabaseError } = await supabase
          .from('deals')
          .select('*')
          .eq('company_id', companyId)
          .eq('company_id', companyId)
          .order('created_at', { ascending: false })
        } else {
          console.log(`✅ [useDeals] Loaded ${data?.length || 0} deals`)
          setDeals(data || [])
          setError(null)
        }
      } catch (err: any) {
        console.error('💥 [useDeals] Unexpected error:', err)
        setError(err.message || 'Failed to fetch deals')
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
  
  // Get resolved company ID (handles fallback internally)
  const companyId = useEffectiveCompanyId()

  useEffect(() => {
    async function fetchContacts() {
      try {
        console.log('🔄 [useContacts] Fetching contacts for company_id:', companyId)
        
        const { data, error: supabaseError } = await supabase

        if (supabaseError) {
          console.error('❌ [useContacts] Supabase error:', supabaseError.message)
          setError(supabaseError.message)
          setContacts([])
        } else {
          console.log(`✅ [useContacts] Loaded ${data?.length || 0} contacts`)
          setContacts(data || [])
          setError(null)
        }
      } catch (err: any) {
        console.error('💥 [useContacts] Unexpected error:', err)
        setError(err.message || 'Failed to fetch contacts')
        setContacts([])
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [companyId])

  return { contacts, loading, error }
}