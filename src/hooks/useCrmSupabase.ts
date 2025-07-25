import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { CRMContact, Deal } from '@/types'
import { useToast } from '@/hooks/use-toast'

// CRM-specific interfaces that match Supabase schema
interface CRMContactDB {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  source: string
  source_id?: string
  status: string
  assigned_to?: string
  notes: string
  score?: number
  last_activity?: string
  custom_fields?: Record<string, any>
  created_at: string
  updated_at: string
}

interface DealDB {
  id: string
  customer_id?: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  vehicle_id?: string
  vehicle_info?: string
  stage: string
  amount?: number
  source?: string
  type?: string
  priority?: string
  rep_id?: string
  rep_name?: string
  probability?: number
  expected_close_date?: string
  notes: string
  created_at: string
  updated_at: string
}

export function useContacts() {
  const [contacts, setContacts] = useState<CRMContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    console.log('🔄 [CRM] Fetching contacts from crm_contacts table...')
    try {
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ [CRM] Error fetching contacts:', error.message)
        setError(error.message)
        throw error
      }

      console.log(`✅ [CRM] Fetched ${data?.length || 0} contacts from crm_contacts`)
      
      // Transform database records to application format
      const transformedContacts: CRMContact[] = (data || []).map((contact: CRMContactDB) => ({
        id: contact.id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone,
        source: contact.source,
        source_id: contact.source_id,
        status: contact.status,
        assigned_to: contact.assigned_to,
        notes: contact.notes,
        score: contact.score,
        last_activity: contact.last_activity,
        custom_fields: contact.custom_fields,
        created_at: contact.created_at,
        updated_at: contact.updated_at
      }))
      
      setContacts(transformedContacts)
      setError(null)
    } catch (error) {
      console.error('💥 [CRM] Failed to fetch contacts:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: `Failed to fetch contacts: ${errorMessage}`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const createContact = async (contactData: Partial<CRMContact>) => {
    console.log('🔄 [CRM] Creating new contact in crm_contacts table...')
    try {
      // Transform application data to database format
      const dbData = {
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
        custom_fields: contactData.custom_fields
      }
      
      const { data, error } = await supabase
        .from('crm_contacts')
        .insert([dbData])
        .select()
        .single()

      if (error) {
        console.error('❌ [CRM] Error creating contact:', error.message)
        throw error
      }

      console.log('✅ [CRM] Contact created:', data.id)
      
      // Transform back to application format
      const newContact: CRMContact = {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        source: data.source,
        source_id: data.source_id,
        status: data.status,
        assigned_to: data.assigned_to,
        notes: data.notes,
        score: data.score,
        last_activity: data.last_activity,
        custom_fields: data.custom_fields,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
      
      setContacts(prev => [newContact, ...prev])
      
      toast({
        title: 'Success',
        description: 'Contact created successfully'
      })
      
      return newContact
    } catch (error) {
      console.error('💥 [CRM] Failed to create contact:', error)
      toast({
        title: 'Error',
        description: 'Failed to create contact',
        variant: 'destructive'
      })
      throw error
    }
  }

  const updateContact = async (id: string, updates: Partial<CRMContact>) => {
    console.log('🔄 [CRM] Updating contact in crm_contacts table:', id)
    try {
      // Transform application data to database format
      const dbUpdates: Partial<CRMContactDB> = {}
      if (updates.first_name !== undefined) dbUpdates.first_name = updates.first_name
      if (updates.last_name !== undefined) dbUpdates.last_name = updates.last_name
      if (updates.email !== undefined) dbUpdates.email = updates.email
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone
      if (updates.source !== undefined) dbUpdates.source = updates.source
      if (updates.source_id !== undefined) dbUpdates.source_id = updates.source_id
      if (updates.status !== undefined) dbUpdates.status = updates.status
      if (updates.assigned_to !== undefined) dbUpdates.assigned_to = updates.assigned_to
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes
      if (updates.score !== undefined) dbUpdates.score = updates.score
      if (updates.last_activity !== undefined) dbUpdates.last_activity = updates.last_activity
      if (updates.custom_fields !== undefined) dbUpdates.custom_fields = updates.custom_fields
      
      const { data, error } = await supabase
        .from('crm_contacts')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ [CRM] Error updating contact:', error.message)
        throw error
      }

      console.log('✅ [CRM] Contact updated:', data.id)
      
      // Transform back to application format
      const updatedContact: CRMContact = {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        source: data.source,
        source_id: data.source_id,
        status: data.status,
        assigned_to: data.assigned_to,
        notes: data.notes,
        score: data.score,
        last_activity: data.last_activity,
        custom_fields: data.custom_fields,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
      
      setContacts(prev => prev.map(contact => 
        contact.id === id ? updatedContact : contact
      ))
      
      toast({
        title: 'Success',
        description: 'Contact updated successfully'
      })
      
      return updatedContact
    } catch (error) {
      console.error('💥 [CRM] Failed to update contact:', error)
      toast({
        title: 'Error',
        description: 'Failed to update contact',
        variant: 'destructive'
      })
      throw error
    }
  }

  const deleteContact = async (id: string) => {
    console.log('🔄 [CRM] Deleting contact from crm_contacts table:', id)
    try {
      const { error } = await supabase
        .from('crm_contacts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ [CRM] Error deleting contact:', error.message)
        throw error
      }

      console.log('✅ [CRM] Contact deleted:', id)
      setContacts(prev => prev.filter(contact => contact.id !== id))
      
      toast({
        title: 'Success',
        description: 'Contact deleted successfully'
      })
    } catch (error) {
      console.error('💥 [CRM] Failed to delete contact:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive'
      })
      throw error
    }
  }

  return {
    contacts,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts
  }
}

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    console.log('🔄 [CRM] Fetching deals from deals table...')
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ [CRM] Error fetching deals:', error.message)
        setError(error.message)
        throw error
      }

      console.log(`✅ [CRM] Fetched ${data?.length || 0} deals from deals table`)
      
      // Transform database records to application format
      const transformedDeals: Deal[] = (data || []).map((deal: DealDB) => ({
        id: deal.id,
        customer_id: deal.customer_id,
        customer_name: deal.customer_name,
        customer_email: deal.customer_email,
        customer_phone: deal.customer_phone,
        vehicle_id: deal.vehicle_id,
        vehicle_info: deal.vehicle_info,
        stage: deal.stage,
        amount: deal.amount,
        source: deal.source,
        type: deal.type,
        priority: deal.priority,
        rep_id: deal.rep_id,
        rep_name: deal.rep_name,
        probability: deal.probability,
        expected_close_date: deal.expected_close_date,
        notes: deal.notes,
        created_at: deal.created_at,
        updated_at: deal.updated_at
      }))
      
      setDeals(transformedDeals)
      setError(null)
    } catch (error) {
      console.error('💥 [CRM] Failed to fetch deals:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: `Failed to fetch deals: ${errorMessage}`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const createDeal = async (dealData: Partial<Deal>) => {
    console.log('🔄 [CRM] Creating new deal in deals table...')
    try {
      // Transform application data to database format
      const dbData = {
        customer_id: dealData.customer_id,
        customer_name: dealData.customer_name || '',
        customer_email: dealData.customer_email,
        customer_phone: dealData.customer_phone,
        vehicle_id: dealData.vehicle_id,
        vehicle_info: dealData.vehicle_info,
        stage: dealData.stage || 'New',
        amount: dealData.amount,
        source: dealData.source,
        type: dealData.type,
        priority: dealData.priority,
        rep_id: dealData.rep_id,
        rep_name: dealData.rep_name,
        probability: dealData.probability,
        expected_close_date: dealData.expected_close_date,
        notes: dealData.notes || ''
      }
      
      const { data, error } = await supabase
        .from('deals')
        .insert([dbData])
        .select()
        .single()

      if (error) {
        console.error('❌ [CRM] Error creating deal:', error.message)
        throw error
      }

      console.log('✅ [CRM] Deal created:', data.id)
      
      // Transform back to application format
      const newDeal: Deal = {
        id: data.id,
        customer_id: data.customer_id,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        vehicle_id: data.vehicle_id,
        vehicle_info: data.vehicle_info,
        stage: data.stage,
        amount: data.amount,
        source: data.source,
        type: data.type,
        priority: data.priority,
        rep_id: data.rep_id,
        rep_name: data.rep_name,
        probability: data.probability,
        expected_close_date: data.expected_close_date,
        notes: data.notes,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
      
      setDeals(prev => [newDeal, ...prev])
      
      toast({
        title: 'Success',
        description: 'Deal created successfully'
      })
      
      return newDeal
    } catch (error) {
      console.error('💥 [CRM] Failed to create deal:', error)
      toast({
        title: 'Error',
        description: 'Failed to create deal',
        variant: 'destructive'
      })
      throw error
    }
  }

  const updateDeal = async (id: string, updates: Partial<Deal>) => {
    console.log('🔄 [CRM] Updating deal in deals table:', id)
    try {
      // Transform application data to database format
      const dbUpdates: Partial<DealDB> = {}
      if (updates.customer_id !== undefined) dbUpdates.customer_id = updates.customer_id
      if (updates.customer_name !== undefined) dbUpdates.customer_name = updates.customer_name
      if (updates.customer_email !== undefined) dbUpdates.customer_email = updates.customer_email
      if (updates.customer_phone !== undefined) dbUpdates.customer_phone = updates.customer_phone
      if (updates.vehicle_id !== undefined) dbUpdates.vehicle_id = updates.vehicle_id
      if (updates.vehicle_info !== undefined) dbUpdates.vehicle_info = updates.vehicle_info
      if (updates.stage !== undefined) dbUpdates.stage = updates.stage
      if (updates.amount !== undefined) dbUpdates.amount = updates.amount
      if (updates.source !== undefined) dbUpdates.source = updates.source
      if (updates.type !== undefined) dbUpdates.type = updates.type
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority
      if (updates.rep_id !== undefined) dbUpdates.rep_id = updates.rep_id
      if (updates.rep_name !== undefined) dbUpdates.rep_name = updates.rep_name
      if (updates.probability !== undefined) dbUpdates.probability = updates.probability
      if (updates.expected_close_date !== undefined) dbUpdates.expected_close_date = updates.expected_close_date
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes
      
      const { data, error } = await supabase
        .from('deals')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ [CRM] Error updating deal:', error.message)
        throw error
      }

      console.log('✅ [CRM] Deal updated:', data.id)
      
      // Transform back to application format
      const updatedDeal: Deal = {
        id: data.id,
        customer_id: data.customer_id,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        vehicle_id: data.vehicle_id,
        vehicle_info: data.vehicle_info,
        stage: data.stage,
        amount: data.amount,
        source: data.source,
        type: data.type,
        priority: data.priority,
        rep_id: data.rep_id,
        rep_name: data.rep_name,
        probability: data.probability,
        expected_close_date: data.expected_close_date,
        notes: data.notes,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
      
      setDeals(prev => prev.map(deal => 
        deal.id === id ? updatedDeal : deal
      ))
      
      toast({
        title: 'Success',
        description: 'Deal updated successfully'
      })
      
      return updatedDeal
    } catch (error) {
      console.error('💥 [CRM] Failed to update deal:', error)
      toast({
        title: 'Error',
        description: 'Failed to update deal',
        variant: 'destructive'
      })
      throw error
    }
  }

  const deleteDeal = async (id: string) => {
    console.log('🔄 [CRM] Deleting deal from deals table:', id)
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ [CRM] Error deleting deal:', error.message)
        throw error
      }

      console.log('✅ [CRM] Deal deleted:', id)
      setDeals(prev => prev.filter(deal => deal.id !== id))
      
      toast({
        title: 'Success',
        description: 'Deal deleted successfully'
      })
    } catch (error) {
      console.error('💥 [CRM] Failed to delete deal:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete deal',
        variant: 'destructive'
      })
      throw error
    }
  }

  return {
    deals,
    loading,
    error,
    createDeal,
    updateDeal,
    deleteDeal,
    refetch: fetchDeals
  }
}