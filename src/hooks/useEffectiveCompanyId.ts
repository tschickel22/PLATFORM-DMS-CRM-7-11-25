import { useContext } from "react";
import { TenantContext } from "@/contexts/TenantContext";

/**
 * Resolves the active company_id from context, or returns fallback for Bolt/dev preview
 */
export function useEffectiveCompanyId(): string {
  const context = useContext(TenantContext);
  // Use tenant.id as the company_id since that's the actual property in TenantContext
  return context?.tenant?.id || "11111111-1111-1111-1111-111111111111";
}