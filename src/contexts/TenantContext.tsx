import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { mockCompanySettings } from '@/mocks/companySettingsMock'

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

    console.log('🏢 [TenantContext] Fetching tenant data...', { rawCompanyId, isValidCompanyId, companyId })

    if (!companyId) {
      console.warn('⚠️ [TenantContext] Invalid or missing company_id. Using fallback data.')
      const fallbackTenant = {
        id: 'fallback-tenant',
        name: 'Demo Company',
        domain: 'demo.renterinsight.com',
        settings: {
          timezone: 'America/New_York',
          currency: 'USD',
          dateFormat: 'MM/dd/yyyy',
          language: 'en'
        },
        branding: {
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b'
        },
        customFields: mockCompanySettings.customFields?.sampleFields || [],
        source: 'fallback' as const,
      }
      setTenant(fallbackTenant)
      setUsingFallback(true)
      setSupabaseStatus({ connected: false, error: 'Invalid company ID', count: fallbackTenant.customFields.length })
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
          id: companyId,
          name: 'Demo Company',
          domain: 'demo.renterinsight.com',
          settings: {
            timezone: 'America/New_York',
            currency: 'USD',
            dateFormat: 'MM/dd/yyyy',
            language: 'en'
          },
          branding: {
            primaryColor: '#3b82f6',
            secondaryColor: '#64748b'
          },
          customFields: mockCompanySettings.customFields?.sampleFields?.map(f => ({ ...f, source: 'fallback' as const })) || [],
          source: 'fallback' as const,
        }
        setTenant(fallbackTenant)
        setUsingFallback(true)
        setSupabaseStatus({ connected: false, error: errorMsg, count: fallbackTenant.customFields.length })
      } else {
        console.log('✅ [TenantContext] Fetched tenant data from Supabase:', { tenantData, customFieldsData })
        
        // Transform Supabase data to Tenant interface
        const tenantData: Tenant = {
          id: tenantData.id,
          name: tenantData.name || 'Company Name',
          domain: tenantData.domain || 'company.com',
          settings: {
            timezone: 'America/New_York',
            currency: 'USD',
            dateFormat: 'MM/dd/yyyy',
            language: 'en'
          },
          branding: {
            primaryColor: '#3b82f6',
            secondaryColor: '#64748b'
          },
          customFields: (customFieldsData || []).map(f => ({ ...f, source: 'supabase' as const })),
          source: 'supabase'
        }
        
        setTenant(tenantData)
        setUsingFallback(false)
        setSupabaseStatus({ connected: true, count: customFieldsData?.length || 0 })
      }
    } catch (err: any) {
      console.error('💥 [TenantContext] Unexpected error during fetch:', err)
      setError(new Error('Failed to connect to Supabase or process data.'))
      
      // Fallback to mock data
      const fallbackTenant = {
        id: companyId,
        name: 'Demo Company',
        domain: 'demo.renterinsight.com',
        settings: {
          timezone: 'America/New_York',
          currency: 'USD',
          dateFormat: 'MM/dd/yyyy',
          language: 'en'
        },
        branding: {
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b'
        },
        customFields: mockCompanySettings.customFields?.sampleFields?.map(f => ({ ...f, source: 'fallback' as const })) || [],
        source: 'fallback' as const,
      }
      setTenant(fallbackTenant)
      setUsingFallback(true)
      setSupabaseStatus({ connected: false, error: err.message, count: fallbackTenant.customFields.length })
    } finally {
      setLoading(false)
    }
  }

  const updateTenant = async (updates: Partial<Tenant>) => {
    if (!tenant) return

    if (usingFallback) {
      console.log('📝 [TenantContext] Updating tenant (fallback mode):', updates)
      setTenant(prev => prev ? { ...prev, ...updates, source: 'fallback' } : null)
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
      setTenant(prev => prev ? { ...prev, ...updates, source: 'supabase' } : null)
    } catch (err: any) {
      console.error('❌ [TenantContext] Error updating tenant:', err)
      throw err
    }
  }

  const addCustomField = async (field: Omit<CustomField, 'id' | 'source'>) => {
    if (usingFallback) {
      console.log('➕ [TenantContext] Adding custom field (fallback mode):', field)
      const newField = { ...field, id: `mock-${Date.now()}`, source: 'fallback' as const }
      setTenant(prev => prev ? { 
        ...prev, 
        customFields: [...prev.customFields, newField],
        source: 'fallback'
      } : null)
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
      setTenant(prev => prev ? { 
        ...prev, 
        customFields: [...prev.customFields, newField],
        source: 'supabase'
      } : null)
    } catch (err: any) {
      console.error('❌ [TenantContext] Error adding custom field:', err)
      throw err
    }
  }

  const updateCustomField = async (id: string, updates: Partial<CustomField>) => {
    if (usingFallback) {
      console.log('📝 [TenantContext] Updating custom field (fallback mode):', { id, updates })
      setTenant(prev => prev ? {
        ...prev,
        customFields: prev.customFields.map(f => 
          f.id === id ? { ...f, ...updates, source: 'fallback' } : f
        ),
        source: 'fallback'
      } : null)
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
      setTenant(prev => prev ? {
        ...prev,
        customFields: prev.customFields.map(f => 
          f.id === id ? { ...data, source: 'supabase' as const } : f
        ),
        source: 'supabase'
      } : null)
    } catch (err: any) {
      console.error('❌ [TenantContext] Error updating custom field:', err)
      throw err
    }
  }

  const deleteCustomField = async (id: string) => {
    if (usingFallback) {
      console.log('🗑️ [TenantContext] Deleting custom field (fallback mode):', id)
      setTenant(prev => prev ? {
        ...prev,
        customFields: prev.customFields.filter(f => f.id !== id),
        source: 'fallback'
      } : null)
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
      setTenant(prev => prev ? {
        ...prev,
        customFields: prev.customFields.filter(f => f.id !== id),
        source: 'supabase'
      } : null)
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