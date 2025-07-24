import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export function useDealManagement() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [deals, setDeals] = useState<any[]>([])
  const [territories, setTerritories] = useState<any[]>([])
  const [approvalWorkflows, setApprovalWorkflows] = useState<any[]>([])
  const [winLossReports, setWinLossReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is authenticated before making any requests
  const isAuthenticated = !!user

  const fetchDeals = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping deals fetch')
      setDeals([])
      return
    }

    try {
      console.log('Fetching deals from Supabase...')
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Deals table does not exist yet, using empty array')
          setDeals([])
          return
        }
        throw error
      }

      console.log('Deals fetched successfully:', data?.length || 0)
      setDeals(data || [])
    } catch (error: any) {
      console.error('Error fetching deals:', error)
      setError(`Failed to fetch deals: ${error.message}`)
      setDeals([])
      
      toast({
        title: 'Error Loading Deals',
        description: 'Unable to load deals. Please check your connection.',
        variant: 'destructive'
      })
    }
  }

  const fetchTerritories = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping territories fetch')
      setTerritories([])
      return
    }

    try {
      console.log('Fetching territories from Supabase...')
      const { data, error } = await supabase
        .from('territories')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Territories table does not exist yet, using empty array')
          setTerritories([])
          return
        }
        throw error
      }

      console.log('Territories fetched successfully:', data?.length || 0)
      setTerritories(data || [])
    } catch (error: any) {
      console.error('Error fetching territories:', error)
      setTerritories([])
    }
  }

  const fetchApprovalWorkflows = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping approval workflows fetch')
      setApprovalWorkflows([])
      return
    }

    try {
      console.log('Fetching approval workflows from Supabase...')
      const { data, error } = await supabase
        .from('approval_workflows')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Approval workflows table does not exist yet, using empty array')
          setApprovalWorkflows([])
          return
        }
        throw error
      }

      console.log('Approval workflows fetched successfully:', data?.length || 0)
      setApprovalWorkflows(data || [])
    } catch (error: any) {
      console.error('Error fetching approval workflows:', error)
      setApprovalWorkflows([])
    }
  }

  const fetchWinLossReports = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping win/loss reports fetch')
      setWinLossReports([])
      return
    }

    try {
      console.log('Fetching win/loss reports from Supabase...')
      const { data, error } = await supabase
        .from('win_loss_reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Win/loss reports table does not exist yet, using empty array')
          setWinLossReports([])
          return
        }
        throw error
      }

      console.log('Win/loss reports fetched successfully:', data?.length || 0)
      setWinLossReports(data || [])
    } catch (error: any) {
      console.error('Error fetching win/loss reports:', error)
      setWinLossReports([])
    }
  }

  const fetchAllData = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, clearing all data')
      setDeals([])
      setTerritories([])
      setApprovalWorkflows([])
      setWinLossReports([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('Starting to fetch all CRM sales deal data...')
      
      // Fetch all data in parallel
      await Promise.all([
        fetchDeals(),
        fetchTerritories(),
        fetchApprovalWorkflows(),
        fetchWinLossReports()
      ])

      console.log('All CRM sales deal data fetched successfully')
    } catch (error: any) {
      console.error('Global error in useDealManagement:', error)
      setError(`Failed to load data: ${error.message}`)
      
      toast({
        title: 'Error Loading Data',
        description: 'Unable to load sales deal data. Please refresh the page.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Load data when component mounts or authentication changes
  useEffect(() => {
    fetchAllData()
  }, [isAuthenticated])

  const createDeal = async (dealData: any) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to create deals.',
        variant: 'destructive'
      })
      return
    }

    try {
      console.log('Creating new deal:', dealData)
      
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

      if (error) {
        throw error
      }

      console.log('Deal created successfully:', data)
      
      // Refresh deals list
      await fetchDeals()
      
      toast({
        title: 'Deal Created',
        description: 'New deal has been created successfully.'
      })

      return data?.[0]
    } catch (error: any) {
      console.error('Error creating deal:', error)
      
      toast({
        title: 'Error Creating Deal',
        description: `Failed to create deal: ${error.message}`,
        variant: 'destructive'
      })
      
      throw error
    }
  }

  const updateDealStage = async (dealId: string, newStage: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to update deals.',
        variant: 'destructive'
      })
      return
    }

    try {
      console.log('Updating deal stage:', dealId, newStage)
      
      const { error } = await supabase
        .from('deals')
        .update({ stage: newStage })
        .eq('id', dealId)

      if (error) {
        throw error
      }

      console.log('Deal stage updated successfully')
      
      // Refresh deals list
      await fetchDeals()
      
      toast({
        title: 'Deal Updated',
        description: `Deal stage changed to ${newStage}.`
      })
    } catch (error: any) {
      console.error('Error updating deal stage:', error)
      
      toast({
        title: 'Error Updating Deal',
        description: `Failed to update deal: ${error.message}`,
        variant: 'destructive'
      })
      
      throw error
    }
  }

  const assignTerritory = async (dealId: string, territoryId: string) => {
    if (!isAuthenticated) {
      return
    }

    try {
      console.log('Assigning territory to deal:', dealId, territoryId)
      
      const { error } = await supabase
        .from('deals')
        .update({ territory_id: territoryId })
        .eq('id', dealId)

      if (error) {
        throw error
      }

      console.log('Territory assigned successfully')
      await fetchDeals()
    } catch (error: any) {
      console.error('Error assigning territory:', error)
      throw error
    }
  }

  const createApprovalWorkflow = async (dealId: string, workflowType: string) => {
    if (!isAuthenticated) {
      return
    }

    try {
      console.log('Creating approval workflow:', dealId, workflowType)
      
      const { data, error } = await supabase
        .from('approval_workflows')
        .insert([{
          deal_id: dealId,
          workflow_type: workflowType,
          status: 'pending'
        }])
        .select()

      if (error) {
        throw error
      }

      console.log('Approval workflow created successfully')
      await fetchApprovalWorkflows()
      
      return data?.[0]
    } catch (error: any) {
      console.error('Error creating approval workflow:', error)
      throw error
    }
  }

  const createWinLossReport = async (dealId: string, outcome: 'won' | 'lost', reportData: any) => {
    if (!isAuthenticated) {
      return
    }

    try {
      console.log('Creating win/loss report:', dealId, outcome, reportData)
      
      const { data, error } = await supabase
        .from('win_loss_reports')
        .insert([{
          deal_id: dealId,
          outcome,
          reason: reportData.reason || '',
          notes: reportData.notes || ''
        }])
        .select()

      if (error) {
        throw error
      }

      console.log('Win/loss report created successfully')
      await fetchWinLossReports()
      
      return data?.[0]
    } catch (error: any) {
      console.error('Error creating win/loss report:', error)
      throw error
    }
  }

  const getDealMetrics = () => {
    const totalDeals = deals.length
    const totalValue = deals.reduce((sum, deal) => sum + (deal.amount || 0), 0)
    const wonDeals = deals.filter(deal => deal.stage === 'Closed Won').length
    const lostDeals = deals.filter(deal => deal.stage === 'Closed Lost').length
    const winRate = totalDeals > 0 ? (wonDeals / (wonDeals + lostDeals)) * 100 : 0
    const averageDealSize = totalDeals > 0 ? totalValue / totalDeals : 0
    const averageSalesCycle = 21 // Mock value - in real app, calculate from deal data

    return {
      totalDeals,
      totalValue,
      wonDeals,
      lostDeals,
      winRate,
      averageDealSize,
      averageSalesCycle
    }
  }

  return {
    deals,
    territories,
    approvalWorkflows,
    winLossReports,
    createDeal,
    updateDealStage,
    assignTerritory,
    createApprovalWorkflow,
    createWinLossReport,
    getDealMetrics,
    loading,
    error,
    refetch: fetchAllData
  }
}