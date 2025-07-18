export const mockReportingSuite = {
  availableReports: [
    { 
      id: 'finance-summary', 
      name: 'Finance Summary',
      description: 'Overview of financial performance and loan metrics',
      category: 'Finance'
    },
    { 
      id: 'inventory-status', 
      name: 'Inventory Status',
      description: 'Current inventory levels and vehicle availability',
      category: 'Inventory'
    },
    { 
      id: 'quote-conversions', 
      name: 'Quote Conversions',
      description: 'Quote generation and conversion rates',
      category: 'Sales'
    },
    { 
      id: 'service-performance', 
      name: 'Service Ticket Performance',
      description: 'Service ticket resolution times and customer satisfaction',
      category: 'Service'
    },
    { 
      id: 'delivery-timelines', 
      name: 'Delivery Timelines',
      description: 'Delivery scheduling and completion metrics',
      category: 'Operations'
    },
    {
      id: 'crm-pipeline',
      name: 'CRM Pipeline Analysis',
      description: 'Lead progression and sales pipeline performance',
      category: 'CRM'
    },
    {
      id: 'commission-summary',
      name: 'Commission Summary',
      description: 'Sales team commission tracking and payouts',
      category: 'Finance'
    },
    {
      id: 'customer-satisfaction',
      name: 'Customer Satisfaction',
      description: 'Customer feedback and satisfaction scores',
      category: 'Service'
    }
  ],

  reportCategories: [
    'All',
    'Finance',
    'Inventory', 
    'Sales',
    'Service',
    'Operations',
    'CRM'
  ],

  timeRangeOptions: [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ],

  chartTypes: [
    { value: 'bar', label: 'Bar Chart', icon: 'BarChart3' },
    { value: 'line', label: 'Line Chart', icon: 'LineChart' },
    { value: 'pie', label: 'Pie Chart', icon: 'PieChart' },
    { value: 'numberCard', label: 'Number Cards', icon: 'Hash' },
    { value: 'table', label: 'Data Table', icon: 'Table' }
  ],

  exportFormats: [
    { value: 'pdf', label: 'PDF', icon: 'FileText' },
    { value: 'excel', label: 'Excel', icon: 'FileSpreadsheet' },
    { value: 'csv', label: 'CSV', icon: 'Download' }
  ],

  sampleReportResults: {
    'finance-summary': {
      chartType: 'bar',
      title: 'Monthly Revenue',
      data: [
        { label: 'Jan', value: 125000, color: '#3b82f6' },
        { label: 'Feb', value: 158000, color: '#3b82f6' },
        { label: 'Mar', value: 143000, color: '#3b82f6' },
        { label: 'Apr', value: 167000, color: '#3b82f6' },
        { label: 'May', value: 189000, color: '#3b82f6' },
        { label: 'Jun', value: 201000, color: '#3b82f6' }
      ],
      summary: {
        totalRevenue: 1083000,
        averageMonthly: 180500,
        growth: 12.5
      }
    },

    'inventory-status': {
      chartType: 'pie',
      title: 'Inventory by Status',
      data: [
        { label: 'Available', value: 45, color: '#10b981' },
        { label: 'Pending', value: 12, color: '#f59e0b' },
        { label: 'Sold', value: 28, color: '#3b82f6' },
        { label: 'Service', value: 8, color: '#ef4444' }
      ],
      summary: {
        totalUnits: 93,
        availableUnits: 45,
        utilizationRate: 51.6
      }
    },

    'quote-conversions': {
      chartType: 'numberCard',
      title: 'Quote Performance',
      data: [
        { label: 'Quotes Sent', value: 48, trend: '+12%', color: 'blue' },
        { label: 'Quotes Accepted', value: 32, trend: '+8%', color: 'green' },
        { label: 'Conversion Rate', value: '66.7%', trend: '+2.1%', color: 'green' },
        { label: 'Avg Quote Value', value: '$45,250', trend: '+5%', color: 'blue' }
      ],
      summary: {
        totalQuotes: 48,
        acceptedQuotes: 32,
        conversionRate: 66.7
      }
    },

    'service-performance': {
      chartType: 'line',
      title: 'Service Ticket Resolution',
      data: [
        { label: 'Week 1', value: 24, color: '#3b82f6' },
        { label: 'Week 2', value: 31, color: '#3b82f6' },
        { label: 'Week 3', value: 28, color: '#3b82f6' },
        { label: 'Week 4', value: 35, color: '#3b82f6' }
      ],
      summary: {
        totalTickets: 118,
        avgResolutionTime: 2.3,
        customerSatisfaction: 4.6
      }
    },

    'delivery-timelines': {
      chartType: 'bar',
      title: 'Delivery Performance',
      data: [
        { label: 'On Time', value: 78, color: '#10b981' },
        { label: 'Delayed', value: 12, color: '#f59e0b' },
        { label: 'Cancelled', value: 3, color: '#ef4444' }
      ],
      summary: {
        totalDeliveries: 93,
        onTimeRate: 83.9,
        avgDeliveryTime: 5.2
      }
    },

    'crm-pipeline': {
      chartType: 'bar',
      title: 'Sales Pipeline',
      data: [
        { label: 'New Leads', value: 45, color: '#6366f1' },
        { label: 'Qualified', value: 32, color: '#8b5cf6' },
        { label: 'Proposal', value: 18, color: '#a855f7' },
        { label: 'Negotiation', value: 12, color: '#c084fc' },
        { label: 'Closed Won', value: 8, color: '#10b981' }
      ],
      summary: {
        totalLeads: 115,
        conversionRate: 7.0,
        avgDealSize: 52000
      }
    }
  },

  dashboardWidgets: [
    {
      id: 'revenue-trend',
      title: 'Revenue Trend',
      type: 'line',
      size: 'large',
      reportId: 'finance-summary'
    },
    {
      id: 'quote-conversion',
      title: 'Quote Conversion',
      type: 'numberCard',
      size: 'medium',
      reportId: 'quote-conversions'
    },
    {
      id: 'inventory-status',
      title: 'Inventory Status',
      type: 'pie',
      size: 'medium',
      reportId: 'inventory-status'
    },
    {
      id: 'service-tickets',
      title: 'Service Performance',
      type: 'bar',
      size: 'medium',
      reportId: 'service-performance'
    }
  ],

  filterOptions: {
    dateRanges: [
      { value: 'today', label: 'Today' },
      { value: 'yesterday', label: 'Yesterday' },
      { value: 'last_7_days', label: 'Last 7 Days' },
      { value: 'last_30_days', label: 'Last 30 Days' },
      { value: 'this_month', label: 'This Month' },
      { value: 'last_month', label: 'Last Month' },
      { value: 'this_quarter', label: 'This Quarter' },
      { value: 'last_quarter', label: 'Last Quarter' },
      { value: 'this_year', label: 'This Year' },
      { value: 'last_year', label: 'Last Year' }
    ],
    
    groupBy: [
      { value: 'day', label: 'By Day' },
      { value: 'week', label: 'By Week' },
      { value: 'month', label: 'By Month' },
      { value: 'quarter', label: 'By Quarter' },
      { value: 'year', label: 'By Year' }
    ],

    salesReps: [
      { value: 'all', label: 'All Sales Reps' },
      { value: 'john_smith', label: 'John Smith' },
      { value: 'sarah_johnson', label: 'Sarah Johnson' },
      { value: 'mike_davis', label: 'Mike Davis' },
      { value: 'lisa_chen', label: 'Lisa Chen' }
    ],

    vehicleTypes: [
      { value: 'all', label: 'All Types' },
      { value: 'rv', label: 'RV' },
      { value: 'motorhome', label: 'Motorhome' },
      { value: 'travel_trailer', label: 'Travel Trailer' },
      { value: 'fifth_wheel', label: 'Fifth Wheel' },
      { value: 'manufactured_home', label: 'Manufactured Home' }
    ]
  },

  scheduledReports: [
    {
      id: 'weekly-summary',
      name: 'Weekly Performance Summary',
      reportId: 'finance-summary',
      frequency: 'weekly',
      recipients: ['manager@company.com', 'owner@company.com'],
      format: 'pdf',
      nextRun: '2024-01-22T09:00:00Z',
      isActive: true
    },
    {
      id: 'monthly-inventory',
      name: 'Monthly Inventory Report',
      reportId: 'inventory-status',
      frequency: 'monthly',
      recipients: ['inventory@company.com'],
      format: 'excel',
      nextRun: '2024-02-01T08:00:00Z',
      isActive: true
    }
  ],

  reportTemplates: [
    {
      id: 'executive-dashboard',
      name: 'Executive Dashboard',
      description: 'High-level overview for executives',
      widgets: ['revenue-trend', 'quote-conversion', 'inventory-status'],
      isDefault: true
    },
    {
      id: 'sales-performance',
      name: 'Sales Performance',
      description: 'Detailed sales metrics and pipeline analysis',
      widgets: ['quote-conversion', 'crm-pipeline'],
      isDefault: false
    },
    {
      id: 'operations-overview',
      name: 'Operations Overview',
      description: 'Service and delivery performance metrics',
      widgets: ['service-tickets', 'inventory-status'],
      isDefault: false
    }
  ]
}

export default mockReportingSuite