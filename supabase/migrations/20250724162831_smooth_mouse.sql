/*
  # Create company_settings table

  1. New Tables
    - `company_settings`
      - `id` (uuid, primary key)
      - `company_id` (uuid, required)
      - `name` (text, required)
      - `domain` (text, required)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `company_settings` table
    - Add policy for authenticated users to manage company settings

  3. Performance
    - Add index on company_id for faster lookups
    - Add trigger for automatic updated_at timestamp updates
*/

-- Create company_settings table
CREATE TABLE IF NOT EXISTS company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  name text NOT NULL,
  domain text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can manage company settings"
  ON company_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_company_settings_company_id 
  ON company_settings (company_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_company_settings_updated_at
  BEFORE UPDATE ON company_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();