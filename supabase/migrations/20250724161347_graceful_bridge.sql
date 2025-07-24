/*
  # Create integration_providers table

  1. New Tables
    - `integration_providers`
      - `id` (uuid, primary key)
      - `name` (text, required) - provider name
      - `category` (text, required) - provider category (email, sms, payment, etc.)
      - `is_enabled` (boolean, default false) - whether the provider is enabled
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `integration_providers` table
    - Add policy for authenticated users to manage integration providers

  3. Triggers
    - Add trigger to automatically update updated_at timestamp
*/

CREATE TABLE IF NOT EXISTS integration_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE integration_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage integration providers"
  ON integration_providers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER update_integration_providers_updated_at
  BEFORE UPDATE ON integration_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();