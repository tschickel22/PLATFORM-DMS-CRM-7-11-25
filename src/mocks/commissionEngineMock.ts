export const mockCommissionEngine = {
  payPeriods: ['Weekly', 'Bi-Weekly', 'Monthly'],
  commissionTypes: ['Flat', 'Percentage', 'Tiered'],
  ruleTypes: ['Revenue', 'Unit', 'Bonus'],
  defaultSettings: {
    payPeriod: 'Monthly',
    commissionType: 'Percentage',
    rate: 0.05
  },
  salesReps: [
    { id: 'rep-1', name: 'Jamie Sales' },
    { id: 'rep-2', name: 'Morgan Closer' }
  ],
  sampleRules: [
    {
      id: 'rule-001',
      name: '5% on RV Sales',
      type: 'Percentage',
      rate: 0.05,
      criteria: 'vehicle.type === "RV"'
    }
  ],
  sampleCommissions: [
    {
      id: 'comm-001',
      repId: 'rep-1',
      amount: 1250,
      period: 'June 2025',
      ruleId: 'rule-001',
      saleAmount: 25000
    }
  ]
}

export default mockCommissionEngine