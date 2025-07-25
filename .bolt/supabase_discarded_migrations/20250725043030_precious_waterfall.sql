/*
  # Create agreement_signatures table

  1. New Tables
    - `agreement_signatures`
      - `id` (uuid, primary key)
      - `agreement_id` (uuid, foreign key to agreements)
      - `signer_email` (text, required)
      - `signer_name` (text, optional)
      - `status` (text, default 'pending')
      - `signed_at` (timestamp, nullable)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `agreement_signatures` table
    - Add policy for authenticated users to manage signatures

  3. Indexes
    - Index on agreement_id for fast lookups
    - Index on signer_email for searching
    - Index on status for filtering
    - Index on signed_at for ordering
*/

CREATE TABLE IF NOT EXISTS agreement_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id uuid NOT NULL,
  signer_email text NOT NULL,
  signer_name text,
  status text DEFAULT 'pending',
  signed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE agreement_signatures ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can manage agreement signatures"
  ON agreement_signatures
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agreement_signatures_agreement_id ON agreement_signatures(agreement_id);
CREATE INDEX IF NOT EXISTS idx_agreement_signatures_signer_email ON agreement_signatures(signer_email);
CREATE INDEX IF NOT EXISTS idx_agreement_signatures_status ON agreement_signatures(status);
CREATE INDEX IF NOT EXISTS idx_agreement_signatures_signed_at ON agreement_signatures(signed_at);

-- Create update trigger
CREATE TRIGGER update_agreement_signatures_updated_at
  BEFORE UPDATE ON agreement_signatures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key constraint to agreements table if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'agreements'
  ) THEN
    ALTER TABLE agreement_signatures 
    ADD CONSTRAINT fk_agreement_signatures_agreement_id 
    FOREIGN KEY (agreement_id) REFERENCES agreements(id) ON DELETE CASCADE;
  END IF;
END $$;