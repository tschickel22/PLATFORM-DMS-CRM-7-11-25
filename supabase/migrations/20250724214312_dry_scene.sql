/*
  # CRM Sales Deal System Tables

  1. New Tables
    - `deals`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, nullable)
      - `customer_name` (text, default '')
      - `customer_email` (text, nullable)
      - `customer_phone` (text, nullable)
      - `vehicle_id` (uuid, nullable)
      - `vehicle_info` (text, nullable)
      - `stage` (text, default 'New')
      - `amount` (numeric, default 0)
      - `source` (text, nullable)
      - `type` (text, default 'New Sale')
      - `priority` (text, default 'Medium')
      - `rep_id` (text, nullable)
      - `rep_name` (text, nullable)
      - `probability` (integer, default 0)
      - `expected_close_date` (date, nullable)
      - `notes` (text, default '')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `territories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, default '')
      - `rep_ids` (jsonb, default '[]')
      - `zipcodes` (jsonb, default '[]')
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `win_loss_reports`
      - `id` (uuid, primary key)
      - `deal_id` (uuid)
      - `outcome` (text)
      - `reason` (text, default '')
      - `notes` (text, default '')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `approval_workflows`
      - `id` (uuid, primary key)
      - `deal_id` (uuid)
      - `workflow_type` (text)
      - `status` (text, default 'pending')
      - `approver_id` (text, nullable)
      - `approved_at` (timestamp, nullable)
      - `notes` (text, default '')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - NO RLS enabled on any tables for development
    - Full access allowed for all operations
    - Rails backend will handle authorization later

  3. Performance
    - Indexes on frequently queried columns
    - Automatic updated_at triggers
*/

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid,
  customer_name text DEFAULT '' NOT NULL,
  customer_email text,
  customer_phone text,
  vehicle_id uuid,
  vehicle_info text,
  stage text DEFAULT 'New' NOT NULL,
  amount numeric DEFAULT 0,
  source text,
  type text DEFAULT 'New Sale',
  priority text DEFAULT 'Medium',
  rep_id text,
  rep_name text,
  probability integer DEFAULT 0,
  expected_close_date date,
  notes text DEFAULT '' NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create territories table
CREATE TABLE IF NOT EXISTS territories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  rep_ids jsonb DEFAULT '[]',
  zipcodes jsonb DEFAULT '[]',
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_deals_customer_id ON deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_deals_rep_id ON deals(rep_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);

CREATE INDEX IF NOT EXISTS idx_territories_rep_ids ON territories USING gin(rep_ids);

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

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_territories_updated_at
  BEFORE UPDATE ON territories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_win_loss_reports_updated_at
  BEFORE UPDATE ON win_loss_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approval_workflows_updated_at
  BEFORE UPDATE ON approval_workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- EXPLICITLY DISABLE RLS FOR ALL TABLES
ALTER TABLE deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE territories DISABLE ROW LEVEL SECURITY;
ALTER TABLE win_loss_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflows DISABLE ROW LEVEL SECURITY;

-- DROP ANY EXISTING POLICIES (if they exist)
DROP POLICY IF EXISTS "Authenticated users can manage deals" ON deals;
DROP POLICY IF EXISTS "Authenticated users can manage territories" ON territories;
DROP POLICY IF EXISTS "Authenticated users can manage win/loss reports" ON win_loss_reports;
DROP POLICY IF EXISTS "Authenticated users can manage approval workflows" ON approval_workflows;