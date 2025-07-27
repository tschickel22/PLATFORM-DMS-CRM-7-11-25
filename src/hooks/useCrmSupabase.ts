import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Deal, CRMContact } from '@/types';
import { useEffectiveCompanyId } from '@/hooks/useEffectiveCompanyId';
import { is } from '@supabase/supabase-js';

export function useDeals() {
  const { companyId } = useEffectiveCompanyId();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeals() {
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from('deals').select('*');

        if (companyId) {
          query = query.eq('company_id', companyId);
        } else {
          // Fallback to deals with no company_id if companyId is null (for test mode/preview)
          query = query.is('company_id', null);
        }

        const { data, error } = await query;

        if (error) throw error;
        setDeals(data || []);
      } catch (err: any) {
        console.error('Error fetching deals:', err.message);
        setError(err.message);
        setDeals([]); // Clear deals on error
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, [companyId]);

  return { deals, loading, error };
}

export function useContacts() {
  const { companyId } = useEffectiveCompanyId();
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from('crm_contacts').select('*');

        if (companyId) {
          query = query.eq('company_id', companyId);
        } else {
          // Fallback to contacts with no company_id if companyId is null (for test mode/preview)
          query = query.is('company_id', null);
        }

        const { data, error } = await query;

        if (error) throw error;
        setContacts(data || []);
      } catch (err: any) {
        console.error('Error fetching contacts:', err.message);
        setError(err.message);
        setContacts([]); // Clear contacts on error
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, [companyId]);

  return { contacts, loading, error };
}