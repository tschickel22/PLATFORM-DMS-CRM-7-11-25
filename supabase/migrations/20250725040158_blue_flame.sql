/*
  # Create quotes and quote_items tables

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with time zone)
      - `customer_id` (uuid, not null)
      - `inventory_id` (uuid, not null)
      - `price` (numeric)
      - `discount` (numeric)
      - `status` (text)
      - `notes` (text)
      - `valid_until` (date)
    - `quote_items`
      - `id` (uuid, primary key)
      - `quote_id` (uuid, foreign key to quotes)
      - `description` (text)
      - `quantity` (integer)
      - `unit_price` (numeric)
      - `total_price` (numeric)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage quotes

  3. Sample Data
    - Insert 3 sample quotes with items for testing
    - Mix of draft and sent statuses
*/

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  customer_id uuid NOT NULL,
  inventory_id uuid NOT NULL,
  price numeric DEFAULT 0,
  discount numeric DEFAULT 0,
  status text DEFAULT 'draft',
  notes text DEFAULT '',
  valid_until date,
  updated_at timestamptz DEFAULT now()
);

-- Create quote_items table
CREATE TABLE IF NOT EXISTS quote_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL,
  description text NOT NULL,
  quantity integer DEFAULT 1,
  unit_price numeric DEFAULT 0,
  total_price numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_quote_items_quote_id'
  ) THEN
    ALTER TABLE quote_items 
    ADD CONSTRAINT fk_quote_items_quote_id 
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add updated_at trigger for quotes
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
    WHERE trigger_name = 'update_quotes_updated_at'
  ) THEN
    CREATE TRIGGER update_quotes_updated_at
      BEFORE UPDATE ON quotes
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can manage quotes"
  ON quotes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage quote items"
  ON quote_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample data
DO $$
DECLARE
  sample_customer_id uuid;
  sample_inventory_id uuid;
  quote1_id uuid;
  quote2_id uuid;
  quote3_id uuid;
BEGIN
  -- Get sample customer and inventory IDs (use existing or create placeholders)
  SELECT id INTO sample_customer_id FROM crm_contacts LIMIT 1;
  SELECT id INTO sample_inventory_id FROM inventory_items LIMIT 1;
  
  -- If no existing data, create placeholder IDs
  IF sample_customer_id IS NULL THEN
    sample_customer_id := gen_random_uuid();
  END IF;
  
  IF sample_inventory_id IS NULL THEN
    sample_inventory_id := gen_random_uuid();
  END IF;

  -- Insert sample quotes
  INSERT INTO quotes (id, customer_id, inventory_id, price, discount, status, notes, valid_until)
  VALUES 
    (gen_random_uuid(), sample_customer_id, sample_inventory_id, 45000.00, 2000.00, 'draft', 'Initial quote for 2023 Forest River Cherokee', CURRENT_DATE + INTERVAL '30 days'),
    (gen_random_uuid(), sample_customer_id, sample_inventory_id, 62000.00, 3000.00, 'sent', 'Quote sent to customer via email', CURRENT_DATE + INTERVAL '15 days'),
    (gen_random_uuid(), sample_customer_id, sample_inventory_id, 38000.00, 1500.00, 'accepted', 'Customer accepted quote terms', CURRENT_DATE + INTERVAL '7 days')
  RETURNING id INTO quote1_id;

  -- Get the actual quote IDs for items
  SELECT id INTO quote1_id FROM quotes WHERE status = 'draft' LIMIT 1;
  SELECT id INTO quote2_id FROM quotes WHERE status = 'sent' LIMIT 1;
  SELECT id INTO quote3_id FROM quotes WHERE status = 'accepted' LIMIT 1;

  -- Insert sample quote items
  INSERT INTO quote_items (quote_id, description, quantity, unit_price, total_price)
  VALUES 
    (quote1_id, 'Base Unit - 2023 Forest River Cherokee 274RK', 1, 43000.00, 43000.00),
    (quote1_id, 'Delivery and Setup', 1, 2000.00, 2000.00),
    (quote2_id, 'Base Unit - 2024 Keystone Montana 3761FL', 1, 59000.00, 59000.00),
    (quote2_id, 'Extended Warranty', 1, 3000.00, 3000.00),
    (quote3_id, 'Base Unit - 2022 Grand Design Solitude', 1, 36500.00, 36500.00),
    (quote3_id, 'Installation Package', 1, 1500.00, 1500.00);

EXCEPTION
  WHEN OTHERS THEN
    -- Ignore errors if sample data already exists or references don't exist
    NULL;
END $$;