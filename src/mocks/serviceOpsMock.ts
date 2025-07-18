export const mockServiceOps = {
  defaultStatuses: [
    'Open',
    'In Progress', 
    'Waiting for Parts',
    'Customer Review',
    'Completed',
    'Cancelled'
  ],

  formDefaults: {
    title: '',
    description: '',
    category: 'Maintenance',
    priority: 'Medium',
    status: 'Open',
    assignedTo: '',
    customerId: '',
    vehicleId: '',
    scheduledDate: '',
    estimatedHours: 2,
    notes: ''
  },

  categoryOptions: [
    'Maintenance',
    'Repair',
    'Inspection',
    'Warranty',
    'Installation',
    'Emergency'
  ],

  priorityOptions: [
    'Low',
    'Medium', 
    'High',
    'Urgent'
  ],

  technicianOptions: [
    { id: 'tech-001', name: 'Mike Johnson', specialties: ['Electrical', 'Plumbing'] },
    { id: 'tech-002', name: 'Sarah Davis', specialties: ['HVAC', 'Appliances'] },
    { id: 'tech-003', name: 'Tom Wilson', specialties: ['Structural', 'Roofing'] },
    { id: 'tech-004', name: 'Lisa Chen', specialties: ['General Maintenance'] }
  ],

  sampleTickets: [
    {
      id: 'ticket-001',
      title: 'AC Unit Not Cooling Properly',
      description: 'Customer reports that the air conditioning unit is running but not cooling the home effectively. Temperature differential is only 5 degrees.',
      category: 'Repair',
      priority: 'High',
      status: 'In Progress',
      customerId: 'cust-001',
      customerName: 'John Smith',
      customerPhone: '(555) 123-4567',
      customerEmail: 'john.smith@email.com',
      vehicleId: 'vh-001',
      vehicleInfo: '2020 Forest River Cherokee 274RK',
      assignedTo: 'tech-002',
      assignedTechName: 'Sarah Davis',
      scheduledDate: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-12T09:30:00Z',
      updatedAt: '2024-01-14T14:20:00Z',
      estimatedHours: 4,
      actualHours: 2.5,
      parts: [
        { id: 'part-001', name: 'AC Capacitor', quantity: 1, cost: 45.99 },
        { id: 'part-002', name: 'Refrigerant R410A', quantity: 2, cost: 89.50 }
      ],
      labor: [
        { id: 'labor-001', description: 'Diagnostic and testing', hours: 1, rate: 85.00 },
        { id: 'labor-002', description: 'Capacitor replacement', hours: 1.5, rate: 85.00 }
      ],
      timeline: [
        {
          id: 'timeline-001',
          timestamp: '2024-01-12T09:30:00Z',
          action: 'Ticket Created',
          user: 'System',
          details: 'Service ticket created by customer portal'
        },
        {
          id: 'timeline-002', 
          timestamp: '2024-01-12T11:15:00Z',
          action: 'Assigned',
          user: 'Manager',
          details: 'Assigned to Sarah Davis - HVAC specialist'
        },
        {
          id: 'timeline-003',
          timestamp: '2024-01-14T10:00:00Z',
          action: 'Status Updated',
          user: 'Sarah Davis',
          details: 'Started diagnostic work - found faulty capacitor'
        },
        {
          id: 'timeline-004',
          timestamp: '2024-01-14T14:20:00Z',
          action: 'Parts Ordered',
          user: 'Sarah Davis', 
          details: 'Ordered replacement capacitor and refrigerant'
        }
      ],
      notes: 'Customer mentioned the issue started about a week ago. Unit is 3 years old, still under extended warranty for parts.',
      totalCost: 347.49,
      customerApproved: true
    },
    {
      id: 'ticket-002',
      title: 'Annual Safety Inspection',
      description: 'Scheduled annual safety inspection including electrical, plumbing, and structural components.',
      category: 'Inspection',
      priority: 'Medium',
      status: 'Completed',
      customerId: 'cust-002',
      customerName: 'Maria Rodriguez',
      customerPhone: '(555) 987-6543',
      customerEmail: 'maria.rodriguez@email.com',
      vehicleId: 'vh-002',
      vehicleInfo: '2019 Keystone Montana 3761FL',
      assignedTo: 'tech-003',
      assignedTechName: 'Tom Wilson',
      scheduledDate: '2024-01-10T08:00:00Z',
      createdAt: '2024-01-05T16:45:00Z',
      updatedAt: '2024-01-10T16:30:00Z',
      estimatedHours: 3,
      actualHours: 2.5,
      parts: [],
      labor: [
        { id: 'labor-003', description: 'Complete safety inspection', hours: 2.5, rate: 75.00 }
      ],
      timeline: [
        {
          id: 'timeline-005',
          timestamp: '2024-01-05T16:45:00Z',
          action: 'Ticket Created',
          user: 'System',
          details: 'Annual inspection scheduled'
        },
        {
          id: 'timeline-006',
          timestamp: '2024-01-08T09:00:00Z',
          action: 'Assigned',
          user: 'Manager',
          details: 'Assigned to Tom Wilson for structural inspection'
        },
        {
          id: 'timeline-007',
          timestamp: '2024-01-10T08:00:00Z',
          action: 'Started',
          user: 'Tom Wilson',
          details: 'Beginning comprehensive safety inspection'
        },
        {
          id: 'timeline-008',
          timestamp: '2024-01-10T16:30:00Z',
          action: 'Completed',
          user: 'Tom Wilson',
          details: 'Inspection completed - all systems passed'
        }
      ],
      notes: 'All safety systems checked and verified. Minor recommendation to replace smoke detector batteries within 6 months.',
      totalCost: 187.50,
      customerApproved: true
    }
  ],

  statusColors: {
    'Open': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800', 
    'Waiting for Parts': 'bg-orange-100 text-orange-800',
    'Customer Review': 'bg-purple-100 text-purple-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  },

  priorityColors: {
    'Low': 'bg-gray-100 text-gray-800',
    'Medium': 'bg-blue-100 text-blue-800',
    'High': 'bg-orange-100 text-orange-800', 
    'Urgent': 'bg-red-100 text-red-800'
  }
}

export default mockServiceOps