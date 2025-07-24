/*
  # Create integration_credentials table

  1. New Tables
    - `integration_credentials`
      - `id` (uuid, primary key)
      - `provider_id` (uuid, foreign key to integration_providers)
      - `key` (text, API key)
      - `secret` (text, API secret)
      - `access_token` (text, OAuth access token)
      - `refresh_token` (text, OAuth refresh token)
      - `expires_at` (timestamp, token expiration)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `integration_credentials` table
    - Add policy for authenticated users to manage credentials
    - Add foreign key constraint to integration_providers table

  3. Features
    - Auto-updating updated_at timestamp
    - Secure storage for API credentials and OAuth tokens
*/

CREATE TABLE IF NOT EXISTS integration_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL,
  key text,
  secret text,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint to integration_providers
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'integration_providers') THEN
    ALTER TABLE integration_credentials 
    ADD CONSTRAINT fk_integration_credentials_provider 
    FOREIGN KEY (provider_id) REFERENCES integration_providers(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE integration_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to manage integration credentials
CREATE POLICY "Authenticated users can manage integration credentials"
  ON integration_credentials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at timestamp
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
    WHERE trigger_name = 'update_integration_credentials_updated_at'
  ) THEN
    CREATE TRIGGER update_integration_credentials_updated_at
      BEFORE UPDATE ON integration_credentials
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;