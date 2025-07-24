/*
  # Create feature_flags table

  1. New Tables
    - `feature_flags`
      - `id` (uuid, primary key)
      - `key` (text, unique, required)
      - `value` (boolean, required, default false)
      - `description` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `feature_flags` table
    - Add policy for authenticated users to read and manage feature flags

  3. Notes
    - The `key` field has a unique constraint to prevent duplicate feature flags
    - Default value for `value` is false for safety
    - Includes automatic timestamp management
*/

CREATE TABLE IF NOT EXISTS feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value boolean NOT NULL DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage feature flags"
  ON feature_flags
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER update_feature_flags_updated_at
  BEFORE UPDATE ON feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();