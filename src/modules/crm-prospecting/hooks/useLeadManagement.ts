import { useState, useEffect } from 'react'
import { Lead, LeadStatus } from '@/types'
import { supabase } from '@/lib/supabaseClient'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

interface UseLeadManagementReturn {
  leads: Lead[]
  loading: boolean
  error: string | null
  createLead: (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Lead | null>
  updateLead: (id: string, updates: Partial<Lead>) => Promise<boolean>
  deleteLead: (id: string) => Promise<boolean>
  getLeadById: (id: string) => Lead | undefined
  getLeadsByStatus: (status: LeadStatus) => Lead[]
  searchLeads: (query: string) => Lead[]
  getLeadStats: () => {
    total: number
    byStatus: Record<LeadStatus, number>
    avgScore: number
    recentActivity: number
  }
  refreshLeads: () => Promise<void>
}

// Mapping functions between Lead interface and database schema
const mapDbToLead = (dbRecord: any): Lead => ({
  id: dbRecord.id,
  firstName: dbRecord.first_name || '',
  lastName: dbRecord.last_name || '',
  email: dbRecord.email || '',
  phone: dbRecord.phone || '',
  source: dbRecord.source || '',
  sourceId: dbRecord.source_id || undefined,
  status: dbRecord.status as LeadStatus,
  assignedTo: dbRecord.assigned_to || undefined,
  notes: dbRecord.notes || '',
  score: dbRecord.score || undefined,
  lastActivity: dbRecord.last_activity ? new Date(dbRecord.last_activity) : undefined,
  customFields: dbRecord.custom_fields || {},
  createdAt: new Date(dbRecord.created_at),
  updatedAt: new Date(dbRecord.updated_at)
})

const mapLeadToDb = (lead: Partial<Lead>) => ({
  first_name: lead.firstName || '',
  last_name: lead.lastName || '',
  email: lead.email || '',
  phone: lead.phone || '',
  source: lead.source || '',
  source_id: lead.sourceId || null,
  status: lead.status || 'new',
  assigned_to: lead.assignedTo || null,
  notes: lead.notes || '',
  score: lead.score || null,
  last_activity: lead.lastActivity ? lead.lastActivity.toISOString() : null,
  custom_fields: lead.customFields || {}
})

export function useLeadManagement(): UseLeadManagementReturn {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch leads from Supabase
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

      const mappedLeads = (data || []).map(mapDbToLead)
      setLeads(mappedLeads)
      
      // Cache for offline access
      saveToLocalStorage('crm_leads', mappedLeads)
      
    } catch (err) {
      console.error('Error fetching leads:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch leads')
      
      // Fallback to cached data if available
      const cachedLeads = loadFromLocalStorage<Lead[]>('crm_leads', [])
      setLeads(cachedLeads)
    } finally {
      setLoading(false)
    }
  }

  // Load leads on mount
  useEffect(() => {
    fetchLeads()
  }, [])

  const createLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead | null> => {
    try {
      setError(null)
      
      const dbData = mapLeadToDb(leadData)
      
      const { data, error: insertError } = await supabase
        .from('crm_contacts')
        .insert([dbData])
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      const newLead = mapDbToLead(data)
      setLeads(prev => [newLead, ...prev])
      
      // Update cache
      const updatedLeads = [newLead, ...leads]
      saveToLocalStorage('crm_leads', updatedLeads)
      
      return newLead
    } catch (err) {
      console.error('Error creating lead:', err)
      setError(err instanceof Error ? err.message : 'Failed to create lead')
      return null
    }
  }

  const updateLead = async (id: string, updates: Partial<Lead>): Promise<boolean> => {
    try {
      setError(null)
      
      const dbUpdates = mapLeadToDb(updates)
      
      const { data, error: updateError } = await supabase
        .from('crm_contacts')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      const updatedLead = mapDbToLead(data)
      setLeads(prev => prev.map(lead => lead.id === id ? updatedLead : lead))
      
      // Update cache
      const updatedLeads = leads.map(lead => lead.id === id ? updatedLead : lead)
      saveToLocalStorage('crm_leads', updatedLeads)
      
      return true
    } catch (err) {
      console.error('Error updating lead:', err)
      setError(err instanceof Error ? err.message : 'Failed to update lead')
      return false
    }
  }

  const deleteLead = async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      const { error: deleteError } = await supabase
        .from('crm_contacts')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      setLeads(prev => prev.filter(lead => lead.id !== id))
      
      // Update cache
      const updatedLeads = leads.filter(lead => lead.id !== id)
      saveToLocalStorage('crm_leads', updatedLeads)
      
      return true
    } catch (err) {
      console.error('Error deleting lead:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete lead')
      return false
    }
  }

  const getLeadById = (id: string): Lead | undefined => {
    return leads.find(lead => lead.id === id)
  }

  const getLeadsByStatus = (status: LeadStatus): Lead[] => {
    return leads.filter(lead => lead.status === status)
  }

  const searchLeads = (query: string): Lead[] => {
    if (!query.trim()) return leads
    
    const lowerQuery = query.toLowerCase()
    return leads.filter(lead =>
      lead.firstName.toLowerCase().includes(lowerQuery) ||
      lead.lastName.toLowerCase().includes(lowerQuery) ||
      lead.email.toLowerCase().includes(lowerQuery) ||
      lead.phone.includes(query) ||
      lead.source.toLowerCase().includes(lowerQuery) ||
      lead.notes.toLowerCase().includes(lowerQuery)
    )
  }

  const getLeadStats = () => {
    const total = leads.length
    const byStatus = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1
      return acc
    }, {} as Record<LeadStatus, number>)
    
    const avgScore = leads.length > 0 
      ? leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / leads.length 
      : 0
    
    const recentActivity = leads.filter(lead => 
      lead.lastActivity && 
      new Date(lead.lastActivity).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)
    ).length

    return { total, byStatus, avgScore, recentActivity }
  }

  const refreshLeads = async () => {
    await fetchLeads()
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
    searchLeads,
    getLeadStats,
    refreshLeads
  }
}