/*
  # Add company_id columns to CRM and PDI tables

  1. Schema Updates
    - Add `company_id` column to `crm_contacts` table
    - Add `company_id` column to `deals` table  
    - Add `company_id` column to `pdi_checklists` table
    - Set default company_id for existing records
  2. Performance
    - Add indexes on company_id columns for faster queries
  3. Security
    - Disable RLS for development safety
*/

-- Add company_id to crm_contacts if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'crm_contacts' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE crm_contacts ADD COLUMN company_id uuid;
  END IF;
END $$;

-- Add company_id to deals if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE deals ADD COLUMN company_id uuid;
  END IF;
END $$;

-- Add company_id to pdi_checklists if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pdi_checklists' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE pdi_checklists ADD COLUMN company_id uuid;
  END IF;
END $$;

-- Set default company_id for existing records (only if NULL)
UPDATE crm_contacts 
SET company_id = '11111111-1111-1111-1111-111111111111' 
WHERE company_id IS NULL;

UPDATE deals 
SET company_id = '11111111-1111-1111-1111-111111111111' 
WHERE company_id IS NULL;

UPDATE pdi_checklists 
SET company_id = '11111111-1111-1111-1111-111111111111' 
WHERE company_id IS NULL;

-- Disable RLS for development safety
ALTER TABLE crm_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE pdi_checklists DISABLE ROW LEVEL SECURITY;

-- Create indexes for performance (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'crm_contacts' AND indexname = 'idx_crm_contacts_company_id_new'
  ) THEN
    CREATE INDEX idx_crm_contacts_company_id_new ON crm_contacts(company_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'deals' AND indexname = 'idx_deals_company_id_new'
  ) THEN
    CREATE INDEX idx_deals_company_id_new ON deals(company_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'pdi_checklists' AND indexname = 'idx_pdi_checklists_company_id_new'
  ) THEN
    CREATE INDEX idx_pdi_checklists_company_id_new ON pdi_checklists(company_id);
  END IF;
END $$;