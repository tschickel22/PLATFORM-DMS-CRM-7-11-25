export const mockCrmSalesDeal = {
  dealStages: ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'],
  dealSources: ['Walk-in', 'Online', 'Referral', 'Trade Show', 'Phone Call', 'Email Campaign'],
  dealTypes: ['New Sale', 'Trade-in', 'Lease', 'Financing'],
  priorities: ['Low', 'Medium', 'High', 'Urgent'],
  
  defaultDeal: {
    stage: 'New',
    source: 'Online',
    type: 'New Sale',
    priority: 'Medium',
    amount: 0,
    expectedCloseDate: new Date().toISOString().split('T')[0],
    probability: 25
  },
  
  sampleDeals: [
    {
      id: 'deal-001',
      customerId: 'cust-001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '(555) 123-4567',
      vehicleId: 'veh-001',
      vehicleInfo: '2023 Forest River Cherokee 274RK',
      stage: 'Qualified',
      amount: 35000,
      source: 'Referral',
      type: 'New Sale',
      priority: 'High',
      repId: 'rep-001',
      repName: 'Jamie Closer',
      probability: 75,
      expectedCloseDate: '2024-02-15',
      createdAt: '2024-01-10T09:30:00Z',
      updatedAt: '2024-01-20T14:22:00Z',
      notes: 'Customer very interested, ready to move forward with financing',
      activities: [
        {
          id: 'activity-001',
          type: 'Call',
          description: 'Initial qualification call',
          date: '2024-01-10T10:00:00Z',
          userId: 'rep-001'
        },
        {
          id: 'activity-002',
          type: 'Meeting',
          description: 'Product demonstration',
          date: '2024-01-15T14:00:00Z',
          userId: 'rep-001'
        }
      ]
    },
    {
      id: 'deal-002',
      customerId: 'cust-002',
      customerName: 'Maria Rodriguez',
      customerEmail: 'maria.rodriguez@email.com',
      customerPhone: '(555) 987-6543',
      vehicleId: 'veh-002',
      vehicleInfo: '2024 Keystone Montana 3761FL',
      stage: 'Proposal Sent',
      amount: 62000,
      source: 'Trade Show',
      type: 'New Sale',
      priority: 'Medium',
      repId: 'rep-002',
      repName: 'Avery Seller',
      probability: 60,
      expectedCloseDate: '2024-02-28',
      createdAt: '2024-01-05T11:15:00Z',
      updatedAt: '2024-01-18T16:45:00Z',
      notes: 'Proposal sent, waiting for customer decision',
      activities: [
        {
          id: 'activity-003',
          type: 'Email',
          description: 'Sent detailed proposal',
          date: '2024-01-18T09:00:00Z',
          userId: 'rep-002'
        }
      ]
    },
    {
      id: 'deal-003',
      customerId: 'cust-003',
      customerName: 'David Johnson',
      customerEmail: 'david.johnson@email.com',
      customerPhone: '(555) 456-7890',
      vehicleId: 'veh-003',
      vehicleInfo: '2023 Grand Design Solitude 310GK',
      stage: 'Negotiation',
      amount: 48000,
      source: 'Online',
      type: 'Trade-in',
      priority: 'High',
      repId: 'rep-001',
      repName: 'Jamie Closer',
      probability: 85,
      expectedCloseDate: '2024-02-10',
      createdAt: '2024-01-08T13:20:00Z',
      updatedAt: '2024-01-22T10:30:00Z',
      notes: 'Negotiating trade-in value, close to agreement',
      activities: [
        {
          id: 'activity-004',
          type: 'Meeting',
          description: 'Trade-in appraisal',
          date: '2024-01-20T11:00:00Z',
          userId: 'rep-001'
        }
      ]
    }
  ],
  
  reps: [
    { 
      id: 'rep-001', 
      name: 'Jamie Closer',
      email: 'jamie.closer@company.com',
      phone: '(555) 111-2222',
      specialties: ['RV Sales', 'Financing']
    },
    { 
      id: 'rep-002', 
      name: 'Avery Seller',
      email: 'avery.seller@company.com',
      phone: '(555) 333-4444',
      specialties: ['Manufactured Homes', 'Trade-ins']
    },
    { 
      id: 'rep-003', 
      name: 'Morgan Deal',
      email: 'morgan.deal@company.com',
      phone: '(555) 555-6666',
      specialties: ['Luxury RVs', 'Commercial Sales']
    }
  ],
  
  stageColors: {
    'New': 'bg-gray-100 text-gray-800',
    'Qualified': 'bg-blue-100 text-blue-800',
    'Proposal Sent': 'bg-yellow-100 text-yellow-800',
    'Negotiation': 'bg-orange-100 text-orange-800',
    'Closed Won': 'bg-green-100 text-green-800',
    'Closed Lost': 'bg-red-100 text-red-800'
  },
  
  priorityColors: {
    'Low': 'bg-gray-100 text-gray-800',
    'Medium': 'bg-blue-100 text-blue-800',
    'High': 'bg-orange-100 text-orange-800',
    'Urgent': 'bg-red-100 text-red-800'
  },
  
  metrics: {
    totalDeals: 156,
    totalValue: 8750000,
    avgDealSize: 56089,
    conversionRate: 68.5,
    avgSalesCycle: 21, // days
    monthlyGrowth: 12.3,
    pipelineByStage: [
      { stage: 'New', count: 45, value: 2250000 },
      { stage: 'Qualified', count: 32, value: 1920000 },
      { stage: 'Proposal Sent', count: 18, value: 1260000 },
      { stage: 'Negotiation', count: 12, value: 960000 },
      { stage: 'Closed Won', count: 8, value: 520000 },
      { stage: 'Closed Lost', count: 5, value: 0 }
    ],
    monthlyPerformance: [
      { month: 'Jan', deals: 12, value: 720000 },
      { month: 'Feb', deals: 15, value: 900000 },
      { month: 'Mar', deals: 18, value: 1080000 },
      { month: 'Apr', deals: 14, value: 840000 },
      { month: 'May', deals: 20, value: 1200000 },
      { month: 'Jun', deals: 22, value: 1320000 }
    ]
  },
  
  approvalWorkflows: [
    {
      id: 'workflow-001',
      name: 'Standard Deal Approval',
      description: 'Default approval process for deals under $50k',
      stages: [
        { id: 'stage-001', name: 'Sales Manager Review', required: true, order: 1 },
        { id: 'stage-002', name: 'Finance Approval', required: true, order: 2 },
        { id: 'stage-003', name: 'General Manager Sign-off', required: false, order: 3 }
      ],
      conditions: {
        maxAmount: 50000,
        requiresTradeIn: false
      },
      isActive: true
    },
    {
      id: 'workflow-002',
      name: 'High Value Deal Approval',
      description: 'Enhanced approval process for deals over $50k',
      stages: [
        { id: 'stage-001', name: 'Sales Manager Review', required: true, order: 1 },
        { id: 'stage-002', name: 'Finance Approval', required: true, order: 2 },
        { id: 'stage-003', name: 'General Manager Sign-off', required: true, order: 3 },
        { id: 'stage-004', name: 'Owner Approval', required: true, order: 4 }
      ],
      conditions: {
        minAmount: 50000,
        requiresTradeIn: false
      },
      isActive: true
    }
  ],
  
  territories: [
    {
      id: 'territory-001',
      name: 'North Region',
      description: 'Northern counties and cities',
      repIds: ['rep-001', 'rep-003'],
      zipcodes: ['12345', '12346', '12347'],
      isActive: true
    },
    {
      id: 'territory-002',
      name: 'South Region',
      description: 'Southern counties and cities',
      repIds: ['rep-002'],
      zipcodes: ['54321', '54322', '54323'],
      isActive: true
    }
  ]
}

export default mockCrmSalesDeal