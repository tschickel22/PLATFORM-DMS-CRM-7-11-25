import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/hooks/use-toast'

export interface Quote {
  id: string
  customer_id: string
  inventory_id: string
  price: number
  discount: number
  status: string
  notes?: string
  valid_until?: string
  created_at?: string
  updated_at?: string
}

export interface QuoteItem {
  id: string
  quote_id: string
  description: string
  quantity: number
  unit_price: number
  total_price: number
  created_at?: string
}

export interface QuoteWithItems extends Quote {
  items: QuoteItem[]
}

export function useQuoteManagement() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Load quotes on mount
  useEffect(() => {
    getQuotes()
  }, [])

  const getQuotes = async (): Promise<Quote[]> => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      const quotesData = data || []
      setQuotes(quotesData)
      return quotesData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quotes'
      setError(errorMessage)
      console.error('Error fetching quotes:', err)
      
      toast({
        title: 'Error',
        description: 'Failed to load quotes. Please try again.',
        variant: 'destructive'
      })
      
      // Return empty array as safe default
      setQuotes([])
      return []
    } finally {
      setLoading(false)
    }
  }

  const getQuoteById = async (id: string): Promise<QuoteWithItems | null> => {
    try {
      setError(null)

      // Fetch quote with items
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single()

      if (quoteError) {
        throw quoteError
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from('quote_items')
        .select('*')
        .eq('quote_id', id)
        .order('created_at', { ascending: true })

      if (itemsError) {
        throw itemsError
      }

      return {
        ...quoteData,
        items: itemsData || []
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quote'
      setError(errorMessage)
      console.error('Error fetching quote:', err)
      
      toast({
        title: 'Error',
        description: 'Failed to load quote details. Please try again.',
        variant: 'destructive'
      })
      
      return null
    }
  }

  const createQuote = async (quoteData: Omit<Quote, 'id' | 'created_at' | 'updated_at'>): Promise<Quote | null> => {
    try {
      setError(null)

      const { data, error: insertError } = await supabase
        .from('quotes')
        .insert([{
          customer_id: quoteData.customer_id,
          inventory_id: quoteData.inventory_id,
          price: quoteData.price || 0,
          discount: quoteData.discount || 0,
          status: quoteData.status || 'draft',
          notes: quoteData.notes || '',
          valid_until: quoteData.valid_until
        }])
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      const newQuote = data as Quote
      setQuotes(prev => [newQuote, ...prev])
      
      toast({
        title: 'Success',
        description: 'Quote created successfully.'
      })
      
      return newQuote
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create quote'
      setError(errorMessage)
      console.error('Error creating quote:', err)
      
      toast({
        title: 'Error',
        description: 'Failed to create quote. Please try again.',
        variant: 'destructive'
      })
      
      return null
    }
  }

  const updateQuote = async (id: string, updates: Partial<Quote>): Promise<Quote | null> => {
    try {
      setError(null)

      const { data, error: updateError } = await supabase
        .from('quotes')
        .update({
          customer_id: updates.customer_id,
          inventory_id: updates.inventory_id,
          price: updates.price,
          discount: updates.discount,
          status: updates.status,
          notes: updates.notes,
          valid_until: updates.valid_until
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      const updatedQuote = data as Quote
      setQuotes(prev => prev.map(quote => 
        quote.id === id ? updatedQuote : quote
      ))
      
      toast({
        title: 'Success',
        description: 'Quote updated successfully.'
      })
      
      return updatedQuote
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update quote'
      setError(errorMessage)
      console.error('Error updating quote:', err)
      
      toast({
        title: 'Error',
        description: 'Failed to update quote. Please try again.',
        variant: 'destructive'
      })
      
      return null
    }
  }

  const deleteQuote = async (id: string): Promise<boolean> => {
    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      setQuotes(prev => prev.filter(quote => quote.id !== id))
      
      toast({
        title: 'Success',
        description: 'Quote deleted successfully.'
      })
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete quote'
      setError(errorMessage)
      console.error('Error deleting quote:', err)
      
      toast({
        title: 'Error',
        description: 'Failed to delete quote. Please try again.',
        variant: 'destructive'
      })
      
      return false
    }
  }

  const createQuoteItem = async (itemData: Omit<QuoteItem, 'id' | 'created_at'>): Promise<QuoteItem | null> => {
    try {
      setError(null)

      const { data, error: insertError } = await supabase
        .from('quote_items')
        .insert([{
          quote_id: itemData.quote_id,
          description: itemData.description,
          quantity: itemData.quantity || 1,
          unit_price: itemData.unit_price || 0,
          total_price: itemData.total_price || 0
        }])
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      toast({
        title: 'Success',
        description: 'Quote item added successfully.'
      })
      
      return data as QuoteItem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create quote item'
      setError(errorMessage)
      console.error('Error creating quote item:', err)
      
      toast({
        title: 'Error',
        description: 'Failed to add quote item. Please try again.',
        variant: 'destructive'
      })
      
      return null
    }
  }

  const updateQuoteItem = async (id: string, updates: Partial<QuoteItem>): Promise<QuoteItem | null> => {
    try {
      setError(null)

      const { data, error: updateError } = await supabase
        .from('quote_items')
        .update({
          description: updates.description,
          quantity: updates.quantity,
          unit_price: updates.unit_price,
          total_price: updates.total_price
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      toast({
        title: 'Success',
        description: 'Quote item updated successfully.'
      })
      
      return data as QuoteItem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update quote item'
      setError(errorMessage)
      console.error('Error updating quote item:', err)
      
      toast({
        title: 'Error',
        description: 'Failed to update quote item. Please try again.',
        variant: 'destructive'
      })
      
      return null
    }
  }

  const deleteQuoteItem = async (id: string): Promise<boolean> => {
    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('quote_items')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      toast({
        title: 'Success',
        description: 'Quote item removed successfully.'
      })
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete quote item'
      setError(errorMessage)
      console.error('Error deleting quote item:', err)
      
      toast({
        title: 'Error',
        description: 'Failed to remove quote item. Please try again.',
        variant: 'destructive'
      })
      
      return false
    }
  }

  return {
    quotes,
    loading,
    error,
    getQuotes,
    getQuoteById,
    createQuote,
    updateQuote,
    deleteQuote,
    createQuoteItem,
    updateQuoteItem,
    deleteQuoteItem,
    refreshQuotes: getQuotes
  }
}