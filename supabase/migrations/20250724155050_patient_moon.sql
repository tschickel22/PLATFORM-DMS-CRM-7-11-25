/*
  # Create test table for connection verification

  1. New Tables
    - `test`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `test` table
    - Add policy for public read access (connection testing only)

  This table is used solely for verifying the Supabase connection in the application.
*/

CREATE TABLE IF NOT EXISTS test (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for connection testing"
  ON test
  FOR SELECT
  TO public
  USING (true);