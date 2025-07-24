/*
  # Create integration_logs table

  1. New Tables
    - `integration_logs`
      - `id` (uuid, primary key)
      - `provider_id` (uuid, foreign key to integration_providers)
      - `event` (text, required)
      - `status` (text, required)
      - `response` (jsonb, optional)
      - `created_at` (timestamp, default now())

  2. Security
    - Enable RLS on `integration_logs` table
    - Add policy for authenticated users to read and create logs

  3. Foreign Keys
    - Links to integration_providers table via provider_id
*/

-- Create integration_logs table
CREATE TABLE IF NOT EXISTS integration_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL,
  event text NOT NULL,
  status text NOT NULL,
  response jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to manage integration logs
CREATE POLICY "Authenticated users can manage integration logs"
  ON integration_logs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add foreign key constraint
ALTER TABLE integration_logs 
ADD CONSTRAINT fk_integration_logs_provider 
FOREIGN KEY (provider_id) REFERENCES integration_providers(id) ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_integration_logs_provider_id ON integration_logs(provider_id);
CREATE INDEX IF NOT EXISTS idx_integration_logs_created_at ON integration_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_integration_logs_status ON integration_logs(status);