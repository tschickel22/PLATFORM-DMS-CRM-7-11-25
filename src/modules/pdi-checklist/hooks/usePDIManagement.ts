import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { PdiChecklist } from '@/types';
import { useEffectiveCompanyId } from '@/hooks/useEffectiveCompanyId';
import { is } from '@supabase/supabase-js';

export function usePDIManagement() {
  const { companyId } = useEffectiveCompanyId();
  const [checklists, setChecklists] = useState<PdiChecklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChecklists() {
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from('pdi_checklists').select('*');

        if (companyId) {
          query = query.eq('company_id', companyId);
        } else {
          // If companyId is null, load entries with company_id is null (for preview/test mode)
          query = query.is('company_id', null);
        }

        const { data, error } = await query;

        if (error) throw error;
        setChecklists(data || []);
      } catch (err: any) {
        console.error('Error fetching PDI checklists:', err.message);
        setError(err.message);
        setChecklists([]); // Clear checklists on error
      } finally {
        setLoading(false);
      }
    }
    fetchChecklists();
  }, [companyId]);

  return { checklists, loading, error };
}