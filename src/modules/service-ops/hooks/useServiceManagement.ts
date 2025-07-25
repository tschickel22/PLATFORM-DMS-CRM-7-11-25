import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/hooks/use-toast'
import { mockServiceOps } from '@/mocks/serviceOpsMock'

export interface ServiceTicket {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  customer_id?: string
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  vehicle_id?: string
  vehicle_info?: string
  assigned_to?: string
  assigned_tech_name?: string
  scheduled_date?: string
  created_at: string
  updated_at: string
  estimated_hours?: number
  actual_hours?: number
  parts?: ServicePart[]
  labor?: ServiceLabor[]
  timeline?: ServiceTimelineEntry[]
  notes?: string
  total_cost?: number
  customer_approved?: boolean
}

export interface ServicePart {
  id: string
  name: string
  quantity: number
  cost: number
}

export interface ServiceLabor {
  id: string
  description: string
  hours: number
  rate: number
}

export interface ServiceTimelineEntry {
  id: string
  timestamp: string
  action: string
  user: string
  details: string
}

export function useServiceManagement() {
  const [tickets, setTickets] = useState<ServiceTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const { toast } = useToast()

  // Load tickets from Supabase
  const loadTickets = async () => {
    console.log('[Service Ops] Starting Supabase fetch from service_tickets table...')
    setLoading(true)
    setError(null)
    
    try {
      // Note: Using a hypothetical service_tickets table structure
      // In reality, you might need to adjust the table name and fields
      const { data, error: supabaseError } = await supabase
        .from('service_tickets')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      console.log('[Service Ops] Supabase fetch successful:', data?.length || 0, 'tickets')
      
      // Transform Supabase data to match our interface
      const transformedTickets: ServiceTicket[] = (data || []).map(row => ({
        id: row.id,
        title: row.title || 'Untitled Ticket',
        description: row.description || '',
        category: row.category || 'General',
        priority: row.priority || 'Medium',
        status: row.status || 'Open',
        customer_id: row.customer_id,
        customer_name: row.customer_name,
        customer_phone: row.customer_phone,
        customer_email: row.customer_email,
        vehicle_id: row.vehicle_id,
        vehicle_info: row.vehicle_info,
        assigned_to: row.assigned_to,
        assigned_tech_name: row.assigned_tech_name,
        scheduled_date: row.scheduled_date,
        created_at: row.created_at,
        updated_at: row.updated_at,
        estimated_hours: row.estimated_hours,
        actual_hours: row.actual_hours,
        parts: row.parts || [],
        labor: row.labor || [],
        timeline: row.timeline || [],
        notes: row.notes || '',
        total_cost: row.total_cost,
        customer_approved: row.customer_approved
      }))

      setTickets(transformedTickets)
      setUsingFallback(false)
      
    } catch (error) {
      console.warn('[Service Ops] Supabase fetch failed, activating fallback mode:', error)
      
      // Fallback to mock data
      setTickets(mockServiceOps.sampleTickets.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        customer_id: ticket.customerId,
        customer_name: ticket.customerName,
        customer_phone: ticket.customerPhone,
        customer_email: ticket.customerEmail,
        vehicle_id: ticket.vehicleId,
        vehicle_info: ticket.vehicleInfo,
        assigned_to: ticket.assignedTo,
        assigned_tech_name: ticket.assignedTechName,
        scheduled_date: ticket.scheduledDate,
        created_at: ticket.createdAt,
        updated_at: ticket.updatedAt,
        estimated_hours: ticket.estimatedHours,
        actual_hours: ticket.actualHours,
        parts: ticket.parts,
        labor: ticket.labor,
        timeline: ticket.timeline,
        notes: ticket.notes,
        total_cost: ticket.totalCost,
        customer_approved: ticket.customerApproved
      })))
      
      setUsingFallback(true)
      setError('Failed to connect to Supabase. Using fallback data.')
      
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
    loadTickets()
  }, [])

  // Disabled write operations for Phase 1
  const createTicket = async (ticketData: Partial<ServiceTicket>) => {
    console.log('[Service Ops] Create operation disabled in Phase 1 read-only mode')
    toast({
      title: 'Feature Disabled',
      description: 'Create operations are disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    return null
  }

  const updateTicket = async (id: string, updates: Partial<ServiceTicket>) => {
    console.log('[Service Ops] Update operation disabled in Phase 1 read-only mode')
    toast({
      title: 'Feature Disabled',
      description: 'Update operations are disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
  }

  const deleteTicket = async (id: string) => {
    console.log('[Service Ops] Delete operation disabled in Phase 1 read-only mode')
    toast({
      title: 'Feature Disabled',
      description: 'Delete operations are disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
  }

  const getTicketById = (id: string): ServiceTicket | undefined => {
    return tickets.find(ticket => ticket.id === id)
  }

  const getTicketsByStatus = (status: string): ServiceTicket[] => {
    return tickets.filter(ticket => ticket.status === status)
  }

  const getTicketsByTechnician = (techId: string): ServiceTicket[] => {
    return tickets.filter(ticket => ticket.assigned_to === techId)
  }

  const refreshData = () => {
    console.log('[Service Ops] Manual refresh triggered')
    loadTickets()
  }

  return {
    tickets,
    loading,
    error,
    usingFallback,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketById,
    getTicketsByStatus,
    getTicketsByTechnician,
    refreshData,
    loadTickets
  }
}