import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4, validate as validateUUID } from 'uuid'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { mockPDI } from '@/mocks/pdiMock'
import { PdiChecklist, PdiSetting } from '@/types'

export function usePdiChecklists() {
  const { user } = useAuth()
  const [checklists, setChecklists] = useState<PdiChecklist[]>([])
  const [loading, setLoading] = useState(true)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)
  const [pdiSettings, setPdiSettings] = useState<PdiSetting[]>([])
  const [connectionAttempted, setConnectionAttempted] = useState(false)
  const [supabaseStatus, setSupabaseStatus] = useState<{
    checklists: { connected: boolean; error?: string; count: number }
    settings: { connected: boolean; error?: string; count: number }
  }>({
    checklists: { connected: false, error: undefined, count: 0 },
    settings: { connected: false, error: undefined, count: 0 }
  })
  const { toast } = useToast()
  
  // Dynamically resolve a valid company ID (fallback if invalid)
  let companyId = user?.tenantId
  if (!validateUUID(companyId)) {
    console.warn('⚠️ Invalid tenantId:', companyId, '- using fallback UUID')
    companyId = '00000000-0000-0000-0000-000000000000'
  }

  // Warn if no valid company ID is found
  useEffect(() => {
    if (!user?.tenantId) {
      console.warn('⚠️ No valid company ID found. PDI settings using fallback UUID.')
    }
  }, [user?.tenantId])

  // Load data from Supabase on mount
  useEffect(() => {
    console.log('🔄 [PDI Checklists] Starting data load from Supabase...')
    console.log('📊 [PDI Checklists] Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'NOT_SET')
    console.log('🔑 [PDI Checklists] Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET')
    
    setConnectionAttempted(true)
    
    const loadData = async (companyId: string) => {
      try {
        await Promise.all([
          loadChecklists(),
          loadPdiSettings(companyId)
        ])
      } catch (error) {
        console.error('🚨 [PDI Checklists] Critical error during data load:', error)
        // Only use fallback if Supabase is not configured
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.log('🔄 [PDI Checklists] Using fallback due to missing Supabase config')
          setChecklists(mockPDI.sampleInspections)
          setUsingFallback(true)
        } else {
          console.log('🔄 [PDI Checklists] Supabase configured but failed - keeping empty state')
          setChecklists([])
          setUsingFallback(false)
        }
        setLoading(false)
      }
    }
    
    loadData(companyId)
  }, [])

  const loadChecklists = async () => {
    console.log('📋 [PDI Checklists] Fetching checklists from Supabase...')
    
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('⚠️ [PDI Checklists] Supabase not configured, using fallback')
      setSupabaseStatus(prev => ({
        ...prev,
        checklists: { connected: false, error: 'Supabase not configured', count: 0 }
      }))
      throw new Error('Supabase not configured')
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
          checklists: { connected: false, error: error.message, count: 0 }
        }))
        throw error
      }

      if (!Array.isArray(data)) {
        console.warn('⚠️ [PDI Checklists] Supabase returned non-array data:', typeof data)
        setSupabaseStatus(prev => ({
          ...prev,
          checklists: { connected: false, error: 'Invalid data format', count: 0 }
        }))
        throw new Error('Invalid data format from Supabase')
      }

      // Empty array is valid - don't use fallback
      console.log(`✅ [PDI Checklists] Supabase connected successfully - ${data.length} checklists found`)
      
      setSupabaseStatus(prev => ({
        ...prev,
        checklists: { connected: true, error: undefined, count: data.length }
      }))
      
      if (data.length === 0) {
        console.log('📭 [PDI Checklists] Database is empty - showing empty state')
        // If Supabase is connected but returns no data, show empty state
        setChecklists([])
        setUsingFallback(false)
        setLoading(false)
        return
      }

      // Log sample data structure
      console.log('📋 [PDI Checklists] Sample checklist:', {
        id: data[0]?.id,
        vehicle_id: data[0]?.vehicle_id,
        technician: data[0]?.technician,
        status: data[0]?.status,
        created_at: data[0]?.created_at
      })

      // Transform data safely
      const transformedChecklists: PdiChecklist[] = data.map((row) => ({
        id: row.id || `pdi-${Date.now()}-${Math.random()}`,
        vehicle_id: row.vehicle_id || '',
        technician: row.technician || 'Unknown',
        status: row.status || 'Not Started',
        checklist_data: Array.isArray(row.checklist_data) ? row.checklist_data : [],
        created_at: row.created_at || new Date().toISOString(),
        updated_at: row.updated_at || new Date().toISOString()
      }))

      console.log(`🔄 [PDI Checklists] Transformed ${transformedChecklists.length} checklists`)
      setChecklists(transformedChecklists)
      setUsingFallback(false)
      setLoading(false)
      
    } catch (error) {
      console.error('💥 [PDI Checklists] Supabase fetch failed:', error)
      
      // Only use fallback if Supabase is not configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.log('🔄 [PDI Checklists] Using mock data fallback - Supabase not configured')
        setChecklists(mockPDI.sampleInspections)
        setUsingFallback(true)
        setSupabaseStatus(prev => ({
          ...prev,
          checklists: { 
            connected: false, 
            error: 'Supabase not configured', 
            count: mockPDI.sampleInspections.length 
          }
        }))
      } else {
        console.log('🔄 [PDI Checklists] Supabase configured but failed - keeping empty state')
        setChecklists([])
        setUsingFallback(false)
        setSupabaseStatus(prev => ({
          ...prev,
          checklists: { 
            connected: false, 
            error: error instanceof Error ? error.message : 'Connection failed', 
            count: 0 
          }
        }))
      }
      setLoading(false)
    }
  }

  const loadPdiSettings = async (companyId: string) => {
    console.log('📋 [PDI Settings] Loading settings for company:', companyId)
    setSettingsLoading(true)
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(companyId)) {
      console.warn('⚠️ [PDI Settings] Invalid UUID format for company ID:', companyId)
      console.log('🔄 [PDI Settings] Using fallback settings due to invalid UUID')
      setPdiSettings(mockPDI.sampleSettings)
      setSupabaseStatus(prev => ({
        ...prev,
        settings: { 
          connected: false, 
          error: `Invalid UUID format: ${companyId}`, 
          count: mockPDI.sampleSettings.length 
        }
      }))
      setSettingsLoading(false)
      return
    }
    
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('⚠️ [PDI Settings] Supabase not configured, using fallback')
      setPdiSettings(mockPDI.sampleSettings)
      setSupabaseStatus(prev => ({
        ...prev,
        settings: { connected: false, error: 'Supabase not configured', count: mockPDI.sampleSettings.length }
      }))
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
        // Use fallback on error
        setPdiSettings(mockPDI.sampleSettings)
        setSettingsLoading(false)
        return
      }

      if (!Array.isArray(data)) {
        console.warn('⚠️ [PDI Settings] Supabase returned non-array data:', typeof data)
        setSupabaseStatus(prev => ({
          ...prev,
          settings: { connected: false, error: 'Invalid data format', count: 0 }
        }))
        setPdiSettings(mockPDI.sampleSettings)
        setSettingsLoading(false)
        return
      }

      console.log(`✅ [PDI Settings] Supabase connected successfully - ${data.length} settings found`)
      
      setSupabaseStatus(prev => ({
        ...prev,
        settings: { connected: true, error: undefined, count: data.length }
      }))

      // Transform data safely
      const transformedSettings: PdiSetting[] = data.map(row => ({
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
      // Use fallback on error
      setPdiSettings(mockPDI.sampleSettings)
    } finally {
      setSettingsLoading(false)
    }
  }

  const updatePdiSetting = async (companyId: string, key: string, value: string) => {
    console.log('📝 [PDI Settings] Updating setting:', { companyId, key, value })
    
    // Validate UUID format - allow fallback UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(companyId)) {
      console.warn('⚠️ [PDI Settings] Invalid UUID format:', companyId, '- using fallback UUID')
      // Don't return early - allow fallback UUID to work
    }
    
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('⚠️ [PDI Settings] Supabase not configured, cannot update')
      throw new Error('Supabase not configured')
    }
    
    try {
      // Use upsert to create or update the setting
      const { data, error } = await supabase
        .from('pdi_settings')
        .upsert({
          company_id: companyId,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'company_id,key'
        })
        .select()

      if (error) {
        console.error('❌ [PDI Settings] Update error:', error.message)
        throw error
      }

      console.log('✅ [PDI Settings] Setting updated successfully')
      
      // Update local state
      setPdiSettings(prev => {
        const existingIndex = prev.findIndex(s => s.company_id === companyId && s.key === key)
        if (existingIndex >= 0) {
          // Update existing setting
          const updated = [...prev]
          updated[existingIndex] = {
            ...updated[existingIndex],
            value,
            updated_at: new Date().toISOString()
          }
          return updated
        } else {
          // Add new setting
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
      
    } catch (error) {
      console.error('💥 [PDI Settings] Update failed:', error)
      throw error
    }
  }

  const getPdiSetting = (companyId: string, key: string, defaultValue: string = ''): string => {
    const setting = pdiSettings.find(s => s.company_id === companyId && s.key === key)
    if (setting) {
      return setting.value
    }
    
    // Fallback to mock settings
    const mockSetting = mockPDI.sampleSettings.find(s => s.key === key)
    return mockSetting?.value || defaultValue
  }

  const createChecklist = async (data: Partial<PdiChecklist>): Promise<PdiChecklist> => {
    try {
      const checklistData = {
        vehicle_id: data.vehicle_id || '',
        technician: data.technician || '',
        status: data.status || 'Not Started',
        checklist_data: data.checklist_data || []
      }

      // Insert into Supabase
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
      console.error('Error creating checklist:', error)
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

      // Update in Supabase
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

      // Transform and update local state
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
      console.error('Error updating checklist:', error)
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
      // Delete from Supabase
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
      console.error('Error deleting checklist:', error)
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

  return {
    checklists,
    loading,
    settingsLoading,
    usingFallback,
    supabaseStatus,
    pdiSettings,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    getChecklistById,
    loadChecklists,
    loadPdiSettings,
    updatePdiSetting,
    getPdiSetting
  }
}