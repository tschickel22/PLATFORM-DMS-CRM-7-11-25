/*
  # Create inventory_items table

  1. New Tables
    - `inventory_items`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `type` (text)
      - `status` (text)
      - `serial_number` (text)
      - `location` (text)
      - `photos` (text array)
      - `assigned_to` (uuid)
      - `purchase_date` (timestamp)
      - `warranty_expiration` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - No RLS enabled as per requirements
    - Backend will manage access control

  3. Sample Data
    - 5 sample inventory items with mix of home, RV, and equipment types
*/

CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text,
  status text,
  serial_number text,
  location text,
  photos text[],
  assigned_to uuid,
  purchase_date timestamptz,
  warranty_expiration timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO inventory_items (name, type, status, serial_number, location, photos, assigned_to, purchase_date, warranty_expiration) VALUES
(
  '2023 Forest River Cherokee 274RK',
  'Travel Trailer',
  'Available',
  'RV2023001',
  'Main Lot A-12',
  ARRAY['https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg'],
  null,
  '2023-06-15T00:00:00Z',
  '2025-06-15T00:00:00Z'
),
(
  '2024 Clayton Homes Double Wide',
  'Manufactured Home',
  'Sold',
  'MH2024005',
  'Display Area B-3',
  ARRAY['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'],
  null,
  '2024-01-10T00:00:00Z',
  '2026-01-10T00:00:00Z'
),
(
  '2022 Keystone Montana 3761FL',
  'Fifth Wheel',
  'Service',
  'FW2022012',
  'Service Bay 2',
  ARRAY['https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg'],
  null,
  '2022-08-20T00:00:00Z',
  '2024-08-20T00:00:00Z'
),
(
  'Generac 7500W Generator',
  'Equipment',
  'Available',
  'GEN2023078',
  'Parts Warehouse',
  ARRAY['https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg'],
  null,
  '2023-11-05T00:00:00Z',
  '2025-11-05T00:00:00Z'
),
(
  '2021 Winnebago Vista 32KE',
  'Motorhome',
  'Reserved',
  'MH2021034',
  'Premium Lot C-1',
  ARRAY['https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg'],
  null,
  '2021-04-12T00:00:00Z',
  '2023-04-12T00:00:00Z'
);