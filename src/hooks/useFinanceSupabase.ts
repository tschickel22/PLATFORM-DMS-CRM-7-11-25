@@ .. @@
   // Load data from Supabase on mount
   useEffect(() => {
     console.log('🔄 [Finance] Starting data load from Supabase...')
     console.log('📊 [Finance] Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'NOT_SET')
     console.log('🔑 [Finance] Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET')
     
     setConnectionAttempted(true)
     
     const loadData = async () => {
       // Get company ID from session with proper validation
-      const rawCompanyId = session?.user?.app_metadata?.company_id;
+      const rawCompanyId = session?.user?.app_metadata?.company_id || '00000000-0000-0000-0000-000000000000';
       const isValidCompanyId = uuidRegex.test(rawCompanyId);
-      const companyId = isValidCompanyId ? rawCompanyId : '00000000-0000-0000-0000-000000000000'; // Fallback UUID
+      const companyId = isValidCompanyId ? rawCompanyId : null;
       
-      if (!isValidCompanyId) {
-        console.warn("⚠️ Invalid company_id format in initial load, using fallback UUID.");
+      if (!companyId) {
+        console.warn("[Finance] Invalid companyId UUID. Skipping finance data load.");
+        setLoans(mockFinance.sampleLoans);
+        setPayments(mockFinance.samplePayments);
+          }
     }
   }
   )
     setSupabaseStatus(prev => ({
+          ...prev,
+          loans: { connected: false, error: 'Invalid company ID format', count: 0 },
+          payments: { connected: false, error: 'Invalid company ID format', count: 0 }
+        }));
+        setLoading(false);
+        return;
       }
 
       try {
@@ .. @@
       console.log('⏳ [Financ       }
       )
e] Executing Supabase query for loans...')
       const { data, error } = await supabase
         .order('created_at', { ascending: false })
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
@@ .. @@
          }
       )
    console.log('⏳ [Finance] Executing Supabase query for loan_payments...')
       const { data, error } = await supabase
         .order('created_at', { ascending: false }) // Using created_at as payment_date
      let query = supabase
        .from('finance_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Only add company_id filter if we have a valid companyId
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
      const { data, error } = await query;
       console.log('📊 [Finance] Payments Supabase response:', { 
@@ .. @@
   const createLoan = async (data: Partial<Loan>): Promise<Loan> => {
     const raw    }
  }
CompanyId = session?.user?.app_metadata?.company_id;
     const isValidCompanyId = uuidRegex.test(rawCompanyId);
-    const companyId = isValidCompanyId ? rawCompanyId : '00000000-0000-0000-0000-000000000000';
    const companyId = isValidCompanyId ? rawCompanyId : null;
    const companyId = isValidCompanyId ? rawCompanyId : null;
-    if (!isValidCompanyId) {
-      console.warn("⚠️ Invalid company_id format in createLoan, using fallback UUID.");
      console.warn("❌ Invalid company_id format in createLoan, cannot create loan.");
      toast({
        title: 'Error',
        description: 'Invalid company ID format',
        variant: 'destructive'
      });
      throw new Error('Invalid company ID format');
+    const companyId = isValidCompanyId ? rawCompanyId : null;
+    
+    if (!companyId) {
+      console.warn("[Finance] Invalid companyId UUID. Skipping loan creation.");
+      toast({
+        title: 'Error',
+        description: 'Invalid company ID format',
+        variant: 'destructive'
+      });
+      throw new Error('Invalid company ID format');
     }
 
     try {
@@ .. @@
       const { data: insertedData, error } = await supabase
        }
  }
     .from('deals') // Assuming 'deals' table for loans
-        .insert([{ ...loanData, company_id: companyId }]) // Add company_id to inserted data
        .insert([{ ...loanData, ...(companyId && { company_id: companyId }) }])
+        .insert([loanData])
         .select()
         .single()
 
@@ .. @@
   const createPayment = async (data: Partial<LoanPayment>): Promise<LoanPayment> => {
     const rawCompanyId = session?.user?.app_metadata?.company_id;
     const isValidCompanyId = uuidRegex.test(rawCompanyId);
    const companyId = isValidCompanyId ? rawCompanyId : null;
-    if (!isValidCompanyId) {
-      console.warn("⚠️ Invalid company_id format in createPayment, using fallback UUID.");
      console.warn("❌ Invalid company_id format in createPayment, cannot create payment.");
      toast({
        title: 'Error',
        description: 'Invalid company ID format',
        variant: 'destructive'
      });
      throw new Error('Invalid company ID format');
+    const companyId = isValidCompanyId ? rawCompanyId : null;
+    
+    if (!companyId) {
+      console.warn("[Finance] Invalid companyId UUID. Skipping payment creation.");
+      toast({
+        title: 'Error',
+        description: 'Invalid company ID format',
+        variant: 'destructive'
+      });
      console.warn("❌ Invalid company_id format in initial load, skipping Supabase operations.");
      setLoans(mockFinance.sampleLoans);
      setPayments(mockFinance.samplePayments);
      setUsingFallback(true);
      setLoading(false);
      return;
     }
 
     try {
@@ .. @@
       const { data: insertedData, error } = await supabase
         .from('finance_applications') // Using finance_applications as a proxy for payments
-        .insert([{ ...paymentData, company_id: companyId }]) // Add company_id to inserted data
        .insert([{ ...paymentData, ...(companyId && { company_id: companyId }) }])
+        .insert([paymentData])
         .select()
         .single()