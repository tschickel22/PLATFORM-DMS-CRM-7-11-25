import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/hooks/use-toast'
import { mockServiceOps } from '@/mocks/serviceOpsMock'

export interface ServiceRequest {
  id: string
  title: string
  description?: string
  status: string
  priority?: string
  assigned_to?: string
  customer_id?: string
  requested_date?: string
  completed_date?: string
  created_at?: string
  updated_at?: string
}

export interface ServiceLog {
  id: string
  request_id: string
  note: string
  created_by?: string
  created_at?: string
}

export function useServiceOps() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [serviceLogs, setServiceLogs] = useState<ServiceLog[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadServiceRequests = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setServiceRequests(data || [])
    } catch (err) {
      console.warn('Supabase failed, fallback to mock data:', err)
      // Fallback to mock data
      setServiceRequests(mockServiceOps.sampleTickets.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        assigned_to: ticket.assignedTo,
        customer_id: ticket.customerId,
        requested_date: ticket.scheduledDate,
        completed_date: ticket.completedDate,
        created_at: ticket.createdAt,
        updated_at: ticket.updatedAt
      })))
    } finally {
      setLoading(false)
    }
  }

  const loadServiceLogs = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('service_logs')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      return data || []
    } catch (err) {
      console.warn('Supabase failed for service logs, fallback to mock:', err)
      // Fallback to mock timeline data
      const mockTicket = mockServiceOps.sampleTickets.find(t => t.id === requestId)
      return mockTicket?.timeline?.map(entry => ({
        id: entry.id,
        request_id: requestId,
        note: `${entry.action}: ${entry.details}`,
        created_by: entry.user,
        created_at: entry.timestamp
      })) || []
    }
  }

  const createServiceRequest = async (requestData: Partial<ServiceRequest>) => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .insert([{
          title: requestData.title,
          description: requestData.description,
          status: requestData.status || 'open',
          priority: requestData.priority,
          assigned_to: requestData.assigned_to,
          customer_id: requestData.customer_id,
          requested_date: requestData.requested_date
        }])
        .select()
        .single()

      if (error) throw error
      
      // Refresh the list
      await loadServiceRequests()
      
      toast({
        title: 'Service Request Created',
        description: 'New service request has been created successfully.'
      })
      
      return data
    } catch (err) {
      console.error('Failed to create service request:', err)
      toast({
        title: 'Error',
        description: 'Failed to create service request. Please try again.',
        variant: 'destructive'
      })
      throw err
    }
  }

  const updateServiceRequest = async (id: string, updates: Partial<ServiceRequest>) => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      // Refresh the list
      await loadServiceRequests()
      
      toast({
        title: 'Service Request Updated',
        description: 'Service request has been updated successfully.'
      })
      
      return data
    } catch (err) {
      console.error('Failed to update service request:', err)
      toast({
        title: 'Error',
        description: 'Failed to update service request. Please try again.',
        variant: 'destructive'
      })
      throw err
    }
  }

  const addServiceLog = async (requestId: string, note: string, createdBy?: string) => {
    try {
      const { data, error } = await supabase
        .from('service_logs')
        .insert([{
          request_id: requestId,
          note: note,
          created_by: createdBy
        }])
        .select()
        .single()

      if (error) throw error
      
      toast({
        title: 'Note Added',
        description: 'Service log note has been added successfully.'
      })
      
      return data
    } catch (err) {
      console.error('Failed to add service log:', err)
      toast({
        title: 'Error',
        description: 'Failed to add service log. Please try again.',
        variant: 'destructive'
      })
      throw err
    }
  }

  useEffect(() => {
    loadServiceRequests()
  }, [])

  return {
    serviceRequests,
    serviceLogs,
    loading,
    loadServiceRequests,
    loadServiceLogs,
    createServiceRequest,
    updateServiceRequest,
    addServiceLog
  }
}