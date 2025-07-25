import { useAuth } from '@/contexts/AuthContext'

// UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function useValidatedCompanyId() {
  const { session } = useAuth()
  
  const rawCompanyId = session?.user?.app_metadata?.company_id
  const isValidCompanyId = uuidRegex.test(rawCompanyId)
  const companyId = isValidCompanyId ? rawCompanyId : null
  
  return { 
    companyId, 
    isValid: isValidCompanyId,
    rawCompanyId 
  }
}

export function getValidatedCompanyId(session: any): { companyId: string | null; isValid: boolean } {
  const rawCompanyId = session?.user?.app_metadata?.company_id
  const isValidCompanyId = uuidRegex.test(rawCompanyId)
  const companyId = isValidCompanyId ? rawCompanyId : null
  
  return { 
    companyId, 
    isValid: isValidCompanyId 
  }
}