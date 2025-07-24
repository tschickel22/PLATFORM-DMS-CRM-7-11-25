import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
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
  const { user } = useAuth()
  const { toast } = useToast()
  const [deals, setDeals] = useState<Deal[]>([])
  const [territories, setTerritories] = useState<Territory[]>([])
  const [approvalWorkflows, setApprovalWorkflows] = useState<ApprovalWorkflow[]>([])
  const [winLossReports, setWinLossReports] = useState<WinLossReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is authenticated before making requests
  const isAuthenticated = !!user

  // Load deals from Supabase
  const fetchDeals = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping deals fetch')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Check if deals table exists first
      const { data: tableExists } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'deals')
        .eq('table_schema', 'public')
        .single()
      
      if (!tableExists) {
        console.log('Deals table does not exist yet')
        setDeals([])
        return
      }
      
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.log('Deals table does not exist yet')
          setDeals([])
          setError(null)
        } else {
          console.error('Error fetching deals:', error)
          setError(error.message)
          toast({
            title: 'Database Error',
            description: 'Failed to load deals. Please check your database connection.',
            variant: 'destructive'
          })
        }
        return
      }

      const mappedDeals = (data || []).map((row: any) => ({
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
      console.error('Error in fetchDeals:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch deals')
      setDeals([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  // Load territories from Supabase
  const fetchTerritories = async () => {
    if (!isAuthenticated) return

    try {
      // Check if territories table exists first
      const { data: tableExists } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'territories')
        .eq('table_schema', 'public')
        .single()
      
      if (!tableExists) {
        console.log('Territories table does not exist yet')
        setTerritories([])
        return
      }
      
      const { data, error } = await supabase
        .from('territories')
        .select('*')
        .order('name')

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.log('Territories table does not exist yet')
          setTerritories([])
        } else {
          console.error('Error fetching territories:', error)
        }
        return
      }

      setTerritories(data || [])
    } catch (err) {
      console.error('Error in fetchTerritories:', err)
      setTerritories([])
    }
  }

  const fetchApprovalWorkflows = async () => {
    if (!isAuthenticated) return

    try {
      // Check if approval_workflows table exists first
      const { data: tableExists } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'approval_workflows')
        .eq('table_schema', 'public')
        .single()
      
      if (!tableExists) {
        console.log('Approval workflows table does not exist yet')
        setApprovalWorkflows([])
        return
      }
      
      const { data, error } = await supabase
        .from('approval_workflows')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.log('Approval workflows table does not exist yet')
          setApprovalWorkflows([])
        } else {
          console.error('Error fetching approval workflows:', error)
        }
        return
      }

      setApprovalWorkflows(data || [])
    } catch (err) {
      console.error('Error in fetchApprovalWorkflows:', err)
      setApprovalWorkflows([])
    }
  }

  const fetchWinLossReports = async () => {
    if (!isAuthenticated) return

    try {
      // Check if win_loss_reports table exists first
      const { data: tableExists } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'win_loss_reports')
        .eq('table_schema', 'public')
        .single()
      
      if (!tableExists) {
        console.log('Win/loss reports table does not exist yet')
        setWinLossReports([])
        return
      }
      
      const { data, error } = await supabase
        .from('win_loss_reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.log('Win/loss reports table does not exist yet')
          setWinLossReports([])
        } else {
          console.error('Error fetching win/loss reports:', error)
        }
        return
      }

      setWinLossReports(data || [])
    } catch (err) {
      console.error('Error in fetchWinLossReports:', err)
      setWinLossReports([])
    }
  }

  // Load all data on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchDeals()
      fetchTerritories()
      fetchApprovalWorkflows()
      fetchWinLossReports()
    } else {
      // Clear data when not authenticated
      setDeals([])
      setTerritories([])
      setApprovalWorkflows([])
      setWinLossReports([])
      setLoading(false)
      setError(null)
    }
  }, [isAuthenticated])

  // Create new deal
  const createDeal = async (dealData: Partial<Deal>) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to create deals',
        variant: 'destructive'
      })
      return
    }

    try {
      // Check if deals table exists first
      const { data: tableExists } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'deals')
        .eq('table_schema', 'public')
        .single()
      
      if (!tableExists) {
        toast({
          title: 'Database Setup Required',
          description: 'Deals table needs to be created. Please run database migrations.',
          variant: 'destructive'
        })
        return
      }
      
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

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          toast({
            title: 'Database Setup Required',
            description: 'Please set up the deals table in your database',
            variant: 'destructive'
          })
        } else {
          console.error('Error creating deal:', error)
          toast({
            title: 'Error',
            description: 'Failed to create deal',
            variant: 'destructive'
          })
        }
        return
      }

      // Refresh deals list
      fetchDeals()
      
      toast({
        title: 'Deal Created',
        description: 'Deal has been created successfully'
      })
    } catch (err) {
      console.error('Error in createDeal:', err)
      toast({
        title: 'Error',
        description: 'Failed to create deal',
        variant: 'destructive'
      })
    }
  }

  // Update deal stage
  const updateDealStage = async (dealId: string, newStage: string) => {
    if (!isAuthenticated) return

    try {
      // Check if deals table exists first
      const { data: tableExists } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'deals')
        .eq('table_schema', 'public')
        .single()
      
      if (!tableExists) {
        toast({
          title: 'Database Setup Required',
          description: 'Deals table needs to be created. Please run database migrations.',
          variant: 'destructive'
        })
        return
      }
      
      const { error } = await supabase
        .from('deals')
        .update({ 
          stage: newStage,
          updated_at: new Date().toISOString()
        })
        .eq('id', dealId)

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          toast({
            title: 'Database Setup Required',
            description: 'Please set up the deals table in your database',
            variant: 'destructive'
          })
        } else {
          console.error('Error updating deal stage:', error)
          toast({
            title: 'Error',
            description: 'Failed to update deal stage',
            variant: 'destructive'
          })
        }
        return
      }

      // Refresh deals list
      fetchDeals()
    } catch (err) {
      console.error('Error in updateDealStage:', err)
      toast({
        title: 'Error',
        description: 'Failed to update deal stage',
        variant: 'destructive'
      })
    }
  }

  // Update deal
  const updateDeal = async (dealId: string, updates: Partial<Deal>): Promise<boolean> => {
    if (!isAuthenticated) return false

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
    if (!isAuthenticated) return false

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
    if (!isAuthenticated) return false

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
  const createApprovalWorkflow = async (dealId: string, workflowType: string) => {
    if (!isAuthenticated) return

    try {
      // Check if approval_workflows table exists first
      const { data: tableExists } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'approval_workflows')
        .eq('table_schema', 'public')
        .single()
      
      if (!tableExists) {
        console.log('Approval workflows table does not exist yet')
        return
      }
      
      const { error } = await supabase
        .from('approval_workflows')
        .insert([{
          deal_id: dealId,
          workflow_type: workflowType,
          status: 'pending',
          approvers: [],
          current_step: 0
        }])

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.log('Approval workflows table does not exist yet')
        } else {
          console.error('Error creating approval workflow:', error)
        }
        return
      }

      fetchApprovalWorkflows()
    } catch (err) {
      console.error('Error in createApprovalWorkflow:', err)
    }
  }

  // Create win/loss report
  const createWinLossReport = async (dealId: string, outcome: 'won' | 'lost', reportData: Partial<WinLossReport>) => {
    if (!isAuthenticated) return

    try {
      // Check if win_loss_reports table exists first
      const { data: tableExists } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'win_loss_reports')
        .eq('table_schema', 'public')
        .single()
      
      if (!tableExists) {
        console.log('Win/loss reports table does not exist yet')
        return
      }
      
      const { error } = await supabase
        .from('win_loss_reports')
        .insert([{
          deal_id: dealId,
          outcome,
          reason: reportData.reason || '',
          competitor_info: reportData.competitorInfo,
          feedback: reportData.feedback
        }])

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.log('Win/loss reports table does not exist yet')
        } else {
          console.error('Error creating win/loss report:', error)
        }
        return
      }

      fetchWinLossReports()
    } catch (err) {
      console.error('Error in createWinLossReport:', err)
    }
  }

  // Calculate deal metrics
  const getDealMetrics = () => {
    if (!deals || deals.length === 0) {
      return {
        totalDeals: 0,
        totalValue: 0,
        averageDealSize: 0,
        winRate: 0,
        wonDeals: 0,
        averageSalesCycle: 0
      }
    }
    
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

  // Add error boundary for the entire hook
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error in useDealManagement:', event.error)
    }
    
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  return {
    deals,
    territories,
    approvalWorkflows,
    winLossReports,
    createDeal,
    updateDeal,
    updateDealStage,
    deleteDeal,
    assignTerritory,
    createApprovalWorkflow,
    createWinLossReport,
    getDealMetrics,
    loading,
    error,
    // Add safe fallback functions
    createDealSafe: createDeal,
    updateDealStageSafe: updateDealStage,
    refreshDeals: fetchDeals
  }
}