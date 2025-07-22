export const mockInventory = {
  vehicleTypes: ['Single Wide', 'Double Wide', 'Fifth Wheel', 'Travel Trailer', 'Park Model', 'Motorhome'],
  conditions: ['New', 'Used', 'Refurbished'],
  statuses: ['Available', 'Pending', 'Sold', 'On Hold'],
  locations: ['Main Lot', 'Overflow Lot', 'Service Bay', 'Offsite'],
  features: ['AC', 'Washer/Dryer', 'Solar Prep', 'Porch', 'Skirting', 'Appliances Included'],
  csvFields: [
    'stockNumber',
    'vin',
    'year',
    'make',
    'model',
    'type',
    'condition',
    'status',
    'location',
    'price',
    'cost',
    'features'
  ],
  exampleInventory: [
    {
      stockNumber: 'RV-001',
      type: 'Fifth Wheel',
      condition: 'Used',
      status: 'Available',
      location: 'Main Lot',
      year: 2022,
      make: 'Forest River',
      model: 'Flagstaff 832IKRL',
      vin: '1FUJBBCK5NLBXXXXX',
      price: 45000,
      cost: 38000,
      features: ['AC', 'Slide Outs', 'Awning']
    },
    {
      stockNumber: 'RV-002',
      type: 'Travel Trailer',
      condition: 'New',
      status: 'Available',
      location: 'Main Lot',
      year: 2024,
      make: 'Keystone',
      model: 'Passport 2400RB',
      vin: '4X4TWHBK5PNXXXXXX',
      price: 32000,
      cost: 26000,
      features: ['AC', 'Solar Prep', 'Outdoor Kitchen']
    },
    {
      stockNumber: 'MH-001',
      type: 'Double Wide',
      condition: 'New',
      status: 'Available',
      location: 'Main Lot',
      year: 2024,
      make: 'Clayton',
      model: 'The Breeze',
      vin: 'CLT123456789XXXXX',
      price: 85000,
      cost: 72000,
      features: ['Washer/Dryer', 'Porch', 'Central Air']
    },
    {
      stockNumber: 'MH-002',
      type: 'Single Wide',
      condition: 'Used',
      status: 'Pending',
      location: 'Overflow Lot',
      year: 2022,
      make: 'Fleetwood',
      model: 'Inspiration',
      vin: 'FLT987654321XXXXX',
      price: 55000,
      cost: 48000,
      features: ['Skirting', 'Appliances Included', 'Fireplace']
    }
  ]
}

export default mockInventory