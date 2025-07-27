import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useEffectiveCompanyId } from "./useEffectiveCompanyId";
import { PdiChecklist } from "@/types";

export function usePdiChecklist() {
  const [checklists, setChecklists] = useState<PdiChecklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const companyId = useEffectiveCompanyId();

  useEffect(() => {
    async function loadData() {
      try {
        console.log('🔄 [usePdiChecklist] Fetching PDI checklists for company_id:', companyId);
        
        const { data, error: supabaseError } = await supabase
          .from("pdi_checklists")
          .select("*")
          .eq("company_id", companyId)
          .order('created_at', { ascending: false });

        if (supabaseError) {
          console.error('❌ [usePdiChecklist] Supabase error:', supabaseError.message);
          setError(supabaseError.message);
          setChecklists([]);
        } else {
          console.log(`✅ [usePdiChecklist] Loaded ${data?.length || 0} checklists`);
          // Ensure we always return an array, even if data is null
          setChecklists(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err: any) {
        console.error('💥 [usePdiChecklist] Unexpected error:', err);
        setError(err.message || 'Failed to fetch PDI checklists');
        setChecklists([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [companyId]);

  return { checklists, loading, error };
}