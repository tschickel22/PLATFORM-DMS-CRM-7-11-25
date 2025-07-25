import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { mockPDI } from '@/mocks/pdiMock'
import { PdiChecklist, PdiSetting } from '@/types'

// UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// Export alias for backward compatibility
export const usePdiChecklists = usePdiSupabase

export function usePdiSupabase() {
  const { session } = useAuth()
  const [checklists, setChecklists] = useState<PdiChecklist[]>([])
  const [loading, setLoading] = useState(true)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)
  const [pdiSettings, setPdiSettings] = useState<PdiSetting[]>([])
  const [connectionAttempted, setConnectionAttempted] = useState(false)
  const [supabaseStatus, setSupabaseStatus] = useState<{
    checklists: { connected: boolean; error: string | undefined; count: number };
    settings: { connected: boolean; error: string | undefined; count: number };
  const [supabaseStatus, setSupabaseStatus] = useState<{
    checklists: { connected: boolean; error?: string; count: number }
    settings: { connected: boolean; error?: string; count: number }
  }>({
    checklists: { connected: false, error: undefined, count: 0 },
    settings: { connected: false, error: undefined, count: 0 }
  })
  const { toast } = useToast()

  // UUID validation regex (avoiding external dependency)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  useEffect(() => {
    if (!session?.user?.app_metadata?.company_id) {
      console.warn('⚠️ Invalid companyId. Using fallback PDI data.')
      console.warn('⚠️ No valid company ID found. PDI settings using fallback UUID.')
    }
  }, [session?.user?.app_metadata?.company_id])

  // Load data from Supabase on mount
  useEffect(() => {
    console.log('🔄 [PDI Checklists] Starting data load from Supabase...')
    console.log('📊 [PDI Checklists] Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'NOT_SET')
    console.log('🔑 [PDI Checklists] Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET')
    
    setConnectionAttempted(true)
    
    const loadData = async () => {
      // Get company ID from session with proper validation
      const rawCompanyId = session?.user?.app_metadata?.company_id || '00000000-0000-0000-0000-000000000000';
      const isValidCompanyId = uuidRegex.test(rawCompanyId);
      const companyId = isValidCompanyId ? rawCompanyId : null;

      if (!companyId) {
        console.warn("[PDI Settings] Invalid companyId UUID. Skipping PDI settings load.");
        setPdiSettings(mockPDI.sampleSettings);
        setSupabaseStatus(prev => ({
          ...prev,
          settings: {
            connected: false,
            error: 'Invalid company ID format',
            count: 0
          }
        }));
        setLoading(false);
        return;
      }

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
    
    loadData()
  }, [session?.user?.app_metadata?.company_id])

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
    
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('⚠️ [PDI Settings] Supabase not configured, using fallback')
      setSupabaseStatus(prev => ({
        ...prev,
        settings: { connected: false, error: 'Supabase not configured', count: 0 }
      }))
      // Use fallback only when Supabase is not configured
      setPdiSettings(mockPDI.sampleSettings)
      setUsingFallback(true)
      setSettingsLoading(false)
      return
    }
    
    try {
      console.log('⏳ [PDI Settings] Executing Supabase query for pdi_settings...')
      let query = supabase
        .from('pdi_settings')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (companyId) {
        query = query.eq('company_id', companyId)
      }
      
      const { data, error } = await query

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
        // If Supabase is configured but fails, use empty array (not mock data)
        setPdiSettings([])
        setUsingFallback(false)
        setSettingsLoading(false)
        return
      }

      if (!Array.isArray(data)) {
        console.warn('⚠️ [PDI Settings] Supabase returned non-array data:', typeof data)
        setSupabaseStatus(prev => ({
          ...prev,
          settings: { connected: false, error: 'Invalid data format', count: 0 }
        }))
        setPdiSettings([])
        setUsingFallback(false)
        setSettingsLoading(false)
        return
      }

      console.log(`✅ [PDI Settings] Supabase connected successfully - ${data.length} settings found`)
      
      setSupabaseStatus(prev => ({
        ...prev,
        settings: { connected: true, error: undefined, count: data.length }
      }))
      
      setPdiSettings(data)
      setUsingFallback(false)
      
    } catch (error) {
      console.error('💥 [PDI Settings] Supabase fetch failed:', error)
      
      // If Supabase is configured but fails, use empty array (not mock data)
      console.log('🔄 [PDI Settings] Supabase configured but failed - keeping empty state')
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
    } finally {
      setSettingsLoading(false)
    }
  }

  const updatePdiSetting = async (key: string, value: string) => {
    // Get company ID from session with proper validation
    const rawCompanyId = session?.user?.app_metadata?.company_id || '00000000-0000-0000-0000-000000000000';
    const isValidCompanyId = uuidRegex.test(rawCompanyId);
    const companyId = isValidCompanyId ? rawCompanyId : null;

    if (!companyId) {
      console.warn("[PDI Settings] Invalid companyId UUID. Skipping PDI setting update.");
      toast({
        title: 'Error',
        description: 'Invalid company ID format',
        variant: 'destructive'
      });
      return;
    }
    
    console.log('📝 [PDI Settings] Updating setting:', { companyId, key, value })
    
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

      console.log('✅ [PDI Settings] Setting upserted:', data)
      
      // Update local state to reflect changes immediately
      setPdiSettings(prev => {
        const existingIndex = prev.findIndex(setting => 
          setting.company_id === companyId && setting.key === key
        )
        
        if (existingIndex >= 0) {
          // Update existing setting
          const updated = [...prev]
          updated[existingIndex] = { ...updated[existingIndex], value, updated_at: new Date().toISOString() }
          return updated
        } else {
          // Add new setting
          return [...prev, {
            id: data?.[0]?.id || `temp-${Date.now()}`,
            company_id: companyId,
            key,
            value,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]
        }
      })
      
      toast({
        title: 'Setting Updated',
        description: `PDI setting "${key}" has been updated successfully.`
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

  const getPdiSetting = (key: string, defaultValue: string = ''): string => {
    // Get company ID from session with proper validation
    const rawCompanyId = session?.user?.app_metadata?.company_id || '00000000-0000-0000-0000-000000000000';
    const isValidCompanyId = uuidRegex.test(rawCompanyId);
    const companyId = isValidCompanyId ? rawCompanyId : null;

    if (!companyId) {
      console.warn("[PDI Settings] Invalid companyId UUID. Returning default value.");
      return defaultValue;
    }

    // Read from cached state (not directly from Supabase)
    const setting = pdiSettings.find(s => 
      s.company_id === companyId && s.key === key
    )
    
    return setting?.value || defaultValue
  }

  const createChecklist = async (data: Partial<PdiChecklist>): Promise<PdiChecklist> => {
    const rawCompanyId = session?.user?.app_metadata?.company_id
    const isValidCompanyId = uuidRegex.test(rawCompanyId)
    const companyId = isValidCompanyId ? rawCompanyId : null
    
    if (!companyId) {
      console.warn('⚠️ Invalid companyId. Cannot create PDI checklist.')
      toast({
        title: 'Error',
        description: 'Invalid company configuration. Please contact support.',
        variant: 'destructive'
      })
      throw new Error('Invalid company ID')
    }

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
        .insert([{ ...checklistData, ...(companyId && { company_id: companyId }) }])
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
    const rawCompanyId = session?.user?.app_metadata?.company_id
    const isValidCompanyId = uuidRegex.test(rawCompanyId)
    const companyId = isValidCompanyId ? rawCompanyId : null
    
    if (!companyId) {
      console.warn('⚠️ Invalid companyId. Cannot update PDI setting.')
      toast({
        title: 'Error',
        description: 'Invalid company configuration. Please contact support.',
        variant: 'destructive'
      })
      return
    }

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

  const hookReturn = {
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

  return hookReturn
}