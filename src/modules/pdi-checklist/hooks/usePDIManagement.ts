import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useEffectiveCompanyId } from '@/hooks/useEffectiveCompanyId'
import { useToast } from '@/hooks/use-toast'
import { PdiChecklist, PdiSetting } from '@/types'
import { mockPDI } from '@/mocks/pdiMock'

interface PDIManagementState {
  inspections: PdiChecklist[]
  settings: PdiSetting[]
  loading: boolean
  error: Error | null
  usingFallback: boolean
  supabaseStatus: {
    inspections: { connected: boolean; error?: string; count: number }
    settings: { connected: boolean; error?: string; count: number }
  }
}

export function usePDIManagement() {
  const { companyId, usingFallback: companyIdFallback } = useEffectiveCompanyId()
  const { toast } = useToast()
  
  const [state, setState] = useState<PDIManagementState>({
    inspections: [],
    settings: [],
    loading: true,
    error: null,
    usingFallback: false,
    supabaseStatus: {
      inspections: { connected: false, error: undefined, count: 0 },
      settings: { connected: false, error: undefined, count: 0 }
    }
  })

  const fetchInspections = async () => {
    console.log('🔍 [PDI Management] Fetching inspections from Supabase...')
    
    if (companyIdFallback) {
      console.warn('⚠️ [PDI Management] Invalid company ID, using fallback data')
      setState(prev => ({
        ...prev,
        inspections: mockPDI.sampleInspections,
        usingFallback: true,
        supabaseStatus: {
          ...prev.supabaseStatus,
          inspections: { connected: false, error: 'Invalid company ID', count: 0 }
        }
      }))
      return
    }

    try {
      const { data, error } = await supabase
        .from('pdi_checklists')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ [PDI Management] Supabase error fetching inspections:', error.message)
        console.log('Supabase fetch failed for PDI Checklist')
        setState(prev => ({
          ...prev,
          inspections: mockPDI.sampleInspections,
          usingFallback: true,
          supabaseStatus: {
            ...prev.supabaseStatus,
            inspections: { connected: false, error: error.message, count: 0 }
          }
        }))
        return
      }

      console.log(`✅ [PDI Management] Fetched ${data?.length || 0} inspections from Supabase`)
      
      if (!data || data.length === 0) {
        // No data found, use fallback
        setState(prev => ({
          ...prev,
          inspections: mockPDI.sampleInspections,
          usingFallback: true,
          supabaseStatus: {
            ...prev.supabaseStatus,
            inspections: { connected: true, error: undefined, count: 0 }
          }
        }))
        return
      }

      // Transform Supabase data to match our types
      const transformedInspections: PdiChecklist[] = data.map(row => ({
        id: row.id,
        vehicle_id: row.vehicle_id,
        technician: row.technician,
        status: row.status,
        checklist_data: Array.isArray(row.checklist_data) ? row.checklist_data : [],
        created_at: row.created_at,
        updated_at: row.updated_at
      }))

      setState(prev => ({
        ...prev,
        inspections: transformedInspections,
        usingFallback: false,
        supabaseStatus: {
          ...prev.supabaseStatus,
          inspections: { connected: true, error: undefined, count: transformedInspections.length }
        }
      }))
    } catch (err: any) {
      console.error('💥 [PDI Management] Unexpected error fetching inspections:', err)
      console.log('Supabase fetch failed for PDI Checklist')
      setState(prev => ({
        ...prev,
        inspections: mockPDI.sampleInspections,
        usingFallback: true,
        error: new Error('Failed to fetch inspections'),
        supabaseStatus: {
          ...prev.supabaseStatus,
          inspections: { connected: false, error: err.message, count: 0 }
        }
      }))
    }
  }

  const fetchSettings = async () => {
    console.log('⚙️ [PDI Management] Fetching settings from Supabase...')
    
    if (companyIdFallback) {
      console.warn('⚠️ [PDI Management] Invalid company ID for settings, using fallback')
      setState(prev => ({
        ...prev,
        settings: mockPDI.sampleSettings,
        supabaseStatus: {
          ...prev.supabaseStatus,
          settings: { connected: false, error: 'Invalid company ID', count: 0 }
        }
      }))
      return
    }

    try {
      const { data, error } = await supabase
        .from('pdi_settings')
        .select('*')
        .eq('company_id', companyId)

      if (error) {
        console.error('❌ [PDI Management] Supabase error fetching settings:', error.message)
        console.log('Supabase fetch failed for PDI Checklist')
        setState(prev => ({
          ...prev,
          settings: mockPDI.sampleSettings,
          supabaseStatus: {
            ...prev.supabaseStatus,
            settings: { connected: false, error: error.message, count: 0 }
          }
        }))
        return
      }

      console.log(`✅ [PDI Management] Fetched ${data?.length || 0} settings from Supabase`)

      if (!data || data.length === 0) {
        // No settings found, use fallback
        setState(prev => ({
          ...prev,
          settings: mockPDI.sampleSettings,
          supabaseStatus: {
            ...prev.supabaseStatus,
            settings: { connected: true, error: undefined, count: 0 }
          }
        }))
        return
      }

      // Transform Supabase data to match our types
      const transformedSettings: PdiSetting[] = data.map(row => ({
        id: row.id,
        company_id: row.company_id,
        key: row.setting_key,
        value: row.setting_value,
        created_at: row.created_at,
        updated_at: row.updated_at
      }))

      setState(prev => ({
        ...prev,
        settings: transformedSettings,
        supabaseStatus: {
          ...prev.supabaseStatus,
          settings: { connected: true, error: undefined, count: transformedSettings.length }
        }
      }))
    } catch (err: any) {
      console.error('💥 [PDI Management] Unexpected error fetching settings:', err)
      console.log('Supabase fetch failed for PDI Checklist')
      setState(prev => ({
        ...prev,
        settings: mockPDI.sampleSettings,
        error: new Error('Failed to fetch settings'),
        supabaseStatus: {
          ...prev.supabaseStatus,
          settings: { connected: false, error: err.message, count: 0 }
        }
      }))
    }
  }

  const createInspection = async (inspectionData: Omit<PdiChecklist, 'id' | 'created_at' | 'updated_at'>) => {
    if (companyIdFallback || !companyId) {
      toast({
        title: 'Error',
        description: 'Invalid company ID. Cannot create inspection.',
        variant: 'destructive'
      })
      return null
    }

    try {
      const { data, error } = await supabase
        .from('pdi_checklists')
        .insert([{
          vehicle_id: inspectionData.vehicle_id,
          technician: inspectionData.technician,
          status: inspectionData.status,
          checklist_data: inspectionData.checklist_data,
          company_id: companyId
        }])
        .select()
        .single()

      if (error) {
        console.error('❌ [PDI Management] Error creating inspection:', error.message)
        toast({
          title: 'Error',
          description: 'Failed to create inspection',
          variant: 'destructive'
        })
        return null
      }

      const newInspection: PdiChecklist = {
        id: data.id,
        vehicle_id: data.vehicle_id,
        technician: data.technician,
        status: data.status,
        checklist_data: data.checklist_data,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      setState(prev => ({
        ...prev,
        inspections: [newInspection, ...prev.inspections]
      }))

      return newInspection
    } catch (err: any) {
      console.error('💥 [PDI Management] Unexpected error creating inspection:', err)
      toast({
        title: 'Error',
        description: 'Failed to create inspection',
        variant: 'destructive'
      })
      return null
    }
  }

  const updateInspection = async (id: string, updates: Partial<PdiChecklist>) => {
    try {
      const { data, error } = await supabase
        .from('pdi_checklists')
        .update({
          vehicle_id: updates.vehicle_id,
          technician: updates.technician,
          status: updates.status,
          checklist_data: updates.checklist_data
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ [PDI Management] Error updating inspection:', error.message)
        toast({
          title: 'Error',
          description: 'Failed to update inspection',
          variant: 'destructive'
        })
        return
      }

      const updatedInspection: PdiChecklist = {
        id: data.id,
        vehicle_id: data.vehicle_id,
        technician: data.technician,
        status: data.status,
        checklist_data: data.checklist_data,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      setState(prev => ({
        ...prev,
        inspections: prev.inspections.map(inspection =>
          inspection.id === id ? updatedInspection : inspection
        )
      }))
    } catch (err: any) {
      console.error('💥 [PDI Management] Unexpected error updating inspection:', err)
      toast({
        title: 'Error',
        description: 'Failed to update inspection',
        variant: 'destructive'
      })
    }
  }

  const deleteInspection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pdi_checklists')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ [PDI Management] Error deleting inspection:', error.message)
        toast({
          title: 'Error',
          description: 'Failed to delete inspection',
          variant: 'destructive'
        })
        return
      }

      setState(prev => ({
        ...prev,
        inspections: prev.inspections.filter(inspection => inspection.id !== id)
      }))
    } catch (err: any) {
      console.error('💥 [PDI Management] Unexpected error deleting inspection:', err)
      toast({
        title: 'Error',
        description: 'Failed to delete inspection',
        variant: 'destructive'
      })
    }
  }

  const updateSetting = async (key: string, value: string) => {
    if (companyIdFallback || !companyId) {
      toast({
        title: 'Error',
        description: 'Invalid company ID. Cannot update setting.',
        variant: 'destructive'
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from('pdi_settings')
        .upsert({
          company_id: companyId,
          setting_key: key,
          setting_value: value
        })
        .select()
        .single()

      if (error) {
        console.error('❌ [PDI Management] Error updating setting:', error.message)
        toast({
          title: 'Error',
          description: 'Failed to update setting',
          variant: 'destructive'
        })
        return
      }

      const updatedSetting: PdiSetting = {
        id: data.id,
        company_id: data.company_id,
        key: data.setting_key,
        value: data.setting_value,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      setState(prev => ({
        ...prev,
        settings: prev.settings.some(s => s.key === key)
          ? prev.settings.map(s => s.key === key ? updatedSetting : s)
          : [...prev.settings, updatedSetting]
      }))
    } catch (err: any) {
      console.error('💥 [PDI Management] Unexpected error updating setting:', err)
      toast({
        title: 'Error',
        description: 'Failed to update setting',
        variant: 'destructive'
      })
    }
  }

  // Load data when component mounts or company_id changes
  useEffect(() => {
    if (companyId) {
      setState(prev => ({ ...prev, loading: true }))
      Promise.all([fetchInspections(), fetchSettings()]).finally(() => {
        setState(prev => ({ ...prev, loading: false }))
      })
    }
  }, [companyId])

  return {
    inspections: state.inspections,
    settings: state.settings,
    loading: state.loading,
    error: state.error,
    usingFallback: state.usingFallback,
    supabaseStatus: state.supabaseStatus,
    createInspection,
    updateInspection,
    deleteInspection,
    updateSetting,
    refetch: () => {
      setState(prev => ({ ...prev, loading: true }))
      Promise.all([fetchInspections(), fetchSettings()]).finally(() => {
        setState(prev => ({ ...prev, loading: false }))
      })
    }
  }
}