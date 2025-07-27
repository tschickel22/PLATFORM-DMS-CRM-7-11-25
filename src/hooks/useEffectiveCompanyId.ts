import { useContext } from "react";
import { TenantContext } from "@/contexts/TenantContext";

/**
 * Resolves the active company_id from context, or returns fallback UUID for Bolt/dev preview
 */
export function useEffectiveCompanyId(): string {
  const context = useContext(TenantContext);
  const fallbackCompanyId = '11111111-1111-1111-1111-111111111111';
  
  // Get company ID from tenant context, fallback to demo UUID
  const companyId = context?.tenant?.id ?? fallbackCompanyId;
  
  return companyId;
}