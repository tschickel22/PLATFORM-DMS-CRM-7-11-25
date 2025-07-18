export const mockPlatformAdmin = {
  tenantRoles: [
    { value: 'admin', label: 'Admin', description: 'Full access to all features' },
    { value: 'manager', label: 'Manager', description: 'Manage users and settings' },
    { value: 'sales', label: 'Sales', description: 'Access to CRM and quotes' },
    { value: 'service', label: 'Service', description: 'Access to service operations' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access' }
  ],

  defaultPermissions: {
    crm: { read: true, write: true, delete: false },
    inventory: { read: true, write: true, delete: false },
    quotes: { read: true, write: true, delete: false },
    agreements: { read: true, write: false, delete: false },
    service: { read: true, write: true, delete: false },
    delivery: { read: true, write: true, delete: false },
    commissions: { read: true, write: false, delete: false },
    portal: { read: true, write: false, delete: false },
    invoices: { read: true, write: true, delete: false },
    reports: { read: true, write: false, delete: false }
  },

  usageStats: {
    totalTenants: 247,
    activeTenants: 189,
    totalUsers: 1456,
    activeUsers: 892,
    monthlyGrowth: 12.5,
    storageUsed: 2.4, // TB
    apiCalls: 1250000,
    uptime: 99.9,
    chartData: {
      tenantGrowth: [
        { month: 'Jan', tenants: 180, users: 720 },
        { month: 'Feb', tenants: 195, users: 810 },
        { month: 'Mar', tenants: 210, users: 920 },
        { month: 'Apr', tenants: 225, users: 1050 },
        { month: 'May', tenants: 235, users: 1180 },
        { month: 'Jun', tenants: 247, users: 1456 }
      ],
      apiUsage: [
        { date: '2024-01-01', calls: 45000 },
        { date: '2024-01-02', calls: 52000 },
        { date: '2024-01-03', calls: 48000 },
        { date: '2024-01-04', calls: 61000 },
        { date: '2024-01-05', calls: 55000 },
        { date: '2024-01-06', calls: 58000 },
        { date: '2024-01-07', calls: 49000 }
      ]
    }
  },

  sampleTenants: [
    {
      id: 'tenant-001',
      name: 'Sunshine RV Dealership',
      domain: 'sunshine-rv.renterinsight.com',
      platformType: 'RV',
      status: 'Active',
      createdAt: '2023-06-15T10:30:00Z',
      lastActivity: '2024-01-20T14:22:00Z',
      userCount: 12,
      storageUsed: 1.2, // GB
      monthlyApiCalls: 45000,
      subscription: {
        plan: 'Professional',
        status: 'Active',
        nextBilling: '2024-02-15T00:00:00Z',
        amount: 299
      },
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        features: {
          crm: true,
          inventory: true,
          quotes: true,
          agreements: true,
          service: true,
          delivery: true,
          commissions: true,
          portal: true,
          invoices: true,
          reports: true
        }
      },
      auditTrail: [
        {
          id: 'audit-001',
          timestamp: '2024-01-20T14:22:00Z',
          action: 'User Login',
          user: 'admin@sunshine-rv.com',
          details: 'Successful login from IP 192.168.1.100',
          module: 'Authentication'
        },
        {
          id: 'audit-002',
          timestamp: '2024-01-20T13:45:00Z',
          action: 'Lead Created',
          user: 'sales@sunshine-rv.com',
          details: 'New lead: John Smith - Website inquiry',
          module: 'CRM'
        },
        {
          id: 'audit-003',
          timestamp: '2024-01-20T12:30:00Z',
          action: 'Quote Generated',
          user: 'sales@sunshine-rv.com',
          details: 'Quote Q-2024-001 generated for customer ID: cust-123',
          module: 'Quotes'
        },
        {
          id: 'audit-004',
          timestamp: '2024-01-20T11:15:00Z',
          action: 'Settings Updated',
          user: 'admin@sunshine-rv.com',
          details: 'Updated business hours configuration',
          module: 'Settings'
        }
      ]
    },
    {
      id: 'tenant-002',
      name: 'Mountain View Manufactured Homes',
      domain: 'mountainview-mh.renterinsight.com',
      platformType: 'MH',
      status: 'Active',
      createdAt: '2023-08-22T09:15:00Z',
      lastActivity: '2024-01-19T16:45:00Z',
      userCount: 8,
      storageUsed: 0.8, // GB
      monthlyApiCalls: 28000,
      subscription: {
        plan: 'Standard',
        status: 'Active',
        nextBilling: '2024-02-22T00:00:00Z',
        amount: 199
      },
      settings: {
        timezone: 'America/Denver',
        currency: 'USD',
        features: {
          crm: true,
          inventory: true,
          quotes: true,
          agreements: false,
          service: true,
          delivery: true,
          commissions: false,
          portal: false,
          invoices: true,
          reports: true
        }
      },
      auditTrail: [
        {
          id: 'audit-005',
          timestamp: '2024-01-19T16:45:00Z',
          action: 'Inventory Updated',
          user: 'manager@mountainview-mh.com',
          details: 'Added new manufactured home: Stock #MH-2024-001',
          module: 'Inventory'
        },
        {
          id: 'audit-006',
          timestamp: '2024-01-19T15:20:00Z',
          action: 'Service Ticket Created',
          user: 'service@mountainview-mh.com',
          details: 'Service ticket ST-001 created for customer maintenance',
          module: 'Service'
        }
      ]
    }
  ],

  platformTypes: [
    { value: 'RV', label: 'RV Dealership' },
    { value: 'MH', label: 'Manufactured Housing' },
    { value: 'RV & MH', label: 'RV & Manufactured Housing' },
    { value: 'Auto', label: 'Auto Dealership' }
  ],

  subscriptionPlans: [
    {
      id: 'starter',
      name: 'Starter',
      price: 99,
      features: ['Up to 5 users', 'Basic CRM', 'Inventory management', 'Email support']
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 199,
      features: ['Up to 15 users', 'Full CRM', 'Quote builder', 'Service ops', 'Phone support']
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 299,
      features: ['Up to 50 users', 'All features', 'API access', 'Custom integrations', 'Priority support']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 499,
      features: ['Unlimited users', 'White-label', 'Advanced analytics', 'Dedicated support', 'Custom development']
    }
  ],

  systemHealth: {
    status: 'Healthy',
    uptime: 99.9,
    responseTime: 145, // ms
    errorRate: 0.02, // %
    services: [
      { name: 'API Gateway', status: 'Healthy', responseTime: 120 },
      { name: 'Database', status: 'Healthy', responseTime: 45 },
      { name: 'File Storage', status: 'Healthy', responseTime: 89 },
      { name: 'Email Service', status: 'Warning', responseTime: 250 },
      { name: 'SMS Service', status: 'Healthy', responseTime: 180 }
    ]
  }
}

export default mockPlatformAdmin