export const mockAgreementTemplates = {
  sampleTemplates: [
    {
      id: 'template-001',
      name: 'Standard RV Purchase Agreement',
      description: 'Comprehensive purchase agreement for RV sales with financing options',
      type: 'PURCHASE',
      category: 'RV Sales',
      version: '1.0',
      isActive: true,
      usageCount: 45,
      tags: ['RV', 'Purchase', 'Financing'],
      terms: `RV PURCHASE AGREEMENT

This Purchase Agreement ("Agreement") is entered into on {{effective_date}} between {{company_name}} ("Dealer") and {{customer_name}} ("Buyer").

VEHICLE INFORMATION:
Vehicle: {{vehicle_info}}
VIN: {{vehicle_vin}}
Year: {{vehicle_year}}
Make: {{vehicle_make}}
Model: {{vehicle_model}}

PURCHASE TERMS:
Total Purchase Price: {{total_amount}}
Down Payment: {{down_payment}}
Amount Financed: {{financing_amount}}
Monthly Payment: {{monthly_payment}}
Interest Rate: {{interest_rate}}%
Term: {{loan_term}} months

BUYER INFORMATION:
Name: {{customer_name}}
Address: {{customer_address}}
Phone: {{customer_phone}}
Email: {{customer_email}}

The Buyer agrees to purchase the above-described vehicle under the terms and conditions set forth in this Agreement. The vehicle is sold "AS IS" with manufacturer warranty where applicable.

DELIVERY:
Expected delivery date: {{delivery_date}}
Delivery location: {{delivery_address}}

By signing below, both parties agree to the terms and conditions of this Agreement.

Dealer: {{company_name}}
Date: {{current_date}}

Buyer Signature: _________________________
{{customer_name}}
Date: ________________`,
      mergeFields: [
        'effective_date',
        'company_name',
        'customer_name',
        'vehicle_info',
        'vehicle_vin',
        'vehicle_year',
        'vehicle_make',
        'vehicle_model',
        'total_amount',
        'down_payment',
        'financing_amount',
        'monthly_payment',
        'interest_rate',
        'loan_term',
        'customer_address',
        'customer_phone',
        'customer_email',
        'delivery_date',
        'delivery_address',
        'current_date'
      ],
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      createdBy: 'admin@company.com'
    },
    {
      id: 'template-002',
      name: 'Manufactured Home Lease Agreement',
      description: 'Standard lease agreement for manufactured housing with monthly payment terms',
      type: 'LEASE',
      category: 'Manufactured Housing',
      version: '2.1',
      isActive: true,
      usageCount: 28,
      tags: ['Manufactured Home', 'Lease', 'Monthly'],
      terms: `MANUFACTURED HOME LEASE AGREEMENT

This Lease Agreement ("Agreement") is made on {{effective_date}} between {{company_name}} ("Lessor") and {{customer_name}} ("Lessee").

PROPERTY DESCRIPTION:
Home: {{vehicle_info}}
Serial Number: {{vehicle_vin}}
Location: {{property_address}}

LEASE TERMS:
Monthly Rent: {{monthly_payment}}
Security Deposit: {{security_deposit}}
Lease Term: {{lease_term}} months
Lease Start Date: {{effective_date}}
Lease End Date: {{expiration_date}}

LESSEE INFORMATION:
Name: {{customer_name}}
Phone: {{customer_phone}}
Email: {{customer_email}}
Emergency Contact: {{emergency_contact}}

PAYMENT TERMS:
Rent is due on the {{payment_due_date}} of each month. Late fees of {{late_fee_amount}} will be charged for payments received after {{grace_period_days}} days.

UTILITIES AND SERVICES:
{{utilities_included}}

MAINTENANCE AND REPAIRS:
Lessee is responsible for routine maintenance. Lessor will handle structural repairs and major system failures.

TERMINATION:
This lease may be terminated with {{notice_period_days}} days written notice.

Lessor: {{company_name}}
Signature: _________________________
Date: {{current_date}}

Lessee: {{customer_name}}
Signature: _________________________
Date: ________________`,
      mergeFields: [
        'effective_date',
        'company_name',
        'customer_name',
        'vehicle_info',
        'vehicle_vin',
        'property_address',
        'monthly_payment',
        'security_deposit',
        'lease_term',
        'expiration_date',
        'customer_phone',
        'customer_email',
        'emergency_contact',
        'payment_due_date',
        'late_fee_amount',
        'grace_period_days',
        'utilities_included',
        'notice_period_days',
        'current_date'
      ],
      createdAt: '2024-01-08T11:30:00Z',
      updatedAt: '2024-01-20T16:45:00Z',
      createdBy: 'admin@company.com'
    },
    {
      id: 'template-003',
      name: 'Extended Service Agreement',
      description: 'Comprehensive service agreement covering maintenance and repairs',
      type: 'SERVICE',
      category: 'Service & Maintenance',
      version: '1.5',
      isActive: true,
      usageCount: 67,
      tags: ['Service', 'Maintenance', 'Warranty'],
      terms: `EXTENDED SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into on {{effective_date}} between {{company_name}} ("Service Provider") and {{customer_name}} ("Customer").

COVERED UNIT:
Unit: {{vehicle_info}}
Serial/VIN: {{vehicle_vin}}
Location: {{service_address}}

SERVICE COVERAGE:
Coverage Level: {{coverage_level}}
Annual Service Fee: {{annual_fee}}
Coverage Period: {{effective_date}} to {{expiration_date}}

SERVICES INCLUDED:
- Routine maintenance and inspections
- Emergency repair services
- Parts and labor coverage
- {{additional_services}}

CUSTOMER INFORMATION:
Name: {{customer_name}}
Address: {{customer_address}}
Phone: {{customer_phone}}
Email: {{customer_email}}
Preferred Contact Method: {{preferred_contact}}

RESPONSE TIMES:
- Emergency Service: {{emergency_response_time}} hours
- Routine Service: {{routine_response_time}} business days
- Scheduled Maintenance: {{maintenance_schedule}}

PAYMENT TERMS:
Annual fee of {{annual_fee}} is due on {{payment_due_date}}. Service calls outside of coverage will be billed separately.

EXCLUSIONS:
This agreement does not cover damage due to misuse, natural disasters, or normal wear and tear beyond specified limits.

Service Provider: {{company_name}}
Authorized Representative: _________________________
Date: {{current_date}}

Customer: {{customer_name}}
Signature: _________________________
Date: ________________`,
      mergeFields: [
        'effective_date',
        'company_name',
        'customer_name',
        'vehicle_info',
        'vehicle_vin',
        'service_address',
        'coverage_level',
        'annual_fee',
        'expiration_date',
        'additional_services',
        'customer_address',
        'customer_phone',
        'customer_email',
        'preferred_contact',
        'emergency_response_time',
        'routine_response_time',
        'maintenance_schedule',
        'payment_due_date',
        'current_date'
      ],
      createdAt: '2024-01-05T14:15:00Z',
      updatedAt: '2024-01-18T10:20:00Z',
      createdBy: 'service@company.com'
    },
    {
      id: 'template-004',
      name: 'Extended Warranty Agreement',
      description: 'Warranty coverage agreement for additional protection beyond manufacturer warranty',
      type: 'WARRANTY',
      category: 'Warranty & Protection',
      version: '1.0',
      isActive: true,
      usageCount: 23,
      tags: ['Warranty', 'Protection', 'Coverage'],
      terms: `EXTENDED WARRANTY AGREEMENT

This Extended Warranty Agreement ("Agreement") is made on {{effective_date}} between {{company_name}} ("Warranty Provider") and {{customer_name}} ("Warranty Holder").

COVERED PRODUCT:
Product: {{vehicle_info}}
Serial/Model Number: {{vehicle_vin}}
Purchase Date: {{purchase_date}}
Warranty Start Date: {{effective_date}}

WARRANTY COVERAGE:
Coverage Type: {{coverage_level}}
Warranty Period: {{warranty_period}} months
Coverage Limit: {{coverage_limit}}
Deductible: {{deductible_amount}}

COVERED COMPONENTS:
{{covered_components}}

WARRANTY HOLDER:
Name: {{customer_name}}
Address: {{customer_address}}
Phone: {{customer_phone}}
Email: {{customer_email}}

CLAIM PROCESS:
To file a warranty claim, contact {{company_name}} at {{company_phone}} or {{company_email}}. Claims must be reported within {{claim_reporting_days}} days of the issue.

TERMS AND CONDITIONS:
- Warranty is non-transferable
- Regular maintenance records must be maintained
- Warranty void if product is modified without authorization
- {{additional_terms}}

PAYMENT:
Warranty fee: {{warranty_fee}}
Payment due: {{payment_due_date}}

This warranty is in addition to and does not replace the manufacturer's warranty.

Warranty Provider: {{company_name}}
Authorized Agent: _________________________
Date: {{current_date}}

Warranty Holder: {{customer_name}}
Signature: _________________________
Date: ________________`,
      mergeFields: [
        'effective_date',
        'company_name',
        'customer_name',
        'vehicle_info',
        'vehicle_vin',
        'purchase_date',
        'coverage_level',
        'warranty_period',
        'coverage_limit',
        'deductible_amount',
        'covered_components',
        'customer_address',
        'customer_phone',
        'customer_email',
        'company_phone',
        'company_email',
        'claim_reporting_days',
        'additional_terms',
        'warranty_fee',
        'payment_due_date',
        'current_date'
      ],
      createdAt: '2024-01-12T16:00:00Z',
      updatedAt: '2024-01-12T16:00:00Z',
      createdBy: 'admin@company.com'
    }
  ],

  templateCategories: [
    'RV Sales',
    'Manufactured Housing',
    'Service & Maintenance',
    'Warranty & Protection',
    'Financing',
    'Trade-In',
    'Rental',
    'Custom'
  ],

  commonMergeFields: [
    // Customer Information
    { key: 'customer_name', label: 'Customer Name', category: 'Customer' },
    { key: 'customer_email', label: 'Customer Email', category: 'Customer' },
    { key: 'customer_phone', label: 'Customer Phone', category: 'Customer' },
    { key: 'customer_address', label: 'Customer Address', category: 'Customer' },
    { key: 'emergency_contact', label: 'Emergency Contact', category: 'Customer' },
    { key: 'preferred_contact', label: 'Preferred Contact Method', category: 'Customer' },

    // Vehicle/Property Information
    { key: 'vehicle_info', label: 'Vehicle/Home Info', category: 'Vehicle' },
    { key: 'vehicle_vin', label: 'VIN/Serial Number', category: 'Vehicle' },
    { key: 'vehicle_year', label: 'Year', category: 'Vehicle' },
    { key: 'vehicle_make', label: 'Make', category: 'Vehicle' },
    { key: 'vehicle_model', label: 'Model', category: 'Vehicle' },
    { key: 'property_address', label: 'Property Address', category: 'Vehicle' },

    // Financial Information
    { key: 'total_amount', label: 'Total Amount', category: 'Financial' },
    { key: 'down_payment', label: 'Down Payment', category: 'Financial' },
    { key: 'financing_amount', label: 'Financing Amount', category: 'Financial' },
    { key: 'monthly_payment', label: 'Monthly Payment', category: 'Financial' },
    { key: 'security_deposit', label: 'Security Deposit', category: 'Financial' },
    { key: 'annual_fee', label: 'Annual Fee', category: 'Financial' },
    { key: 'interest_rate', label: 'Interest Rate', category: 'Financial' },
    { key: 'loan_term', label: 'Loan Term (months)', category: 'Financial' },
    { key: 'warranty_fee', label: 'Warranty Fee', category: 'Financial' },

    // Agreement Details
    { key: 'effective_date', label: 'Effective Date', category: 'Agreement' },
    { key: 'expiration_date', label: 'Expiration Date', category: 'Agreement' },
    { key: 'coverage_level', label: 'Coverage Level', category: 'Agreement' },
    { key: 'lease_term', label: 'Lease Term (months)', category: 'Agreement' },
    { key: 'warranty_period', label: 'Warranty Period (months)', category: 'Agreement' },

    // Company Information
    { key: 'company_name', label: 'Company Name', category: 'Company' },
    { key: 'company_phone', label: 'Company Phone', category: 'Company' },
    { key: 'company_email', label: 'Company Email', category: 'Company' },
    { key: 'company_address', label: 'Company Address', category: 'Company' },

    // System Fields
    { key: 'current_date', label: 'Current Date', category: 'System' },
    { key: 'quote_number', label: 'Quote Number', category: 'System' },
    { key: 'agreement_number', label: 'Agreement Number', category: 'System' },

    // Service Specific
    { key: 'service_address', label: 'Service Address', category: 'Service' },
    { key: 'emergency_response_time', label: 'Emergency Response Time', category: 'Service' },
    { key: 'routine_response_time', label: 'Routine Response Time', category: 'Service' },
    { key: 'maintenance_schedule', label: 'Maintenance Schedule', category: 'Service' },

    // Delivery Information
    { key: 'delivery_date', label: 'Delivery Date', category: 'Delivery' },
    { key: 'delivery_address', label: 'Delivery Address', category: 'Delivery' },

    // Payment Terms
    { key: 'payment_due_date', label: 'Payment Due Date', category: 'Payment' },
    { key: 'late_fee_amount', label: 'Late Fee Amount', category: 'Payment' },
    { key: 'grace_period_days', label: 'Grace Period (days)', category: 'Payment' },

    // Additional Fields
    { key: 'utilities_included', label: 'Utilities Included', category: 'Additional' },
    { key: 'additional_services', label: 'Additional Services', category: 'Additional' },
    { key: 'covered_components', label: 'Covered Components', category: 'Additional' },
    { key: 'additional_terms', label: 'Additional Terms', category: 'Additional' }
  ],

  mergeFieldCategories: [
    'Customer',
    'Vehicle',
    'Financial',
    'Agreement',
    'Company',
    'System',
    'Service',
    'Delivery',
    'Payment',
    'Additional'
  ],

  defaultTemplate: {
    name: '',
    description: '',
    type: 'PURCHASE',
    category: 'Custom',
    terms: '',
    mergeFields: [],
    isActive: true,
    version: '1.0',
    tags: []
  },

  templateValidation: {
    nameMinLength: 3,
    nameMaxLength: 100,
    descriptionMaxLength: 500,
    termsMinLength: 50,
    maxMergeFields: 50,
    requiredFields: ['name', 'description', 'type', 'terms']
  }
}

export default mockAgreementTemplates