import { mockAgreements } from '@/mocks/agreementsMock'

interface SignatureRequestData {
  agreementId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  agreementType: string
  vehicleInfo?: string
  effectiveDate: string
  signatureLink: string
}

interface CompanySettings {
  name: string
  phone?: string
  emailProvider?: string
  emailApiKey?: string
  emailFromAddress?: string
  emailFromName?: string
  smsProvider?: string
  smsApiKey?: string
  smsFromNumber?: string
}

interface PlatformSettings {
  emailProvider: string
  emailApiKey: string
  emailFromAddress: string
  emailFromName: string
  smsProvider: string
  smsApiKey: string
  smsFromNumber: string
}

/**
 * Sends signature request via email and/or SMS using platform or company settings
 */
export async function sendSignatureRequest(
  data: SignatureRequestData,
  companySettings: CompanySettings,
  platformSettings?: PlatformSettings,
  sendSMS: boolean = false
): Promise<{ success: boolean; message: string }> {
  try {
    const results: boolean[] = []

    // Always send email
    const emailResult = await sendEmailSignatureRequest(data, companySettings, platformSettings)
    results.push(emailResult.success)

    // Send SMS if requested and phone number available
    if (sendSMS && data.customerPhone) {
      const smsResult = await sendSMSSignatureRequest(data, companySettings, platformSettings)
      results.push(smsResult.success)
    }

    const allSuccessful = results.every(result => result)
    const anySuccessful = results.some(result => result)

    if (allSuccessful) {
      return {
        success: true,
        message: sendSMS ? 'Signature request sent via email and SMS' : 'Signature request sent via email'
      }
    } else if (anySuccessful) {
      return {
        success: true,
        message: 'Signature request partially sent (some methods failed)'
      }
    } else {
      return {
        success: false,
        message: 'Failed to send signature request'
      }
    }
  } catch (error) {
    console.error('Error sending signature request:', error)
    return {
      success: false,
      message: 'Failed to send signature request due to system error'
    }
  }
}

/**
 * Sends email signature request using configured email provider
 */
async function sendEmailSignatureRequest(
  data: SignatureRequestData,
  companySettings: CompanySettings,
  platformSettings?: PlatformSettings
): Promise<{ success: boolean; message: string }> {
  try {
    // Determine email settings (company overrides platform)
    const emailProvider = companySettings.emailProvider || platformSettings?.emailProvider || 'default'
    const emailApiKey = companySettings.emailApiKey || platformSettings?.emailApiKey
    const fromAddress = companySettings.emailFromAddress || platformSettings?.emailFromAddress
    const fromName = companySettings.emailFromName || platformSettings?.emailFromName || companySettings.name

    // Use template from mock data
    const template = mockAgreements.signatureRequestTemplates.email
    
    // Replace template variables
    const subject = template.subject
      .replace('{{agreement_type}}', data.agreementType)
      .replace('{{customer_name}}', data.customerName)

    const body = template.body
      .replace(/{{customer_name}}/g, data.customerName)
      .replace(/{{agreement_type}}/g, data.agreementType)
      .replace(/{{vehicle_info}}/g, data.vehicleInfo || 'N/A')
      .replace(/{{effective_date}}/g, data.effectiveDate)
      .replace(/{{signature_link}}/g, data.signatureLink)
      .replace(/{{company_name}}/g, companySettings.name)
      .replace(/{{company_phone}}/g, companySettings.phone || 'N/A')

    // Send email based on provider
    switch (emailProvider) {
      case 'sendgrid':
        return await sendViaSendGrid({
          to: data.customerEmail,
          from: fromAddress!,
          fromName: fromName!,
          subject,
          body,
          apiKey: emailApiKey!
        })

      case 'mailgun':
        return await sendViaMailgun({
          to: data.customerEmail,
          from: fromAddress!,
          fromName: fromName!,
          subject,
          body,
          apiKey: emailApiKey!
        })

      case 'smtp':
        return await sendViaSMTP({
          to: data.customerEmail,
          from: fromAddress!,
          fromName: fromName!,
          subject,
          body,
          smtpConfig: {
            host: process.env.SMTP_HOST || '',
            port: parseInt(process.env.SMTP_PORT || '587'),
            username: process.env.SMTP_USERNAME || '',
            password: process.env.SMTP_PASSWORD || ''
          }
        })

      default:
        // Use platform default email service
        return await sendViaDefaultEmail({
          to: data.customerEmail,
          from: fromAddress || 'noreply@renterinsight.com',
          fromName: fromName!,
          subject,
          body
        })
    }
  } catch (error) {
    console.error('Error sending email signature request:', error)
    return {
      success: false,
      message: 'Failed to send email signature request'
    }
  }
}

/**
 * Sends SMS signature request using configured SMS provider
 */
async function sendSMSSignatureRequest(
  data: SignatureRequestData,
  companySettings: CompanySettings,
  platformSettings?: PlatformSettings
): Promise<{ success: boolean; message: string }> {
  try {
    // Determine SMS settings (company overrides platform)
    const smsProvider = companySettings.smsProvider || platformSettings?.smsProvider || 'default'
    const smsApiKey = companySettings.smsApiKey || platformSettings?.smsApiKey
    const fromNumber = companySettings.smsFromNumber || platformSettings?.smsFromNumber

    // Use template from mock data
    const template = mockAgreements.signatureRequestTemplates.sms
    
    // Replace template variables
    const message = template.message
      .replace(/{{customer_name}}/g, data.customerName)
      .replace(/{{agreement_type}}/g, data.agreementType)
      .replace(/{{signature_link}}/g, data.signatureLink)
      .replace(/{{company_name}}/g, companySettings.name)

    // Send SMS based on provider
    switch (smsProvider) {
      case 'twilio':
        return await sendViaTwilio({
          to: data.customerPhone!,
          from: fromNumber!,
          message,
          apiKey: smsApiKey!
        })

      case 'messagebird':
        return await sendViaMessageBird({
          to: data.customerPhone!,
          from: fromNumber!,
          message,
          apiKey: smsApiKey!
        })

      case 'vonage':
        return await sendViaVonage({
          to: data.customerPhone!,
          from: fromNumber!,
          message,
          apiKey: smsApiKey!
        })

      default:
        // Use platform default SMS service
        return await sendViaDefaultSMS({
          to: data.customerPhone!,
          from: fromNumber || 'RenterInsight',
          message
        })
    }
  } catch (error) {
    console.error('Error sending SMS signature request:', error)
    return {
      success: false,
      message: 'Failed to send SMS signature request'
    }
  }
}

// Email Provider Implementations
async function sendViaSendGrid(params: {
  to: string
  from: string
  fromName: string
  subject: string
  body: string
  apiKey: string
}): Promise<{ success: boolean; message: string }> {
  // In a real implementation, you would use the SendGrid API
  console.log('Sending via SendGrid:', params)
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    message: 'Email sent via SendGrid'
  }
}

async function sendViaMailgun(params: {
  to: string
  from: string
  fromName: string
  subject: string
  body: string
  apiKey: string
}): Promise<{ success: boolean; message: string }> {
  // In a real implementation, you would use the Mailgun API
  console.log('Sending via Mailgun:', params)
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    message: 'Email sent via Mailgun'
  }
}

async function sendViaSMTP(params: {
  to: string
  from: string
  fromName: string
  subject: string
  body: string
  smtpConfig: {
    host: string
    port: number
    username: string
    password: string
  }
}): Promise<{ success: boolean; message: string }> {
  // In a real implementation, you would use nodemailer or similar
  console.log('Sending via SMTP:', params)
  
  // Simulate SMTP send
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    message: 'Email sent via SMTP'
  }
}

async function sendViaDefaultEmail(params: {
  to: string
  from: string
  fromName: string
  subject: string
  body: string
}): Promise<{ success: boolean; message: string }> {
  // In a real implementation, you would use the platform's default email service
  console.log('Sending via default email service:', params)
  
  // Simulate platform email service
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    success: true,
    message: 'Email sent via platform service'
  }
}

// SMS Provider Implementations
async function sendViaTwilio(params: {
  to: string
  from: string
  message: string
  apiKey: string
}): Promise<{ success: boolean; message: string }> {
  // In a real implementation, you would use the Twilio API
  console.log('Sending via Twilio:', params)
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    message: 'SMS sent via Twilio'
  }
}

async function sendViaMessageBird(params: {
  to: string
  from: string
  message: string
  apiKey: string
}): Promise<{ success: boolean; message: string }> {
  // In a real implementation, you would use the MessageBird API
  console.log('Sending via MessageBird:', params)
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    message: 'SMS sent via MessageBird'
  }
}

async function sendViaVonage(params: {
  to: string
  from: string
  message: string
  apiKey: string
}): Promise<{ success: boolean; message: string }> {
  // In a real implementation, you would use the Vonage API
  console.log('Sending via Vonage:', params)
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    message: 'SMS sent via Vonage'
  }
}

async function sendViaDefaultSMS(params: {
  to: string
  from: string
  message: string
}): Promise<{ success: boolean; message: string }> {
  // In a real implementation, you would use the platform's default SMS service
  console.log('Sending via default SMS service:', params)
  
  // Simulate platform SMS service
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    success: true,
    message: 'SMS sent via platform service'
  }
}

/**
 * Generates a secure signature link for the agreement
 */
export function generateSignatureLink(agreementId: string, baseUrl?: string): string {
  const base = baseUrl || window.location.origin
  const token = generateSecureToken(agreementId)
  return `${base}/sign/${agreementId}?token=${token}`
}

/**
 * Generates a secure token for signature verification
 */
function generateSecureToken(agreementId: string): string {
  // In a real implementation, you would use a proper JWT or similar secure token
  // This is a simplified version for demo purposes
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  return btoa(`${agreementId}:${timestamp}:${randomString}`)
}