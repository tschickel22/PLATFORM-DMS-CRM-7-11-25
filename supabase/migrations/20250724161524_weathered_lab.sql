/*
  # Create integration_settings table

  1. New Tables
    - `integration_settings`
      - `id` (uuid, primary key)
      - `provider_id` (uuid, foreign key to integration_providers)
      - `key` (text, required)
      - `value` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `integration_settings` table
    - Add policy for authenticated users to manage integration settings

  3. Indexes
    - Index on provider_id for efficient lookups
    - Composite index on provider_id and key for unique settings per provider
*/

CREATE TABLE IF NOT EXISTS integration_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL,
  key text NOT NULL,
  value text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint
ALTER TABLE integration_settings 
ADD CONSTRAINT fk_integration_settings_provider 
FOREIGN KEY (provider_id) REFERENCES integration_providers(id) ON DELETE CASCADE;

-- Add unique constraint for provider_id + key combination
ALTER TABLE integration_settings 
ADD CONSTRAINT unique_provider_setting 
UNIQUE (provider_id, key);

-- Enable Row Level Security
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can manage integration settings"
  ON integration_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_integration_settings_provider_id 
  ON integration_settings (provider_id);

CREATE INDEX IF NOT EXISTS idx_integration_settings_key 
  ON integration_settings (key);

-- Create trigger for updated_at
CREATE TRIGGER update_integration_settings_updated_at
  BEFORE UPDATE ON integration_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();