/*
  # Create agreement_templates table

  1. New Tables
    - `agreement_templates`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, optional)
      - `pdf_base64` (text, stores base64 encoded PDF content)
      - `fields` (jsonb, stores field definitions as JSON)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `agreement_templates` table
    - Add policy for authenticated users to manage templates

  3. Indexes
    - Add index on `is_active` for filtering active templates
    - Add index on `created_at` for sorting
*/

CREATE TABLE IF NOT EXISTS public.agreement_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  pdf_base64 text,
  fields jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agreement_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to manage agreement templates
CREATE POLICY "Authenticated users can manage agreement templates"
  ON public.agreement_templates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_agreement_templates_is_active 
  ON public.agreement_templates (is_active);

CREATE INDEX IF NOT EXISTS idx_agreement_templates_created_at 
  ON public.agreement_templates (created_at);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_agreement_templates_updated_at
  BEFORE UPDATE ON public.agreement_templates
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();