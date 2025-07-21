import { LandAsset } from '@/modules/inventory-management/models/LandAsset'

export const mockLandAssets = {
  sampleLandAssets: [
    {
      id: 'land-001',
      label: 'Sunset Ridge Lot 15',
      parcelNumber: 'SR-015-2024',
      address: '1500 Sunset Ridge Drive, Lot 15, Clearwater, FL 33755',
      lotSizeSqFt: 8500,
      zoningType: 'Residential Mobile Home',
      utilityStatus: 'Full Hookups Available',
      ownershipStatus: 'Dealer-Owned',
      linkedInventoryId: null,
      pricing: {
        salePrice: 45000,
        leaseRate: 850,
        rentToOwn: true
      },
      status: 'Available',
      createdAt: '2024-01-10T09:30:00Z',
      updatedAt: '2024-01-15T14:22:00Z'
    },
    {
      id: 'land-002',
      label: 'Pine Valley Community Lot 8',
      parcelNumber: 'PV-008-2024',
      address: '2200 Pine Valley Road, Lot 8, Lakeland, FL 33801',
      lotSizeSqFt: 12000,
      zoningType: 'Manufactured Housing',
      utilityStatus: 'Electric & Water Ready',
      ownershipStatus: 'Third-Party',
      linkedInventoryId: 'vh-002',
      pricing: {
        salePrice: 62000,
        leaseRate: 1200,
        rentToOwn: false
      },
      status: 'Bundled',
      createdAt: '2024-01-05T11:15:00Z',
      updatedAt: '2024-01-18T16:45:00Z'
    },
    {
      id: 'land-003',
      label: 'Oak Grove Estate Lot 22',
      parcelNumber: 'OG-022-2024',
      address: '3300 Oak Grove Boulevard, Lot 22, Tampa, FL 33612',
      lotSizeSqFt: 10500,
      zoningType: 'Single Family Residential',
      utilityStatus: 'Full Utilities Connected',
      ownershipStatus: 'Dealer-Owned',
      linkedInventoryId: null,
      pricing: {
        salePrice: 78000,
        leaseRate: 1450,
        rentToOwn: true
      },
      status: 'Available',
      createdAt: '2024-01-08T13:20:00Z',
      updatedAt: '2024-01-22T10:30:00Z'
    },
    {
      id: 'land-004',
      label: 'Meadowbrook Park Lot 5',
      parcelNumber: 'MB-005-2024',
      address: '4400 Meadowbrook Parkway, Lot 5, Orlando, FL 32801',
      lotSizeSqFt: 7200,
      zoningType: 'Mobile Home Park',
      utilityStatus: 'Sewer Connection Pending',
      ownershipStatus: 'Leased',
      linkedInventoryId: null,
      pricing: {
        salePrice: null,
        leaseRate: 750,
        rentToOwn: false
      },
      status: 'Available',
      createdAt: '2024-01-12T08:45:00Z',
      updatedAt: '2024-01-20T15:30:00Z'
    },
    {
      id: 'land-005',
      label: 'Heritage Hills Lot 31',
      parcelNumber: 'HH-031-2024',
      address: '5500 Heritage Hills Circle, Lot 31, St. Petersburg, FL 33710',
      lotSizeSqFt: 9800,
      zoningType: 'Planned Unit Development',
      utilityStatus: 'All Utilities Active',
      ownershipStatus: 'Dealer-Owned',
      linkedInventoryId: 'vh-001',
      pricing: {
        salePrice: 55000,
        leaseRate: 1050,
        rentToOwn: true
      },
      status: 'Bundled',
      createdAt: '2024-01-03T16:00:00Z',
      updatedAt: '2024-01-25T12:15:00Z'
    },
    {
      id: 'land-006',
      label: 'Riverside Commons Lot 12',
      parcelNumber: 'RC-012-2024',
      address: '6600 Riverside Drive, Lot 12, Jacksonville, FL 32207',
      lotSizeSqFt: 11200,
      zoningType: 'Residential',
      utilityStatus: 'Gas Line Installation Required',
      ownershipStatus: 'Third-Party',
      linkedInventoryId: null,
      pricing: {
        salePrice: 68000,
        leaseRate: 1300,
        rentToOwn: false
      },
      status: 'Available',
      createdAt: '2024-01-15T10:20:00Z',
      updatedAt: '2024-01-23T09:45:00Z'
    }
  ] as LandAsset[],

  zoningTypes: [
    'Residential Mobile Home',
    'Manufactured Housing',
    'Single Family Residential',
    'Mobile Home Park',
    'Planned Unit Development',
    'Residential',
    'Mixed Use',
    'Commercial'
  ],

  utilityStatuses: [
    'Full Hookups Available',
    'Electric & Water Ready',
    'Full Utilities Connected',
    'Sewer Connection Pending',
    'All Utilities Active',
    'Gas Line Installation Required',
    'Utilities Not Connected',
    'Partial Utilities Available'
  ],

  ownershipStatuses: [
    'Dealer-Owned',
    'Third-Party',
    'Leased'
  ],

  landStatuses: [
    'Available',
    'Bundled',
    'Sold',
    'Archived'
  ],

  statusColors: {
    'Available': 'bg-green-100 text-green-800',
    'Bundled': 'bg-blue-100 text-blue-800',
    'Sold': 'bg-gray-100 text-gray-800',
    'Archived': 'bg-red-100 text-red-800'
  },

  ownershipColors: {
    'Dealer-Owned': 'bg-emerald-100 text-emerald-800',
    'Third-Party': 'bg-orange-100 text-orange-800',
    'Leased': 'bg-purple-100 text-purple-800'
  },

  formDefaults: {
    label: '',
    parcelNumber: '',
    address: '',
    lotSizeSqFt: undefined,
    zoningType: 'Residential Mobile Home',
    utilityStatus: 'Full Hookups Available',
    ownershipStatus: 'Dealer-Owned' as const,
    pricing: {
      salePrice: undefined,
      leaseRate: undefined,
      rentToOwn: false
    },
    status: 'Available' as const
  }
}

export default mockLandAssets