import { useAuth } from '@/contexts/AuthContext'
import useEffectiveCompanyId from '@/hooks/useEffectiveCompanyId'

// UUID validation regex
export const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function useValidatedCompanyId() {
  // Use the centralized company ID resolution
  const companyId = useEffectiveCompanyId()
  
  const isValidCompanyId = typeof companyId === 'string' && uuidRegex.test(companyId)
  
  return { 
    companyId: isValidCompanyId ? companyId : null, 
    isValid: isValidCompanyId,
    rawCompanyId: companyId 
  }
}

// Legacy function - deprecated, use useEffectiveCompanyId instead
export function getValidatedCompanyId(user: any): { companyId: string | null; isValid: boolean } {
  const rawCompanyId = user?.tenantId // Assuming tenantId is the company_id
  const isValidCompanyId = typeof rawCompanyId === 'string' && uuidRegex.test(rawCompanyId)
  const companyId = isValidCompanyId ? rawCompanyId : null
  
  return { 
    companyId, 
    isValid: isValidCompanyId 
  }
}