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