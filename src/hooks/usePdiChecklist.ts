import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useEffectiveCompanyId } from "./useEffectiveCompanyId";

export function usePdiChecklist() {
  const [checklist, setChecklist] = useState<any[]>([]);
  const company_id = useEffectiveCompanyId();

  useEffect(() => {
    async function fetchChecklist() {
      const { data, error } = await supabase
        .from("pdi_checklists")
        .select("*")
        .eq("company_id", company_id);

      if (error) console.error("Error loading PDI checklist:", error);
      else setChecklist(data || []);
    }

    fetchChecklist();
  }, [company_id]);

  return checklist;
}