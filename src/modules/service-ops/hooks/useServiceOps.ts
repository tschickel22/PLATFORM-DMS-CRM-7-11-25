import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { ServiceRequest, ServiceLog } from '../types'
import { mockServiceOps } from '@/mocks/serviceOpsMock'
import { useToast } from '@/hooks/use-toast'

export function useServiceOps() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadServiceRequests()
  }, [])

  const loadServiceRequests = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const transformedRequests: ServiceRequest[] = (data || []).map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status,
        priority: row.priority,
        assigned_to: row.assigned_to,
        customer_id: row.customer_id,
        requested_date: row.requested_date,
        completed_date: row.completed_date,
        created_at: row.created_at,
        updated_at: row.updated_at
      }))
      setServiceRequests(transformedRequests)
    } catch (err) {
      console.warn('Supabase failed to load service requests, falling back to mock data:', err)
      toast({
        title: 'Data Load Error',
        description: 'Failed to load service requests from Supabase. Using mock data.',
        variant: 'destructive'
      })
      // Fallback to mock data
      const mockRequests: ServiceRequest[] = mockServiceOps.sampleTickets.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        assigned_to: ticket.assignedTo,
        customer_id: ticket.customerId,
        requested_date: ticket.scheduledDate,
        completed_date: null, // Mock data doesn't have this directly
        created_at: ticket.createdAt,
        updated_at: ticket.updatedAt
      }))
      setServiceRequests(mockRequests)
    } finally {
      setLoading(false)
    }
  }

  const getServiceLogs = async (requestId: string): Promise<ServiceLog[]> => {
    try {
      const { data, error } = await supabase
        .from('service_logs')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: true })

      if (error) throw error

      const transformedLogs: ServiceLog[] = (data || []).map(row => ({
        id: row.id,
        request_id: row.request_id,
        note: row.note,
        created_by: row.created_by,
        created_at: row.created_at
      }))
      return transformedLogs
    } catch (err) {
      console.warn(`Supabase failed to load service logs for request ${requestId}, falling back to mock data:`, err)
      // Fallback to mock data from serviceOpsMock.ts timeline
      const mockTicket = mockServiceOps.sampleTickets.find(ticket => ticket.id === requestId)
      if (mockTicket && mockTicket.timeline) {
        return mockTicket.timeline.map(log => ({
          id: log.id,
          request_id: requestId,
          note: log.details,
          created_by: log.user,
          created_at: log.timestamp
        }))
      }
      return []
    }
  }

  // Placeholder for future CRUD operations
  const createServiceRequest = async (newRequest: Partial<ServiceRequest>) => { /* ... */ }
  const updateServiceRequest = async (id: string, updates: Partial<ServiceRequest>) => { /* ... */ }
  const deleteServiceRequest = async (id: string) => { /* ... */ }

  return {
    serviceRequests,
    loading,
    loadServiceRequests,
    getServiceLogs,
    createServiceRequest,
    updateServiceRequest,
    deleteServiceRequest
  }
}