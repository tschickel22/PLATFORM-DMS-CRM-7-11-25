/*
  # Create custom_fields table

  1. New Tables
    - `custom_fields`
      - `id` (uuid, primary key)
      - `company_id` (uuid, required)
      - `name` (text, required)
      - `module` (text, required)
      - `section` (text, required)
      - `type` (text, required)
      - `required` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `custom_fields` table
    - Add policy for authenticated users to manage custom fields

  3. Performance
    - Add indexes on company_id and module for efficient queries
*/

CREATE TABLE IF NOT EXISTS custom_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  name text NOT NULL,
  module text NOT NULL,
  section text NOT NULL,
  type text NOT NULL,
  required boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can manage custom fields"
  ON custom_fields
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_custom_fields_company_id ON custom_fields(company_id);
CREATE INDEX IF NOT EXISTS idx_custom_fields_module ON custom_fields(module);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_custom_fields_updated_at
  BEFORE UPDATE ON custom_fields
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();