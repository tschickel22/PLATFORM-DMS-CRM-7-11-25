import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/hooks/use-toast'

export interface InventoryItem {
  id: string
  name: string
  type?: string
  status?: string
  serial_number?: string
  location?: string
  photos?: string[]
  assigned_to?: string
  purchase_date?: string
  warranty_expiration?: string
  created_at?: string
  updated_at?: string
}

// Mock fallback data
const mockInventoryFallback: InventoryItem[] = [
  {
    id: 'mock-001',
    name: '2023 Forest River Cherokee 274RK',
    type: 'Travel Trailer',
    status: 'Available',
    serial_number: 'FR2023001',
    location: 'Main Lot',
    photos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-002', 
    name: '2024 Keystone Montana 3761FL',
    type: 'Fifth Wheel',
    status: 'Available',
    serial_number: 'KS2024002',
    location: 'Overflow Lot',
    photos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export function useInventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true)
      setError(null)
      
      try {
        console.log('[Supabase inventory] Fetching from inventory_items table...')
        
        const { data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        console.log('[Supabase inventory] Success:', data)
        setInventory(data || [])
        setUsingFallback(false)
        
      } catch (error) {
        console.warn('[Supabase inventory] Fetch failed, using fallback:', error)
        setError(error instanceof Error ? error.message : 'Failed to load inventory')
        setInventory(mockInventoryFallback)
        setUsingFallback(true)
        
        toast({
          title: 'Inventory Load Warning',
          description: 'Using fallback data. Supabase connection failed.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [toast])

  // Read-only operations for now (Phase 1)
  const createItem = async (itemData: Partial<InventoryItem>) => {
    console.log('[Inventory] Create operation disabled in Phase 1')
    toast({
      title: 'Feature Disabled',
      description: 'Create operations are disabled in Phase 1. Read-only mode.',
      variant: 'destructive'
    })
    return null
  }

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    console.log('[Inventory] Update operation disabled in Phase 1')
    toast({
      title: 'Feature Disabled', 
      description: 'Update operations are disabled in Phase 1. Read-only mode.',
      variant: 'destructive'
    })
    return null
  }

  const deleteItem = async (id: string) => {
    console.log('[Inventory] Delete operation disabled in Phase 1')
    toast({
      title: 'Feature Disabled',
      description: 'Delete operations are disabled in Phase 1. Read-only mode.',
      variant: 'destructive'
    })
    return false
  }

  const refreshInventory = async () => {
    const fetchInventory = async () => {
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        
        setInventory(data || [])
        setUsingFallback(false)
        setError(null)
        
      } catch (error) {
        console.warn('[Supabase inventory] Refresh failed:', error)
        setError(error instanceof Error ? error.message : 'Failed to refresh inventory')
      }
    }

    await fetchInventory()
  }

  return {
    inventory,
    loading,
    error,
    usingFallback,
    createItem,
    updateItem,
    deleteItem,
    refreshInventory
  }
}