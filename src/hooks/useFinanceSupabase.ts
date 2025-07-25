@@ .. @@
   // Load data from Supabase on mount
   useEffect(() => {
     console.log('🔄 [Finance] Starting data load from Supabase...')
     console.log('📊 [Finance] Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'NOT_SET')
     console.log('🔑 [Finance] Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET')
     
     setConnectionAttempted(true)
     
     const loadData = async () => {
       // Get company ID from session with proper validation
       const rawCompanyId = session?.user?.app_metadata?.company_id || '00000000-0000-0000-0000-000000000000';
       const isValidCompanyId = uuidRegex.test(rawCompanyId);
       const companyId = isValidCompanyId ? rawCompanyId : null;
       
       if (!companyId) {
         console.warn("[Finance] Invalid companyId UUID. Skipping finance data load.");
         setLoans(mockFinance.sampleLoans);
         setPayments(mockFinance.samplePayments);
         setSupabaseStatus(prev => ({
           ...prev,
           loans: { connected: false, error: 'Invalid company ID format', count: 0 },
           payments: { connected: false, error: 'Invalid company ID format', count: 0 }
         }));
         setLoading(false);
         return;
       }

       try {
         console.log('⏳ [Finance] Executing Supabase query for loans...')
         let query = supabase
           .from('deals')
           .select('*')
           .order('created_at', { ascending: false });
         
         // Only add company_id filter if we have a valid companyId
         if (companyId) {
           query = query.eq('company_id', companyId);
         }
         
         const { data, error } = await query;
         console.log('📊 [Finance] Loans Supabase response:', { 
           data: data?.length || 0,
           error: error?.message || 'none'
         });

         console.log('⏳ [Finance] Executing Supabase query for loan_payments...')
         let query2 = supabase
           .from('finance_applications')
           .select('*')
           .order('created_at', { ascending: false });
         
         // Only add company_id filter if we have a valid companyId
         if (companyId) {
           query2 = query2.eq('company_id', companyId);
         }
         
         const { data: data2, error: error2 } = await query2;
         console.log('📊 [Finance] Payments Supabase response:', { 
           data: data2?.length || 0,
           error: error2?.message || 'none'
         });
       } catch (err) {
         console.error('Error loading data:', err);
       }
     };
     
     loadData();
   }, [session]);

   const createLoan = async (data: Partial<Loan>): Promise<Loan> => {
     const rawCompanyId = session?.user?.app_metadata?.company_id;
     const isValidCompanyId = uuidRegex.test(rawCompanyId);
     const companyId = isValidCompanyId ? rawCompanyId : null;
     
     if (!companyId) {
       console.warn("[Finance] Invalid companyId UUID. Skipping loan creation.");
       toast({
         title: 'Error',
         description: 'Invalid company ID format',
         variant: 'destructive'
       });
       throw new Error('Invalid company ID format');
     }

     try {
       const loanData = {
         ...data,
         id: crypto.randomUUID(),
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString()
       };

       const { data: insertedData, error } = await supabase
         .from('deals') // Assuming 'deals' table for loans
         .insert([loanData])
         .select()
         .single();

       if (error) throw error;
       return insertedData;
     } catch (err) {
       console.error('Error creating loan:', err);
       throw err;
     }
   };

   const createPayment = async (data: Partial<LoanPayment>): Promise<LoanPayment> => {
     const rawCompanyId = session?.user?.app_metadata?.company_id;
     const isValidCompanyId = uuidRegex.test(rawCompanyId);
     const companyId = isValidCompanyId ? rawCompanyId : null;
     
     if (!companyId) {
       console.warn("[Finance] Invalid companyId UUID. Skipping payment creation.");
       toast({
         title: 'Error',
         description: 'Invalid company ID format',
         variant: 'destructive'
       });
       throw new Error('Invalid company ID format');
     }

     try {
       const paymentData = {
         ...data,
         id: crypto.randomUUID(),
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString()
       };

       const { data: insertedData, error } = await supabase
         .from('finance_applications') // Using finance_applications as a proxy for payments
         .insert([paymentData])
         .select()
         .single();

       if (error) throw error;
       return insertedData;
     } catch (err) {
       console.error('Error creating payment:', err);
       throw err;
     }
   };