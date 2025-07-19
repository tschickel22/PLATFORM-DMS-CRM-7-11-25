export enum FieldType {
  TEXT = 'text',
  DATE = 'date',
  SIGNATURE = 'signature',
  CHECKBOX = 'checkbox'
}

export interface BaseField {
  id: string
  type: FieldType
  label: string
  x: number
  y: number
  width: number
  height: number
  required: boolean
}

export interface TextField extends BaseField {
  type: FieldType.TEXT
  defaultValue?: string
  placeholder?: string
}

export interface DateField extends BaseField {
  type: FieldType.DATE
  defaultValue?: string
  format?: string
}

export interface SignatureField extends BaseField {
  type: FieldType.SIGNATURE
  signedBy?: string
  signedAt?: string
}

export interface CheckboxField extends BaseField {
  type: FieldType.CHECKBOX
  defaultChecked?: boolean
  checkboxLabel?: string
}

export type TemplateField = TextField | DateField | SignatureField | CheckboxField

export interface Template {
  id: string
  name: string
  description?: string
  pdfBase64: string
  fields: TemplateField[]
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface TemplatePosition {
  x: number
  y: number
}

export interface TemplateSize {
  width: number
  height: number
}

export interface FieldConfig {
  type: FieldType
  label: string
  icon: string
  defaultSize: TemplateSize
}