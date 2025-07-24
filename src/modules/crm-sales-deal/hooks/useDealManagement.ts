import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/hooks/use-toast'

export interface Deal {
  id: string
  name: string
  customerId: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  vehicleId?: string
  vehicleInfo?: string
  stage: string
  amount: number
  source: string
  type: string
  priority: string
  repId?: string
  repName?: string
  probability: number
  expectedCloseDate: string
  territoryId?: string
  requiresApproval?: boolean
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Territory {
  id: string
  name: string
  description: string
  repIds: string[]
  zipcodes: string[]
  isActive: boolean
}

export interface ApprovalWorkflow {
  id: string
  dealId: string
  workflowType: string
  status: string
  approvers: string[]
  currentStep: number
  createdAt: string
}

export interface WinLossReport {
  id: string
  dealId: string
  outcome: 'won' | 'lost'
  reason: string
  competitorInfo?: string
  feedback?: string
  createdAt: string
}

export interface DealMetrics {
  totalDeals: number
  totalValue: number
  averageDealSize: number
  winRate: number
  wonDeals: number
  averageSalesCycle: number
}

export function useDealManagement() {
  const { toast } = useToast()
  const [deals, setDeals] = useState<Deal[]>([])
  const [territories, setTerritories] = useState<Territory[]>([])
  const [approvalWorkflows, setApprovalWorkflows] = useState<ApprovalWorkflow[]>([])
  const [winLossReports, setWinLossReports] = useState<WinLossReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load deals from Supabase
  const loadDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const mappedDeals: Deal[] = (data || []).map(row => ({
        id: row.id,
        name: row.name || `Deal ${row.id.slice(-6)}`,
        customerId: row.customer_id || '',
        customerName: row.customer_name || '',
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        vehicleId: row.vehicle_id,
        vehicleInfo: row.vehicle_info,
        stage: row.stage || 'New',
        amount: row.amount || 0,
        source: row.source || 'Unknown',
        type: row.type || 'New Sale',
        priority: row.priority || 'Medium',
        repId: row.rep_id,
        repName: row.rep_name,
        probability: row.probability || 0,
        expectedCloseDate: row.expected_close_date || new Date().toISOString().split('T')[0],
        territoryId: row.territory_id,
        requiresApproval: row.requires_approval || false,
        status: row.status || 'Active',
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))

      setDeals(mappedDeals)
    } catch (err) {
      console.error('Error loading deals:', err)
      setError(err instanceof Error ? err.message : 'Failed to load deals')
      setDeals([]) // Ensure deals is always an array
    }
  }

  // Load territories from Supabase
  const loadTerritories = async () => {
    try {
      const { data, error } = await supabase
        .from('territories')
        .select('*')
        .eq('is_active', true)

      if (error) throw error

      const mappedTerritories: Territory[] = (data || []).map(row => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        repIds: row.rep_ids || [],
        zipcodes: row.zipcodes || [],
        isActive: row.is_active
      }))

      setTerritories(mappedTerritories)
    } catch (err) {
      console.error('Error loading territories:', err)
      setTerritories([])
    }
  }

  // Load approval workflows from Supabase
  const loadApprovalWorkflows = async () => {
    try {
      const { data, error } = await supabase
        .from('approval_workflows')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const mappedWorkflows: ApprovalWorkflow[] = (data || []).map(row => ({
        id: row.id,
        dealId: row.deal_id,
        workflowType: row.workflow_type,
        status: row.status,
        approvers: row.approvers || [],
        currentStep: row.current_step || 0,
        createdAt: row.created_at
      }))

      setApprovalWorkflows(mappedWorkflows)
    } catch (err) {
      console.error('Error loading approval workflows:', err)
      setApprovalWorkflows([])
    }
  }

  // Load win/loss reports from Supabase
  const loadWinLossReports = async () => {
    try {
      const { data, error } = await supabase
        .from('win_loss_reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const mappedReports: WinLossReport[] = (data || []).map(row => ({
        id: row.id,
        dealId: row.deal_id,
        outcome: row.outcome,
        reason: row.reason,
        competitorInfo: row.competitor_info,
        feedback: row.feedback,
        createdAt: row.created_at
      }))

      setWinLossReports(mappedReports)
    } catch (err) {
      console.error('Error loading win/loss reports:', err)
      setWinLossReports([])
    }
  }

  // Load all data on mount
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true)
      setError(null)
      
      await Promise.all([
        loadDeals(),
        loadTerritories(),
        loadApprovalWorkflows(),
        loadWinLossReports()
      ])
      
      setLoading(false)
    }

    loadAllData()
  }, [])

  // Create new deal
  const createDeal = async (dealData: Partial<Deal>): Promise<Deal | null> => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .insert([{
          name: dealData.name,
          customer_id: dealData.customerId,
          customer_name: dealData.customerName,
          customer_email: dealData.customerEmail,
          customer_phone: dealData.customerPhone,
          vehicle_id: dealData.vehicleId,
          vehicle_info: dealData.vehicleInfo,
          stage: dealData.stage || 'New',
          amount: dealData.amount || 0,
          source: dealData.source || 'Unknown',
          type: dealData.type || 'New Sale',
          priority: dealData.priority || 'Medium',
          rep_id: dealData.repId,
          rep_name: dealData.repName,
          probability: dealData.probability || 0,
          expected_close_date: dealData.expectedCloseDate,
          territory_id: dealData.territoryId,
          requires_approval: dealData.requiresApproval || false,
          status: dealData.status || 'Active',
          notes: dealData.notes
        }])
        .select()
        .single()

      if (error) throw error

      const newDeal: Deal = {
        id: data.id,
        name: data.name,
        customerId: data.customer_id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        vehicleId: data.vehicle_id,
        vehicleInfo: data.vehicle_info,
        stage: data.stage,
        amount: data.amount,
        source: data.source,
        type: data.type,
        priority: data.priority,
        repId: data.rep_id,
        repName: data.rep_name,
        probability: data.probability,
        expectedCloseDate: data.expected_close_date,
        territoryId: data.territory_id,
        requiresApproval: data.requires_approval,
        status: data.status,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }

      setDeals(prev => [newDeal, ...prev])
      
      toast({
        title: 'Deal Created',
        description: `Deal "${newDeal.name}" has been created successfully.`
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

  // Update deal stage
  const updateDealStage = async (dealId: string, newStage: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({ 
          stage: newStage,
          updated_at: new Date().toISOString()
        })
        .eq('id', dealId)

      if (error) throw error

      setDeals(prev => prev.map(deal => 
        deal.id === dealId 
          ? { ...deal, stage: newStage, updatedAt: new Date().toISOString() }
          : deal
      ))

      return true
    } catch (err) {
      console.error('Error updating deal stage:', err)
      toast({
        title: 'Error',
        description: 'Failed to update deal stage. Please try again.',
        variant: 'destructive'
      })
      return false
    }
  }

  // Update deal
  const updateDeal = async (dealId: string, updates: Partial<Deal>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({
          name: updates.name,
          customer_id: updates.customerId,
          customer_name: updates.customerName,
          customer_email: updates.customerEmail,
          customer_phone: updates.customerPhone,
          vehicle_id: updates.vehicleId,
          vehicle_info: updates.vehicleInfo,
          stage: updates.stage,
          amount: updates.amount,
          source: updates.source,
          type: updates.type,
          priority: updates.priority,
          rep_id: updates.repId,
          rep_name: updates.repName,
          probability: updates.probability,
          expected_close_date: updates.expectedCloseDate,
          territory_id: updates.territoryId,
          requires_approval: updates.requiresApproval,
          status: updates.status,
          notes: updates.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', dealId)

      if (error) throw error

      setDeals(prev => prev.map(deal => 
        deal.id === dealId 
          ? { ...deal, ...updates, updatedAt: new Date().toISOString() }
          : deal
      ))

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

  // Delete deal
  const deleteDeal = async (dealId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId)

      if (error) throw error

      setDeals(prev => prev.filter(deal => deal.id !== dealId))

      toast({
        title: 'Deal Deleted',
        description: 'Deal has been deleted successfully.'
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

  // Assign territory
  const assignTerritory = async (dealId: string, territoryId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({ 
          territory_id: territoryId,
          updated_at: new Date().toISOString()
        })
        .eq('id', dealId)

      if (error) throw error

      setDeals(prev => prev.map(deal => 
        deal.id === dealId 
          ? { ...deal, territoryId, updatedAt: new Date().toISOString() }
          : deal
      ))

      return true
    } catch (err) {
      console.error('Error assigning territory:', err)
      return false
    }
  }

  // Create approval workflow
  const createApprovalWorkflow = async (dealId: string, workflowType: string): Promise<ApprovalWorkflow | null> => {
    try {
      const { data, error } = await supabase
        .from('approval_workflows')
        .insert([{
          deal_id: dealId,
          workflow_type: workflowType,
          status: 'pending',
          approvers: [],
          current_step: 0
        }])
        .select()
        .single()

      if (error) throw error

      const newWorkflow: ApprovalWorkflow = {
        id: data.id,
        dealId: data.deal_id,
        workflowType: data.workflow_type,
        status: data.status,
        approvers: data.approvers || [],
        currentStep: data.current_step,
        createdAt: data.created_at
      }

      setApprovalWorkflows(prev => [newWorkflow, ...prev])
      return newWorkflow
    } catch (err) {
      console.error('Error creating approval workflow:', err)
      return null
    }
  }

  // Create win/loss report
  const createWinLossReport = async (dealId: string, outcome: 'won' | 'lost', reportData: Partial<WinLossReport>): Promise<WinLossReport | null> => {
    try {
      const { data, error } = await supabase
        .from('win_loss_reports')
        .insert([{
          deal_id: dealId,
          outcome,
          reason: reportData.reason || '',
          competitor_info: reportData.competitorInfo,
          feedback: reportData.feedback
        }])
        .select()
        .single()

      if (error) throw error

      const newReport: WinLossReport = {
        id: data.id,
        dealId: data.deal_id,
        outcome: data.outcome,
        reason: data.reason,
        competitorInfo: data.competitor_info,
        feedback: data.feedback,
        createdAt: data.created_at
      }

      setWinLossReports(prev => [newReport, ...prev])
      return newReport
    } catch (err) {
      console.error('Error creating win/loss report:', err)
      return null
    }
  }

  // Calculate deal metrics
  const getDealMetrics = (): DealMetrics => {
    const totalDeals = deals.length
    const totalValue = deals.reduce((sum, deal) => sum + deal.amount, 0)
    const averageDealSize = totalDeals > 0 ? totalValue / totalDeals : 0
    const wonDeals = deals.filter(deal => deal.stage === 'Closed Won').length
    const winRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0
    const averageSalesCycle = 30 // Placeholder - would calculate from actual data

    return {
      totalDeals,
      totalValue,
      averageDealSize,
      winRate,
      wonDeals,
      averageSalesCycle
    }
  }

  return {
    deals,
    territories,
    approvalWorkflows,
    winLossReports,
    loading,
    error,
    createDeal,
    updateDeal,
    updateDealStage,
    deleteDeal,
    assignTerritory,
    createApprovalWorkflow,
    createWinLossReport,
    getDealMetrics,
    refreshDeals: loadDeals
  }
}