/*
  # Create CRM Contacts Table

  1. New Tables
    - `crm_contacts`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text) 
      - `email` (text)
      - `phone` (text)
      - `source` (text)
      - `source_id` (text, nullable)
      - `status` (text, default 'new')
      - `assigned_to` (text, nullable)
      - `notes` (text, default '')
      - `score` (integer, nullable)
      - `last_activity` (timestamptz, nullable)
      - `custom_fields` (jsonb, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `crm_contacts` table
    - Add policy for authenticated users to manage all CRM contact data

  3. Indexes
    - Add indexes for common query patterns (email, status, assigned_to, created_at)

  4. Triggers
    - Add trigger to automatically update `updated_at` timestamp
*/

-- Create the crm_contacts table
CREATE TABLE IF NOT EXISTS crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT '',
  source_id text,
  status text NOT NULL DEFAULT 'new',
  assigned_to text,
  notes text NOT NULL DEFAULT '',
  score integer,
  last_activity timestamptz,
  custom_fields jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to manage CRM contacts
CREATE POLICY "Authenticated users can manage CRM contacts"
  ON crm_contacts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_crm_contacts_email ON crm_contacts (email);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_status ON crm_contacts (status);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_assigned_to ON crm_contacts (assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_created_at ON crm_contacts (created_at);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_last_activity ON crm_contacts (last_activity);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_source ON crm_contacts (source);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_crm_contacts_updated_at
  BEFORE UPDATE ON crm_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();