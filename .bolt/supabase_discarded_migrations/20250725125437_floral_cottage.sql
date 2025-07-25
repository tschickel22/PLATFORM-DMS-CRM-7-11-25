/*
  # Create service operations tables

  1. New Tables
    - `service_requests`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `status` (text, default 'open')
      - `priority` (text)
      - `assigned_to` (uuid)
      - `customer_id` (uuid)
      - `requested_date` (timestamp)
      - `completed_date` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `service_logs`
      - `id` (uuid, primary key)
      - `request_id` (uuid)
      - `note` (text)
      - `created_by` (uuid)
      - `created_at` (timestamp)

  2. Sample Data
    - Insert 2 service requests
    - Insert corresponding service logs
*/

-- Create service_requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',
  priority TEXT,
  assigned_to UUID,
  customer_id UUID,
  requested_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create service_logs table
CREATE TABLE IF NOT EXISTS service_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID,
  note TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert sample service requests
INSERT INTO service_requests (id, title, status, description, priority, customer_id, requested_date)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Repair AC Unit', 'open', 'AC unit not cooling properly in living area.', 'high', 'cust-001', '2024-01-25T10:00:00Z'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Fix Broken Window', 'in_progress', 'Living room window has a crack that needs repair.', 'medium', 'cust-002', '2024-01-26T14:00:00Z');

-- Insert sample service logs
INSERT INTO service_logs (request_id, note, created_by)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Initial inspection scheduled for AC unit. Technician assigned.', 'admin-001'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Customer contacted regarding window repair. Parts have been ordered.', 'admin-001');