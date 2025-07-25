import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { PdiChecklist, ChecklistItem, PdiSetting } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { mockPDI } from '@/mocks/pdiMock'

export function usePdiChecklists() {
  const [checklists, setChecklists] = useState<PdiChecklist[]>([])
  const [pdiSettings, setPdiSettings] = useState<PdiSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)
  const [connectionAttempted, setConnectionAttempted] = useState(false)
  const [supabaseStatus, setSupabaseStatus] = useState<{
    checklists: { connected: boolean; error?: string; count: number }
    settings: { connected: boolean; error?: string; count: number }
  }>({
    checklists: { connected: false, error: undefined, count: 0 },
    settings: { connected: false, error: undefined, count: 0 }
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
      setSupabaseStatus(prev => ({
        ...prev,
        checklists: {
          connected: false,
          error: 'Supabase not configured',
          count: 0
        }
      }))
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
        setSupabaseStatus(prev => ({
          ...prev,
          checklists: {
            connected: false,
            error: error.message,
            count: 0
          }
        }))
        useFallbackData()
        return
      }

      if (!Array.isArray(data)) {
        console.warn('⚠️ [PDI Checklists] Supabase returned non-array data:', typeof data)
        setSupabaseStatus(prev => ({
          ...prev,
          checklists: {
            connected: false,
            error: 'Invalid data format',
            count: 0
          }
        }))
        useFallbackData()
        return
      }

      console.log(`✅ [PDI Checklists] Supabase connected successfully - ${data.length} checklists found`)
      
      setSupabaseStatus(prev => ({
        ...prev,
        checklists: {
          connected: true,
          error: undefined,
          count: data.length
        }
      }))
      
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
      setSupabaseStatus(prev => ({
        ...prev,
        checklists: {
          connected: false,
          error: error instanceof Error ? error.message : 'Connection failed',
          count: 0
        }
      }))
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

  const loadPdiSettings = async (companyId: string) => {
    console.log('📋 [PDI Settings] Fetching settings from Supabase...')
    setSettingsLoading(true)
    
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('⚠️ [PDI Settings] Supabase not configured, using fallback')
      setSupabaseStatus(prev => ({
        ...prev,
        settings: { connected: false, error: 'Supabase not configured', count: 0 }
      }))
      setPdiSettings(mockPDI.sampleSettings.filter(s => s.company_id === companyId))
      setSettingsLoading(false)
      return
    }
    
    try {
      console.log('⏳ [PDI Settings] Executing Supabase query for pdi_settings...')
      const { data, error } = await supabase
        .from('pdi_settings')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      console.log('📊 [PDI Settings] Supabase response:', { 
        error: error?.message || null, 
        dataType: typeof data, 
        dataLength: Array.isArray(data) ? data.length : 'not array'
      })

      if (error) {
        console.error('❌ [PDI Settings] Supabase error:', error.message)
        setSupabaseStatus(prev => ({
          ...prev,
          settings: { connected: false, error: error.message, count: 0 }
        }))
        // Use fallback data
        setPdiSettings(mockPDI.sampleSettings.filter(s => s.company_id === companyId))
        setSettingsLoading(false)
        return
      }

      if (!Array.isArray(data)) {
        console.warn('⚠️ [PDI Settings] Supabase returned non-array data:', typeof data)
        setSupabaseStatus(prev => ({
          ...prev,
          settings: { connected: false, error: 'Invalid data format', count: 0 }
        }))
        setPdiSettings(mockPDI.sampleSettings.filter(s => s.company_id === companyId))
        setSettingsLoading(false)
        return
      }

      console.log(`✅ [PDI Settings] Supabase connected successfully - ${data.length} settings found`)
      
      setSupabaseStatus(prev => ({
        ...prev,
        settings: { connected: true, error: undefined, count: data.length }
      }))
      
      if (data.length === 0) {
        console.log('📭 [PDI Settings] Database is empty - using fallback settings')
        setPdiSettings(mockPDI.sampleSettings.filter(s => s.company_id === companyId))
        setSettingsLoading(false)
        return
      }

      // Transform data safely
      const transformedSettings: PdiSetting[] = data.map((row) => ({
        id: row.id || `setting-${Date.now()}-${Math.random()}`,
        company_id: row.company_id || companyId,
        key: row.key || '',
        value: row.value || '',
        created_at: row.created_at || new Date().toISOString(),
        updated_at: row.updated_at || new Date().toISOString()
      }))

      console.log(`🔄 [PDI Settings] Transformed ${transformedSettings.length} settings`)
      setPdiSettings(transformedSettings)
      
    } catch (error) {
      console.error('💥 [PDI Settings] Supabase fetch failed:', error)
      setSupabaseStatus(prev => ({
        ...prev,
        settings: { 
          connected: false, 
          error: error instanceof Error ? error.message : 'Connection failed', 
          count: 0 
        }
      }))
      // Use fallback data
      setPdiSettings(mockPDI.sampleSettings.filter(s => s.company_id === companyId))
    } finally {
      setSettingsLoading(false)
    }
  }

  const updatePdiSetting = async (companyId: string, key: string, value: string) => {
    console.log(`🔄 [PDI Settings] Updating setting ${key} = ${value}`)
    
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.log('⚠️ [PDI Settings] Supabase not configured, updating local state only')
        // Update local state for demo purposes
        setPdiSettings(prev => {
          const existing = prev.find(s => s.company_id === companyId && s.key === key)
          if (existing) {
            return prev.map(s => 
              s.company_id === companyId && s.key === key 
                ? { ...s, value, updated_at: new Date().toISOString() }
                : s
            )
          } else {
            return [...prev, {
              id: `setting-${Date.now()}-${Math.random()}`,
              company_id: companyId,
              key,
              value,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]
          }
        })
        return
      }

      // Upsert setting in Supabase
      const { data, error } = await supabase
        .from('pdi_settings')
        .upsert({
          company_id: companyId,
          key,
          value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'company_id,key'
        })
        .select()
        .single()

      if (error) {
        console.error('❌ [PDI Settings] Update error:', error.message)
        throw error
      }

      console.log('✅ [PDI Settings] Setting updated:', data.id)

      // Update local state
      setPdiSettings(prev => {
        const existing = prev.find(s => s.company_id === companyId && s.key === key)
        if (existing) {
          return prev.map(s => 
            s.company_id === companyId && s.key === key 
              ? { ...s, value, updated_at: data.updated_at }
              : s
          )
        } else {
          return [...prev, {
            id: data.id,
            company_id: data.company_id,
            key: data.key,
            value: data.value,
            created_at: data.created_at,
            updated_at: data.updated_at
          }]
        }
      })

    } catch (error) {
      console.error('Error updating PDI setting:', error)
      toast({
        title: 'Error',
        description: 'Failed to update PDI setting',
        variant: 'destructive'
      })
      throw error
    }
  }

  const getPdiSetting = (companyId: string, key: string, defaultValue: string = ''): string => {
    const setting = pdiSettings.find(s => s.company_id === companyId && s.key === key)
    return setting?.value || defaultValue
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
    pdiSettings,
    loading,
    settingsLoading,
    usingFallback,
    supabaseStatus,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    getChecklistById,
    getChecklistsByVehicle,
    loadChecklists,
    loadPdiSettings,
    updatePdiSetting,
    getPdiSetting
  }
}