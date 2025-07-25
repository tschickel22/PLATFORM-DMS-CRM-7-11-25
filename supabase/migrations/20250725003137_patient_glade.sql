/*
  # Finance Applications Schema

  1. New Tables
    - `finance_applications`
      - `id` (uuid, primary key)
      - `customer_id` (text)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `template_id` (uuid, foreign key)
      - `status` (text)
      - `data` (jsonb)
      - `uploaded_files` (jsonb)
      - `history` (jsonb)
      - `fraud_check_status` (text)
      - `notes` (text)
      - `admin_notes` (text)
      - `submitted_at` (timestamptz)
      - `reviewed_at` (timestamptz)
      - `reviewed_by` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `application_templates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `sections` (jsonb)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
*/

-- Create finance_applications table
CREATE TABLE IF NOT EXISTS finance_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id text DEFAULT '',
  customer_name text DEFAULT '',
  customer_email text DEFAULT '',
  customer_phone text DEFAULT '',
  template_id uuid,
  status text DEFAULT 'draft',
  data jsonb DEFAULT '{}',
  uploaded_files jsonb DEFAULT '[]',
  history jsonb DEFAULT '[]',
  fraud_check_status text DEFAULT 'pending',
  notes text DEFAULT '',
  admin_notes text DEFAULT '',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create application_templates table
CREATE TABLE IF NOT EXISTS application_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  sections jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE finance_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for finance_applications
CREATE POLICY "Authenticated users can manage finance applications"
  ON finance_applications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for application_templates
CREATE POLICY "Authenticated users can manage application templates"
  ON application_templates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_finance_applications_customer_id ON finance_applications(customer_id);
CREATE INDEX IF NOT EXISTS idx_finance_applications_status ON finance_applications(status);
CREATE INDEX IF NOT EXISTS idx_finance_applications_template_id ON finance_applications(template_id);
CREATE INDEX IF NOT EXISTS idx_finance_applications_created_at ON finance_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_application_templates_is_active ON application_templates(is_active);

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_finance_applications_template'
  ) THEN
    ALTER TABLE finance_applications 
    ADD CONSTRAINT fk_finance_applications_template 
    FOREIGN KEY (template_id) REFERENCES application_templates(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_finance_applications_updated_at'
  ) THEN
    CREATE TRIGGER update_finance_applications_updated_at
      BEFORE UPDATE ON finance_applications
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_application_templates_updated_at'
  ) THEN
    CREATE TRIGGER update_application_templates_updated_at
      BEFORE UPDATE ON application_templates
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;