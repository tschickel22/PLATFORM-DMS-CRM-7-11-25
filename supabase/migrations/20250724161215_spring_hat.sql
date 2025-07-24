/*
  # Create sms_templates table

  1. New Tables
    - `sms_templates`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `content` (text, required)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `sms_templates` table
    - Add policy for authenticated users to manage SMS templates

  3. Changes
    - Add trigger to automatically update updated_at timestamp
*/

-- Create the sms_templates table
CREATE TABLE IF NOT EXISTS sms_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE sms_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to manage SMS templates
CREATE POLICY "Authenticated users can manage SMS templates"
  ON sms_templates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_sms_templates_updated_at
  BEFORE UPDATE ON sms_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();