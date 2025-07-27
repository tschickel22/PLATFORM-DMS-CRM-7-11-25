import { useContext } from "react";
import { TenantContext } from "@/contexts/TenantContext";

/**
 * Resolves the active company_id from context, or returns fallback for Bolt/dev preview
 */
export function useEffectiveCompanyId(): string {
  const tenant = useContext(TenantContext);
  return tenant?.company_id || "11111111-1111-1111-1111-111111111111";
}