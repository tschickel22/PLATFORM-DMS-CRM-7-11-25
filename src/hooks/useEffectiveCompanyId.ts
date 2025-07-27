import { useAuth } from '@/contexts/AuthContext'

// UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function useEffectiveCompanyId() {
  const { user } = useAuth()
  
  const rawCompanyId = user?.tenantId
  const isValidCompanyId = typeof rawCompanyId === 'string' && uuidRegex.test(rawCompanyId)
  
  // Use a valid demo UUID that matches the database schema
  const fallbackCompanyId = '11111111-1111-1111-1111-111111111111'
  
  const effectiveCompanyId = isValidCompanyId ? rawCompanyId : fallbackCompanyId
  
  console.log('🏢 [useEffectiveCompanyId] Resolved company_id:', {
    raw: rawCompanyId,
    isValid: isValidCompanyId,
    effective: effectiveCompanyId,
    usingFallback: !isValidCompanyId
  })
  
  return {
    companyId: effectiveCompanyId,
    isValid: isValidCompanyId,
    usingFallback: !isValidCompanyId
  }
}