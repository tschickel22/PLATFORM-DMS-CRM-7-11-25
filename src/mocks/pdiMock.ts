export const mockPDI = {
  checklistStatuses: [
    'Not Started',
    'In Progress', 
    'Complete',
    'Failed',
    'Pending Review',
    'Approved'
  ],

  sampleInspections: [
    {
      id: 'pdi-001',
      unitId: 'unit-001',
      unitInfo: '2023 Forest River Cherokee 274RK',
      stockNumber: 'RV-2023-001',
      vin: '1FUJBBCK5NLBXXXXX',
      technicianId: 'tech-001',
      technicianName: 'Mike Johnson',
      status: 'Complete',
      templateId: 'template-rv-standard',
      templateName: 'Standard RV PDI',
      startedDate: '2024-01-15T08:00:00Z',
      completedDate: '2024-01-15T14:30:00Z',
      findings: [
        {
          category: 'Exterior',
          item: 'Body Condition',
          status: 'Pass',
          notes: 'No visible damage or defects'
        },
        {
          category: 'Interior',
          item: 'Appliances',
          status: 'Fail',
          notes: 'Refrigerator not cooling properly - needs service'
        },
        {
          category: 'Electrical',
          item: '12V Systems',
          status: 'Pass',
          notes: 'All lights and outlets functioning'
        },
        {
          category: 'Plumbing',
          item: 'Water System',
          status: 'Pass',
          notes: 'No leaks detected, pressure test passed'
        }
      ],
      overallNotes: 'Unit ready for delivery pending refrigerator repair. Estimated 2-day delay.',
      customerNotified: true,
      deliveryApproved: false,
      photos: [
        { id: 'photo-001', category: 'Exterior', description: 'Front view', url: '/mock/pdi-photo-1.jpg' },
        { id: 'photo-002', category: 'Interior', description: 'Kitchen area', url: '/mock/pdi-photo-2.jpg' }
      ]
    },
    {
      id: 'pdi-002',
      unitId: 'unit-002',
      unitInfo: '2024 Keystone Montana 3761FL',
      stockNumber: 'RV-2024-005',
      vin: '4X4TWHBK5PNxxxxxx',
      technicianId: 'tech-002',
      technicianName: 'Sarah Davis',
      status: 'In Progress',
      templateId: 'template-fifthwheel',
      templateName: 'Fifth Wheel PDI',
      startedDate: '2024-01-16T09:00:00Z',
      completedDate: null,
      findings: [
        {
          category: 'Exterior',
          item: 'Slide-out Operation',
          status: 'Pass',
          notes: 'All slides operate smoothly'
        },
        {
          category: 'Interior',
          item: 'HVAC System',
          status: 'Pass',
          notes: 'AC and furnace both operational'
        }
      ],
      overallNotes: 'Inspection in progress - approximately 60% complete',
      customerNotified: false,
      deliveryApproved: false,
      photos: []
    }
  ],

  formDefaults: {
    unitId: '',
    technicianId: '',
    templateId: 'template-rv-standard',
    status: 'Not Started',
    startedDate: '',
    notes: '',
    customerNotified: false,
    deliveryApproved: false
  },

  templateOptions: [
    {
      id: 'template-rv-standard',
      name: 'Standard RV PDI',
      description: 'Comprehensive inspection for travel trailers and motorhomes',
      unitTypes: ['Travel Trailer', 'Motorhome', 'Toy Hauler']
    },
    {
      id: 'template-fifthwheel',
      name: 'Fifth Wheel PDI',
      description: 'Specialized inspection for fifth wheel trailers',
      unitTypes: ['Fifth Wheel']
    },
    {
      id: 'template-manufactured-home',
      name: 'Manufactured Home PDI',
      description: 'Complete inspection for manufactured housing units',
      unitTypes: ['Single Wide', 'Double Wide', 'Triple Wide']
    },
    {
      id: 'template-park-model',
      name: 'Park Model PDI',
      description: 'Inspection checklist for park model homes',
      unitTypes: ['Park Model']
    }
  ],

  inspectionCategories: [
    {
      id: 'exterior',
      name: 'Exterior',
      items: [
        'Body Condition',
        'Paint/Graphics',
        'Windows/Doors',
        'Awnings',
        'Slide-out Operation',
        'Tires/Wheels',
        'Hitch/Coupling',
        'Exterior Lights',
        'Storage Compartments'
      ]
    },
    {
      id: 'interior',
      name: 'Interior',
      items: [
        'Flooring',
        'Walls/Ceiling',
        'Furniture/Cabinetry',
        'Appliances',
        'Window Treatments',
        'Interior Lights',
        'Safety Equipment',
        'Entertainment Systems'
      ]
    },
    {
      id: 'electrical',
      name: 'Electrical',
      items: [
        '12V Systems',
        '120V Systems',
        'Battery Condition',
        'Converter/Inverter',
        'Solar System',
        'Generator',
        'Shore Power Connection',
        'GFCI Outlets'
      ]
    },
    {
      id: 'plumbing',
      name: 'Plumbing',
      items: [
        'Water System',
        'Hot Water Heater',
        'Toilet Operation',
        'Shower/Tub',
        'Kitchen Sink',
        'Water Pump',
        'Holding Tanks',
        'Exterior Water Connection'
      ]
    },
    {
      id: 'hvac',
      name: 'HVAC',
      items: [
        'Air Conditioning',
        'Furnace Operation',
        'Ventilation Fans',
        'Thermostat',
        'Ductwork',
        'Filters',
        'Vents/Returns'
      ]
    },
    {
      id: 'safety',
      name: 'Safety & Compliance',
      items: [
        'Smoke Detectors',
        'Carbon Monoxide Detector',
        'Fire Extinguisher',
        'Emergency Exits',
        'Propane System',
        'Brake System',
        'Safety Chains',
        'Compliance Labels'
      ]
    }
  ],

  technicianOptions: [
    { id: 'tech-001', name: 'Mike Johnson', specialties: ['Electrical', 'Plumbing'] },
    { id: 'tech-002', name: 'Sarah Davis', specialties: ['HVAC', 'Appliances'] },
    { id: 'tech-003', name: 'Tom Wilson', specialties: ['Structural', 'Exterior'] },
    { id: 'tech-004', name: 'Lisa Chen', specialties: ['Interior', 'Safety'] }
  ],

  statusColors: {
    'Not Started': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Complete': 'bg-green-100 text-green-800',
    'Failed': 'bg-red-100 text-red-800',
    'Pending Review': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-emerald-100 text-emerald-800'
  },

  findingStatusColors: {
    'Pass': 'bg-green-100 text-green-800',
    'Fail': 'bg-red-100 text-red-800',
    'N/A': 'bg-gray-100 text-gray-800',
    'Pending': 'bg-yellow-100 text-yellow-800'
  },

  sampleSettings: [
    {
      id: 'setting-001',
      company_id: 'tenant-1',
      key: 'default_inspection_status',
      value: 'not_started',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'setting-002',
      company_id: 'tenant-1',
      key: 'allow_custom_steps',
      value: 'true',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'setting-003',
      company_id: 'tenant-1',
      key: 'require_technician_signature',
      value: 'false',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'setting-004',
      company_id: 'tenant-1',
      key: 'auto_complete_on_all_pass',
      value: 'true',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ],

  settingDefinitions: {
    'default_inspection_status': {
      label: 'Default Inspection Status',
      description: 'The default status for new PDI inspections',
      type: 'select',
      options: ['not_started', 'in_progress', 'complete', 'failed', 'pending_review', 'approved']
    },
    'allow_custom_steps': {
      label: 'Allow Custom Steps',
      description: 'Allow technicians to add custom checklist steps during inspection',
      type: 'boolean'
    },
    'require_technician_signature': {
      label: 'Require Technician Signature',
      description: 'Require digital signature from technician to complete inspection',
      type: 'boolean'
    },
    'auto_complete_on_all_pass': {
      label: 'Auto-Complete on All Pass',
      description: 'Automatically mark inspection as complete when all steps pass',
      type: 'boolean'
    }
  }
}

export default mockPDI