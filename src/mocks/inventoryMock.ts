export const mockInventory = {
  vehicleTypes: ['Single Wide', 'Double Wide', 'Fifth Wheel', 'Travel Trailer', 'Park Model', 'Motorhome'],
  conditions: ['New', 'Used', 'Refurbished'],
  statuses: ['Available', 'Pending', 'Sold', 'On Hold'],
  locations: ['Main Lot', 'Overflow Lot', 'Service Bay', 'Offsite'],
  features: ['AC', 'Washer/Dryer', 'Solar Prep', 'Porch', 'Skirting', 'Appliances Included'],
  exampleInventory: [
    {
      stockNumber: 'RV-001',
      type: 'Fifth Wheel',
      condition: 'Used',
      status: 'Available',
      location: 'Main Lot',
      year: 2022,
      make: 'Forest River',
      model: 'Flagstaff 832IKRL'
    }
  ]
}

export default mockInventory