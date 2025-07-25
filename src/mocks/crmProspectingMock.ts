export const mockCrmProspecting = {
  leadSources: ['Walk-In', 'Referral', 'Website', 'Phone Call', 'Social Media', 'Trade Show'],
  leadStatuses: ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'],
  preferredContactMethods: ['Phone', 'Email', 'Text'],
  tags: ['First-time Buyer', 'Investor', 'Out-of-State', 'Follow-up Needed'],
  pipelines: ['New Inquiry', 'In Progress', 'Negotiation', 'Closed Won', 'Closed Lost'],
  sequences: ['Initial Outreach', 'Second Touch', 'Final Attempt'],
  
  // Mock reps data for getRepById function
  reps: [
    { id: 'rep-001', name: 'Jamie Closer', email: 'jamie@company.com' },
    { id: 'rep-002', name: 'Avery Seller', email: 'avery@company.com' },
    { id: 'rep-003', name: 'Morgan Deal', email: 'morgan@company.com' }
  ],
  
  // Mock lead forms data for useLeadManagement
  leadForms: [
    {
      id: 'form-001',
      name: 'Standard Lead Form',
      description: 'Basic lead intake form',
      fields: []
    }
  ],
  
  // Mock nurture sequence data
  nurtureSequences: [
    {
      id: 'seq-001',
      name: 'Initial Outreach',
      description: 'Welcome new leads and introduce our services',
      steps: [
        { id: 'step-001', type: 'email', delay: 0, subject: 'Welcome to our dealership!', template: 'welcome-email' },
        { id: 'step-002', type: 'sms', delay: 1, message: 'Thanks for your interest! Call us at (555) 123-4567', template: 'welcome-sms' },
        { id: 'step-003', type: 'email', delay: 3, subject: 'See our latest inventory', template: 'inventory-showcase' },
        { id: 'step-004', type: 'call', delay: 7, notes: 'Follow up call to discuss needs', template: 'discovery-call' }
      ],
      isActive: true
    },
    {
      id: 'seq-002',
      name: 'Second Touch',
      description: 'Re-engage leads who showed initial interest',
      steps: [
        { id: 'step-005', type: 'email', delay: 0, subject: 'Still looking for the perfect RV?', template: 'reengagement-email' },
        { id: 'step-006', type: 'sms', delay: 2, message: 'Special financing options available this month!', template: 'financing-sms' },
        { id: 'step-007', type: 'email', delay: 5, subject: 'Customer testimonials', template: 'testimonials-email' }
      ],
      isActive: true
    },
    {
      id: 'seq-003',
      name: 'Final Attempt',
      description: 'Last chance to convert before marking as lost',
      steps: [
        { id: 'step-008', type: 'email', delay: 0, subject: 'Last chance - exclusive offer inside', template: 'final-offer-email' },
        { id: 'step-009', type: 'call', delay: 3, notes: 'Personal call to address any concerns', template: 'final-call' }
      ],
      isActive: true
    }
  ],

}

export default mockCrmProspecting