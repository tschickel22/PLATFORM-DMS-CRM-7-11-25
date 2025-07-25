import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { PdiChecklist, ChecklistItem } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { mockPDI } from '@/mocks/pdiMock'

export function usePdiChecklists() {
  const [checklists, setChecklists] = useState<PdiChecklist[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const [connectionAttempted, setConnectionAttempted] = useState(false)
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean
    error?: string
    count: number
  }>({
    connected: false,
    error: undefined,
    count: 0
  })
  const { toast } = useToast()

  // Load data from Supabase on mount
  useEffect(() => {
    console.log('🔄 [PDI Checklists] Starting data load from Supabase...')
    console.log('📊 [PDI Checklists] Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'NOT_SET')
    console.log('🔑 [PDI Checklists] Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET')
    
    setConnectionAttempted(true)
    loadChecklists()
  }, [])

  const loadChecklists = async () => {
    console.log('📋 [PDI Checklists] Fetching checklists from Supabase...')
    
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('⚠️ [PDI Checklists] Supabase not configured, using fallback')
      setSupabaseStatus({
        connected: false,
        error: 'Supabase not configured',
        count: 0
      })
      useFallbackData()
      return
    }
    
    try {
      console.log('⏳ [PDI Checklists] Executing Supabase query for pdi_checklists...')
      const { data, error } = await supabase
        .from('pdi_checklists')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('📊 [PDI Checklists] Supabase response:', { 
        error: error?.message || null, 
        dataType: typeof data, 
        dataLength: Array.isArray(data) ? data.length : 'not array',
        isNull: data === null,
        isUndefined: data === undefined
      })

      if (error) {
        console.error('❌ [PDI Checklists] Supabase error:', error.message)
        setSupabaseStatus({
          connected: false,
          error: error.message,
          count: 0
        })
        useFallbackData()
        return
      }

      if (!Array.isArray(data)) {
        console.warn('⚠️ [PDI Checklists] Supabase returned non-array data:', typeof data)
        setSupabaseStatus({
          connected: false,
          error: 'Invalid data format',
          count: 0
        })
        useFallbackData()
        return
      }

      console.log(`✅ [PDI Checklists] Supabase connected successfully - ${data.length} checklists found`)
      
      setSupabaseStatus({
        connected: true,
        error: undefined,
        count: data.length
      })
      
      if (data.length === 0) {
        console.log('📭 [PDI Checklists] Database is empty - showing empty state')
        setChecklists([])
        setUsingFallback(false)
        setLoading(false)
        return
      }

      // Transform data safely
      const transformedChecklists: PdiChecklist[] = data.map((row) => ({
        id: row.id || `pdi-${Date.now()}-${Math.random()}`,
        vehicle_id: row.vehicle_id || '',
        technician: row.technician || 'Unknown',
        status: row.status || 'not_started',
        checklist_data: Array.isArray(row.checklist_data) ? row.checklist_data : [],
        created_at: row.created_at || new Date().toISOString(),
        updated_at: row.updated_at || new Date().toISOString()
      }))

      console.log(`🔄 [PDI Checklists] Transformed ${transformedChecklists.length} checklists`)
      setChecklists(transformedChecklists)
      setUsingFallback(false)
      
    } catch (error) {
      console.error('💥 [PDI Checklists] Supabase fetch failed:', error)
      setSupabaseStatus({
        connected: false,
        error: error instanceof Error ? error.message : 'Connection failed',
        count: 0
      })
      useFallbackData()
    } finally {
      setLoading(false)
    }
  }

  const useFallbackData = () => {
    console.log('🔄 [PDI Checklists] Using mock data fallback')
    
    // Transform mock data to match our interface
    const mockChecklists: PdiChecklist[] = mockPDI.sampleInspections.map(inspection => ({
      id: inspection.id,
      vehicle_id: inspection.unitId,
      technician: inspection.technicianName,
      status: inspection.status.toLowerCase().replace(' ', '_'),
      checklist_data: inspection.findings.map(finding => ({
        step: `${finding.category}: ${finding.item}`,
        status: finding.status.toLowerCase(),
        notes: finding.notes
      })),
      created_at: inspection.startedDate,
      updated_at: inspection.completedDate || inspection.startedDate
    }))
    
    setChecklists(mockChecklists)
    setUsingFallback(true)
  }

  const createChecklist = async (data: Partial<PdiChecklist>): Promise<PdiChecklist> => {
    try {
      if (usingFallback) {
        // Create in localStorage for fallback mode
        const newChecklist: PdiChecklist = {
          id: `pdi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          vehicle_id: data.vehicle_id || '',
          technician: data.technician || '',
          status: data.status || 'not_started',
          checklist_data: data.checklist_data || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        setChecklists(prev => [newChecklist, ...prev])
        return newChecklist
      }

      const checklistData = {
        vehicle_id: data.vehicle_id || '',
        technician: data.technician || '',
        status: data.status || 'not_started',
        checklist_data: data.checklist_data || []
      }

      const { data: insertedData, error } = await supabase
        .from('pdi_checklists')
        .insert([checklistData])
        .select()
        .single()

      if (error) {
        console.error('❌ [PDI Checklists] Create error:', error.message)
        throw error
      }

      console.log('✅ [PDI Checklists] Checklist created:', insertedData.id)

      const newChecklist: PdiChecklist = {
        id: insertedData.id,
        vehicle_id: insertedData.vehicle_id,
        technician: insertedData.technician,
        status: insertedData.status,
        checklist_data: insertedData.checklist_data || [],
        created_at: insertedData.created_at,
        updated_at: insertedData.updated_at
      }

      setChecklists(prev => [newChecklist, ...prev])
      return newChecklist
    } catch (error) {
      console.error('Error creating PDI checklist:', error)
      toast({
        title: 'Error',
        description: 'Failed to create PDI checklist',
        variant: 'destructive'
      })
      throw error
    }
  }

  const updateChecklist = async (id: string, updates: Partial<PdiChecklist>) => {
    try {
      if (usingFallback) {
        // Update in localStorage for fallback mode
        setChecklists(prev => prev.map(checklist => 
          checklist.id === id 
            ? { ...checklist, ...updates, updated_at: new Date().toISOString() }
            : checklist
        ))
        return
      }

      const updateData = {
        vehicle_id: updates.vehicle_id,
        technician: updates.technician,
        status: updates.status,
        checklist_data: updates.checklist_data
      }

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData]
        }
      })

      const { data, error } = await supabase
        .from('pdi_checklists')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ [PDI Checklists] Update error:', error.message)
        throw error
      }

      console.log('✅ [PDI Checklists] Checklist updated:', data.id)

      const updatedChecklist: PdiChecklist = {
        id: data.id,
        vehicle_id: data.vehicle_id,
        technician: data.technician,
        status: data.status,
        checklist_data: data.checklist_data || [],
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      setChecklists(prev => prev.map(checklist => 
        checklist.id === id ? updatedChecklist : checklist
      ))
    } catch (error) {
      console.error('Error updating PDI checklist:', error)
      toast({
        title: 'Error',
        description: 'Failed to update PDI checklist',
        variant: 'destructive'
      })
      throw error
    }
  }

  const deleteChecklist = async (id: string) => {
    try {
      if (usingFallback) {
        // Delete from localStorage for fallback mode
        setChecklists(prev => prev.filter(checklist => checklist.id !== id))
        return
      }

      const { error } = await supabase
        .from('pdi_checklists')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ [PDI Checklists] Delete error:', error.message)
        throw error
      }

      console.log('✅ [PDI Checklists] Checklist deleted:', id)

      setChecklists(prev => prev.filter(checklist => checklist.id !== id))
    } catch (error) {
      console.error('Error deleting PDI checklist:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete PDI checklist',
        variant: 'destructive'
      })
      throw error
    }
  }

  const getChecklistById = (id: string): PdiChecklist | undefined => {
    return checklists.find(checklist => checklist.id === id)
  }

  const getChecklistsByVehicle = (vehicleId: string): PdiChecklist[] => {
    return checklists.filter(checklist => checklist.vehicle_id === vehicleId)
  }

  return {
    checklists,
    loading,
    usingFallback,
    supabaseStatus,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    getChecklistById,
    getChecklistsByVehicle,
    loadChecklists
  }
}