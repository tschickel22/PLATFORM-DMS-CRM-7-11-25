import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { mockCrmSalesDeal } from '@/mocks/crmSalesDealMock'

export interface Deal {
  id: string
  customer_id?: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  vehicle_id?: string
  vehicle_info?: string
  stage: string
  amount: number
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

export interface Territory {
  id: string
  name: string
  description?: string
  rep_ids: string[]
  zipcodes: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WinLossReport {
  id: string
  deal_id: string
  outcome: string
  reason?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ApprovalWorkflow {
  id: string
  deal_id: string
  workflow_type: string
  status: string
  approver_id?: string
  approved_at?: string
  notes?: string
  created_at: string
  updated_at: string
}

export function useDealManagement() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [deals, setDeals] = useState<Deal[]>([])
  const [territories, setTerritories] = useState<Territory[]>([])
  const [winLossReports, setWinLossReports] = useState<WinLossReport[]>([])
  const [approvalWorkflows, setApprovalWorkflows] = useState<ApprovalWorkflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all data when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchAllData()
    } else {
      // Clear data when user is not authenticated
      setDeals([])
      setTerritories([])
      setWinLossReports([])
      setApprovalWorkflows([])
      setLoading(false)
      setError(null)
    }
  }, [user])

  const fetchAllData = async () => {
    if (!user) {
      console.log('User not authenticated, skipping data fetch')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('Starting to fetch CRM Sales Deal data...')
      
      // Fetch deals
      await fetchDeals()
      
      // Fetch territories
      await fetchTerritories()
      
      // Fetch win/loss reports
      await fetchWinLossReports()
      
      // Fetch approval workflows
      await fetchApprovalWorkflows()
      
      console.log('Successfully fetched all CRM Sales Deal data')
      
    } catch (error) {
      console.error('Global error in useDealManagement:', error)
      setError('Failed to load sales deal data')
      
      toast({
        title: 'Data Loading Error',
        description: 'Unable to load sales deal data. Please try refreshing the page.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchDeals = async () => {
    try {
      console.log('Fetching deals...')
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Deals table does not exist, using empty array')
          setDeals([])
          return
        }
        throw error
      }

      console.log('Deals fetched successfully:', data?.length || 0, 'records')
      setDeals(data || [])
      
    } catch (error) {
      console.error('Error fetching deals:', error)
      console.error('Full error stack:', error)
      
      // Fallback to empty array on error
      setDeals([])
      
      if (error instanceof Error && !error.message.includes('PGRST116')) {
        toast({
          title: 'Error Loading Deals',
          description: `Failed to fetch deals: ${error.message}`,
          variant: 'destructive'
        })
      }
    }
  }

  const fetchTerritories = async () => {
    try {
      console.log('Fetching territories...')
      const { data, error } = await supabase
        .from('territories')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Territories table does not exist, using empty array')
          setTerritories([])
          return
        }
        throw error
      }

      console.log('Territories fetched successfully:', data?.length || 0, 'records')
      setTerritories(data || [])
      
    } catch (error) {
      console.error('Error fetching territories:', error)
      console.error('Full error stack:', error)
      
      // Fallback to empty array on error
      setTerritories([])
    }
  }

  const fetchWinLossReports = async () => {
    try {
      console.log('Fetching win/loss reports...')
      const { data, error } = await supabase
        .from('win_loss_reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Win/loss reports table does not exist, using empty array')
          setWinLossReports([])
          return
        }
        throw error
      }

      console.log('Win/loss reports fetched successfully:', data?.length || 0, 'records')
      setWinLossReports(data || [])
      
    } catch (error) {
      console.error('Error fetching win/loss reports:', error)
      console.error('Full error stack:', error)
      
      // Fallback to empty array on error
      setWinLossReports([])
    }
  }

  const fetchApprovalWorkflows = async () => {
    try {
      console.log('Fetching approval workflows...')
      const { data, error } = await supabase
        .from('approval_workflows')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Approval workflows table does not exist, using empty array')
          setApprovalWorkflows([])
          return
        }
        throw error
      }

      console.log('Approval workflows fetched successfully:', data?.length || 0, 'records')
      setApprovalWorkflows(data || [])
      
    } catch (error) {
      console.error('Error fetching approval workflows:', error)
      console.error('Full error stack:', error)
      
      // Fallback to empty array on error
      setApprovalWorkflows([])
    }
  }

  const createDeal = async (dealData: Partial<Deal>): Promise<Deal | null> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to create deals',
        variant: 'destructive'
      })
      return null
    }

    try {
      console.log('Creating new deal:', dealData)
      
      const { data, error } = await supabase
        .from('deals')
        .insert([{
          ...dealData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Deals table does not exist, cannot create deal')
          toast({
            title: 'Database Error',
            description: 'Deals table not found. Please contact support.',
            variant: 'destructive'
          })
          return null
        }
        throw error
      }

      console.log('Deal created successfully:', data)
      
      // Add to local state
      setDeals(prev => [data, ...prev])
      
      toast({
        title: 'Deal Created',
        description: 'New deal has been created successfully'
      })
      
      return data
      
    } catch (error) {
      console.error('Error creating deal:', error)
      console.error('Full error stack:', error)
      
      toast({
        title: 'Error Creating Deal',
        description: error instanceof Error ? error.message : 'Failed to create deal',
        variant: 'destructive'
      })
      
      return null
    }
  }

  const updateDeal = async (id: string, updates: Partial<Deal>): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to update deals',
        variant: 'destructive'
      })
      return false
    }

    try {
      console.log('Updating deal:', id, updates)
      
      const { data, error } = await supabase
        .from('deals')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Deals table does not exist, cannot update deal')
          return false
        }
        throw error
      }

      console.log('Deal updated successfully:', data)
      
      // Update local state
      setDeals(prev => prev.map(deal => 
        deal.id === id ? { ...deal, ...data } : deal
      ))
      
      toast({
        title: 'Deal Updated',
        description: 'Deal has been updated successfully'
      })
      
      return true
      
    } catch (error) {
      console.error('Error updating deal:', error)
      console.error('Full error stack:', error)
      
      toast({
        title: 'Error Updating Deal',
        description: error instanceof Error ? error.message : 'Failed to update deal',
        variant: 'destructive'
      })
      
      return false
    }
  }

  const deleteDeal = async (id: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to delete deals',
        variant: 'destructive'
      })
      return false
    }

    try {
      console.log('Deleting deal:', id)
      
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id)

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Deals table does not exist, cannot delete deal')
          return false
        }
        throw error
      }

      console.log('Deal deleted successfully')
      
      // Remove from local state
      setDeals(prev => prev.filter(deal => deal.id !== id))
      
      toast({
        title: 'Deal Deleted',
        description: 'Deal has been deleted successfully'
      })
      
      return true
      
    } catch (error) {
      console.error('Error deleting deal:', error)
      console.error('Full error stack:', error)
      
      toast({
        title: 'Error Deleting Deal',
        description: error instanceof Error ? error.message : 'Failed to delete deal',
        variant: 'destructive'
      })
      
      return false
    }
  }

  const createTerritory = async (territoryData: Partial<Territory>): Promise<Territory | null> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to create territories',
        variant: 'destructive'
      })
      return null
    }

    try {
      console.log('Creating new territory:', territoryData)
      
      const { data, error } = await supabase
        .from('territories')
        .insert([{
          ...territoryData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Territories table does not exist, cannot create territory')
          return null
        }
        throw error
      }

      console.log('Territory created successfully:', data)
      
      // Add to local state
      setTerritories(prev => [data, ...prev])
      
      toast({
        title: 'Territory Created',
        description: 'New territory has been created successfully'
      })
      
      return data
      
    } catch (error) {
      console.error('Error creating territory:', error)
      console.error('Full error stack:', error)
      
      toast({
        title: 'Error Creating Territory',
        description: error instanceof Error ? error.message : 'Failed to create territory',
        variant: 'destructive'
      })
      
      return null
    }
  }

  const updateTerritory = async (id: string, updates: Partial<Territory>): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to update territories',
        variant: 'destructive'
      })
      return false
    }

    try {
      console.log('Updating territory:', id, updates)
      
      const { data, error } = await supabase
        .from('territories')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Territories table does not exist, cannot update territory')
          return false
        }
        throw error
      }

      console.log('Territory updated successfully:', data)
      
      // Update local state
      setTerritories(prev => prev.map(territory => 
        territory.id === id ? { ...territory, ...data } : territory
      ))
      
      toast({
        title: 'Territory Updated',
        description: 'Territory has been updated successfully'
      })
      
      return true
      
    } catch (error) {
      console.error('Error updating territory:', error)
      console.error('Full error stack:', error)
      
      toast({
        title: 'Error Updating Territory',
        description: error instanceof Error ? error.message : 'Failed to update territory',
        variant: 'destructive'
      })
      
      return false
    }
  }

  const deleteTerritory = async (id: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to delete territories',
        variant: 'destructive'
      })
      return false
    }

    try {
      console.log('Deleting territory:', id)
      
      const { error } = await supabase
        .from('territories')
        .delete()
        .eq('id', id)

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Territories table does not exist, cannot delete territory')
          return false
        }
        throw error
      }

      console.log('Territory deleted successfully')
      
      // Remove from local state
      setTerritories(prev => prev.filter(territory => territory.id !== id))
      
      toast({
        title: 'Territory Deleted',
        description: 'Territory has been deleted successfully'
      })
      
      return true
      
    } catch (error) {
      console.error('Error deleting territory:', error)
      console.error('Full error stack:', error)
      
      toast({
        title: 'Error Deleting Territory',
        description: error instanceof Error ? error.message : 'Failed to delete territory',
        variant: 'destructive'
      })
      
      return false
    }
  }

  return {
    // Data
    deals: deals || [],
    territories: territories || [],
    winLossReports: winLossReports || [],
    approvalWorkflows: approvalWorkflows || [],
    
    // State
    loading,
    error,
    
    // Actions
    createDeal,
    updateDeal,
    deleteDeal,
    createTerritory,
    updateTerritory,
    deleteTerritory,
    refreshData: fetchAllData
  }
}