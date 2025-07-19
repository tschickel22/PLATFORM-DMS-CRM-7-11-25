export interface TemplateField {
  id: string
  type: 'text' | 'date' | 'signature' | 'checkbox' | 'number' | 'email'
  label: string
  required: boolean
  x: number
  y: number
  width: number
  height: number
  page: number
  placeholder?: string
  defaultValue?: string
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
  }
}

export interface TemplateMetadata {
  id: string
  name: string
  type: 'PURCHASE' | 'LEASE' | 'SERVICE' | 'WARRANTY'
  description?: string
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  createdAt: Date
  updatedAt: Date
  createdBy: string
  version: number
  tags?: string[]
}

export interface AgreementTemplate {
  metadata: TemplateMetadata
  fields: TemplateField[]
  pdfFile?: File
  pdfBase64?: string
  mergeFields: Record<string, string>
  settings: {
    allowEditing: boolean
    requireAllFields: boolean
    autoSave: boolean
    signatureOrder?: string[]
  }
}

export interface TemplateListItem {
  id: string
  name: string
  type: string
  status: string
  lastModified: Date
  createdBy: string
  fieldCount: number
}

export const FIELD_TYPES = [
  { value: 'text', label: 'Text Field', icon: 'Type' },
  { value: 'date', label: 'Date Field', icon: 'Calendar' },
  { value: 'signature', label: 'Signature', icon: 'PenTool' },
  { value: 'checkbox', label: 'Checkbox', icon: 'CheckSquare' },
  { value: 'number', label: 'Number', icon: 'Hash' },
  { value: 'email', label: 'Email', icon: 'Mail' }
] as const

export const TEMPLATE_TYPES = [
  { value: 'PURCHASE', label: 'Purchase Agreement' },
  { value: 'LEASE', label: 'Lease Agreement' },
  { value: 'SERVICE', label: 'Service Agreement' },
  { value: 'WARRANTY', label: 'Warranty Agreement' }
] as const

export const TEMPLATE_STATUS = [
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'ACTIVE', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'ARCHIVED', label: 'Archived', color: 'bg-red-100 text-red-800' }
] as const

export const DEFAULT_MERGE_FIELDS = {
  // Customer fields
  'customer_name': 'Customer Name',
  'customer_email': 'Customer Email',
  'customer_phone': 'Customer Phone',
  'customer_address': 'Customer Address',
  
  // Vehicle fields
  'vehicle_info': 'Vehicle Information',
  'vehicle_vin': 'Vehicle VIN',
  'vehicle_year': 'Vehicle Year',
  'vehicle_make': 'Vehicle Make',
  'vehicle_model': 'Vehicle Model',
  
  // Agreement fields
  'agreement_date': 'Agreement Date',
  'effective_date': 'Effective Date',
  'expiration_date': 'Expiration Date',
  'total_amount': 'Total Amount',
  'down_payment': 'Down Payment',
  'monthly_payment': 'Monthly Payment',
  
  // Company fields
  'company_name': 'Company Name',
  'company_address': 'Company Address',
  'company_phone': 'Company Phone',
  'company_email': 'Company Email',
  
  // Current date/time
  'current_date': 'Current Date',
  'current_time': 'Current Time'
}