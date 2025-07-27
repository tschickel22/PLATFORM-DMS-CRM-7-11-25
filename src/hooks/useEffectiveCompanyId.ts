import { useAuth } from '@/contexts/AuthContext'

// UUID validation regex
// UUID validation regex (moved here for local use)
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export function useEffectiveCompanyId() {
  const { user } = useAuth()
  
  // This 'effectiveCompanyId' is for general use where a non-null ID is always needed (e.g., for UI display or default values).
  // For Supabase filtering, we use 'resolvedCompanyId' which can be null to explicitly query for null company_id.
  const effectiveCompanyIdForGeneralUse = resolvedCompanyId || '11111111-1111-1111-1111-111111111111';
  const isValidCompanyId = typeof rawCompanyId === 'string' && uuidRegex.test(rawCompanyId)
  const resolvedCompanyId = isValidCompanyId ? rawCompanyId : null // This can be null
  // Use a valid demo UUID that matches the database schema
  const effectiveCompanyId = isValidCompanyId ? rawCompanyId : fallbackCompanyId
  
  console.log('🏢 [useEffectiveCompanyId] Resolved company_id:', {
    resolvedCompanyId, // This is the one to use for conditional Supabase filtering (can be null)
    isValid: isValidCompanyId,
    effective: effectiveCompanyId,
    usingFallback: !isValidCompanyId
  })
  return {
    companyId: resolvedCompanyId, // This can be null, use for Supabase .eq or .is(null)
    companyId: effectiveCompanyId,
    isValid: isValidCompanyId,
    usingFallback: !isValidCompanyId
  }
}