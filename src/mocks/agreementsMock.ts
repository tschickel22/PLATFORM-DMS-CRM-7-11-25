export const mockAgreements = {
  agreementTypes: [
    { value: 'PURCHASE', label: 'Purchase Agreement' },
    { value: 'LEASE', label: 'Lease Agreement' },
    { value: 'SERVICE', label: 'Service Agreement' },
    { value: 'WARRANTY', label: 'Warranty Agreement' }
  ],

  agreementStatuses: [
    { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    { value: 'PENDING', label: 'Pending Signature', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'SIGNED', label: 'Signed', color: 'bg-blue-100 text-blue-800' },
    { value: 'ACTIVE', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'EXPIRED', label: 'Expired', color: 'bg-red-100 text-red-800' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ],

  sampleAgreements: [
    {
      id: 'agr-001',
      type: 'PURCHASE',
      status: 'SIGNED',
      customerId: 'cust-001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      vehicleId: 'veh-001',
      vehicleInfo: '2023 Forest River Cherokee 274RK',
      quoteId: 'quote-001',
      terms: 'Standard purchase agreement terms and conditions. Vehicle sold as-is with manufacturer warranty.',
      effectiveDate: '2024-01-15T00:00:00Z',
      expirationDate: null,
      signedBy: 'John Smith',
      signedAt: '2024-01-15T14:30:00Z',
      ipAddress: '192.168.1.100',
      signatureData: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCI+PHBhdGggZD0iTTEwIDUwIEw1MCAzMCBMOTAgNzAiIHN0cm9rZT0iYmxhY2siIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
      documents: [
        {
          id: 'doc-001',
          name: 'Purchase Agreement.pdf',
          type: 'application/pdf',
          url: '/mock/purchase-agreement.pdf',
          size: 245760,
          uploadedAt: '2024-01-10T10:00:00Z'
        },
        {
          id: 'doc-002',
          name: 'Vehicle Inspection Report.pdf',
          type: 'application/pdf',
          url: '/mock/inspection-report.pdf',
          size: 156432,
          uploadedAt: '2024-01-10T10:15:00Z'
        }
      ],
      createdAt: '2024-01-10T09:30:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      createdBy: 'sales@company.com',
      totalAmount: 35000,
      downPayment: 5000,
      financingAmount: 30000
    },
    {
      id: 'agr-002',
      type: 'LEASE',
      status: 'PENDING',
      customerId: 'cust-002',
      customerName: 'Maria Rodriguez',
      customerEmail: 'maria.rodriguez@email.com',
      vehicleId: 'veh-002',
      vehicleInfo: '2024 Keystone Montana 3761FL',
      quoteId: 'quote-002',
      terms: 'Lease agreement for 24 months with option to purchase. Monthly payment includes maintenance.',
      effectiveDate: '2024-02-01T00:00:00Z',
      expirationDate: '2026-02-01T00:00:00Z',
      signedBy: null,
      signedAt: null,
      ipAddress: null,
      signatureData: null,
      documents: [
        {
          id: 'doc-003',
          name: 'Lease Agreement.pdf',
          type: 'application/pdf',
          url: '/mock/lease-agreement.pdf',
          size: 198432,
          uploadedAt: '2024-01-20T11:00:00Z'
        }
      ],
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T11:00:00Z',
      createdBy: 'sales@company.com',
      totalAmount: 62000,
      monthlyPayment: 1250,
      securityDeposit: 2500
    },
    {
      id: 'agr-003',
      type: 'SERVICE',
      status: 'ACTIVE',
      customerId: 'cust-003',
      customerName: 'David Johnson',
      customerEmail: 'david.johnson@email.com',
      vehicleId: 'veh-003',
      vehicleInfo: '2022 Grand Design Solitude 310GK',
      quoteId: null,
      terms: 'Annual service agreement covering routine maintenance and emergency repairs.',
      effectiveDate: '2024-01-01T00:00:00Z',
      expirationDate: '2024-12-31T23:59:59Z',
      signedBy: 'David Johnson',
      signedAt: '2023-12-28T16:45:00Z',
      ipAddress: '10.0.0.50',
      signatureData: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCI+PHBhdGggZD0iTTIwIDMwIEw2MCA2MCBMMTIwIDIwIiBzdHJva2U9ImJsYWNrIiBmaWxsPSJub25lIi8+PC9zdmc+',
      documents: [
        {
          id: 'doc-004',
          name: 'Service Agreement.pdf',
          type: 'application/pdf',
          url: '/mock/service-agreement.pdf',
          size: 134567,
          uploadedAt: '2023-12-20T14:00:00Z'
        }
      ],
      createdAt: '2023-12-20T13:30:00Z',
      updatedAt: '2023-12-28T16:45:00Z',
      createdBy: 'service@company.com',
      annualFee: 1200,
      coverageLevel: 'Comprehensive'
    }
  ],

  // Sample data for dropdowns when tenant data is not available
  sampleCustomers: [
    { id: 'user-1', name: 'John Smith', email: 'john.smith@example.com' },
    { id: 'user-3', name: 'David Johnson', email: 'david.johnson@example.com' }
  ],

  sampleVehicles: [
    { id: 'veh-001', info: '2023 Forest River Cherokee 274RK' },
    { id: 'veh-002', info: '2024 Keystone Montana 3761FL' },
    { id: 'veh-003', info: '2022 Grand Design Solitude 310GK' }
  ],

  sampleQuotes: [
    { id: 'quote-001', number: 'Q-2024-001', amount: 35000 },
    { id: 'quote-002', number: 'Q-2024-002', amount: 62000 },
    { id: 'quote-003', number: 'Q-2024-003', amount: 48000 }
  ],

  defaultAgreement: {
    type: 'PURCHASE',
    status: 'DRAFT',
    customerId: '',
    vehicleId: '',
    quoteId: '',
    terms: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    expirationDate: '',
    documents: []
  },

  signatureRequestTemplates: {
    email: {
      subject: 'Signature Required: {{agreement_type}} Agreement',
      body: `Dear {{customer_name}},

Your {{agreement_type}} agreement is ready for signature. Please click the link below to review and sign the document:

{{signature_link}}

Agreement Details:
- Type: {{agreement_type}}
- Vehicle: {{vehicle_info}}
- Effective Date: {{effective_date}}

If you have any questions, please contact us at {{company_phone}} or reply to this email.

Best regards,
{{company_name}} Team`
    },
    sms: {
      message: 'Hi {{customer_name}}, your {{agreement_type}} agreement is ready for signature. Click here to sign: {{signature_link}} - {{company_name}}'
    }
  },

  documentTemplates: [
    {
      id: 'template-purchase',
      name: 'Standard Purchase Agreement',
      type: 'PURCHASE',
      description: 'Standard vehicle purchase agreement template'
    },
    {
      id: 'template-lease',
      name: 'Standard Lease Agreement',
      type: 'LEASE',
      description: 'Standard vehicle lease agreement template'
    },
    {
      id: 'template-service',
      name: 'Service Agreement',
      type: 'SERVICE',
      description: 'Annual service agreement template'
    },
    {
      id: 'template-warranty',
      name: 'Extended Warranty',
      type: 'WARRANTY',
      description: 'Extended warranty agreement template'
    }
  ],

  signatureSettings: {
    requireIPAddress: true,
    requireTimestamp: true,
    allowElectronicSignature: true,
    signatureExpirationDays: 30,
    reminderIntervalDays: 3,
    maxReminders: 3
  }
}

export default mockAgreements