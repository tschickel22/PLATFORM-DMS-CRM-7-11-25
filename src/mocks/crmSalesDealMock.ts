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
  
}

export default mockCrmSalesDeal