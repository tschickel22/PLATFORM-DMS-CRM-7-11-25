import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/hooks/use-toast'
import { mockDelivery } from '@/mocks/deliveryMock'

export interface Delivery {
  id: string
  customer_id: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  vehicle_id?: string
  vehicle_info?: string
  status: string
  delivery_type: string
  scheduled_date?: string
  delivered_date?: string
  address: string
  city: string
  state: string
  zip_code: string
  driver_name?: string
  eta?: string
  notes?: string
  checklist_items?: string[]
  photos?: string[]
  created_at: string
  updated_at: string
}

export function useDeliveryManagement() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'supabase' | 'fallback'>('supabase')
  const { toast } = useToast()

  // Load deliveries from Supabase with fallback
  const loadDeliveries = async () => {
    console.log('[Delivery Tracker] Starting data fetch from Supabase...')
    setLoading(true)
    setError(null)

    try {
      // Attempt to fetch from Supabase deliveries table
      const { data, error: supabaseError } = await supabase
        .from('deliveries')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw new Error(`Supabase error: ${supabaseError.message}`)
      }

      if (!data) {
        throw new Error('Supabase returned null data')
      }

      console.log('[Delivery Tracker] Supabase fetch successful:', data.length, 'deliveries')
      setDeliveries(data)
      setDataSource('supabase')

      if (data.length === 0) {
        console.log('[Delivery Tracker] No deliveries found in Supabase')
      }

    } catch (error) {
      console.warn('[Delivery Tracker] Supabase fetch failed, activating fallback:', error)
      
      // Fallback to mock data
      const fallbackDeliveries = mockDelivery.sampleDeliveries || []
      console.log('[Delivery Tracker] Fallback activated with', fallbackDeliveries.length, 'mock deliveries')
      
      setDeliveries(fallbackDeliveries)
      setDataSource('fallback')
      setError(error instanceof Error ? error.message : 'Unknown error')

      toast({
        title: 'Connection Issue',
        description: 'Using offline data. Some features may be limited.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    loadDeliveries()
  }, [])

  // Disabled write operations for Phase 1
  const createDelivery = async (deliveryData: Partial<Delivery>) => {
    console.log('[Delivery Tracker] Create operation disabled in Phase 1')
    toast({
      title: 'Feature Disabled',
      description: 'Create delivery is disabled in read-only mode.',
      variant: 'destructive'
    })
    return null
  }

  const updateDelivery = async (id: string, updates: Partial<Delivery>) => {
    console.log('[Delivery Tracker] Update operation disabled in Phase 1')
    toast({
      title: 'Feature Disabled',
      description: 'Update delivery is disabled in read-only mode.',
      variant: 'destructive'
    })
  }

  const deleteDelivery = async (id: string) => {
    console.log('[Delivery Tracker] Delete operation disabled in Phase 1')
    toast({
      title: 'Feature Disabled',
      description: 'Delete delivery is disabled in read-only mode.',
      variant: 'destructive'
    })
  }

  const updateDeliveryStatus = async (id: string, status: string) => {
    console.log('[Delivery Tracker] Status update disabled in Phase 1')
    toast({
      title: 'Feature Disabled',
      description: 'Status updates are disabled in read-only mode.',
      variant: 'destructive'
    })
  }

  const scheduleDelivery = async (deliveryData: Partial<Delivery>) => {
    console.log('[Delivery Tracker] Schedule operation disabled in Phase 1')
    toast({
      title: 'Feature Disabled',
      description: 'Schedule delivery is disabled in read-only mode.',
      variant: 'destructive'
    })
    return null
  }

  // Helper functions
  const getDeliveryById = (id: string): Delivery | undefined => {
    return deliveries.find(delivery => delivery.id === id)
  }

  const getDeliveriesByStatus = (status: string): Delivery[] => {
    return deliveries.filter(delivery => delivery.status === status)
  }

  const getDeliveriesByCustomer = (customerId: string): Delivery[] => {
    return deliveries.filter(delivery => delivery.customer_id === customerId)
  }

  const refreshData = () => {
    console.log('[Delivery Tracker] Manual refresh triggered')
    loadDeliveries()
  }

  return {
    deliveries,
    loading,
    error,
    dataSource,
    createDelivery,
    updateDelivery,
    deleteDelivery,
    updateDeliveryStatus,
    scheduleDelivery,
    getDeliveryById,
    getDeliveriesByStatus,
    getDeliveriesByCustomer,
    refreshData,
    loadDeliveries
  }
}