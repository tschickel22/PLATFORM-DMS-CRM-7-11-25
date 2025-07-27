export const safeFallbackTenant = {
  id: '11111111-1111-1111-1111-111111111111', // Use valid UUID
  name: 'Demo Company',
  domain: 'demo.renterinsight.com',
  timezone: 'America/Chicago',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  settings: {
    timezone: 'America/Chicago',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  },
  branding: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b'
  },
  customFields: []
}

export const createSafeFallbackTenant = (id?: string | null) => ({
  ...safeFallbackTenant,
  id: id || '11111111-1111-1111-1111-111111111111' // Always use valid UUID
})