/*
  # Create integration_test_users table

  1. New Tables
    - `integration_test_users`
      - `id` (uuid, primary key)
      - `email` (text, required)
      - `platform` (text, required)
      - `test_case` (text, required)
      - `notes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `integration_test_users` table
    - Add policy for authenticated users to manage integration test users

  3. Performance
    - Add indexes on email and platform fields for efficient querying
*/

CREATE TABLE IF NOT EXISTS integration_test_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  platform text NOT NULL,
  test_case text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE integration_test_users ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can manage integration test users"
  ON integration_test_users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_integration_test_users_email ON integration_test_users (email);
CREATE INDEX IF NOT EXISTS idx_integration_test_users_platform ON integration_test_users (platform);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_integration_test_users_updated_at
  BEFORE UPDATE ON integration_test_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();