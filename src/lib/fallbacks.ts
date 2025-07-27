export const safeFallbackTenant = {
  id: 'fallback-id',
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

export const createSafeFallbackTenant = (id?: string) => ({
  ...safeFallbackTenant,
  id: id || 'fallback-id'
})