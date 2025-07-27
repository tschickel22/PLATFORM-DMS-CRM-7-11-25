import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useEffectiveCompanyId } from "./useEffectiveCompanyId";

export function useCompanySettings() {
  const [settings, setSettings] = useState<any | null>(null);
  const company_id = useEffectiveCompanyId();

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from("company_settings")
        .select("*")
        .eq("company_id", company_id)
        .single();

      if (error) console.error("Error loading company settings:", error);
      else setSettings(data);
    }

    fetchSettings();
  }, [company_id]);

  return settings;
}