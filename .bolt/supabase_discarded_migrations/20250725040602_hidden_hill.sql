/*
  # Create Agreement Vault Tables

  1. New Tables
    - `agreements`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `customer_id` (uuid, not null)
      - `type` (text) -- lease, finance, service, etc.
      - `status` (text) -- draft, signed, expired
      - `pdf_url` (text)
      - `signed_at` (timestamp)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
      - `notes` (text)
    - `agreement_templates`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `fields` (json)
      - `created_at` (timestamp, default now())
    - `agreement_signatures`
      - `id` (uuid, primary key)
      - `agreement_id` (uuid, references agreements)
      - `signer_name` (text)
      - `signer_email` (text)
      - `signed_at` (timestamp)
      - `signature_url` (text)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage all data
  3. Seed Data
    - 2 sample agreements
    - 1 agreement template
    - 1 signature record
*/

-- Create agreements table
CREATE TABLE IF NOT EXISTS agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  customer_id uuid NOT NULL,
  type text DEFAULT 'purchase',
  status text DEFAULT 'draft',
  pdf_url text,
  signed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  notes text DEFAULT ''
);

-- Create agreement_templates table
CREATE TABLE IF NOT EXISTS agreement_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  fields jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create agreement_signatures table
CREATE TABLE IF NOT EXISTS agreement_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id uuid REFERENCES agreements(id) ON DELETE CASCADE,
  signer_name text NOT NULL,
  signer_email text NOT NULL,
  signed_at timestamptz,
  signature_url text
);

-- Enable RLS
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreement_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreement_signatures ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can manage agreements"
  ON agreements
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage agreement templates"
  ON agreement_templates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage agreement signatures"
  ON agreement_signatures
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_agreements_updated_at
  BEFORE UPDATE ON agreements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_agreements_customer_id ON agreements(customer_id);
CREATE INDEX IF NOT EXISTS idx_agreements_status ON agreements(status);
CREATE INDEX IF NOT EXISTS idx_agreements_type ON agreements(type);
CREATE INDEX IF NOT EXISTS idx_agreement_signatures_agreement_id ON agreement_signatures(agreement_id);

-- Seed data
INSERT INTO agreement_templates (id, name, description, fields) VALUES
(
  'template-001',
  'Standard Purchase Agreement',
  'Standard vehicle purchase agreement template',
  '[
    {
      "id": "customer_name",
      "type": "text",
      "label": "Customer Name",
      "required": true
    },
    {
      "id": "vehicle_info",
      "type": "text", 
      "label": "Vehicle Information",
      "required": true
    },
    {
      "id": "purchase_price",
      "type": "currency",
      "label": "Purchase Price",
      "required": true
    }
  ]'::jsonb
);

INSERT INTO agreements (id, title, customer_id, type, status, pdf_url, notes) VALUES
(
  'agr-001',
  'Purchase Agreement - 2023 Forest River Cherokee',
  'cust-001',
  'purchase',
  'signed',
  '/documents/purchase-agreement-001.pdf',
  'Standard purchase agreement for RV sale'
),
(
  'agr-002', 
  'Service Agreement - Annual Maintenance',
  'cust-002',
  'service',
  'draft',
  NULL,
  'Annual maintenance service agreement'
);

INSERT INTO agreement_signatures (agreement_id, signer_name, signer_email, signed_at, signature_url) VALUES
(
  'agr-001',
  'John Smith',
  'john.smith@email.com',
  '2024-01-15T14:30:00Z',
  '/signatures/signature-001.png'
);