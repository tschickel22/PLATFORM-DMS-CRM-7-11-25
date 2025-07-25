import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/hooks/use-toast'

export function useDeals() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

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

  const createDeal = async (dealData: any) => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .insert([{
          customer_name: dealData.customerName || '',
          customer_email: dealData.customerEmail || '',
          customer_phone: dealData.customerPhone || '',
          vehicle_info: dealData.vehicleInfo || '',
          stage: dealData.stage || 'New',
          amount: dealData.amount || 0,
          source: dealData.source || '',
          type: dealData.type || 'New Sale',
          priority: dealData.priority || 'Medium',
          rep_name: dealData.repName || '',
          probability: dealData.probability || 0,
          expected_close_date: dealData.expectedCloseDate || null,
          notes: dealData.notes || ''
        }])
        .select()
        .single()

      if (error) throw error

      setDeals(prev => [data, ...prev])
      return data
    } catch (error) {
      console.error('Error creating deal:', error)
      toast({
        title: 'Error',
        description: 'Failed to create deal',
        variant: 'destructive'
      })
      throw error
    }
  }

  const updateDeal = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .update({
          customer_name: updates.customerName,
          customer_email: updates.customerEmail,
          customer_phone: updates.customerPhone,
          vehicle_info: updates.vehicleInfo,
          stage: updates.stage,
          amount: updates.amount,
          source: updates.source,
          type: updates.type,
          priority: updates.priority,
          rep_name: updates.repName,
          probability: updates.probability,
          expected_close_date: updates.expectedCloseDate,
          notes: updates.notes
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setDeals(prev => prev.map(deal => deal.id === id ? data : deal))
      return data
    } catch (error) {
      console.error('Error updating deal:', error)
      toast({
        title: 'Error',
        description: 'Failed to update deal',
        variant: 'destructive'
      })
      throw error
    }
  }

  const deleteDeal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id)

      if (error) throw error

      setDeals(prev => prev.filter(deal => deal.id !== id))
    } catch (error) {
      console.error('Error deleting deal:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete deal',
        variant: 'destructive'
      })
      throw error
    }
  }

  return { deals, loading, error, createDeal, updateDeal, deleteDeal }
}

export function useContacts() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

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

  const createContact = async (contactData: any) => {
    try {
      const { data, error } = await supabase
        .from('crm_contacts')
        .insert([{
          first_name: contactData.firstName || '',
          last_name: contactData.lastName || '',
          email: contactData.email || '',
          phone: contactData.phone || '',
          source: contactData.source || '',
          source_id: contactData.sourceId || null,
          status: contactData.status || 'new',
          assigned_to: contactData.assignedTo || null,
          notes: contactData.notes || '',
          score: contactData.score || null,
          last_activity: contactData.lastActivity || null,
          custom_fields: contactData.customFields || {}
        }])
        .select()
        .single()

      if (error) throw error

      setContacts(prev => [data, ...prev])
      return data
    } catch (error) {
      console.error('Error creating contact:', error)
      toast({
        title: 'Error',
        description: 'Failed to create contact',
        variant: 'destructive'
      })
      throw error
    }
  }

  const updateContact = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('crm_contacts')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          email: updates.email,
          phone: updates.phone,
          source: updates.source,
          source_id: updates.sourceId,
          status: updates.status,
          assigned_to: updates.assignedTo,
          notes: updates.notes,
          score: updates.score,
          last_activity: updates.lastActivity,
          custom_fields: updates.customFields
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setContacts(prev => prev.map(contact => contact.id === id ? data : contact))
      return data
    } catch (error) {
      console.error('Error updating contact:', error)
      toast({
        title: 'Error',
        description: 'Failed to update contact',
        variant: 'destructive'
      })
      throw error
    }
  }

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crm_contacts')
        .delete()
        .eq('id', id)

      if (error) throw error

      setContacts(prev => prev.filter(contact => contact.id !== id))
    } catch (error) {
      console.error('Error deleting contact:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive'
      })
      throw error
    }
  }

  return { contacts, loading, error, createContact, updateContact, deleteContact }
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