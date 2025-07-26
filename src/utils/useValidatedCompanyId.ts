import { useAuth } from '@/contexts/AuthContext'

// UUID validation regex
export const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function useValidatedCompanyId() {
  const { session } = useAuth()
  
  const rawCompanyId = session?.user?.tenantId // Assuming tenantId is the company_id
  const isValidCompanyId = typeof rawCompanyId === 'string' && uuidRegex.test(rawCompanyId)
  const companyId = isValidCompanyId ? rawCompanyId : null // Ensure it's null if invalid
  
  return { 
    companyId, 
    isValid: isValidCompanyId,
    rawCompanyId 
  }
}
// This function is not currently used but kept for reference if needed elsewhere
export function getValidatedCompanyId(session: any): { companyId: string | null; isValid: boolean } {
  const rawCompanyId = session?.user?.tenantId // Assuming tenantId is the company_id
  const isValidCompanyId = typeof rawCompanyId === 'string' && uuidRegex.test(rawCompanyId)
  const companyId = isValidCompanyId ? rawCompanyId : null // Ensure it's null if invalid
  
  return { 
    companyId, 
    isValid: isValidCompanyId 
  }
}