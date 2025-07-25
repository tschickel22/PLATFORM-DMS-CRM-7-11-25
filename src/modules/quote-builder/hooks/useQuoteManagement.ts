import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { QuoteWithItems, Quote, QuoteItem } from '@/types'
import { useToast } from '@/hooks/use-toast'

export function useQuoteManagement() {
  const [quotes, setQuotes] = useState<QuoteWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fallback mock data
  const mockQuotes: QuoteWithItems[] = [
    {
      id: 'quote-001',
      customer_id: 'cust-001',
      inventory_id: 'inv-001',
      price: 45000,
      discount: 2000,
      status: 'sent',
      notes: 'Standard RV quote with delivery included',
      valid_until: '2024-03-15',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      items: [
        {
          id: 'item-001',
          quote_id: 'quote-001',
          description: '2023 Forest River Cherokee 274RK',
          quantity: 1,
          unit_price: 43000,
          total_price: 43000,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 'item-002',
          quote_id: 'quote-001',
          description: 'Delivery and Setup',
          quantity: 1,
          unit_price: 2000,
          total_price: 2000,
          created_at: '2024-01-15T10:00:00Z'
        }
      ]
    },
    {
      id: 'quote-002',
      customer_id: 'cust-002',
      inventory_id: 'inv-002',
      price: 62000,
      discount: 3000,
      status: 'draft',
      notes: 'Fifth wheel quote - customer requested extended warranty',
      valid_until: '2024-03-20',
      created_at: '2024-01-18T14:30:00Z',
      updated_at: '2024-01-20T09:15:00Z',
      items: [
        {
          id: 'item-003',
          quote_id: 'quote-002',
          description: '2024 Keystone Montana 3761FL',
          quantity: 1,
          unit_price: 59000,
          total_price: 59000,
          created_at: '2024-01-18T14:30:00Z'
        },
        {
          id: 'item-004',
          quote_id: 'quote-002',
          description: 'Extended Warranty (3 years)',
          quantity: 1,
          unit_price: 3000,
          total_price: 3000,
          created_at: '2024-01-18T14:30:00Z'
        }
      ]
    }
  ]

  useEffect(() => {
    loadQuotes()
  }, [])

  const loadQuotes = async () => {
    console.log('[Supabase Quote Builder] Starting to fetch quotes...')
    setLoading(true)
    setError(null)

    try {
      // Fetch quotes from Supabase
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })

      if (quotesError) {
        console.warn('[Supabase Quote Builder] Quotes fetch error:', quotesError)
        throw quotesError
      }

      console.log('[Supabase Quote Builder] Quotes fetched successfully:', quotesData?.length || 0, 'records')

      // Fetch quote items
      const { data: itemsData, error: itemsError } = await supabase
        .from('quote_items')
        .select('*')
        .order('created_at', { ascending: true })

      if (itemsError) {
        console.warn('[Supabase Quote Builder] Quote items fetch error:', itemsError)
        throw itemsError
      }

      console.log('[Supabase Quote Builder] Quote items fetched successfully:', itemsData?.length || 0, 'records')

      // Combine quotes with their items
      const quotesWithItems: QuoteWithItems[] = (quotesData || []).map(quote => ({
        ...quote,
        items: (itemsData || []).filter(item => item.quote_id === quote.id)
      }))

      setQuotes(quotesWithItems)
      console.log('[Supabase Quote Builder] Data loaded successfully:', quotesWithItems.length, 'quotes with items')

    } catch (error) {
      console.error('[Supabase Quote Builder] Failed to load from Supabase, using fallback data:', error)
      console.log('[Supabase Quote Builder] Fallback activated - using mock data')
      
      setQuotes(mockQuotes)
      setError('Failed to load live data. Using sample data.')
      
      toast({
        title: 'Connection Issue',
        description: 'Using sample data. Live data will load when connection is restored.',
        variant: 'default'
      })
    } finally {
      setLoading(false)
      console.log('[Supabase Quote Builder] Loading complete')
    }
  }

  const refreshQuotes = () => {
    console.log('[Supabase Quote Builder] Manual refresh triggered')
    loadQuotes()
  }

  // Read-only operations - all disabled for Phase 1
  const createQuote = async (quoteData: Partial<Quote>): Promise<QuoteWithItems | null> => {
    console.log('[Supabase Quote Builder] Create operation disabled in read-only mode')
    toast({
      title: 'Feature Disabled',
      description: 'Quote creation is disabled in read-only mode.',
      variant: 'destructive'
    })
    return null
  }

  const updateQuote = async (id: string, updates: Partial<Quote>): Promise<boolean> => {
    console.log('[Supabase Quote Builder] Update operation disabled in read-only mode')
    toast({
      title: 'Feature Disabled',
      description: 'Quote updates are disabled in read-only mode.',
      variant: 'destructive'
    })
    return false
  }

  const deleteQuote = async (id: string): Promise<boolean> => {
    console.log('[Supabase Quote Builder] Delete operation disabled in read-only mode')
    toast({
      title: 'Feature Disabled',
      description: 'Quote deletion is disabled in read-only mode.',
      variant: 'destructive'
    })
    return false
  }

  const addQuoteItem = async (quoteId: string, item: Partial<QuoteItem>): Promise<boolean> => {
    console.log('[Supabase Quote Builder] Add item operation disabled in read-only mode')
    toast({
      title: 'Feature Disabled',
      description: 'Adding quote items is disabled in read-only mode.',
      variant: 'destructive'
    })
    return false
  }

  const updateQuoteItem = async (itemId: string, updates: Partial<QuoteItem>): Promise<boolean> => {
    console.log('[Supabase Quote Builder] Update item operation disabled in read-only mode')
    toast({
      title: 'Feature Disabled',
      description: 'Updating quote items is disabled in read-only mode.',
      variant: 'destructive'
    })
    return false
  }

  const removeQuoteItem = async (itemId: string): Promise<boolean> => {
    console.log('[Supabase Quote Builder] Remove item operation disabled in read-only mode')
    toast({
      title: 'Feature Disabled',
      description: 'Removing quote items is disabled in read-only mode.',
      variant: 'destructive'
    })
    return false
  }

  const getQuoteById = (id: string): QuoteWithItems | undefined => {
    return quotes.find(quote => quote.id === id)
  }

  const getQuotesByCustomer = (customerId: string): QuoteWithItems[] => {
    return quotes.filter(quote => quote.customer_id === customerId)
  }

  const getQuotesByStatus = (status: string): QuoteWithItems[] => {
    return quotes.filter(quote => quote.status === status)
  }

  return {
    quotes,
    loading,
    error,
    createQuote,
    updateQuote,
    deleteQuote,
    addQuoteItem,
    updateQuoteItem,
    removeQuoteItem,
    getQuoteById,
    getQuotesByCustomer,
    getQuotesByStatus,
    refreshQuotes,
    loadQuotes
  }
}