```sql
DROP TABLE IF EXISTS public.agreements CASCADE;

CREATE TABLE public.agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  status text DEFAULT 'draft',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can manage agreements"
ON public.agreements FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_agreements_updated_at
BEFORE UPDATE ON public.agreements
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```