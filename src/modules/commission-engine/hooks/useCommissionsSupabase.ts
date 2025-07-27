```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { mockCommissionEngine } from '@/mocks/commissionEngineMock';
import { useToast } from '@/hooks/use-toast';
import { uuidRegex } from '@/utils/useValidatedCompanyId'; // Assuming this utility exists

// Define a type for the commission data fetched from Supabase
interface Commission {
  id: string;
  rep_id: string;
  amount: number;
  period: string;
  rule_id: string;
  sale_amount: number;
  created_at: string;
  updated_at: string;
  // Assuming company_id will be added to the table as per user's request
  company_id?: string;
  source?: 'supabase' | 'fallback'; // For debugging
}

interface SupabaseStatus {
  commissions: { connected: boolean; error?: string; count: number };
}

export function useCommissionsSupabase() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>({
    commissions: { connected: false, error: undefined, count: 0 },
  });

  const companyId = user?.tenantId; // Get companyId from authenticated user

  useEffect(() => {
    const fetchCommissions = async () => {
      setLoading(true);
      setError(null);
      let currentUsingFallback = false;
      let currentSupabaseStatus: SupabaseStatus = {
        commissions: { connected: false, error: undefined, count: 0 },
      };

      // Validate companyId
      const isValidCompanyId = typeof companyId === 'string' && uuidRegex.test(companyId);

      if (!isValidCompanyId) {
        console.warn('⚠️ [Commissions] Invalid or missing companyId, using fallback data.');
        currentUsingFallback = true;
        currentSupabaseStatus.commissions = {
          connected: false,
          error: 'Invalid or missing company ID',
          count: mockCommissionEngine.sampleCommissions.length,
        };
      } else {
        try {
          console.log(`🔄 [Commissions] Fetching commissions for companyId: ${companyId} from Supabase...`);
          const { data, error: supabaseError } = await supabase
            .from('commissions')
            .select('*')
            .eq('company_id', companyId) // Assuming company_id column exists
            .order('created_at', { ascending: false });

          if (supabaseError) {
            console.error('❌ [Commissions] Supabase fetch error:', supabaseError.message);
            setError(new Error(supabaseError.message));
            currentUsingFallback = true;
            currentSupabaseStatus.commissions = {
              connected: false,
              error: supabaseError.message,
              count: 0,
            };
          } else if (!Array.isArray(data)) {
            console.warn('⚠️ [Commissions] Supabase returned non-array data.');
            setError(new Error('Invalid data format from Supabase'));
            currentUsingFallback = true;
            currentSupabaseStatus.commissions = {
              connected: false,
              error: 'Invalid data format',
              count: 0,
            };
          } else {
            console.log(`✅ [Commissions] Fetched ${data.length} commissions from Supabase.`);
            setCommissions(data.map(item => ({ ...item, source: 'supabase' })));
            currentSupabaseStatus.commissions = {
              connected: true,
              error: undefined,
              count: data.length,
            };
          }
        } catch (err) {
          console.error('💥 [Commissions] Unexpected error during Supabase fetch:', err);
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
          currentUsingFallback = true;
          currentSupabaseStatus.commissions = {
            connected: false,
            error: err instanceof Error ? err.message : 'Unknown error',
            count: 0,
          };
        }
      }

      if (currentUsingFallback) {
        console.log('📊 [Commissions] Loading mock data as fallback.');
        setCommissions(mockCommissionEngine.sampleCommissions.map(item => ({ ...item, source: 'fallback' })));
      }
      setUsingFallback(currentUsingFallback);
      setSupabaseStatus(currentSupabaseStatus);
      setLoading(false);
    };

    fetchCommissions();
  }, [companyId]); // Re-run when companyId changes

  // CRUD operations (read-only in fallback mode)
  const createCommission = async (newCommission: Partial<Commission>) => {
    if (usingFallback) {
      toast({
        title: 'Read-Only Mode',
        description: 'Creating commissions is disabled in fallback mode.',
        variant: 'destructive',
      });
      throw new Error('Creating commissions is disabled in fallback mode.');
    }
    try {
      const { data, error: supabaseError } = await supabase
        .from('commissions')
        .insert([{ ...newCommission, company_id: companyId }]) // Ensure company_id is added
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      toast({ title: 'Success', description: 'Commission created successfully.' });
      // Re-fetch or update state locally
      setCommissions(prev => [{ ...data, source: 'supabase' }, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating commission:', err);
      toast({ title: 'Error', description: `Failed to create commission: ${err.message}` });
      throw err;
    }
  };

  const updateCommission = async (id: string, updates: Partial<Commission>) => {
    if (usingFallback) {
      toast({
        title: 'Read-Only Mode',
        description: 'Updating commissions is disabled in fallback mode.',
        variant: 'destructive',
      });
      throw new Error('Updating commissions is disabled in fallback mode.');
    }
    try {
      const { data, error: supabaseError } = await supabase
        .from('commissions')
        .update(updates)
        .eq('id', id)
        .eq('company_id', companyId) // Ensure company_id is used for update
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      toast({ title: 'Success', description: 'Commission updated successfully.' });
      setCommissions(prev => prev.map(item => item.id === id ? { ...data, source: 'supabase' } : item));
      return data;
    } catch (err) {
      console.error('Error updating commission:', err);
      toast({ title: 'Error', description: `Failed to update commission: ${err.message}` });
      throw err;
    }
  };

  const deleteCommission = async (id: string) => {
    if (usingFallback) {
      toast({
        title: 'Read-Only Mode',
        description: 'Deleting commissions is disabled in fallback mode.',
        variant: 'destructive',
      });
      throw new Error('Deleting commissions is disabled in fallback mode.');
    }
    try {
      const { error: supabaseError } = await supabase
        .from('commissions')
        .delete()
        .eq('id', id)
        .eq('company_id', companyId); // Ensure company_id is used for delete

      if (supabaseError) throw supabaseError;
      toast({ title: 'Success', description: 'Commission deleted successfully.' });
      setCommissions(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting commission:', err);
      toast({ title: 'Error', description: `Failed to delete commission: ${err.message}` });
      throw err;
    }
  };

  return {
    commissions,
    loading,
    error,
    usingFallback,
    supabaseStatus,
    createCommission,
    updateCommission,
    deleteCommission,
  };
}
```