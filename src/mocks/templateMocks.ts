import { Template, FieldType } from '@/modules/agreement-vault/templates/templateTypes'

// Simple base64 encoded minimal PDF for testing
const SAMPLE_PDF_BASE64 = 'JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihTYW1wbGUgUERGKSBUagpFVApzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDI0NSAwMDAwMCBuIAowMDAwMDAwMzIyIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDE0CiUlRU9G'

export const mockTemplates: Template[] = [
  {
    id: 'template-001',
    name: 'Standard Purchase Agreement',
    description: 'Standard vehicle purchase agreement template',
    pdfBase64: SAMPLE_PDF_BASE64,
    fields: [
      {
        id: 'field-001',
        type: FieldType.TEXT,
        label: 'Customer Name',
        x: 100,
        y: 150,
        width: 200,
        height: 30,
        required: true,
        defaultValue: '',
        placeholder: 'Enter customer name'
      },
      {
        id: 'field-002',
        type: FieldType.DATE,
        label: 'Agreement Date',
        x: 350,
        y: 150,
        width: 150,
        height: 30,
        required: true,
        format: 'MM/dd/yyyy'
      },
      {
        id: 'field-003',
        type: FieldType.TEXT,
        label: 'Vehicle VIN',
        x: 100,
        y: 200,
        width: 250,
        height: 30,
        required: true,
        defaultValue: '',
        placeholder: 'Enter VIN number'
      },
      {
        id: 'field-004',
        type: FieldType.SIGNATURE,
        label: 'Customer Signature',
        x: 100,
        y: 400,
        width: 200,
        height: 60,
        required: true
      },
      {
        id: 'field-005',
        type: FieldType.CHECKBOX,
        label: 'Terms Accepted',
        x: 100,
        y: 350,
        width: 20,
        height: 20,
        required: true,
        checkboxLabel: 'I agree to the terms and conditions'
      }
    ],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    isActive: true
  },
  {
    id: 'template-002',
    name: 'Lease Agreement Template',
    description: 'Standard lease agreement for RV rentals',
    pdfBase64: SAMPLE_PDF_BASE64,
    fields: [
      {
        id: 'field-006',
        type: FieldType.TEXT,
        label: 'Lessee Name',
        x: 100,
        y: 150,
        width: 200,
        height: 30,
        required: true,
        defaultValue: '',
        placeholder: 'Enter lessee name'
      },
      {
        id: 'field-007',
        type: FieldType.DATE,
        label: 'Lease Start Date',
        x: 350,
        y: 150,
        width: 150,
        height: 30,
        required: true,
        format: 'MM/dd/yyyy'
      },
      {
        id: 'field-008',
        type: FieldType.DATE,
        label: 'Lease End Date',
        x: 350,
        y: 200,
        width: 150,
        height: 30,
        required: true,
        format: 'MM/dd/yyyy'
      },
      {
        id: 'field-009',
        type: FieldType.TEXT,
        label: 'Monthly Payment',
        x: 100,
        y: 250,
        width: 150,
        height: 30,
        required: true,
        defaultValue: '$',
        placeholder: 'Enter amount'
      },
      {
        id: 'field-010',
        type: FieldType.SIGNATURE,
        label: 'Lessee Signature',
        x: 100,
        y: 400,
        width: 200,
        height: 60,
        required: true
      }
    ],
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    isActive: true
  },
  {
    id: 'template-003',
    name: 'Service Agreement',
    description: 'Service agreement template for maintenance contracts',
    pdfBase64: SAMPLE_PDF_BASE64,
    fields: [
      {
        id: 'field-011',
        type: FieldType.TEXT,
        label: 'Service Provider',
        x: 100,
        y: 150,
        width: 200,
        height: 30,
        required: true,
        defaultValue: '',
        placeholder: 'Enter service provider name'
      },
      {
        id: 'field-012',
        type: FieldType.TEXT,
        label: 'Service Description',
        x: 100,
        y: 200,
        width: 400,
        height: 60,
        required: true,
        defaultValue: '',
        placeholder: 'Describe services to be provided'
      },
      {
        id: 'field-013',
        type: FieldType.CHECKBOX,
        label: 'Emergency Service',
        x: 100,
        y: 280,
        width: 20,
        height: 20,
        required: false,
        checkboxLabel: 'Include 24/7 emergency service'
      },
      {
        id: 'field-014',
        type: FieldType.SIGNATURE,
        label: 'Authorized Signature',
        x: 100,
        y: 400,
        width: 200,
        height: 60,
        required: true
      }
    ],
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-20T12:15:00Z',
    isActive: true
  }
]

export default mockTemplates