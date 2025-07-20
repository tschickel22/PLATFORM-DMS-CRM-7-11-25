export const mockCrmProspecting = {
  leadSources: ['Walk-In', 'Referral', 'Website', 'Phone Call', 'Social Media', 'Trade Show'],
  leadStatuses: ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'],
  preferredContactMethods: ['Phone', 'Email', 'Text'],
  tags: ['First-time Buyer', 'Investor', 'Out-of-State', 'Follow-up Needed'],
  pipelines: ['New Inquiry', 'In Progress', 'Negotiation', 'Closed Won', 'Closed Lost'],
  sequences: ['Initial Outreach', 'Second Touch', 'Final Attempt'],
  
  // Mock nurture sequence data
  nurtureSequences: [
    {
      id: 'seq-001',
      name: 'Initial Outreach',
      description: 'Welcome new leads and introduce our services',
      steps: [
        { id: 'step-001', type: 'email', delay: 0, subject: 'Welcome to our dealership!', template: 'welcome-email' },
        { id: 'step-002', type: 'sms', delay: 1, message: 'Thanks for your interest! Call us at (555) 123-4567', template: 'welcome-sms' },
        { id: 'step-003', type: 'email', delay: 3, subject: 'See our latest inventory', template: 'inventory-showcase' },
        { id: 'step-004', type: 'call', delay: 7, notes: 'Follow up call to discuss needs', template: 'discovery-call' }
      ],
      isActive: true
    },
    {
      id: 'seq-002',
      name: 'Second Touch',
      description: 'Re-engage leads who showed initial interest',
      steps: [
        { id: 'step-005', type: 'email', delay: 0, subject: 'Still looking for the perfect RV?', template: 'reengagement-email' },
        { id: 'step-006', type: 'sms', delay: 2, message: 'Special financing options available this month!', template: 'financing-sms' },
        { id: 'step-007', type: 'email', delay: 5, subject: 'Customer testimonials', template: 'testimonials-email' }
      ],
      isActive: true
    },
    {
      id: 'seq-003',
      name: 'Final Attempt',
      description: 'Last chance to convert before marking as lost',
      steps: [
        { id: 'step-008', type: 'email', delay: 0, subject: 'Last chance - exclusive offer inside', template: 'final-offer-email' },
        { id: 'step-009', type: 'call', delay: 3, notes: 'Personal call to address any concerns', template: 'final-call' }
      ],
      isActive: true
    }
  ],

  // Mock leads with nurture sequence data
  nurtureLeads: [
    {
      id: 'lead-001',
      firstName: 'John',
      lastName: 'Smith',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      source: 'Website',
      status: 'New',
      assignedTo: 'sales-rep-1',
      notes: 'Interested in Class A Motorhome, budget around $150k',
      score: 85,
      lastActivity: '2024-01-20T14:30:00Z',
      sequenceId: 'seq-001',
      sequenceStatus: 'active',
      sequenceStep: 2,
      sequenceType: 'email',
      nextSequenceAction: '2024-01-22T09:00:00Z',
      customFields: {
        pipelineStage: 'New Inquiry',
        estimatedValue: 150000,
        expectedCloseDate: '2024-03-15',
        vehicleType: 'Class A Motorhome',
        budget: 150000,
        timeframe: '3-6 months'
      },
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: 'lead-002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 987-6543',
      source: 'Referral',
      status: 'Contacted',
      assignedTo: 'sales-rep-2',
      notes: 'Looking for travel trailer for family trips, has financing pre-approval',
      score: 92,
      lastActivity: '2024-01-22T10:15:00Z',
      sequenceId: 'seq-002',
      sequenceStatus: 'paused',
      sequenceStep: 1,
      sequenceType: 'sms',
      nextSequenceAction: '2024-01-25T14:00:00Z',
      customFields: {
        pipelineStage: 'In Progress',
        estimatedValue: 45000,
        expectedCloseDate: '2024-02-28',
        vehicleType: 'Travel Trailer',
        budget: 50000,
        timeframe: '1-2 months'
      },
      createdAt: '2024-01-10T11:30:00Z',
      updatedAt: '2024-01-22T10:15:00Z'
    },
    {
      id: 'lead-003',
      firstName: 'Michael',
      lastName: 'Davis',
      name: 'Michael Davis',
      email: 'michael.davis@email.com',
      phone: '(555) 456-7890',
      source: 'Trade Show',
      status: 'Qualified',
      assignedTo: 'sales-rep-1',
      notes: 'Serious buyer, looking at Fifth Wheel options, cash purchase',
      score: 95,
      lastActivity: '2024-01-23T16:45:00Z',
      sequenceId: 'seq-003',
      sequenceStatus: 'completed',
      sequenceStep: 2,
      sequenceType: 'call',
      nextSequenceAction: null,
      customFields: {
        pipelineStage: 'Negotiation',
        estimatedValue: 85000,
        expectedCloseDate: '2024-02-15',
        vehicleType: 'Fifth Wheel',
        budget: 90000,
        timeframe: '2-4 weeks'
      },
      createdAt: '2024-01-08T14:20:00Z',
      updatedAt: '2024-01-23T16:45:00Z'
    },
    {
      id: 'lead-004',
      firstName: 'Lisa',
      lastName: 'Wilson',
      name: 'Lisa Wilson',
      email: 'lisa.wilson@email.com',
      phone: '(555) 234-5678',
      source: 'Social Media',
      status: 'New',
      assignedTo: 'sales-rep-3',
      notes: 'First-time RV buyer, needs education on different types',
      score: 78,
      lastActivity: '2024-01-21T13:20:00Z',
      sequenceId: null,
      sequenceStatus: null,
      sequenceStep: null,
      sequenceType: null,
      nextSequenceAction: null,
      customFields: {
        pipelineStage: 'New Inquiry',
        estimatedValue: 65000,
        expectedCloseDate: '2024-03-30',
        vehicleType: 'Class C Motorhome',
        budget: 70000,
        timeframe: '3-4 months'
      },
      createdAt: '2024-01-12T08:45:00Z',
      updatedAt: '2024-01-21T13:20:00Z'
    },
    {
      id: 'lead-005',
      firstName: 'Robert',
      lastName: 'Brown',
      name: 'Robert Brown',
      email: 'robert.brown@email.com',
      phone: '(555) 345-6789',
      source: 'Walk-In',
      status: 'Contacted',
      assignedTo: 'sales-rep-2',
      notes: 'Interested in travel trailer, comparing options',
      score: 88,
      lastActivity: '2024-01-19T15:30:00Z',
      sequenceId: 'seq-001',
      sequenceStatus: 'active',
      sequenceStep: 3,
      sequenceType: 'email',
      nextSequenceAction: '2024-01-24T10:00:00Z',
      customFields: {
        pipelineStage: 'In Progress',
        estimatedValue: 55000,
        expectedCloseDate: '2024-02-20',
        vehicleType: 'Travel Trailer',
        budget: 55000,
        timeframe: '1-2 months'
      },
      createdAt: '2024-01-05T10:15:00Z',
      updatedAt: '2024-01-19T15:30:00Z'
    },
    {
      id: 'lead-006',
      firstName: 'Jennifer',
      lastName: 'Garcia',
      name: 'Jennifer Garcia',
      email: 'jennifer.garcia@email.com',
      phone: '(555) 567-8901',
      source: 'Phone Call',
      status: 'New',
      assignedTo: 'sales-rep-1',
      notes: 'Interested in luxury motorhome for retirement travel',
      score: 82,
      lastActivity: '2024-01-18T12:00:00Z',
      sequenceId: 'seq-002',
      sequenceStatus: 'active',
      sequenceStep: 1,
      sequenceType: 'email',
      nextSequenceAction: '2024-01-23T11:00:00Z',
      customFields: {
        pipelineStage: 'New Inquiry',
        estimatedValue: 175000,
        expectedCloseDate: '2024-04-01',
        vehicleType: 'Class A Motorhome',
        budget: 180000,
        timeframe: '4-6 months'
      },
      createdAt: '2024-01-03T09:30:00Z',
      updatedAt: '2024-01-18T12:00:00Z'
    }
  ],

  // Mock pipeline leads data
  pipelineLeads: [
    {
      id: 'lead-001',
      firstName: 'John',
      lastName: 'Smith',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      source: 'Website',
      status: 'New',
      assignedTo: 'sales-rep-1',
      notes: 'Interested in Class A Motorhome, budget around $150k',
      score: 85,
      lastActivity: '2024-01-20T14:30:00Z',
      customFields: {
        pipelineStage: 'New Inquiry',
        estimatedValue: 150000,
        expectedCloseDate: '2024-03-15',
        vehicleType: 'Class A Motorhome',
        budget: 150000,
        timeframe: '3-6 months'
      },
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: 'lead-002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 987-6543',
      source: 'Referral',
      status: 'Contacted',
      assignedTo: 'sales-rep-2',
      notes: 'Looking for travel trailer for family trips, has financing pre-approval',
      score: 92,
      lastActivity: '2024-01-22T10:15:00Z',
      customFields: {
        pipelineStage: 'In Progress',
        estimatedValue: 45000,
        expectedCloseDate: '2024-02-28',
        vehicleType: 'Travel Trailer',
        budget: 50000,
        timeframe: '1-2 months'
      },
      createdAt: '2024-01-10T11:30:00Z',
      updatedAt: '2024-01-22T10:15:00Z'
    },
    {
      id: 'lead-003',
      firstName: 'Michael',
      lastName: 'Davis',
      name: 'Michael Davis',
      email: 'michael.davis@email.com',
      phone: '(555) 456-7890',
      source: 'Trade Show',
      status: 'Qualified',
      assignedTo: 'sales-rep-1',
      notes: 'Serious buyer, looking at Fifth Wheel options, cash purchase',
      score: 95,
      lastActivity: '2024-01-23T16:45:00Z',
      customFields: {
        pipelineStage: 'Negotiation',
        estimatedValue: 85000,
        expectedCloseDate: '2024-02-15',
        vehicleType: 'Fifth Wheel',
        budget: 90000,
        timeframe: '2-4 weeks'
      },
      createdAt: '2024-01-08T14:20:00Z',
      updatedAt: '2024-01-23T16:45:00Z'
    },
    {
      id: 'lead-004',
      firstName: 'Lisa',
      lastName: 'Wilson',
      name: 'Lisa Wilson',
      email: 'lisa.wilson@email.com',
      phone: '(555) 234-5678',
      source: 'Social Media',
      status: 'Qualified',
      assignedTo: 'sales-rep-3',
      notes: 'First-time RV buyer, needs education on different types',
      score: 78,
      lastActivity: '2024-01-21T13:20:00Z',
      customFields: {
        pipelineStage: 'In Progress',
        estimatedValue: 65000,
        expectedCloseDate: '2024-03-30',
        vehicleType: 'Class C Motorhome',
        budget: 70000,
        timeframe: '3-4 months'
      },
      createdAt: '2024-01-12T08:45:00Z',
      updatedAt: '2024-01-21T13:20:00Z'
    },
    {
      id: 'lead-005',
      firstName: 'Robert',
      lastName: 'Brown',
      name: 'Robert Brown',
      email: 'robert.brown@email.com',
      phone: '(555) 345-6789',
      source: 'Walk-In',
      status: 'Converted',
      assignedTo: 'sales-rep-2',
      notes: 'Purchased 2023 Forest River Cherokee, excellent experience',
      score: 100,
      lastActivity: '2024-01-19T15:30:00Z',
      customFields: {
        pipelineStage: 'Closed Won',
        estimatedValue: 55000,
        expectedCloseDate: '2024-01-19',
        vehicleType: 'Travel Trailer',
        budget: 55000,
        timeframe: 'Immediate'
      },
      createdAt: '2024-01-05T10:15:00Z',
      updatedAt: '2024-01-19T15:30:00Z'
    },
    {
      id: 'lead-006',
      firstName: 'Jennifer',
      lastName: 'Garcia',
      name: 'Jennifer Garcia',
      email: 'jennifer.garcia@email.com',
      phone: '(555) 567-8901',
      source: 'Phone Call',
      status: 'Lost',
      assignedTo: 'sales-rep-1',
      notes: 'Decided to go with competitor due to pricing',
      score: 45,
      lastActivity: '2024-01-18T12:00:00Z',
      customFields: {
        pipelineStage: 'Closed Lost',
        estimatedValue: 75000,
        expectedCloseDate: '2024-01-18',
        vehicleType: 'Class A Motorhome',
        budget: 75000,
        timeframe: '1-2 months'
      },
      createdAt: '2024-01-03T09:30:00Z',
      updatedAt: '2024-01-18T12:00:00Z'
    },
    {
      id: 'lead-007',
      firstName: 'David',
      lastName: 'Martinez',
      name: 'David Martinez',
      email: 'david.martinez@email.com',
      phone: '(555) 678-9012',
      source: 'Website',
      status: 'New',
      assignedTo: 'sales-rep-3',
      notes: 'Interested in toy hauler for motorcycle trips',
      score: 70,
      lastActivity: '2024-01-24T09:15:00Z',
      customFields: {
        pipelineStage: 'New Inquiry',
        estimatedValue: 95000,
        expectedCloseDate: '2024-04-15',
        vehicleType: 'Toy Hauler',
        budget: 100000,
        timeframe: '4-6 months'
      },
      createdAt: '2024-01-24T09:15:00Z',
      updatedAt: '2024-01-24T09:15:00Z'
    },
    {
      id: 'lead-008',
      firstName: 'Amanda',
      lastName: 'Taylor',
      name: 'Amanda Taylor',
      email: 'amanda.taylor@email.com',
      phone: '(555) 789-0123',
      source: 'Referral',
      status: 'Contacted',
      assignedTo: 'sales-rep-2',
      notes: 'Upgrading from tent camping, needs beginner-friendly option',
      score: 82,
      lastActivity: '2024-01-23T11:45:00Z',
      customFields: {
        pipelineStage: 'In Progress',
        estimatedValue: 35000,
        expectedCloseDate: '2024-03-01',
        vehicleType: 'Travel Trailer',
        budget: 40000,
        timeframe: '2-3 months'
      },
      createdAt: '2024-01-16T14:30:00Z',
      updatedAt: '2024-01-23T11:45:00Z'
    },
    {
      id: 'lead-009',
      firstName: 'Christopher',
      lastName: 'Anderson',
      name: 'Christopher Anderson',
      email: 'chris.anderson@email.com',
      phone: '(555) 890-1234',
      source: 'Trade Show',
      status: 'Qualified',
      assignedTo: 'sales-rep-1',
      notes: 'Looking for luxury fifth wheel, high-end features required',
      score: 88,
      lastActivity: '2024-01-22T14:20:00Z',
      customFields: {
        pipelineStage: 'Negotiation',
        estimatedValue: 125000,
        expectedCloseDate: '2024-02-20',
        vehicleType: 'Fifth Wheel',
        budget: 130000,
        timeframe: '3-4 weeks'
      },
      createdAt: '2024-01-09T16:00:00Z',
      updatedAt: '2024-01-22T14:20:00Z'
    },
    {
      id: 'lead-010',
      firstName: 'Michelle',
      lastName: 'Thomas',
      name: 'Michelle Thomas',
      email: 'michelle.thomas@email.com',
      phone: '(555) 901-2345',
      source: 'Website',
      status: 'New',
      assignedTo: 'sales-rep-3',
      notes: 'Retirement planning, looking for full-time living option',
      score: 75,
      lastActivity: '2024-01-25T08:30:00Z',
      customFields: {
        pipelineStage: 'New Inquiry',
        estimatedValue: 180000,
        expectedCloseDate: '2024-05-01',
        vehicleType: 'Class A Motorhome',
        budget: 200000,
        timeframe: '6+ months'
      },
      createdAt: '2024-01-25T08:30:00Z',
      updatedAt: '2024-01-25T08:30:00Z'
    }
  ]
}

export default mockCrmProspecting