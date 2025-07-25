import { supabase } from '@/lib/supabaseClient'

export interface CreateDealData {
  customer_name: string
  customer_email?: string
  customer_phone?: string
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
  notes?: string
}

export interface UpdateDealData {
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  vehicle_info?: string
  stage?: string
  amount?: number
  source?: string
  type?: string
  priority?: string
  rep_id?: string
  rep_name?: string
  probability?: number
  expected_close_date?: string
  notes?: string
}

export interface CreateApprovalWorkflowData {
  deal_id: string
  workflow_type: string
  status?: string
  approver_id?: string
  notes?: string
}

export interface CreateWinLossReportData {
  deal_id: string
  outcome: string
  reason?: string
  notes?: string
}

export async function createDeal(dealData: CreateDealData) {
  try {
    const { data, error } = await supabase
      .from('deals')
      .insert([dealData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating deal:', error)
      throw new Error(`Failed to create deal: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in createDeal:', error)
    throw error
  }
}

export async function updateDeal(dealId: string, updates: UpdateDealData) {
  try {
    const { data, error } = await supabase
      .from('deals')
      .update(updates)
      .eq('id', dealId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating deal:', error)
      throw new Error(`Failed to update deal: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in updateDeal:', error)
    throw error
  }
}

export async function updateDealStage(dealId: string, newStage: string) {
  return updateDeal(dealId, { stage: newStage })
}

export async function deleteDeal(dealId: string) {
  try {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', dealId)
    
    if (error) {
      console.error('Error deleting deal:', error)
      throw new Error(`Failed to delete deal: ${error.message}`)
    }
    
    return true
  } catch (error) {
    console.error('Error in deleteDeal:', error)
    throw error
  }
}

export async function createApprovalWorkflow(workflowData: CreateApprovalWorkflowData) {
  try {
    const { data, error } = await supabase
      .from('approval_workflows')
      .insert([workflowData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating approval workflow:', error)
      throw new Error(`Failed to create approval workflow: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in createApprovalWorkflow:', error)
    throw error
  }
}

export async function updateApprovalWorkflow(workflowId: string, updates: Partial<CreateApprovalWorkflowData>) {
  try {
    const { data, error } = await supabase
      .from('approval_workflows')
      .update(updates)
      .eq('id', workflowId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating approval workflow:', error)
      throw new Error(`Failed to update approval workflow: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in updateApprovalWorkflow:', error)
    throw error
  }
}

export async function createWinLossReport(reportData: CreateWinLossReportData) {
  try {
    const { data, error } = await supabase
      .from('win_loss_reports')
      .insert([reportData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating win/loss report:', error)
      throw new Error(`Failed to create win/loss report: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in createWinLossReport:', error)
    throw error
  }
}

export async function createContact(contactData: any) {
  try {
    const { data, error } = await supabase
      .from('crm_contacts')
      .insert([contactData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating contact:', error)
      throw new Error(`Failed to create contact: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in createContact:', error)
    throw error
  }
}

export async function updateContact(contactId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('crm_contacts')
      .update(updates)
      .eq('id', contactId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating contact:', error)
      throw new Error(`Failed to update contact: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in updateContact:', error)
    throw error
  }
}

export async function deleteContact(contactId: string) {
  try {
    const { error } = await supabase
      .from('crm_contacts')
      .delete()
      .eq('id', contactId)
    
    if (error) {
      console.error('Error deleting contact:', error)
      throw new Error(`Failed to delete contact: ${error.message}`)
    }
    
    return true
  } catch (error) {
    console.error('Error in deleteContact:', error)
    throw error
  }
}

export async function createTerritory(territoryData: any) {
  try {
    const { data, error } = await supabase
      .from('territories')
      .insert([territoryData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating territory:', error)
      throw new Error(`Failed to create territory: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in createTerritory:', error)
    throw error
  }
}

export async function updateTerritory(territoryId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('territories')
      .update(updates)
      .eq('id', territoryId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating territory:', error)
      throw new Error(`Failed to update territory: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Error in updateTerritory:', error)
    throw error
  }
}