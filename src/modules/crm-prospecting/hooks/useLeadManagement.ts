import { supabase } from '@/lib/supabaseClient'

export interface CreateContactData {
  first_name: string
  last_name: string
  email: string
  phone?: string
  source: string
  source_id?: string
  status?: string
  assigned_to?: string
  notes?: string
  score?: number
  custom_fields?: any
}

export interface UpdateContactData {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  source?: string
  source_id?: string
  status?: string
  assigned_to?: string
  notes?: string
  score?: number
  last_activity?: string
  custom_fields?: any
}

export async function createLead(contactData: CreateContactData) {
  try {
    const { data, error } = await supabase
      .from('crm_contacts')
      .insert([{
        ...contactData,
        status: contactData.status || 'new'
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating lead:', error)
      throw new Error(`Failed to create lead: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in createLead:', error)
    throw error
  }
}

export async function updateLead(contactId: string, updates: UpdateContactData) {
  try {
    const updateData = {
      ...updates,
      last_activity: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('crm_contacts')
      .update(updateData)
      .eq('id', contactId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating lead:', error)
      throw new Error(`Failed to update lead: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in updateLead:', error)
    throw error
  }
}

export async function updateLeadStatus(contactId: string, newStatus: string) {
  return updateLead(contactId, { status: newStatus })
}

export async function updateLeadScore(contactId: string, newScore: number) {
  return updateLead(contactId, { score: newScore })
}

export async function assignLead(contactId: string, assignedTo: string) {
  return updateLead(contactId, { assigned_to: assignedTo })
}

export async function deleteLead(contactId: string) {
  try {
    const { error } = await supabase
      .from('crm_contacts')
      .delete()
      .eq('id', contactId)
    
    if (error) {
      console.error('Error deleting lead:', error)
      throw new Error(`Failed to delete lead: ${error.message}`)
    }
    
    return true
  } catch (error) {
    console.error('Error in deleteLead:', error)
    throw error
  }
}

export async function bulkUpdateLeads(contactIds: string[], updates: UpdateContactData) {
  try {
    const updateData = {
      ...updates,
      last_activity: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('crm_contacts')
      .update(updateData)
      .in('id', contactIds)
      .select()
    
    if (error) {
      console.error('Error bulk updating leads:', error)
      throw new Error(`Failed to bulk update leads: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in bulkUpdateLeads:', error)
    throw error
  }
}

export async function searchLeads(query: string) {
  try {
    const { data, error } = await supabase
      .from('crm_contacts')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error searching leads:', error)
      throw new Error(`Failed to search leads: ${error.message}`)
    }
    
    return data || []
  } catch (error) {
    console.error('Error in searchLeads:', error)
    throw error
  }
}

export async function getLeadsByStatus(status: string) {
  try {
    const { data, error } = await supabase
      .from('crm_contacts')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error getting leads by status:', error)
      throw new Error(`Failed to get leads by status: ${error.message}`)
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getLeadsByStatus:', error)
    throw error
  }
}

export async function getLeadsByAssignee(assignedTo: string) {
  try {
    const { data, error } = await supabase
      .from('crm_contacts')
      .select('*')
      .eq('assigned_to', assignedTo)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error getting leads by assignee:', error)
      throw new Error(`Failed to get leads by assignee: ${error.message}`)
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getLeadsByAssignee:', error)
    throw error
  }
}