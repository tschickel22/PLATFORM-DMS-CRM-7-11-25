import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useEffectiveCompanyId } from "./useEffectiveCompanyId";

export function useCommissionData() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const company_id = useEffectiveCompanyId();

  useEffect(() => {
    async function fetchCommissions() {
      const { data, error } = await supabase
        .from("commission_engine")
        .select("*")
        .eq("company_id", company_id);

      if (error) console.error("Error loading commissions:", error);
      else setCommissions(data || []);
    }

    fetchCommissions();
  }, [company_id]);

  return commissions;
}