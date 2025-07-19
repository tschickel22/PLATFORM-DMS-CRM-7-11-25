import { FinanceApplication, ApplicationTemplate, ApplicationSection, ApplicationField } from '../types'

export const mockFinanceApplications = {
  sampleApplications: [
    {
      id: 'app-001',
      customerId: 'cust-001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '(555) 123-4567',
      templateId: 'template-001',
      status: 'under_review' as const,
      data: {
        'personal-info': {
          'first-name': 'John',
          'last-name': 'Smith',
          'email': 'john.smith@email.com',
          'phone': '(555) 123-4567',
          'ssn': '***-**-1234',
          'date-of-birth': '1985-06-15'
        },
        'employment': {
          'employer-name': 'ABC Corporation',
          'job-title': 'Software Engineer',
          'employment-length': '3 years',
          'monthly-income': '8500',
          'employment-type': 'full-time'
        },
        'residence': {
          'address': '123 Main St',
          'city': 'Anytown',
          'state': 'CA',
          'zip': '12345',
          'housing-status': 'rent',
          'monthly-payment': '2200'
        }
      },
      uploadedFiles: [
        {
          id: 'file-001',
          fieldId: 'pay-stubs',
          name: 'paystub-march-2024.pdf',
          type: 'application/pdf',
          size: 245760,
          url: '/mock/paystub.pdf',
          uploadedAt: '2024-01-15T10:30:00Z'
        }
      ],
      fraudCheckStatus: 'verified' as const,
      createdAt: '2024-01-10T09:30:00Z',
      updatedAt: '2024-01-15T14:22:00Z',
      submittedAt: '2024-01-12T16:45:00Z',
      notes: 'Strong credit profile, employment verified'
    },
    {
      id: 'app-002',
      customerId: 'cust-002',
      customerName: 'Maria Rodriguez',
      customerEmail: 'maria.rodriguez@email.com',
      customerPhone: '(555) 987-6543',
      templateId: 'template-001',
      status: 'draft' as const,
      data: {
        'personal-info': {
          'first-name': 'Maria',
          'last-name': 'Rodriguez',
          'email': 'maria.rodriguez@email.com',
          'phone': '(555) 987-6543'
        }
      },
      uploadedFiles: [],
      fraudCheckStatus: 'pending' as const,
      createdAt: '2024-01-18T11:15:00Z',
      updatedAt: '2024-01-18T11:15:00Z',
      notes: ''
    },
    {
      id: 'app-003',
      customerId: 'cust-003',
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah.wilson@email.com',
      customerPhone: '(555) 234-5678',
      templateId: 'template-001',
      status: 'submitted' as const,
      data: {
        'personal-info': {
          'first-name': 'Sarah',
          'last-name': 'Wilson',
          'email': 'sarah.wilson@email.com',
          'phone': '(555) 234-5678',
          'ssn': '***-**-5678',
          'date-of-birth': '1990-03-22'
        },
        'employment': {
          'employer-name': 'Tech Solutions Inc',
          'job-title': 'Marketing Manager',
          'employment-length': '2 years',
          'monthly-income': '7200',
          'employment-type': 'full-time'
        }
      },
      uploadedFiles: [],
      fraudCheckStatus: 'pending' as const,
      createdAt: '2024-01-20T10:15:00Z',
      updatedAt: '2024-01-22T09:30:00Z',
      submittedAt: '2024-01-22T09:30:00Z',
      notes: 'Application submitted, awaiting initial review'
    },
    {
      id: 'app-004',
      customerId: 'cust-004',
      customerName: 'Michael Chen',
      customerEmail: 'michael.chen@email.com',
      customerPhone: '(555) 345-6789',
      templateId: 'template-001',
      status: 'under_review' as const,
      data: {
        'personal-info': {
          'first-name': 'Michael',
          'last-name': 'Chen',
          'email': 'michael.chen@email.com',
          'phone': '(555) 345-6789',
          'ssn': '***-**-6789',
          'date-of-birth': '1988-11-10'
        },
        'employment': {
          'employer-name': 'Global Manufacturing',
          'job-title': 'Operations Supervisor',
          'employment-length': '5 years',
          'monthly-income': '9500',
          'employment-type': 'full-time'
        }
      },
      uploadedFiles: [
        {
          id: 'file-002',
          fieldId: 'pay-stubs',
          name: 'paystub-january-2024.pdf',
          type: 'application/pdf',
          size: 198432,
          url: '/mock/paystub-chen.pdf',
          uploadedAt: '2024-01-18T11:45:00Z'
        }
      ],
      fraudCheckStatus: 'verified' as const,
      createdAt: '2024-01-16T14:20:00Z',
      updatedAt: '2024-01-23T16:15:00Z',
      submittedAt: '2024-01-18T12:00:00Z',
      reviewedAt: '2024-01-23T16:15:00Z',
      reviewedBy: 'finance@company.com',
      notes: 'Under review by finance team, credit check in progress',
      adminNotes: 'Credit score: 720. Employment verified. Waiting for final bank statements.'
    },
    {
      id: 'app-005',
      customerId: 'cust-005',
      customerName: 'Emily Davis',
      customerEmail: 'emily.davis@email.com',
      customerPhone: '(555) 456-7890',
      templateId: 'template-001',
      status: 'approved' as const,
      data: {
        'personal-info': {
          'first-name': 'Emily',
          'last-name': 'Davis',
          'email': 'emily.davis@email.com',
          'phone': '(555) 456-7890',
          'ssn': '***-**-7890',
          'date-of-birth': '1985-07-14'
        },
        'employment': {
          'employer-name': 'Healthcare Partners',
          'job-title': 'Registered Nurse',
          'employment-length': '8 years',
          'monthly-income': '8800',
          'employment-type': 'full-time'
        }
      },
      uploadedFiles: [
        {
          id: 'file-003',
          fieldId: 'pay-stubs',
          name: 'paystub-december-2023.pdf',
          type: 'application/pdf',
          size: 223456,
          url: '/mock/paystub-davis.pdf',
          uploadedAt: '2024-01-08T15:30:00Z'
        },
        {
          id: 'file-004',
          fieldId: 'tax-returns',
          name: 'tax-return-2023.pdf',
          type: 'application/pdf',
          size: 445678,
          url: '/mock/tax-return-davis.pdf',
          uploadedAt: '2024-01-08T15:35:00Z'
        }
      ],
      fraudCheckStatus: 'verified' as const,
      createdAt: '2024-01-05T08:45:00Z',
      updatedAt: '2024-01-25T10:30:00Z',
      submittedAt: '2024-01-08T16:00:00Z',
      reviewedAt: '2024-01-25T10:30:00Z',
      reviewedBy: 'finance@company.com',
      notes: 'Excellent credit score and stable employment history. Approved for full amount.',
      adminNotes: 'Credit score: 785. 8 years stable employment. Debt-to-income ratio: 28%. Approved for $65,000 at 6.5% APR.'
    },
    {
      id: 'app-006',
      customerId: 'cust-006',
      customerName: 'Robert Taylor',
      customerEmail: 'robert.taylor@email.com',
      customerPhone: '(555) 567-8901',
      templateId: 'template-001',
      status: 'denied' as const,
      data: {
        'personal-info': {
          'first-name': 'Robert',
          'last-name': 'Taylor',
          'email': 'robert.taylor@email.com',
          'phone': '(555) 567-8901',
          'ssn': '***-**-8901',
          'date-of-birth': '1992-12-05'
        },
        'employment': {
          'employer-name': 'Freelance Consulting',
          'job-title': 'Independent Contractor',
          'employment-length': '6 months',
          'monthly-income': '4500',
          'employment-type': 'self-employed'
        }
      },
      uploadedFiles: [],
      fraudCheckStatus: 'flagged' as const,
      createdAt: '2024-01-12T13:20:00Z',
      updatedAt: '2024-01-26T14:45:00Z',
      submittedAt: '2024-01-14T10:15:00Z',
      reviewedAt: '2024-01-26T14:45:00Z',
      reviewedBy: 'finance@company.com',
      notes: 'Insufficient employment history and income verification. Credit score below minimum requirements.',
      adminNotes: 'Credit score: 580 (below 620 minimum). Only 6 months employment history. Self-employed income not verifiable. Recommend denial.'
    },
    {
      id: 'app-007',
      customerId: 'cust-007',
      customerName: 'Jennifer Brown',
      customerEmail: 'jennifer.brown@email.com',
      customerPhone: '(555) 678-9012',
      templateId: 'template-001',
      status: 'completed' as const,
      data: {
        'personal-info': {
          'first-name': 'Jennifer',
          'last-name': 'Brown',
          'email': 'jennifer.brown@email.com',
          'phone': '(555) 678-9012',
          'ssn': '***-**-9012',
          'date-of-birth': '1987-04-18'
        },
        'employment': {
          'employer-name': 'City School District',
          'job-title': 'Elementary Teacher',
          'employment-length': '12 years',
          'monthly-income': '6800',
          'employment-type': 'full-time'
        }
      },
      uploadedFiles: [
        {
          id: 'file-005',
          fieldId: 'pay-stubs',
          name: 'paystub-november-2023.pdf',
          type: 'application/pdf',
          size: 187654,
          url: '/mock/paystub-brown.pdf',
          uploadedAt: '2023-12-15T09:20:00Z'
        }
      ],
      fraudCheckStatus: 'verified' as const,
      createdAt: '2023-12-10T11:30:00Z',
      updatedAt: '2024-01-15T13:45:00Z',
      submittedAt: '2023-12-15T10:00:00Z',
      reviewedAt: '2023-12-20T15:30:00Z',
      reviewedBy: 'finance@company.com',
      notes: 'Application approved and loan funded. Customer has received financing.',
      adminNotes: 'Credit score: 742. 12 years stable employment in education. Loan funded at $45,000 at 7.25% APR for 15 years.'
    },
    {
      id: 'app-008',
      customerId: 'cust-008',
      customerName: 'David Wilson',
      customerEmail: 'david.wilson@email.com',
      customerPhone: '(555) 789-0123',
      templateId: 'template-001',
      status: 'conditionally_approved' as const,
      data: {
        'personal-info': {
          'first-name': 'David',
          'last-name': 'Wilson',
          'email': 'david.wilson@email.com',
          'phone': '(555) 789-0123',
          'ssn': '***-**-0123',
          'date-of-birth': '1983-09-25'
        },
        'employment': {
          'employer-name': 'Regional Bank',
          'job-title': 'Loan Officer',
          'employment-length': '4 years',
          'monthly-income': '7800',
          'employment-type': 'full-time'
        }
      },
      uploadedFiles: [
        {
          id: 'file-006',
          fieldId: 'pay-stubs',
          name: 'paystub-february-2024.pdf',
          type: 'application/pdf',
          size: 201234,
          url: '/mock/paystub-wilson.pdf',
          uploadedAt: '2024-01-22T14:20:00Z'
        }
      ],
      fraudCheckStatus: 'verified' as const,
      createdAt: '2024-01-20T13:45:00Z',
      updatedAt: '2024-01-27T11:30:00Z',
      submittedAt: '2024-01-22T15:00:00Z',
      reviewedAt: '2024-01-27T11:30:00Z',
      reviewedBy: 'finance@company.com',
      notes: 'Conditionally approved pending additional documentation.',
      adminNotes: 'Credit score: 695. Good employment history but needs co-signer due to recent credit inquiry. Approved for $40,000 with co-signer requirement.'
    }
  ] as FinanceApplication[],

  defaultTemplates: [
    {
      id: 'template-001',
      name: 'Standard Finance Application',
      description: 'Complete finance application for manufactured homes and RVs',
      sections: [
        {
          id: 'personal-info',
          title: 'Personal Information',
          description: 'Basic personal and contact information',
          order: 1,
          fields: [
            {
              id: 'first-name',
              type: 'text',
              label: 'First Name',
              placeholder: 'Enter your first name',
              required: true,
              order: 1,
              validation: {
                minLength: 2,
                maxLength: 50
              }
            },
            {
              id: 'last-name',
              type: 'text',
              label: 'Last Name',
              placeholder: 'Enter your last name',
              required: true,
              order: 2,
              validation: {
                minLength: 2,
                maxLength: 50
              }
            },
            {
              id: 'email',
              type: 'email',
              label: 'Email Address',
              placeholder: 'Enter your email address',
              required: true,
              order: 3
            },
            {
              id: 'phone',
              type: 'phone',
              label: 'Phone Number',
              placeholder: '(555) 123-4567',
              required: true,
              order: 4
            },
            {
              id: 'ssn',
              type: 'text',
              label: 'Social Security Number',
              placeholder: '***-**-****',
              required: true,
              order: 5,
              validation: {
                pattern: '^\\d{3}-\\d{2}-\\d{4}$'
              }
            },
            {
              id: 'date-of-birth',
              type: 'date',
              label: 'Date of Birth',
              required: true,
              order: 6
            }
          ]
        },
        {
          id: 'employment',
          title: 'Employment Information',
          description: 'Current employment and income details',
          order: 2,
          fields: [
            {
              id: 'employment-type',
              type: 'select',
              label: 'Employment Type',
              required: true,
              order: 1,
              options: ['full-time', 'part-time', 'self-employed', 'retired', 'unemployed']
            },
            {
              id: 'employer-name',
              type: 'text',
              label: 'Employer Name',
              placeholder: 'Enter employer name',
              required: true,
              order: 2,
              conditionalLogic: {
                dependsOn: 'employment-type',
                condition: 'not_equals',
                value: 'unemployed'
              }
            },
            {
              id: 'job-title',
              type: 'text',
              label: 'Job Title',
              placeholder: 'Enter your job title',
              required: true,
              order: 3,
              conditionalLogic: {
                dependsOn: 'employment-type',
                condition: 'not_equals',
                value: 'unemployed'
              }
            },
            {
              id: 'employment-length',
              type: 'text',
              label: 'Length of Employment',
              placeholder: 'e.g., 2 years 6 months',
              required: true,
              order: 4,
              conditionalLogic: {
                dependsOn: 'employment-type',
                condition: 'not_equals',
                value: 'unemployed'
              }
            },
            {
              id: 'monthly-income',
              type: 'currency',
              label: 'Monthly Gross Income',
              placeholder: '0.00',
              required: true,
              order: 5,
              validation: {
                min: 0
              }
            }
          ]
        },
        {
          id: 'co-applicant',
          title: 'Co-Applicant Information',
          description: 'Information about co-applicant (if applicable)',
          order: 3,
          fields: [
            {
              id: 'has-co-applicant',
              type: 'radio',
              label: 'Do you have a co-applicant?',
              required: true,
              order: 1,
              options: ['yes', 'no']
            },
            {
              id: 'co-first-name',
              type: 'text',
              label: 'Co-Applicant First Name',
              placeholder: 'Enter first name',
              required: false,
              order: 2,
              conditionalLogic: {
                dependsOn: 'has-co-applicant',
                condition: 'equals',
                value: 'yes'
              }
            },
            {
              id: 'co-last-name',
              type: 'text',
              label: 'Co-Applicant Last Name',
              placeholder: 'Enter last name',
              required: false,
              order: 3,
              conditionalLogic: {
                dependsOn: 'has-co-applicant',
                condition: 'equals',
                value: 'yes'
              }
            },
            {
              id: 'co-ssn',
              type: 'text',
              label: 'Co-Applicant SSN',
              placeholder: '***-**-****',
              required: false,
              order: 4,
              conditionalLogic: {
                dependsOn: 'has-co-applicant',
                condition: 'equals',
                value: 'yes'
              }
            }
          ]
        },
        {
          id: 'residence',
          title: 'Residence Information',
          description: 'Current housing situation and address',
          order: 4,
          fields: [
            {
              id: 'address',
              type: 'text',
              label: 'Street Address',
              placeholder: 'Enter your street address',
              required: true,
              order: 1
            },
            {
              id: 'city',
              type: 'text',
              label: 'City',
              placeholder: 'Enter city',
              required: true,
              order: 2
            },
            {
              id: 'state',
              type: 'select',
              label: 'State',
              required: true,
              order: 3,
              options: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
            },
            {
              id: 'zip',
              type: 'text',
              label: 'ZIP Code',
              placeholder: '12345',
              required: true,
              order: 4,
              validation: {
                pattern: '^\\d{5}(-\\d{4})?$'
              }
            },
            {
              id: 'housing-status',
              type: 'select',
              label: 'Housing Status',
              required: true,
              order: 5,
              options: ['own', 'rent', 'live-with-family', 'other']
            },
            {
              id: 'monthly-payment',
              type: 'currency',
              label: 'Monthly Housing Payment',
              placeholder: '0.00',
              required: true,
              order: 6,
              validation: {
                min: 0
              }
            }
          ]
        },
        {
          id: 'obligations',
          title: 'Monthly Obligations',
          description: 'Other monthly financial obligations',
          order: 5,
          fields: [
            {
              id: 'credit-cards',
              type: 'currency',
              label: 'Credit Card Payments',
              placeholder: '0.00',
              required: false,
              order: 1,
              validation: {
                min: 0
              }
            },
            {
              id: 'auto-loans',
              type: 'currency',
              label: 'Auto Loan Payments',
              placeholder: '0.00',
              required: false,
              order: 2,
              validation: {
                min: 0
              }
            },
            {
              id: 'student-loans',
              type: 'currency',
              label: 'Student Loan Payments',
              placeholder: '0.00',
              required: false,
              order: 3,
              validation: {
                min: 0
              }
            },
            {
              id: 'other-debts',
              type: 'currency',
              label: 'Other Monthly Debt Payments',
              placeholder: '0.00',
              required: false,
              order: 4,
              validation: {
                min: 0
              }
            }
          ]
        },
        {
          id: 'documents',
          title: 'Required Documents',
          description: 'Upload required financial documents',
          order: 6,
          fields: [
            {
              id: 'pay-stubs',
              type: 'file',
              label: 'Recent Pay Stubs (Last 2 months)',
              required: true,
              order: 1,
              validation: {
                fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
                maxFileSize: 5242880 // 5MB
              }
            },
            {
              id: 'tax-returns',
              type: 'file',
              label: 'Tax Returns (Last 2 years)',
              required: true,
              order: 2,
              validation: {
                fileTypes: ['pdf'],
                maxFileSize: 10485760 // 10MB
              }
            },
            {
              id: 'bank-statements',
              type: 'file',
              label: 'Bank Statements (Last 3 months)',
              required: true,
              order: 3,
              validation: {
                fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
                maxFileSize: 5242880 // 5MB
              }
            }
          ]
        },
        {
          id: 'consent',
          title: 'Consent and Authorization',
          description: 'Required consents and authorizations',
          order: 7,
          fields: [
            {
              id: 'credit-check-consent',
              type: 'checkbox',
              label: 'I authorize a credit check to be performed',
              required: true,
              order: 1
            },
            {
              id: 'terms-agreement',
              type: 'checkbox',
              label: 'I agree to the terms and conditions',
              required: true,
              order: 2
            },
            {
              id: 'signature',
              type: 'signature',
              label: 'Electronic Signature',
              required: true,
              order: 3
            }
          ]
        }
      ],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ] as ApplicationTemplate[],

  fieldTypes: [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'number', label: 'Number' },
    { value: 'currency', label: 'Currency' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'file', label: 'File Upload' },
    { value: 'signature', label: 'Electronic Signature' }
  ],

  statusOptions: [
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    { value: 'submitted', label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
    { value: 'under_review', label: 'Under Review', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
    { value: 'conditionally_approved', label: 'Conditionally Approved', color: 'bg-orange-100 text-orange-800' },
    { value: 'denied', label: 'Denied', color: 'bg-red-100 text-red-800' },
    { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800' }
  ],

  fraudCheckStatuses: [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'verified', label: 'Verified', color: 'bg-green-100 text-green-800' },
    { value: 'flagged', label: 'Flagged', color: 'bg-red-100 text-red-800' }
  ]
}

export default mockFinanceApplications