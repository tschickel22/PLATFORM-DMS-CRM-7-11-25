export const mockCompanySettings = {
  branding: {
    logoUrl: '/mock/logo.png',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    fontFamily: 'Inter',
    fontOptions: [
      { value: 'Inter', label: 'Inter' },
      { value: 'Roboto', label: 'Roboto' },
      { value: 'Open Sans', label: 'Open Sans' },
      { value: 'Montserrat', label: 'Montserrat' },
      { value: 'Lato', label: 'Lato' },
      { value: 'Poppins', label: 'Poppins' },
      { value: 'Source Sans Pro', label: 'Source Sans Pro' },
      { value: 'Oswald', label: 'Oswald' }
    ]
  },
  
  labelOverrides: {
    platformTypes: [
      { value: 'rv', label: 'RV Dealership' },
      { value: 'mh', label: 'Manufactured Housing' },
      { value: 'both', label: 'Both RV & Manufactured Housing' }
    ],
    defaultLabels: {
      general: {
        'vehicle': 'Home/RV',
        'customer': 'Customer',
        'deal': 'Deal',
        'quote': 'Quote',
        'service': 'Service',
        'inventory': 'Inventory'
      },
      crm: {
        'lead': 'Lead',
        'prospect': 'Prospect',
        'contact': 'Contact',
        'activity': 'Activity',
        'source': 'Source'
      },
      inventory: {
        'vin': 'VIN',
        'make': 'Make',
        'model': 'Model',
        'year': 'Year',
        'type': 'Type',
        'price': 'Price',
        'cost': 'Cost',
        'features': 'Features'
      },
      sales: {
        'salesperson': 'Sales Rep',
        'commission': 'Commission',
        'deal_stage': 'Deal Stage',
        'close_date': 'Close Date',
        'financing': 'Financing'
      },
      service: {
        'technician': 'Technician',
        'service_ticket': 'Service Ticket',
        'parts': 'Parts',
        'labor': 'Labor',
        'warranty': 'Warranty'
      }
    }
  },
  
  customFields: {
    modules: [
      'crm',
      'inventory',
      'quotes',
      'agreements',
      'service',
      'delivery',
      'invoices'
    ],
    sections: {
      crm: ['Lead Information', 'Contact Details', 'Preferences', 'Notes'],
      inventory: ['Vehicle Details', 'Specifications', 'Pricing', 'Features'],
      quotes: ['Quote Details', 'Terms', 'Pricing'],
      agreements: ['Agreement Details', 'Terms', 'Conditions'],
      service: ['Service Details', 'Customer Requirements', 'Technical Notes'],
      delivery: ['Delivery Details', 'Customer Instructions', 'Logistics'],
      invoices: ['Invoice Details', 'Payment Terms', 'Additional Charges']
    },
    sampleFields: [
      {
        id: 'sample-1',
        name: 'Customer Budget',
        type: 'number',
        required: false,
        module: 'crm',
        section: 'Lead Information'
      },
      {
        id: 'sample-2',
        name: 'Preferred Contact Method',
        type: 'select',
        required: true,
        options: ['Email', 'Phone', 'Text'],
        module: 'crm',
        section: 'Contact Details'
      }
    ]
  },
  
  integrations: {
    emailProviders: [
      { value: 'default', label: 'Default (Platform)' },
      { value: 'sendgrid', label: 'SendGrid' },
      { value: 'mailchimp', label: 'Mailchimp' },
      { value: 'mailgun', label: 'Mailgun' },
      { value: 'smtp', label: 'Custom SMTP' }
    ],
    smsProviders: [
      { value: 'default', label: 'Default (Platform)' },
      { value: 'twilio', label: 'Twilio' },
      { value: 'messagebird', label: 'MessageBird' },
      { value: 'vonage', label: 'Vonage (Nexmo)' }
    ],
    webhookEvents: [
      { value: 'lead.created', label: 'Lead Created' },
      { value: 'lead.updated', label: 'Lead Updated' },
      { value: 'quote.created', label: 'Quote Created' },
      { value: 'quote.accepted', label: 'Quote Accepted' },
      { value: 'service.created', label: 'Service Ticket Created' },
      { value: 'service.completed', label: 'Service Completed' },
      { value: 'vehicle.created', label: 'Home/RV Created' },
      { value: 'vehicle.sold', label: 'Home/RV Sold' }
    ]
  },
  
  notifications: {
    emailTypes: [
      { value: 'welcome', label: 'Welcome Email' },
      { value: 'quote', label: 'Quote Email' },
      { value: 'service', label: 'Service Notification' },
      { value: 'delivery', label: 'Delivery Notification' },
      { value: 'invoice', label: 'Invoice Email' },
      { value: 'password_reset', label: 'Password Reset' },
      { value: 'custom', label: 'Custom Email' }
    ],
    smsTypes: [
      { value: 'welcome', label: 'Welcome SMS' },
      { value: 'quote', label: 'Quote SMS' },
      { value: 'service', label: 'Service Notification' },
      { value: 'delivery', label: 'Delivery Notification' },
      { value: 'appointment', label: 'Appointment Reminder' },
      { value: 'custom', label: 'Custom SMS' }
    ],
    commonVariables: [
      '{{first_name}}',
      '{{last_name}}',
      '{{company_name}}',
      '{{quote_number}}',
      '{{invoice_number}}',
      '{{service_ticket}}',
      '{{delivery_date}}',
      '{{appointment_date}}',
      '{{appointment_time}}',
      '{{login_url}}',
      '{{reset_url}}'
    ],
    sampleTemplates: {
      email: [
        {
          id: 'welcome-email',
          name: 'Welcome Email',
          subject: 'Welcome to {{company_name}}!',
          body: 'Hi {{first_name}},\n\nWelcome to {{company_name}}! We\'re excited to have you as a customer.\n\nBest regards,\nThe {{company_name}} Team',
          type: 'welcome',
          variables: ['first_name', 'company_name'],
          isActive: true
        }
      ],
      sms: [
        {
          id: 'appointment-reminder',
          name: 'Appointment Reminder',
          message: 'Hi {{first_name}}, this is a reminder about your appointment on {{appointment_date}} at {{appointment_time}}. See you soon!',
          type: 'appointment',
          variables: ['first_name', 'appointment_date', 'appointment_time'],
          isActive: true
        }
      ]
    }
  },
  
  defaults: {
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    platformType: 'both',
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '12:00', close: '17:00', closed: false }
    },
    features: {
      crm: true,
      inventory: true,
      quotes: true,
      agreements: true,
      service: true,
      delivery: true,
      commissions: true,
      portal: true,
      invoices: true,
      reports: true
    },
    companyInfo: {
      name: 'Demo RV Dealership',
      domain: 'demo.renterinsight.com'
    },
    tabs: [
      { id: 'general', name: 'General', icon: 'Building' },
      { id: 'branding', name: 'Branding', icon: 'Palette' },
      { id: 'labels', name: 'Labels', icon: 'Tag' },
      { id: 'notifications', name: 'Notifications', icon: 'Mail' },
      { id: 'integrations', name: 'Integrations', icon: 'Globe' },
      { id: 'users', name: 'Users', icon: 'Users' },
      { id: 'custom-fields', name: 'Custom Fields', icon: 'Settings' }
    ]
  }
}

export default mockCompanySettings