/*
  # Seed Agreement Vault Sample Data

  1. Sample Data
    - Creates 3 sample agreements with different statuses
    - Creates 3 agreement templates (2 active, 1 inactive)
    - Creates 3 signature records (2 signed, 1 pending)
  
  2. Purpose
    - Provides test data to verify dashboard stats
    - Demonstrates agreement workflow states
    - Tests signature tracking functionality
*/

-- Insert sample agreement templates
INSERT INTO agreement_templates (id, name, description, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Standard Purchase Agreement', 'Standard vehicle purchase agreement template', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Lease Agreement Template', 'Standard lease agreement for RV rentals', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Service Agreement', 'Service agreement template for maintenance contracts', false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample agreements
INSERT INTO agreements (id, customer_id, customer_name, customer_email, title, type, status, total_amount, signed_at, signed_by) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'cust-001', 'John Smith', 'john.smith@email.com', 'RV Purchase Agreement', 'PURCHASE', 'signed', 35000, '2024-01-15T14:30:00Z', 'John Smith'),
  ('660e8400-e29b-41d4-a716-446655440002', 'cust-002', 'Maria Rodriguez', 'maria.rodriguez@email.com', 'Lease Agreement', 'LEASE', 'pending', 62000, NULL, NULL),
  ('660e8400-e29b-41d4-a716-446655440003', 'cust-003', 'David Johnson', 'david.johnson@email.com', 'Service Agreement', 'SERVICE', 'signed', 1200, '2023-12-28T16:45:00Z', 'David Johnson')
ON CONFLICT (id) DO NOTHING;

-- Insert sample signatures
INSERT INTO agreement_signatures (id, agreement_id, signer_email, signer_name, status, signed_at) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'john.smith@email.com', 'John Smith', 'signed', '2024-01-15T14:30:00Z'),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'maria.rodriguez@email.com', 'Maria Rodriguez', 'pending', NULL),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'david.johnson@email.com', 'David Johnson', 'signed', '2023-12-28T16:45:00Z')
ON CONFLICT (id) DO NOTHING;