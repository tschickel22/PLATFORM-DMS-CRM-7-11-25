import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Tenant, CustomField } from '@/types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

interface TenantContextType {
  tenant: Tenant | null
  getCustomFields: (module: string, section?: string) => CustomField[]
  updateTenant: (updates: Partial<Tenant>) => Promise<void>
  addCustomField: (field: Omit<CustomField, 'id'>) => Promise<void>
  updateCustomField: (id: string, field: Partial<CustomField>) => Promise<void>
  deleteCustomField: (id: string) => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

interface TenantProviderProps {
  children: ReactNode
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null)

  useEffect(() => {
    // Try to load tenant data from localStorage first
    const savedTenant = loadFromLocalStorage<Tenant | null>('tenant', null)
    
    if (savedTenant) {
      // Use saved tenant data
      setTenant(savedTenant)
    } else {
      // Fall back to mock tenant data
      const mockTenant: Tenant = {
        id: 'tenant-1',
        name: 'Demo RV Dealership',
        domain: 'demo.renterinsight.com',
        settings: {
          timezone: 'America/New_York',
          currency: 'USD',
          dateFormat: 'MM/dd/yyyy',
          businessHours: {
            monday: { open: '09:00', close: '18:00', closed: false },
            tuesday: { open: '09:00', close: '18:00', closed: false },
            wednesday: { open: '09:00', close: '18:00', closed: false },
            thursday: { open: '09:00', close: '18:00', closed: false },
            friday: { open: '09:00', close: '18:00', closed: false },
            saturday: { open: '09:00', close: '17:00', closed: false },
            sunday: { open: '12:00', close: '17:00', closed: false }
          },
          features: {
            crm: true,
            inventory: true,
            quotes: true,
            agreements: true,
            service: true,
            delivery: true,
            commissions: true,
            portal: true,
            invoices: true,
            reports: true,
            landManagement: true
          }
        },
        customFields: [],
        branding: {
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b',
          fontFamily: 'Inter'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setTenant(mockTenant)
      
      // Save initial mock data to localStorage
      saveToLocalStorage('tenant', mockTenant)
    }
  }, [])

  // Save tenant data to localStorage whenever it changes
  useEffect(() => {
    if (tenant) {
      saveToLocalStorage('tenant', tenant)
    }
  }, [tenant])

  const getCustomFields = (module: string, section?: string): CustomField[] => {
    return tenant?.customFields.filter(field => 
      field.module === module && 
      (section ? field.section === section : true)
    ) || []
  }

  const updateTenant = async (updates: Partial<Tenant>) => {
    if (!tenant) return
    
    // Deep merge for nested objects like settings and branding
    const updatedTenant: Tenant = {
      ...tenant,
      ...updates,
      settings: updates.settings 
        ? { ...tenant.settings, ...updates.settings }
        : tenant.settings,
      branding: updates.branding
        ? { ...tenant.branding, ...updates.branding }
        : tenant.branding,
      customFields: updates.customFields || tenant.customFields,
      updatedAt: new Date()
    }
    
    setTenant(updatedTenant)
  }
  const addCustomField = async (field: Omit<CustomField, 'id'>) => {
    if (!tenant) return
    
    const newField: CustomField = {
      ...field,
      id: Math.random().toString(36).substr(2, 9)
    }
    
    const updatedTenant = {
      ...tenant,
      customFields: [...tenant.customFields, newField],
      updatedAt: new Date()
    }
    
    setTenant(updatedTenant)
  }

  const updateCustomField = async (id: string, field: Partial<CustomField>) => {
    if (!tenant) return
    
    const updatedCustomFields = tenant.customFields.map(f => 
      f.id === id ? { ...f, ...field } : f
    )
    
    const updatedTenant = {
      ...tenant,
      customFields: updatedCustomFields,
      updatedAt: new Date()
    }
    
    setTenant(updatedTenant)
  }

  const deleteCustomField = async (id: string) => {
    if (!tenant) return
    
    const updatedCustomFields = tenant.customFields.filter(f => f.id !== id)
    
    const updatedTenant = {
      ...tenant,
      customFields: updatedCustomFields,
      updatedAt: new Date()
    }
    
    setTenant(updatedTenant)
  }

  const value = {
    tenant,
    getCustomFields,
    updateTenant,
    addCustomField,
    updateCustomField,
    deleteCustomField
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}