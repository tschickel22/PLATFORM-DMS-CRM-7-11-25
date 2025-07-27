import { useContext } from 'react'
import { TenantContext } from '@/contexts/TenantContext'

// Valid demo company UUID for preview/development
const DEMO_COMPANY_UUID = '11111111-1111-1111-1111-111111111111'

// Simple check for preview/development environment
function isBoltPreview(): boolean {
  return import.meta.env.MODE === 'development' || 
         window.location.hostname.includes('bolt.new') ||
         window.location.hostname.includes('webcontainer')
}

export function useEffectiveCompanyId(): string {
  const context = useContext(TenantContext)
  const tenantId = context?.tenant?.id
  
  // If we have a valid tenant ID, use it
  if (tenantId && tenantId !== 'fallback-id') {
    return tenantId
  }
  
  // Only use demo UUID in preview/development mode
  if (isBoltPreview()) {
    return DEMO_COMPANY_UUID
  }
  
  // In production with no valid tenant, throw error
  throw new Error('No valid company ID available and not in preview mode')
}

export default useEffectiveCompanyId