import { useState, useEffect } from 'react'
import { Lead } from '@/types'
import { supabase } from '@/lib/supabaseClient'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

// Database row type for crm_contacts table
interface CrmContactRow {
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

// Utility functions to map between Lead interface and database schema
const mapRowToLead = (row: CrmContactRow): Lead => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  phone: row.phone,
  source: row.source,
  sourceId: row.source_id,
  status: row.status as any,
  assignedTo: row.assigned_to,
  notes: row.notes,
  score: row.score,
  lastActivity: row.last_activity ? new Date(row.last_activity) : undefined,
  customFields: row.custom_fields || {},
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at)
})

const mapLeadToRow = (lead: Partial<Lead>): Partial<CrmContactRow> => ({
  first_name: lead.firstName || '',
  last_name: lead.lastName || '',
  email: lead.email || '',
  phone: lead.phone || '',
  source: lead.source || '',
  source_id: lead.sourceId,
  status: lead.status || 'new',
  assigned_to: lead.assignedTo,
  notes: lead.notes || '',
  score: lead.score,
  last_activity: lead.lastActivity?.toISOString(),
  custom_fields: lead.customFields
})

export function useLeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch leads from Supabase on component mount
  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
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

      const mappedLeads = (data || []).map(mapRowToLead)
      setLeads(mappedLeads)
      
      // Cache leads in localStorage for offline access
      saveToLocalStorage('crm_leads_cache', mappedLeads)
      
    } catch (err) {
      console.error('Error fetching leads:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch leads')
      
      // Fallback to cached data if available
      const cachedLeads = loadFromLocalStorage<Lead[]>('crm_leads_cache', [])
      setLeads(cachedLeads)
    } finally {
      setLoading(false)
    }
  }

  const createLead = async (leadData: Partial<Lead>): Promise<Lead> => {
    try {
      const rowData = mapLeadToRow(leadData)
      
      const { data, error: insertError } = await supabase
        .from('crm_contacts')
        .insert([rowData])
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      const newLead = mapRowToLead(data)
      
      // Update local state
      setLeads(prevLeads => [newLead, ...prevLeads])
      
      // Update cache
      const updatedLeads = [newLead, ...leads]
      saveToLocalStorage('crm_leads_cache', updatedLeads)
      
      return newLead
    } catch (err) {
      console.error('Error creating lead:', err)
      throw new Error(err instanceof Error ? err.message : 'Failed to create lead')
    }
  }

  const updateLead = async (id: string, updates: Partial<Lead>): Promise<Lead> => {
    try {
      const rowUpdates = mapLeadToRow(updates)
      
      const { data, error: updateError } = await supabase
        .from('crm_contacts')
        .update(rowUpdates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      const updatedLead = mapRowToLead(data)
      
      // Update local state
      setLeads(prevLeads => 
        prevLeads.map(lead => lead.id === id ? updatedLead : lead)
      )
      
      // Update cache
      const updatedLeads = leads.map(lead => lead.id === id ? updatedLead : lead)
      saveToLocalStorage('crm_leads_cache', updatedLeads)
      
      return updatedLead
    } catch (err) {
      console.error('Error updating lead:', err)
      throw new Error(err instanceof Error ? err.message : 'Failed to update lead')
    }
  }

  const deleteLead = async (id: string): Promise<void> => {
    try {
      const { error: deleteError } = await supabase
        .from('crm_contacts')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      // Update local state
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id))
      
      // Update cache
      const updatedLeads = leads.filter(lead => lead.id !== id)
      saveToLocalStorage('crm_leads_cache', updatedLeads)
      
    } catch (err) {
      console.error('Error deleting lead:', err)
      throw new Error(err instanceof Error ? err.message : 'Failed to delete lead')
    }
  }

  const getLeadById = (id: string): Lead | undefined => {
    return leads.find(lead => lead.id === id)
  }

  const getLeadsByStatus = (status: string): Lead[] => {
    return leads.filter(lead => lead.status === status)
  }

  const getLeadsByAssignee = (assigneeId: string): Lead[] => {
    return leads.filter(lead => lead.assignedTo === assigneeId)
  }

  const searchLeads = (query: string): Lead[] => {
    const lowerQuery = query.toLowerCase()
    return leads.filter(lead => 
      lead.firstName.toLowerCase().includes(lowerQuery) ||
      lead.lastName.toLowerCase().includes(lowerQuery) ||
      lead.email.toLowerCase().includes(lowerQuery) ||
      lead.phone.includes(query) ||
      lead.notes.toLowerCase().includes(lowerQuery)
    )
  }

  const getLeadStats = () => {
    const totalLeads = leads.length
    const newLeads = leads.filter(lead => lead.status === 'new').length
    const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length
    const convertedLeads = leads.filter(lead => lead.status === 'closed_won').length
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

    return {
      totalLeads,
      newLeads,
      qualifiedLeads,
      convertedLeads,
      conversionRate: Math.round(conversionRate * 100) / 100
    }
  }

  const refreshLeads = () => {
    fetchLeads()
  }

  return {
    leads,
    loading,
    error,
    createLead,
    updateLead,
    deleteLead,
    getLeadById,
    getLeadsByStatus,
    getLeadsByAssignee,
    searchLeads,
    getLeadStats,
    refreshLeads
  }
}