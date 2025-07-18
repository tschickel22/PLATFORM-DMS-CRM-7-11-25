import { Agreement } from '@/types'
import { mockAgreements } from '@/mocks/agreementsMock'

interface SignatureRequestOptions {
  method: 'email' | 'sms' | 'both'
  reminderEnabled?: boolean
  reminderIntervalDays?: number
  maxReminders?: number
  customMessage?: string
}

export async function sendSignatureRequest(
  agreement: Agreement, 
  options: SignatureRequestOptions = { method: 'email' }
): Promise<{ success: boolean; message: string; signatureUrl?: string }> {
  try {
    // Generate a unique signature URL (in real app, this would be done server-side)
    const signatureUrl = `${window.location.origin}/sign/${agreement.id}?token=${generateSignatureToken()}`
    
    // Get template based on agreement type
    const template = getSignatureTemplate(agreement.type, options.method)
    
    // Replace variables in template
    const processedTemplate = replaceTemplateVariables(template, agreement, signatureUrl)
    
    // Simulate sending the request
    await simulateSendRequest(agreement, processedTemplate, options)
    
    return {
      success: true,
      message: `Signature request sent via ${options.method}`,
      signatureUrl
    }
  } catch (error) {
    console.error('Error sending signature request:', error)
    return {
      success: false,
      message: 'Failed to send signature request'
    }
  }
}

function generateSignatureToken(): string {
  // In a real app, this would be a secure JWT token
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function getSignatureTemplate(agreementType: string, method: 'email' | 'sms' | 'both') {
  const templates = mockAgreements.signatureRequestTemplates
  
  if (method === 'email' || method === 'both') {
    return templates.email
  } else {
    return templates.sms
  }
}

function replaceTemplateVariables(
  template: any, 
  agreement: Agreement, 
  signatureUrl: string
): any {
  const variables = {
    customer_name: agreement.customerName,
    agreement_type: agreement.type,
    vehicle_info: agreement.vehicleInfo || 'N/A',
    effective_date: new Date(agreement.effectiveDate).toLocaleDateString(),
    signature_link: signatureUrl,
    company_name: 'Your Company Name', // In real app, get from tenant settings
    company_phone: '(555) 123-4567', // In real app, get from tenant settings
  }
  
  if (template.subject) {
    // Email template
    return {
      subject: replaceVariables(template.subject, variables),
      body: replaceVariables(template.body, variables)
    }
  } else {
    // SMS template
    return {
      message: replaceVariables(template.message, variables)
    }
  }
}

function replaceVariables(text: string, variables: Record<string, string>): string {
  let result = text
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, value)
  })
  
  return result
}

async function simulateSendRequest(
  agreement: Agreement, 
  processedTemplate: any, 
  options: SignatureRequestOptions
): Promise<void> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, this would:
  // 1. Send email via email provider (SendGrid, etc.)
  // 2. Send SMS via SMS provider (Twilio, etc.)
  // 3. Log the request in the database
  // 4. Set up reminder schedule if enabled
  
  console.log('Signature request sent:', {
    agreementId: agreement.id,
    customer: agreement.customerName,
    method: options.method,
    template: processedTemplate
  })
  
  // Simulate successful send
  return Promise.resolve()
}

export function validateSignatureToken(token: string, agreementId: string): boolean {
  // In a real app, this would validate the JWT token
  // For demo purposes, we'll just check if token exists and is not empty
  return token && token.length > 0
}

export function generateSignatureLink(agreementId: string): string {
  const token = generateSignatureToken()
  return `${window.location.origin}/sign/${agreementId}?token=${token}`
}