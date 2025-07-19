export interface AgreementTemplate {
  id: string
  name: string
  category: TemplateCategory
  description?: string
  files: TemplateFile[]
  fields: TemplateField[]
  status: TemplateStatus
  createdBy: string
  createdAt: Date
  updatedAt: Date
  companyId: string
  isDefault?: boolean
}

export interface TemplateFile {
  id: string
  name: string
  originalName: string
  type: 'pdf' | 'docx'
  url: string
  size: number
  uploadedAt: Date
  convertedPdfUrl?: string // For DOCX files converted to PDF
}

export interface TemplateField {
  id: string
  type: TemplateFieldType
  label: string
  placeholder?: string
  required: boolean
  position: FieldPosition
  size: FieldSize
  page: number
  assignedTo?: string // For multi-signer support
  validation?: FieldValidation
}

export interface FieldPosition {
  x: number
  y: number
}

export interface FieldSize {
  width: number
  height: number
}

export interface FieldValidation {
  pattern?: string
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

export enum TemplateCategory {
  PURCHASE = 'purchase',
  LEASE = 'lease',
  SERVICE = 'service',
  WARRANTY = 'warranty',
  CUSTOM = 'custom'
}

export enum TemplateStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

export enum TemplateFieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PHONE = 'phone',
  DATE = 'date',
  NUMBER = 'number',
  SIGNATURE = 'signature',
  CHECKBOX = 'checkbox',
  DROPDOWN = 'dropdown',
  TEXTAREA = 'textarea'
}

export interface TemplatePreview {
  templateId: string
  previewUrl: string
  expiresAt: Date
}