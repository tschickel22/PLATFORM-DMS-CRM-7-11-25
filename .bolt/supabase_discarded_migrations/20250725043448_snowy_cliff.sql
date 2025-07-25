```sql
CREATE TABLE public.agreement_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id uuid NOT NULL,
  signer_email text NOT NULL,
  signer_name text,
  status text DEFAULT 'pending', -- pending, signed, declined
  signed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT fk_agreement_signatures_agreement_id FOREIGN KEY (agreement_id)
    REFERENCES public.agreements(id) ON DELETE CASCADE
);

-- Add RLS
ALTER TABLE public.agreement_signatures ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can manage agreement signatures"
ON public.agreement_signatures FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_agreement_signatures_updated_at
BEFORE UPDATE ON public.agreement_signatures
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```