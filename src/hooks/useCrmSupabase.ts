import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { CRMContact, Deal } from '@/types'
import { useToast } from '@/hooks/use-toast'

export function useContacts() {
  const [contacts, setContacts] = useState<CRMContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('crm_contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setContacts(data || [])
    } catch (err) {
      console.error('Error loading contacts:', err)
      setError(err instanceof Error ? err.message : 'Failed to load contacts')
      setContacts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  const createContact = async (contactData: Partial<CRMContact>): Promise<CRMContact | null> => {
    try {
      const { data, error } = await supabase
        .from('crm_contacts')
        .insert([{
          first_name: contactData.first_name || '',
          last_name: contactData.last_name || '',
          email: contactData.email || '',
          phone: contactData.phone || '',
          source: contactData.source || '',
          source_id: contactData.source_id,
          status: contactData.status || 'new',
          assigned_to: contactData.assigned_to,
          notes: contactData.notes || '',
          score: contactData.score,
          last_activity: contactData.last_activity,
          custom_fields: contactData.custom_fields || {}
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      const newContact = data as CRMContact
      setContacts(prev => [newContact, ...prev])
      
      toast({
        title: 'Contact Created',
        description: `${newContact.first_name} ${newContact.last_name} has been added.`
      })

      return newContact
    } catch (err) {
      console.error('Error creating contact:', err)
      toast({
        title: 'Error',
        description: 'Failed to create contact. Please try again.',
        variant: 'destructive'
      })
      return null
    }
  }

  const updateContact = async (id: string, updates: Partial<CRMContact>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('crm_contacts')
        .update({
          first_name: updates.first_name,
          last_name: updates.last_name,
          email: updates.email,
          phone: updates.phone,
          source: updates.source,
          source_id: updates.source_id,
          status: updates.status,
          assigned_to: updates.assigned_to,
          notes: updates.notes,
          score: updates.score,
          last_activity: updates.last_activity,
          custom_fields: updates.custom_fields
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      const updatedContact = data as CRMContact
      setContacts(prev => prev.map(contact => 
        contact.id === id ? updatedContact : contact
      ))

      toast({
        title: 'Contact Updated',
        description: `${updatedContact.first_name} ${updatedContact.last_name} has been updated.`
      })

      return true
    } catch (err) {
      console.error('Error updating contact:', err)
      toast({
        title: 'Error',
        description: 'Failed to update contact. Please try again.',
        variant: 'destructive'
      })
      return false
    }
  }

  const deleteContact = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('crm_contacts')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setContacts(prev => prev.filter(contact => contact.id !== id))
      
      toast({
        title: 'Contact Deleted',
        description: 'Contact has been removed successfully.'
      })

      return true
    } catch (err) {
      console.error('Error deleting contact:', err)
      toast({
        title: 'Error',
        description: 'Failed to delete contact. Please try again.',
        variant: 'destructive'
      })
      return false
    }
  }

  return {
    contacts,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    refreshContacts: loadContacts
  }
}

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const loadDeals = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setDeals(data || [])
    } catch (err) {
      console.error('Error loading deals:', err)
      setError(err instanceof Error ? err.message : 'Failed to load deals')
      setDeals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDeals()
  }, [])

  const createDeal = async (dealData: Partial<Deal>): Promise<Deal | null> => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .insert([{
          customer_id: dealData.customer_id,
          customer_name: dealData.customer_name || '',
          customer_email: dealData.customer_email || '',
          customer_phone: dealData.customer_phone || '',
          vehicle_id: dealData.vehicle_id,
          vehicle_info: dealData.vehicle_info || '',
          stage: dealData.stage || 'New',
          amount: dealData.amount || 0,
          source: dealData.source || '',
          type: dealData.type || 'New Sale',
          priority: dealData.priority || 'Medium',
          rep_id: dealData.rep_id,
          rep_name: dealData.rep_name || '',
          probability: dealData.probability || 0,
          expected_close_date: dealData.expected_close_date,
          notes: dealData.notes || ''
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      const newDeal = data as Deal
      setDeals(prev => [newDeal, ...prev])
      
      toast({
        title: 'Deal Created',
        description: `Deal for ${newDeal.customer_name} has been created.`
      })

      return newDeal
    } catch (err) {
      console.error('Error creating deal:', err)
      toast({
        title: 'Error',
        description: 'Failed to create deal. Please try again.',
        variant: 'destructive'
      })
      return null
    }
  }

  const updateDeal = async (id: string, updates: Partial<Deal>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .update({
          customer_id: updates.customer_id,
          customer_name: updates.customer_name,
          customer_email: updates.customer_email,
          customer_phone: updates.customer_phone,
          vehicle_id: updates.vehicle_id,
          vehicle_info: updates.vehicle_info,
          stage: updates.stage,
          amount: updates.amount,
          source: updates.source,
          type: updates.type,
          priority: updates.priority,
          rep_id: updates.rep_id,
          rep_name: updates.rep_name,
          probability: updates.probability,
          expected_close_date: updates.expected_close_date,
          notes: updates.notes
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      const updatedDeal = data as Deal
      setDeals(prev => prev.map(deal => 
        deal.id === id ? updatedDeal : deal
      ))

      toast({
        title: 'Deal Updated',
        description: `Deal for ${updatedDeal.customer_name} has been updated.`
      })

      return true
    } catch (err) {
      console.error('Error updating deal:', err)
      toast({
        title: 'Error',
        description: 'Failed to update deal. Please try again.',
        variant: 'destructive'
      })
      return false
    }
  }

  const deleteDeal = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setDeals(prev => prev.filter(deal => deal.id !== id))
      
      toast({
        title: 'Deal Deleted',
        description: 'Deal has been removed successfully.'
      })

      return true
    } catch (err) {
      console.error('Error deleting deal:', err)
      toast({
        title: 'Error',
        description: 'Failed to delete deal. Please try again.',
        variant: 'destructive'
      })
      return false
    }
  }

  return {
    deals,
    loading,
    error,
    createDeal,
    updateDeal,
    deleteDeal,
    refreshDeals: loadDeals
  }
}