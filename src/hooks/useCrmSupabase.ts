import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useDeals() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error loading deals:', error)
          setError(error.message)
        } else {
          setDeals(data || [])
          setError(null)
        }
      } catch (err) {
        console.error('Unexpected error loading deals:', err)
        setError('Failed to load deals')
      } finally {
        setLoading(false)
      }
    }
    
    fetchDeals()
  }, [])

  return { deals, loading, error }
}

export function useContacts() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('crm_contacts')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error loading contacts:', error)
          setError(error.message)
        } else {
          setContacts(data || [])
          setError(null)
        }
      } catch (err) {
        console.error('Unexpected error loading contacts:', err)
        setError('Failed to load contacts')
      } finally {
        setLoading(false)
      }
    }
    
    fetchContacts()
  }, [])

  return { contacts, loading, error }
}

export function useTerritories() {
  const [territories, setTerritories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTerritories = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('territories')
          .select('*')
          .order('name', { ascending: true })
        
        if (error) {
          console.error('Error loading territories:', error)
          setError(error.message)
        } else {
          setTerritories(data || [])
          setError(null)
        }
      } catch (err) {
        console.error('Unexpected error loading territories:', err)
        setError('Failed to load territories')
      } finally {
        setLoading(false)
      }
    }
    
    fetchTerritories()
  }, [])

  return { territories, loading, error }
}

export function useApprovalWorkflows() {
  const [approvalWorkflows, setApprovalWorkflows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApprovalWorkflows = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('approval_workflows')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error loading approval workflows:', error)
          setError(error.message)
        } else {
          setApprovalWorkflows(data || [])
          setError(null)
        }
      } catch (err) {
        console.error('Unexpected error loading approval workflows:', err)
        setError('Failed to load approval workflows')
      } finally {
        setLoading(false)
      }
    }
    
    fetchApprovalWorkflows()
  }, [])

  return { approvalWorkflows, loading, error }
}

export function useWinLossReports() {
  const [winLossReports, setWinLossReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWinLossReports = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('win_loss_reports')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error loading win/loss reports:', error)
          setError(error.message)
        } else {
          setWinLossReports(data || [])
          setError(null)
        }
      } catch (err) {
        console.error('Unexpected error loading win/loss reports:', err)
        setError('Failed to load win/loss reports')
      } finally {
        setLoading(false)
      }
    }
    
    fetchWinLossReports()
  }, [])

  return { winLossReports, loading, error }
}