import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { safeFallbackTenant, createSafeFallbackTenant } from '@/lib/fallbacks'

// UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export interface CustomField {
  id: string
  name: string
  type: 'text' | 'number' | 'select' | 'checkbox' | 'date'
  required: boolean
  options?: string[]
  module: string
  section: string
  company_id?: string
  source?: 'supabase' | 'fallback'
}

export interface Tenant {
  id: string
  name: string
  domain: string
  settings: {
    timezone: string
    currency: string
    dateFormat: string
    language: string
  }
  branding: {
    primaryColor: string
    secondaryColor: string
    logo?: string
    favicon?: string
  }
  customFields: CustomField[]
  source?: 'supabase' | 'fallback'
}

interface TenantContextType {
  tenant: Tenant | null
  loading: boolean
  error: Error | null
  usingFallback: boolean
  supabaseStatus: {
    connected: boolean
    error?: string
    count: number
  }
  updateTenant: (updates: Partial<Tenant>) => Promise<void>
  addCustomField: (field: Omit<CustomField, 'id' | 'source'>) => Promise<void>
  updateCustomField: (id: string, updates: Partial<CustomField>) => Promise<void>
  deleteCustomField: (id: string) => Promise<void>
  refetchTenant: () => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean
    error?: string
    count: number
  }>({ connected: false, error: undefined, count: 0 })

  const fetchTenant = async () => {
    setLoading(true)
    setError(null)

    const rawCompanyId = user?.tenantId
    const isValidCompanyId = typeof rawCompanyId === 'string' && uuidRegex.test(rawCompanyId)
    const companyId = isValidCompanyId ? rawCompanyId : null

    console.log("Resolved company_id:", companyId);
    console.log('🏢 [TenantContext] Fetching tenant data...', { rawCompanyId, isValidCompanyId, companyId })

    if (!companyId) {
      console.warn('⚠️ [TenantContext] Invalid or missing company_id. Using fallback data.')
      const fallbackTenant = {
        ...createSafeFallbackTenant('fallback-id'),
        source: 'fallback' as const
      }
      setTenant(fallbackTenant)
      setUsingFallback(true)
      setSupabaseStatus({ connected: false, error: 'Invalid company ID', count: 0 })
      setLoading(false)
      return
    }

    try {
      // Fetch tenant/company data from Supabase
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', companyId)
        .single()

      // Fetch custom fields
      const { data: customFieldsData, error: customFieldsError } = await supabase
        .from('custom_fields')
        .select('*')
        .eq('company_id', companyId)

      if (tenantError || customFieldsError) {
        const errorMsg = tenantError?.message || customFieldsError?.message || 'Unknown error'
        console.error('❌ [TenantContext] Supabase fetch error:', errorMsg)
        setError(new Error(errorMsg))
        
        // Fallback to mock data
        const fallbackTenant = {
          ...createSafeFallbackTenant(companyId),
          source: 'fallback' as const
        }
        setTenant(fallbackTenant)
        setUsingFallback(true)
        setSupabaseStatus({ connected: false, error: errorMsg, count: 0 })
      } else {
        console.log('✅ [TenantContext] Fetched tenant data from Supabase:', { tenantData, customFieldsData })
        
        // Always create completely new plain object to prevent Relay contamination
        const transformedTenant: Tenant = {
          ...createSafeFallbackTenant(tenantData?.id || 'unknown-id'), 
          name: tenantData?.name || 'Company Name',
          domain: tenantData?.domain || 'company.com',
          settings: {
            ...createSafeFallbackTenant().settings,
            timezone: tenantData?.timezone || 'UTC',
            currency: tenantData?.currency || 'USD',
            dateFormat: tenantData?.dateFormat || 'MM/DD/YYYY',
            language: tenantData?.language || 'en'
          },
          branding: {
            ...createSafeFallbackTenant().branding,
            primaryColor: tenantData?.primaryColor || '#3b82f6',
            secondaryColor: tenantData?.secondaryColor || '#64748b'
          },
          customFields: Array.isArray(customFieldsData) ? customFieldsData.map(f => ({ ...f, source: 'supabase' as const })) : [],
          source: 'supabase'
        }
        
        setTenant(transformedTenant)
        setUsingFallback(false)
        setSupabaseStatus({ connected: true, count: customFieldsData?.length || 0 })
      }
    } catch (err: any) {
      console.error('💥 [TenantContext] Unexpected error during fetch:', err)
      console.log('Supabase fetch failed for TenantContext')
      setError(new Error('Failed to connect to Supabase or process data.'))
      
      // Always create completely new plain object to prevent Relay contamination
      const fallbackTenant = {
        ...createSafeFallbackTenant(companyId),
        source: 'fallback' as const
      }
      setTenant(fallbackTenant)
      setUsingFallback(true)
      setSupabaseStatus({ connected: false, error: err.message, count: 0 })
    } finally {
      setLoading(false)
    }
  }

  const updateTenant = async (updates: Partial<Tenant>) => {
    if (usingFallback) {
      console.log('📝 [TenantContext] Updating tenant (fallback mode):', updates)
      setTenant(prev => {
        if (!prev) return null
        // Always recreate as plain object to prevent Relay contamination
        return {
          ...createSafeFallbackTenant(prev.id),
          name: updates.name || prev.name,
          domain: updates.domain || prev.domain,
          settings: {
            ...createSafeFallbackTenant().settings,
            ...(prev.settings || {}),
            ...(updates.settings || {})
          },
          branding: {
            ...createSafeFallbackTenant().branding,
            ...(prev.branding || {}),
            ...(updates.branding || {})
          },
          customFields: Array.isArray(prev.customFields) ? prev.customFields : [],
          source: 'fallback' as const
        }
      })
      return
    }

    const rawCompanyId = user?.tenantId
    const companyId = uuidRegex.test(rawCompanyId || '') ? rawCompanyId : null
    if (!companyId) throw new Error('Invalid company ID for Supabase operation.')

    try {
      console.log('📝 [TenantContext] Updating tenant in Supabase:', updates)
      
      const { error: supabaseError } = await supabase
        .from('tenants')
        .update({
          name: updates.name,
          domain: updates.domain,
          status: 'active'
        })
        .eq('id', companyId)

      if (supabaseError) throw supabaseError
      
      console.log('✅ [TenantContext] Tenant updated successfully')
      setTenant(prev => {
        if (!prev) return null
        // Always recreate as plain object to prevent Relay contamination
        return {
          ...createSafeFallbackTenant(prev.id),
          name: updates.name || prev.name,
          domain: updates.domain || prev.domain,
          settings: {
            ...createSafeFallbackTenant().settings,
            ...(prev.settings || {}),
            ...(updates.settings || {})
          },
          branding: {
            ...createSafeFallbackTenant().branding,
            ...(prev.branding || {}),
            ...(updates.branding || {})
          },
          customFields: Array.isArray(prev.customFields) ? prev.customFields : [],
          source: 'supabase' as const
        }
      })
    } catch (err: any) {
      console.error('❌ [TenantContext] Error updating tenant:', err)
      throw err
    }
  }

  const addCustomField = async (field: Omit<CustomField, 'id' | 'source'>) => {
    if (usingFallback) {
      console.log('➕ [TenantContext] Adding custom field (fallback mode):', field)
      const newField = { 
        ...field, 
        id: `fallback-field-${Date.now()}`, 
        source: 'fallback' as const 
      }
      setTenant(prev => {
        if (!prev) return null
        // Always recreate as plain object to prevent Relay contamination
        return {
          ...createSafeFallbackTenant(prev.id),
          name: prev.name,
          domain: prev.domain,
          settings: {
            ...createSafeFallbackTenant().settings,
            ...(prev.settings || {})
          },
          branding: {
            ...createSafeFallbackTenant().branding,
            ...(prev.branding || {})
          },
          customFields: [...(Array.isArray(prev.customFields) ? prev.customFields : []), newField],
          source: 'fallback' as const
        }
      })
      return
    }

    const rawCompanyId = user?.tenantId
    const companyId = uuidRegex.test(rawCompanyId || '') ? rawCompanyId : null
    if (!companyId) throw new Error('Invalid company ID for Supabase operation.')

    try {
      console.log('➕ [TenantContext] Adding custom field to Supabase:', field)
      
      const { data, error: supabaseError } = await supabase
        .from('custom_fields')
        .insert([{ ...field, company_id: companyId }])
        .select()
        .single()

      if (supabaseError) throw supabaseError
      
      console.log('✅ [TenantContext] Custom field added successfully')
      const newField = { ...data, source: 'supabase' as const }
      setTenant(prev => {
        if (!prev) return null
        // Always recreate as plain object to prevent Relay contamination
        return {
          ...createSafeFallbackTenant(prev.id),
          name: prev.name,
          domain: prev.domain,
          settings: {
            ...createSafeFallbackTenant().settings,
            ...(prev.settings || {})
          },
          branding: {
            ...createSafeFallbackTenant().branding,
            ...(prev.branding || {})
          },
          customFields: [...(Array.isArray(prev.customFields) ? prev.customFields : []), newField],
          source: 'supabase' as const
        }
      })
    } catch (err: any) {
      console.error('❌ [TenantContext] Error adding custom field:', err)
      throw err
    }
  }

  const updateCustomField = async (id: string, updates: Partial<CustomField>) => {
    if (usingFallback) {
      console.log('📝 [TenantContext] Updating custom field (fallback mode):', { id, updates })
      setTenant(prev => {
        if (!prev) return null
        // Always recreate as plain object to prevent Relay contamination
        return {
          ...createSafeFallbackTenant(prev.id),
          name: prev.name,
          domain: prev.domain,
          settings: {
            ...createSafeFallbackTenant().settings,
            ...(prev.settings || {})
          },
          branding: {
            ...createSafeFallbackTenant().branding,
            ...(prev.branding || {})
          },
          customFields: Array.isArray(prev.customFields) ? prev.customFields.map(f => 
            f.id === id ? { ...f, ...updates, source: 'fallback' as const } : f
          ) : [],
          source: 'fallback' as const
        }
      })
      return
    }

    try {
      console.log('📝 [TenantContext] Updating custom field in Supabase:', { id, updates })
      
      const { data, error: supabaseError } = await supabase
        .from('custom_fields')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) throw supabaseError
      
      console.log('✅ [TenantContext] Custom field updated successfully')
      setTenant(prev => {
        if (!prev) return null
        // Always recreate as plain object to prevent Relay contamination
        return {
          ...createSafeFallbackTenant(prev.id),
          name: prev.name,
          domain: prev.domain,
          settings: {
            ...createSafeFallbackTenant().settings,
            ...(prev.settings || {})
          },
          branding: {
            ...createSafeFallbackTenant().branding,
            ...(prev.branding || {})
          },
          customFields: Array.isArray(prev.customFields) ? prev.customFields.map(f => 
            f.id === id ? { ...data, source: 'supabase' as const } : f
          ) : [],
          source: 'supabase' as const
        }
      })
    } catch (err: any) {
      console.error('❌ [TenantContext] Error updating custom field:', err)
      throw err
    }
  }

  const deleteCustomField = async (id: string) => {
    if (usingFallback) {
      console.log('🗑️ [TenantContext] Deleting custom field (fallback mode):', id)
      setTenant(prev => {
        if (!prev) return null
        // Always recreate as plain object to prevent Relay contamination
        return {
          ...createSafeFallbackTenant(prev.id),
          name: prev.name,
          domain: prev.domain,
          settings: {
            ...createSafeFallbackTenant().settings,
            ...(prev.settings || {})
          },
          branding: {
            ...createSafeFallbackTenant().branding,
            ...(prev.branding || {})
          },
          customFields: Array.isArray(prev.customFields) ? prev.customFields.filter(f => f.id !== id) : [],
          source: 'fallback' as const
        }
      })
      return
    }

    try {
      console.log('🗑️ [TenantContext] Deleting custom field from Supabase:', id)
      
      const { error: supabaseError } = await supabase
        .from('custom_fields')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError
      
      console.log('✅ [TenantContext] Custom field deleted successfully')
      setTenant(prev => {
        if (!prev) return null
        // Always recreate as plain object to prevent Relay contamination
        return {
          ...createSafeFallbackTenant(prev.id),
          name: prev.name,
          domain: prev.domain,
          settings: {
            ...createSafeFallbackTenant().settings,
            ...(prev.settings || {})
          },
          branding: {
            ...createSafeFallbackTenant().branding,
            ...(prev.branding || {})
          },
          customFields: Array.isArray(prev.customFields) ? prev.customFields.filter(f => f.id !== id) : [],
          source: 'supabase' as const
        }
      })
    } catch (err: any) {
      console.error('❌ [TenantContext] Error deleting custom field:', err)
      throw err
    }
  }

  useEffect(() => {
    if (user) {
      fetchTenant()
    }
  }, [user?.tenantId])

  return (
    <TenantContext.Provider
      value={{
        tenant,
        loading,
        error,
        usingFallback,
        supabaseStatus,
        updateTenant,
        addCustomField,
        updateCustomField,
        deleteCustomField,
        refetchTenant: fetchTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

export { TenantContext }