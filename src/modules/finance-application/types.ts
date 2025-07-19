export interface FinanceApplication {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  templateId: string
  status: ApplicationStatus
  data: ApplicationData
  uploadedFiles: UploadedFile[]
  fraudCheckStatus?: FraudCheckStatus
  createdAt: string
  updatedAt: string
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
}

export interface ApplicationTemplate {
  id: string
  name: string
  description: string
  sections: ApplicationSection[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ApplicationSection {
  id: string
  title: string
  description?: string
  order: number
  fields: ApplicationField[]
}

export interface ApplicationField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  order: number
  options?: string[] // For select, radio, checkbox fields
  validation?: FieldValidation
  conditionalLogic?: ConditionalLogic
}

export interface FieldValidation {
  minLength?: number
  maxLength?: number
  pattern?: string
  min?: number
  max?: number
  fileTypes?: string[]
  maxFileSize?: number
}

export interface ConditionalLogic {
  dependsOn: string // Field ID
  condition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: any
}

export interface ApplicationData {
  [sectionId: string]: {
    [fieldId: string]: any
  }
}

export interface UploadedFile {
  id: string
  fieldId: string
  name: string
  type: string
  size: number
  url: string // In real app, this would be a storage URL
  uploadedAt: string
}

export interface CustomerInvite {
  id?: string
  name: string
  email: string
  phone?: string
  source?: string
}

export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'denied' 
  | 'completed'

export type FraudCheckStatus = 
  | 'pending' 
  | 'verified' 
  | 'flagged'

export type FieldType = 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'number' 
  | 'currency' 
  | 'date' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'textarea' 
  | 'file' 
  | 'signature'

export interface ApplicationMetrics {
  totalApplications: number
  pendingReview: number
  approvalRate: number
  avgProcessingTime: number
  monthlyGrowth: number
}