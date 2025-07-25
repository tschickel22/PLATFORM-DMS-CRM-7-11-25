import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Deal } from '@/types'
import { useToast } from '@/hooks/use-toast'

export function useCrmDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const loadDeals = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 [CRM Deals] Fetching deals from Supabase...')
      
      const { data, error: supabaseError } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        console.error('❌ [CRM Deals] Supabase error:', supabaseError.message)
        throw supabaseError
      }

      console.log(`✅ [CRM Deals] Fetched ${data?.length || 0} deals from Supabase`)
      
      // Transform data to match Deal interface
      const transformedDeals: Deal[] = (data || []).map(row => ({
        id: row.id,
        customer_id: row.customer_id,
        customer_name: row.customer_name || '',
        customer_email: row.customer_email || '',
        customer_phone: row.customer_phone || '',
        vehicle_id: row.vehicle_id,
        vehicle_info: row.vehicle_info || '',
        stage: row.stage || 'New',
        amount: row.amount || 0,
        source: row.source || '',
        type: row.type || 'New Sale',
        priority: row.priority || 'Medium',
        rep_id: row.rep_id,
        rep_name: row.rep_name || '',
        probability: row.probability || 0,
        expected_close_date: row.expected_close_date,
        notes: row.notes || '',
        created_at: row.created_at,
        updated_at: row.updated_at
      }))

      setDeals(transformedDeals)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('💥 [CRM Deals] Error loading deals:', errorMessage)
      setError(errorMessage)
      
      // Use mock data as fallback
      console.log('🔄 [CRM Deals] Using mock data as fallback')
      const mockDeals: Deal[] = [
        {
          id: 'deal-001',
          customer_id: 'cust-001',
          customer_name: 'John Smith',
          customer_email: 'john.smith@email.com',
          customer_phone: '(555) 123-4567',
          vehicle_id: 'vh-001',
          vehicle_info: '2023 Forest River Cherokee 274RK',
          stage: 'Qualified',
          amount: 45000,
          source: 'Website',
          type: 'New Sale',
          priority: 'High',
          rep_id: 'rep-001',
          rep_name: 'Sarah Johnson',
          probability: 75,
          expected_close_date: '2024-02-15',
          notes: 'Customer very interested, ready to move forward',
          created_at: '2024-01-10T09:30:00Z',
          updated_at: '2024-01-15T14:30:00Z'
        },
        {
          id: 'deal-002',
          customer_id: 'cust-002',
          customer_name: 'Maria Rodriguez',
          customer_email: 'maria.rodriguez@email.com',
          customer_phone: '(555) 987-6543',
          vehicle_id: 'vh-002',
          vehicle_info: '2024 Keystone Montana 3761FL',
          stage: 'Proposal',
          amount: 62000,
          source: 'Referral',
          type: 'New Sale',
          priority: 'Medium',
          rep_id: 'rep-002',
          rep_name: 'Mike Davis',
          probability: 60,
          expected_close_date: '2024-02-28',
          notes: 'Waiting for financing approval',
          created_at: '2024-01-12T11:15:00Z',
          updated_at: '2024-01-18T16:45:00Z'
        },
        {
          id: 'deal-003',
          customer_id: 'cust-003',
          customer_name: 'David Johnson',
          customer_email: 'david.johnson@email.com',
          customer_phone: '(555) 234-5678',
          vehicle_id: 'vh-003',
          vehicle_info: '2022 Grand Design Solitude 310GK',
          stage: 'Closed Won',
          amount: 48000,
          source: 'Trade Show',
          type: 'New Sale',
          priority: 'High',
          rep_id: 'rep-001',
          rep_name: 'Sarah Johnson',
          probability: 100,
          expected_close_date: '2024-01-20',
          notes: 'Deal closed successfully, customer very satisfied',
          created_at: '2024-01-08T13:20:00Z',
          updated_at: '2024-01-20T10:30:00Z'
        }
      ]
      setDeals(mockDeals)
    } finally {
      setLoading(false)
    }
  }

  const createDeal = async (dealData: Partial<Deal>): Promise<Deal> => {
    try {
      const newDeal = {
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
      }

      const { data, error } = await supabase
        .from('deals')
        .insert([newDeal])
        .select()
        .single()

      if (error) throw error

      const createdDeal: Deal = {
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

      setDeals(prev => [createdDeal, ...prev])
      
      toast({
        title: 'Deal Created',
        description: 'New deal has been created successfully'
      })

      return createdDeal
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create deal'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      throw err
    }
  }

  const updateDeal = async (id: string, updates: Partial<Deal>): Promise<void> => {
    try {
      const { error } = await supabase
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

      if (error) throw error

      setDeals(prev => prev.map(deal => 
        deal.id === id ? { ...deal, ...updates, updated_at: new Date().toISOString() } : deal
      ))

      toast({
        title: 'Deal Updated',
        description: 'Deal has been updated successfully'
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update deal'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      throw err
    }
  }

  const deleteDeal = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id)

      if (error) throw error

      setDeals(prev => prev.filter(deal => deal.id !== id))

      toast({
        title: 'Deal Deleted',
        description: 'Deal has been deleted successfully'
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete deal'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      throw err
    }
  }

  // Load deals on mount
  useEffect(() => {
    loadDeals()
  }, [])

  // Calculate pipeline metrics
  const metrics = {
    totalDeals: deals.length,
    totalValue: deals.reduce((sum, deal) => sum + (deal.amount || 0), 0),
    avgDealSize: deals.length > 0 ? deals.reduce((sum, deal) => sum + (deal.amount || 0), 0) / deals.length : 0,
    winRate: deals.length > 0 ? (deals.filter(deal => deal.stage === 'Closed Won').length / deals.length) * 100 : 0,
    dealsByStage: deals.reduce((acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  return {
    deals,
    loading,
    error,
    metrics,
    createDeal,
    updateDeal,
    deleteDeal,
    loadDeals
  }
}

export function useDeals() {
  return useCrmDeals()
}