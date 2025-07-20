import React, { createContext, useContext, ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { mockAgreements } from '@/mocks/agreementsMock'

interface PortalClient {
  id: string
  name: string
  email: string
}

interface PortalContextType {
  proxiedClient: PortalClient | null
  isProxying: boolean
  getDisplayName: () => string
  getDisplayEmail: () => string
  getCustomerId: () => string
}

const PortalContext = createContext<PortalContextType | undefined>(undefined)

export function usePortal() {
  const context = useContext(PortalContext)
  if (context === undefined) {
    throw new Error('usePortal must be used within a PortalProvider')
  }
  return context
}

interface PortalProviderProps {
  children: ReactNode
  fallbackUser?: {
    name: string
    email: string
  }
}

export function PortalProvider({ children, fallbackUser }: PortalProviderProps) {
  const [searchParams] = useSearchParams()
  
  // Extract impersonate client ID from URL parameters
  const impersonateIdParam = searchParams.get('impersonateClientId')
  
  console.log('PortalContext: impersonateIdParam', impersonateIdParam);

  // Find the proxied client from mock data
  const proxiedClient = impersonateIdParam 
    ? mockAgreements.sampleCustomers.find(customer => customer.id === impersonateIdParam) || null
    : null

  const isProxying = !!proxiedClient

  console.log('PortalContext: proxiedClient', proxiedClient);
  const getDisplayName = (): string => {
    if (proxiedClient) {
      return proxiedClient.name
    }
    return fallbackUser?.name || 'User'
  }

  const getDisplayEmail = (): string => {
    if (proxiedClient) {
      return proxiedClient.email
    }
    return fallbackUser?.email || ''
  }

  const getCustomerId = (): string => {
    if (proxiedClient) {
      return proxiedClient.id
    }
    // Return a default customer ID when not proxying
    return 'portal-customer-001'
  }

  const value = {
    proxiedClient,
    isProxying,
    getDisplayName,
    getDisplayEmail,
    getCustomerId
  }

  return (
    <PortalContext.Provider value={value}>
      {children}
    </PortalContext.Provider>
  )
}