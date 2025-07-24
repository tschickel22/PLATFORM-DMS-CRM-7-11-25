/*
  # Create deals and related tables

  1. New Tables
    - `deals`
      - `id` (uuid, primary key)
      - `customer_id` (uuid)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `vehicle_id` (uuid, nullable)
      - `vehicle_info` (text, nullable)
      - `stage` (text)
      - `amount` (numeric)
      - `source` (text)
      - `type` (text)
      - `priority` (text)
      - `rep_id` (text, nullable)
      - `rep_name` (text, nullable)
      - `probability` (integer)
      - `expected_close_date` (date, nullable)
      - `notes` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `territories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, nullable)
      - `rep_ids` (jsonb)
      - `zipcodes` (jsonb)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `win_loss_reports`
      - `id` (uuid, primary key)
      - `deal_id` (uuid)
      - `outcome` (text)
      - `reason` (text, nullable)
      - `notes` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `approval_workflows`
      - `id` (uuid, primary key)
      - `deal_id` (uuid)
      - `workflow_type` (text)
      - `status` (text)
      - `approver_id` (text, nullable)
      - `approved_at` (timestamp, nullable)
      - `notes` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
*/

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid,
  customer_name text NOT NULL DEFAULT '',
  customer_email text DEFAULT '',
  customer_phone text DEFAULT '',
  vehicle_id uuid,
  vehicle_info text DEFAULT '',
  stage text NOT NULL DEFAULT 'New',
  amount numeric DEFAULT 0,
  source text DEFAULT '',
  type text DEFAULT 'New Sale',
  priority text DEFAULT 'Medium',
  rep_id text,
  rep_name text DEFAULT '',
  probability integer DEFAULT 0,
  expected_close_date date,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create territories table
CREATE TABLE IF NOT EXISTS territories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  rep_ids jsonb DEFAULT '[]'::jsonb,
  zipcodes jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create win_loss_reports table
CREATE TABLE IF NOT EXISTS win_loss_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL,
  outcome text NOT NULL,
  reason text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create approval_workflows table
CREATE TABLE IF NOT EXISTS approval_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL,
  workflow_type text NOT NULL,
  status text DEFAULT 'pending',
  approver_id text,
  approved_at timestamptz,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE win_loss_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;

-- Create policies for deals
CREATE POLICY "Authenticated users can manage deals"
  ON deals
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for territories
CREATE POLICY "Authenticated users can manage territories"
  ON territories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for win_loss_reports
CREATE POLICY "Authenticated users can manage win/loss reports"
  ON win_loss_reports
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for approval_workflows
CREATE POLICY "Authenticated users can manage approval workflows"
  ON approval_workflows
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deals_customer_id ON deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_rep_id ON deals(rep_id);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);
CREATE INDEX IF NOT EXISTS idx_win_loss_reports_deal_id ON win_loss_reports(deal_id);
CREATE INDEX IF NOT EXISTS idx_approval_workflows_deal_id ON approval_workflows(deal_id);

-- Create updated_at triggers
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
    WHERE trigger_name = 'update_deals_updated_at'
  ) THEN
    CREATE TRIGGER update_deals_updated_at
      BEFORE UPDATE ON deals
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_territories_updated_at'
  ) THEN
    CREATE TRIGGER update_territories_updated_at
      BEFORE UPDATE ON territories
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_win_loss_reports_updated_at'
  ) THEN
    CREATE TRIGGER update_win_loss_reports_updated_at
      BEFORE UPDATE ON win_loss_reports
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_approval_workflows_updated_at'
  ) THEN
    CREATE TRIGGER update_approval_workflows_updated_at
      BEFORE UPDATE ON approval_workflows
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;