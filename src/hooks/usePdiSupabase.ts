import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { PdiChecklist, PdiSetting } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { mockPDI } from '@/mocks/pdiMock'
import { useAuth } from '@/contexts/AuthContext'

// UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isValidUUID(uuid: string): boolean {
  return uuidRegex.test(uuid)
}

export function usePdiSupabase() {
  const [pdiChecklists, setPdiChecklists] = useState<PdiChecklist[]>([])
  const [pdiSettings, setPdiSettings] = useState<PdiSetting[]>([])
  const [loading, setLoading] = useState(true)
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
  const { user } = useAuth()

  // Get company_id from user context with UUID validation
  const getValidatedCompanyId = (): string | null => {
    const rawCompanyId = user?.tenantId
    if (!rawCompanyId || !isValidUUID(rawCompanyId)) {
      console.warn('⚠️ [PDI Settings] Invalid or missing company_id:', rawCompanyId)
      return null
    }
    return rawCompanyId
  }

  // Load data from Supabase on mount
  useEffect(() => {
    console.log('🔄 [PDI Checklist] Starting data load from Supabase...')
    console.log('📊 [PDI Checklist] Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'NOT_SET')
    console.log('🔑 [PDI Checklist] Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET')
    
    setConnectionAttempted(true)
    
    const loadData = async () => {
      try {
        await Promise.all([loadPdiChecklists(), loadPdiSettings()])
      } catch (error) {
        console.error('🚨 [PDI Checklist] Critical error during data load:', error)
        // Only use fallback if Supabase is not configured
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.log('🔄 [PDI Checklist] Using fallback due to missing Supabase config')
          setPdiChecklists(mockPDI.sampleInspections)
          setPdiSettings(mockPDI.sampleSettings)
          setUsingFallback(true)
        } else {
          console.log('🔄 [PDI Checklist] Supabase configured but failed - keeping empty state')
          setPdiChecklists([])
          setPdiSettings([])
          setUsingFallback(false)
        }
        setLoading(false)
      }
    }
    
    loadData()
  }, [user?.tenantId])

  const loadPdiChecklists = async () => {
    console.log('📋 [PDI Checklist] Fetching checklists from Supabase...')
    
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('⚠️ [PDI Checklist] Supabase not configured, using fallback')
      setSupabaseStatus(prev => ({
        ...prev,
        checklists: { connected: false, error: 'Supabase not configured', count: 0 }
      }))
      throw new Error('Supabase not configured')
    }
    
    try {
      console.log('⏳ [PDI Checklist] Executing Supabase query for pdi_checklists...')
      const { data, error } = await supabase
        .from('pdi_checklists')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('📊 [PDI Checklist] Supabase response:', { 
        error: error?.message || null, 
        dataType: typeof data, 
        dataLength: Array.isArray(data) ? data.length : 'not array',
        isNull: data === null,
        isUndefined: data === undefined
      })

      if (error) {
        console.error('❌ [PDI Checklist] Supabase error:', error.message)
        setSupabaseStatus(prev => ({
          ...prev,
          checklists: { connected: false, error: error.message, count: 0 }
        }))
        throw error
      }

      if (!Array.isArray(data)) {
        console.warn('⚠️ [PDI Checklist] Supabase returned non-array data:', typeof data)
        setSupabaseStatus(prev => ({
          ...prev,
          checklists: { connected: false, error: 'Invalid data format', count: 0 }
        }))
        throw new Error('Invalid data format from Supabase')
      }

      // Empty array is valid - don't use fallback
      console.log(`✅ [PDI Checklist] Supabase connected successfully - ${data.length} checklists found`)
      
      setSupabaseStatus(prev => ({
        ...prev,
        checklists: { connected: true, error: undefined, count: data.length }
      }))
      
      if (data.length === 0) {
        console.log('📭 [PDI Checklist] Database is empty - showing empty state')
        // If Supabase is connected but returns no data, show empty state
        setPdiChecklists([])
        setUsingFallback(false)
        return
      }

      // Log sample data structure
      console.log('📋 [PDI Checklist] Sample checklist:', {
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
        technician: row.technician || '',
        status: row.status || 'not_started',
        checklist_data: Array.isArray(row.checklist_data) ? row.checklist_data : [],
        created_at: row.created_at || new Date().toISOString(),
        updated_at: row.updated_at || new Date().toISOString()
      }))

      console.log(`🔄 [PDI Checklist] Transformed ${transformedChecklists.length} checklists`)
      setPdiChecklists(transformedChecklists)
      setUsingFallback(false)
      
    } catch (error) {
      console.error('💥 [PDI Checklist] Supabase fetch failed:', error)
      
      // Only use fallback if Supabase is not configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.log('🔄 [PDI Checklist] Using mock data fallback - Supabase not configured')
        setPdiChecklists(mockPDI.sampleInspections)
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
        console.log('🔄 [PDI Checklist] Supabase configured but failed - keeping empty state')
        setPdiChecklists([])
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
    }
  }

  const loadPdiSettings = async () => {
    console.log('📋 [PDI Settings] Fetching settings from Supabase...')
    
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('⚠️ [PDI Settings] Supabase not configured for settings, using fallback')
      setSupabaseStatus(prev => ({
        ...prev,
        settings: { connected: false, error: 'Supabase not configured', count: 0 }
      }))
      throw new Error('Supabase not configured')
    }

    // Validate company_id before making Supabase query
    const companyId = getValidatedCompanyId()
    if (!companyId) {
      console.log('⚠️ [PDI Settings] Invalid company_id, using fallback data')
      setPdiSettings(mockPDI.sampleSettings)
      setUsingFallback(true)
      setSupabaseStatus(prev => ({
        ...prev,
        settings: { 
          connected: false, 
          error: 'Invalid company_id (not UUID)', 
          count: mockPDI.sampleSettings.length 
        }
      }))
      return
    }
    
    try {
      console.log('⏳ [PDI Settings] Executing Supabase query for pdi_settings...')
      console.log('🔑 [PDI Settings] Using company_id:', companyId)
      
      const { data, error } = await supabase
        .from('pdi_settings')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      console.log('📊 [PDI Settings] Settings response:', { 
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
        throw error
      }

      if (!Array.isArray(data)) {
        console.warn('⚠️ [PDI Settings] Settings returned non-array data:', typeof data)
        setSupabaseStatus(prev => ({
          ...prev,
          settings: { connected: false, error: 'Invalid data format', count: 0 }
        }))
        throw new Error('Invalid settings data format')
      }

      console.log(`✅ [PDI Settings] Settings connected successfully - ${data.length} settings found`)
      
      setSupabaseStatus(prev => ({
        ...prev,
        settings: { connected: true, error: undefined, count: data.length }
      }))

      if (data.length === 0) {
        console.log('📭 [PDI Settings] Settings database is empty - showing empty state')
        // If Supabase is connected but returns no settings, show empty state
        setPdiSettings([])
        setUsingFallback(false)
        return
      }

      // Transform data safely
      const transformedSettings: PdiSetting[] = data.map(row => ({
        id: row.id || `setting-${Date.now()}-${Math.random()}`,
        company_id: row.company_id || companyId,
        setting_key: row.setting_key || '',
        setting_value: row.setting_value || '',
        created_at: row.created_at || new Date().toISOString(),
        updated_at: row.updated_at || new Date().toISOString()
      }))

      console.log(`🔄 [PDI Settings] Transformed ${transformedSettings.length} settings`)
      setPdiSettings(transformedSettings)
      setUsingFallback(false)
      
    } catch (error) {
      console.error('💥 [PDI Settings] Settings fetch failed:', error)
      
      // Only use fallback if Supabase is not configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.log('🔄 [PDI Settings] Using mock settings fallback - Supabase not configured')
        setPdiSettings(mockPDI.sampleSettings)
        setUsingFallback(true)
        setSupabaseStatus(prev => ({
          ...prev,
          settings: { 
            connected: false, 
            error: 'Supabase not configured', 
            count: mockPDI.sampleSettings.length 
          }
        }))
      } else {
        console.log('🔄 [PDI Settings] Settings fetch failed - keeping empty state')
        setPdiSettings([])
        setUsingFallback(false)
        setSupabaseStatus(prev => ({
          ...prev,
          settings: { 
            connected: false, 
            error: error instanceof Error ? error.message : 'Connection failed', 
            count: 0 
          }
        }))
      }
    }
  }

  const createChecklist = async (data: Partial<PdiChecklist>): Promise<PdiChecklist> => {
    try {
      const checklistData = {
        vehicle_id: data.vehicle_id || '',
        technician: data.technician || '',
        status: data.status || 'not_started',
        checklist_data: data.checklist_data || []
      }

      // Insert into Supabase
      const { data: insertedData, error } = await supabase
        .from('pdi_checklists')
        .insert([checklistData])
        .select()
        .single()

      if (error) {
        console.error('❌ [PDI Checklist] Create error:', error.message)
        throw error
      }

      console.log('✅ [PDI Checklist] Checklist created:', insertedData.id)

      const newChecklist: PdiChecklist = {
        id: insertedData.id,
        vehicle_id: insertedData.vehicle_id,
        technician: insertedData.technician,
        status: insertedData.status,
        checklist_data: insertedData.checklist_data || [],
        created_at: insertedData.created_at,
        updated_at: insertedData.updated_at
      }

      setPdiChecklists(prev => [newChecklist, ...prev])
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
        console.error('❌ [PDI Checklist] Update error:', error.message)
        throw error
      }

      console.log('✅ [PDI Checklist] Checklist updated:', data.id)

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

      setPdiChecklists(prev => prev.map(checklist => 
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
        console.error('❌ [PDI Checklist] Delete error:', error.message)
        throw error
      }

      console.log('✅ [PDI Checklist] Checklist deleted:', id)

      setPdiChecklists(prev => prev.filter(checklist => checklist.id !== id))
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

  const createPdiSetting = async (data: Partial<PdiSetting>): Promise<PdiSetting> => {
    // Validate company_id before making Supabase query
    const companyId = getValidatedCompanyId()
    if (!companyId) {
      console.error('❌ [PDI Settings] Cannot create setting - invalid company_id')
      throw new Error('Invalid company_id - must be a valid UUID')
    }

    try {
      const settingData = {
        company_id: companyId,
        setting_key: data.setting_key || '',
        setting_value: data.setting_value || ''
      }

      // Insert into Supabase
      const { data: insertedData, error } = await supabase
        .from('pdi_settings')
        .insert([settingData])
        .select()
        .single()

      if (error) {
        console.error('❌ [PDI Settings] Create error:', error.message)
        throw error
      }

      console.log('✅ [PDI Settings] Setting created:', insertedData.id)

      const newSetting: PdiSetting = {
        id: insertedData.id,
        company_id: insertedData.company_id,
        setting_key: insertedData.setting_key,
        setting_value: insertedData.setting_value,
        created_at: insertedData.created_at,
        updated_at: insertedData.updated_at
      }

      setPdiSettings(prev => [newSetting, ...prev])
      return newSetting
    } catch (error) {
      console.error('Error creating PDI setting:', error)
      toast({
        title: 'Error',
        description: 'Failed to create PDI setting',
        variant: 'destructive'
      })
      throw error
    }
  }

  const updatePdiSetting = async (id: string, updates: Partial<PdiSetting>) => {
    try {
      const updateData = {
        setting_key: updates.setting_key,
        setting_value: updates.setting_value
      }

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData]
        }
      })

      // Update in Supabase
      const { data, error } = await supabase
        .from('pdi_settings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ [PDI Settings] Update error:', error.message)
        throw error
      }

      console.log('✅ [PDI Settings] Setting updated:', data.id)

      const updatedSetting: PdiSetting = {
        id: data.id,
        company_id: data.company_id,
        setting_key: data.setting_key,
        setting_value: data.setting_value,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      setPdiSettings(prev => prev.map(setting => 
        setting.id === id ? updatedSetting : setting
      ))
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

  const deletePdiSetting = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('pdi_settings')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ [PDI Settings] Delete error:', error.message)
        throw error
      }

      console.log('✅ [PDI Settings] Setting deleted:', id)

      setPdiSettings(prev => prev.filter(setting => setting.id !== id))
    } catch (error) {
      console.error('Error deleting PDI setting:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete PDI setting',
        variant: 'destructive'
      })
      throw error
    }
  }

  const getChecklistById = (id: string): PdiChecklist | undefined => {
    return pdiChecklists.find(checklist => checklist.id === id)
  }

  const getSettingByKey = (key: string): PdiSetting | undefined => {
    return pdiSettings.find(setting => setting.setting_key === key)
  }

  return {
    pdiChecklists,
    pdiSettings,
    loading,
    usingFallback,
    supabaseStatus,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    getChecklistById,
    createPdiSetting,
    updatePdiSetting,
    deletePdiSetting,
    getSettingByKey,
    loadPdiChecklists,
    loadPdiSettings
  }
}