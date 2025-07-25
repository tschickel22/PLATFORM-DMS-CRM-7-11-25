/*
  # Create agreements table

  1. New Tables
    - `agreements`
      - `id` (text, primary key) - Unique identifier for each agreement
      - `customer_id` (text) - Reference to customer
      - `customer_name` (text) - Customer's full name
      - `customer_email` (text) - Customer's email address
      - `title` (text) - Agreement title/name
      - `type` (text) - Type of agreement (lease, purchase, service, etc.)
      - `status` (text) - Current status (draft, pending, signed, expired, etc.)
      - `pdf_url` (text) - URL to the PDF document
      - `signed_at` (timestamptz) - When the agreement was signed
      - `notes` (text) - Additional notes or comments
      - `vehicle_id` (text) - Reference to vehicle if applicable
      - `vehicle_info` (text) - Vehicle information
      - `quote_id` (text) - Reference to related quote
      - `terms` (text) - Agreement terms and conditions
      - `effective_date` (timestamptz) - When agreement becomes effective
      - `expiration_date` (timestamptz) - When agreement expires
      - `signed_by` (text) - Who signed the agreement
      - `ip_address` (text) - IP address when signed
      - `signature_data` (text) - Digital signature data
      - `documents` (jsonb) - Additional document references
      - `created_by` (text) - Who created the agreement
      - `total_amount` (numeric) - Total agreement amount
      - `down_payment` (numeric) - Down payment amount
      - `financing_amount` (numeric) - Financed amount
      - `monthly_payment` (numeric) - Monthly payment amount
      - `security_deposit` (numeric) - Security deposit
      - `annual_fee` (numeric) - Annual fee
      - `coverage_level` (text) - Coverage level for insurance/warranty
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `agreements` table
    - Add policy for authenticated users to manage agreements
*/

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create agreements table
CREATE TABLE IF NOT EXISTS public.agreements (
    id text PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id text NOT NULL DEFAULT '',
    customer_name text DEFAULT '',
    customer_email text DEFAULT '',
    title text NOT NULL DEFAULT '',
    type text NOT NULL DEFAULT '',
    status text NOT NULL DEFAULT 'draft',
    pdf_url text,
    signed_at timestamp with time zone,
    notes text DEFAULT '',
    vehicle_id text,
    vehicle_info text DEFAULT '',
    quote_id text,
    terms text DEFAULT '',
    effective_date timestamp with time zone,
    expiration_date timestamp with time zone,
    signed_by text,
    ip_address text,
    signature_data text,
    documents jsonb DEFAULT '[]'::jsonb,
    created_by text,
    total_amount numeric DEFAULT 0,
    down_payment numeric DEFAULT 0,
    financing_amount numeric DEFAULT 0,
    monthly_payment numeric DEFAULT 0,
    security_deposit numeric DEFAULT 0,
    annual_fee numeric DEFAULT 0,
    coverage_level text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can manage agreements"
    ON public.agreements
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agreements_customer_id ON public.agreements(customer_id);
CREATE INDEX IF NOT EXISTS idx_agreements_status ON public.agreements(status);
CREATE INDEX IF NOT EXISTS idx_agreements_type ON public.agreements(type);
CREATE INDEX IF NOT EXISTS idx_agreements_created_at ON public.agreements(created_at);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agreements_updated_at
    BEFORE UPDATE ON public.agreements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();