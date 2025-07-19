export interface DocumentField {
  id: string
  type: 'text' | 'signature' | 'date' | 'checkbox' | 'dropdown'
  label: string
  position: {
    x: number // percentage
    y: number // percentage
    width: number // pixels
    height: number // pixels
  }
  required: boolean
  mergeField?: string
  defaultValue?: string
  options?: string[] // for dropdown fields
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    message?: string
  }
}

export interface AgreementTemplate {
  id: string
  name: string
  description: string
  type: 'PURCHASE' | 'LEASE' | 'SERVICE' | 'WARRANTY'
  category: string
  version: string
  isActive: boolean
  usageCount?: number
  tags?: string[]
  terms: string
  mergeFields: string[]
  documentUrl?: string
  documentFields: DocumentField[]
  createdAt: Date | string
  updatedAt: Date | string
  createdBy: string
}

export interface SignatureRequest {
  id: string
  templateId: string
  recipientEmail: string
  recipientName: string
  status: 'pending' | 'sent' | 'viewed' | 'signed' | 'completed' | 'expired'
  sentAt?: Date
  viewedAt?: Date
  signedAt?: Date
  expiresAt: Date
  documentUrl: string
  signatureData?: string
  ipAddress?: string
  mergeData: Record<string, string>
}

export interface TemplateValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  fieldCount: number
  mappedFieldCount: number
  requiredFieldsMapped: boolean
}