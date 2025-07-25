import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/hooks/use-toast'

export interface Deal {
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
  notes?: string
  created_at: string
  updated_at: string
}

export function useDealManagement() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Load deals from Supabase
  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setDeals(data || [])
    } catch (error) {
      console.error('Error loading deals:', error)
      toast({
        title: 'Error',
        description: 'Failed to load deals',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const createDeal = async (dealData: Partial<Deal>): Promise<Deal | null> => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .insert([{
          customer_name: dealData.customer_name || '',
          customer_email: dealData.customer_email || '',
          customer_phone: dealData.customer_phone || '',
          vehicle_info: dealData.vehicle_info || '',
          stage: dealData.stage || 'New',
          amount: dealData.amount || 0,
          source: dealData.source || '',
          type: dealData.type || 'New Sale',
          priority: dealData.priority || 'Medium',
          rep_name: dealData.rep_name || '',
          probability: dealData.probability || 0,
          expected_close_date: dealData.expected_close_date,
          notes: dealData.notes || ''
        }])
        .select()
        .single()

      if (error) throw error

      const newDeal = data as Deal
      setDeals(prev => [newDeal, ...prev])
      
      toast({
        title: 'Deal Created',
        description: 'Deal has been created successfully'
      })

      return newDeal
    } catch (error) {
      console.error('Error creating deal:', error)
      toast({
        title: 'Error',
        description: 'Failed to create deal',
        variant: 'destructive'
      })
      return null
    }
  }

  const updateDeal = async (id: string, updates: Partial<Deal>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

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
      toast({
        title: 'Error',
        description: 'Failed to update deal',
        variant: 'destructive'
      })
      return false
    }
  }

  const deleteDeal = async (id: string): Promise<boolean> => {
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

      return true
    } catch (error) {
      console.error('Error deleting deal:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete deal',
        variant: 'destructive'
      })
      return false
    }
  }

  const getDealById = (id: string): Deal | undefined => {
    return deals.find(deal => deal.id === id)
  }

  const getDealsByStage = (stage: string): Deal[] => {
    return deals.filter(deal => deal.stage === stage)
  }

  const getDealsByRep = (repName: string): Deal[] => {
    return deals.filter(deal => deal.rep_name === repName)
  }

  const getDealsMetrics = () => {
    const totalDeals = deals.length
    const totalValue = deals.reduce((sum, deal) => sum + (deal.amount || 0), 0)
    const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0
    const wonDeals = deals.filter(deal => deal.stage === 'Closed Won').length
    const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0

    return {
      totalDeals,
      totalValue,
      avgDealSize,
      conversionRate,
      wonDeals
    }
  }

  return {
    deals,
    loading,
    createDeal,
    updateDeal,
    deleteDeal,
    getDealById,
    getDealsByStage,
    getDealsByRep,
    getDealsMetrics,
    loadDeals
  }
}