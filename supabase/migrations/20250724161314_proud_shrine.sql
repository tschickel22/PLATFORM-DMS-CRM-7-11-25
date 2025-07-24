/*
  # Create test_users table

  1. New Tables
    - `test_users`
      - `id` (uuid, primary key)
      - `email` (text, required)
      - `mfa_enabled` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `test_users` table
    - Add policy for authenticated users to manage test users
*/

CREATE TABLE IF NOT EXISTS test_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  mfa_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE test_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage test users"
  ON test_users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER update_test_users_updated_at
  BEFORE UPDATE ON test_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();