import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/hooks/use-toast'

export interface InventoryItem {
  id: string
  name: string
  type: string | null
  status: string | null
  serial_number: string | null
  location: string | null
  photos: string[]
  assigned_to: string | null
  purchase_date: string | null
  warranty_expiration: string | null
  created_at: string
  updated_at: string
}

export interface CreateInventoryItemData {
  name: string
  type?: string
  status?: string
  serial_number?: string
  location?: string
  photos?: string[]
  assigned_to?: string
  purchase_date?: string
  warranty_expiration?: string
}

export interface UpdateInventoryItemData {
  name?: string
  type?: string
  status?: string
  serial_number?: string
  location?: string
  photos?: string[]
  assigned_to?: string
  purchase_date?: string
  warranty_expiration?: string
}

export function useInventoryManagement() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Load inventory items from Supabase
  const getInventoryItems = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      // Transform data to match interface
      const transformedItems: InventoryItem[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        status: item.status,
        serial_number: item.serial_number,
        location: item.location,
        photos: item.photos || [],
        assigned_to: item.assigned_to,
        purchase_date: item.purchase_date,
        warranty_expiration: item.warranty_expiration,
        created_at: item.created_at,
        updated_at: item.updated_at
      }))

      setItems(transformedItems)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load inventory items'
      setError(errorMessage)
      console.error('Error loading inventory items:', err)
      
      toast({
        title: 'Error Loading Inventory',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Add new inventory item
  const addInventoryItem = async (itemData: CreateInventoryItemData): Promise<InventoryItem | null> => {
    try {
      const { data, error: insertError } = await supabase
        .from('inventory_items')
        .insert([{
          name: itemData.name,
          type: itemData.type || null,
          status: itemData.status || 'Available',
          serial_number: itemData.serial_number || null,
          location: itemData.location || null,
          photos: itemData.photos || [],
          assigned_to: itemData.assigned_to || null,
          purchase_date: itemData.purchase_date || null,
          warranty_expiration: itemData.warranty_expiration || null
        }])
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      const newItem: InventoryItem = {
        id: data.id,
        name: data.name,
        type: data.type,
        status: data.status,
        serial_number: data.serial_number,
        location: data.location,
        photos: data.photos || [],
        assigned_to: data.assigned_to,
        purchase_date: data.purchase_date,
        warranty_expiration: data.warranty_expiration,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      // Update local state
      setItems(prevItems => [newItem, ...prevItems])

      toast({
        title: 'Item Added',
        description: `${itemData.name} has been added to inventory`
      })

      return newItem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add inventory item'
      console.error('Error adding inventory item:', err)
      
      toast({
        title: 'Error Adding Item',
        description: errorMessage,
        variant: 'destructive'
      })
      
      return null
    }
  }

  // Update inventory item
  const updateInventoryItem = async (id: string, updates: UpdateInventoryItemData): Promise<boolean> => {
    try {
      const { data, error: updateError } = await supabase
        .from('inventory_items')
        .update({
          name: updates.name,
          type: updates.type,
          status: updates.status,
          serial_number: updates.serial_number,
          location: updates.location,
          photos: updates.photos,
          assigned_to: updates.assigned_to,
          purchase_date: updates.purchase_date,
          warranty_expiration: updates.warranty_expiration
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      const updatedItem: InventoryItem = {
        id: data.id,
        name: data.name,
        type: data.type,
        status: data.status,
        serial_number: data.serial_number,
        location: data.location,
        photos: data.photos || [],
        assigned_to: data.assigned_to,
        purchase_date: data.purchase_date,
        warranty_expiration: data.warranty_expiration,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      // Update local state
      setItems(prevItems => 
        prevItems.map(item => item.id === id ? updatedItem : item)
      )

      toast({
        title: 'Item Updated',
        description: `${data.name} has been updated successfully`
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update inventory item'
      console.error('Error updating inventory item:', err)
      
      toast({
        title: 'Error Updating Item',
        description: errorMessage,
        variant: 'destructive'
      })
      
      return false
    }
  }

  // Delete inventory item
  const deleteInventoryItem = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      // Update local state
      setItems(prevItems => prevItems.filter(item => item.id !== id))

      toast({
        title: 'Item Deleted',
        description: 'Inventory item has been deleted successfully'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete inventory item'
      console.error('Error deleting inventory item:', err)
      
      toast({
        title: 'Error Deleting Item',
        description: errorMessage,
        variant: 'destructive'
      })
      
      return false
    }
  }

  // Get single inventory item by ID
  const getInventoryItemById = (id: string): InventoryItem | undefined => {
    return items.find(item => item.id === id)
  }

  // Filter items by status
  const getItemsByStatus = (status: string): InventoryItem[] => {
    return items.filter(item => item.status === status)
  }

  // Filter items by type
  const getItemsByType = (type: string): InventoryItem[] => {
    return items.filter(item => item.type === type)
  }

  // Load data on mount
  useEffect(() => {
    getInventoryItems()
  }, [])

  return {
    items,
    loading,
    error,
    getInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryItemById,
    getItemsByStatus,
    getItemsByType,
    // Computed values
    totalItems: items.length,
    availableItems: items.filter(item => item.status === 'Available').length,
    soldItems: items.filter(item => item.status === 'Sold').length,
    serviceItems: items.filter(item => item.status === 'Service').length
  }
}