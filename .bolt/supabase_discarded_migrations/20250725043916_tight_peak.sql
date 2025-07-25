/*
  # Seed Agreement Vault Data

  1. Sample Data
    - Creates sample agreements with various statuses
    - Creates sample agreement templates
    - Creates sample agreement signatures
  2. Data Relationships
    - Links signatures to agreements via foreign keys
    - Provides realistic test data for dashboard stats
*/

-- Insert sample agreement templates
INSERT INTO agreement_templates (id, name, description, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Standard Purchase Agreement', 'Standard vehicle purchase agreement template', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Lease Agreement Template', 'Standard lease agreement for RV rentals', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Service Agreement', 'Service agreement template for maintenance contracts', false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample agreements
INSERT INTO agreements (id, customer_id, customer_name, customer_email, title, type, status, terms, effective_date, total_amount, down_payment, financing_amount, created_by) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'cust-001', 'John Smith', 'john.smith@email.com', 'Purchase Agreement - 2023 Forest River Cherokee', 'PURCHASE', 'signed', 'Standard purchase agreement terms and conditions. Vehicle sold as-is with manufacturer warranty.', '2024-01-15', 35000, 5000, 30000, 'sales@company.com'),
  ('660e8400-e29b-41d4-a716-446655440002', 'cust-002', 'Maria Rodriguez', 'maria.rodriguez@email.com', 'Lease Agreement - 2024 Keystone Montana', 'LEASE', 'pending', 'Lease agreement for 24 months with option to purchase. Monthly payment includes maintenance.', '2024-02-01', 62000, 0, 0, 'sales@company.com'),
  ('660e8400-e29b-41d4-a716-446655440003', 'cust-003', 'David Johnson', 'david.johnson@email.com', 'Service Agreement - Annual Maintenance', 'SERVICE', 'active', 'Annual service agreement covering routine maintenance and emergency repairs.', '2024-01-01', 1200, 0, 0, 'service@company.com')
ON CONFLICT (id) DO NOTHING;

-- Insert sample agreement signatures
INSERT INTO agreement_signatures (id, agreement_id, signer_email, signer_name, status, signed_at) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'john.smith@email.com', 'John Smith', 'signed', '2024-01-15 14:30:00+00'),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'maria.rodriguez@email.com', 'Maria Rodriguez', 'pending', NULL),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'david.johnson@email.com', 'David Johnson', 'signed', '2023-12-28 16:45:00+00')
ON CONFLICT (id) DO NOTHING;