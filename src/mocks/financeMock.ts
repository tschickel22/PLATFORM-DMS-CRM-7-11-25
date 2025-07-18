export const mockFinance = {
  termOptions: [12, 24, 36, 48, 60, 72],
  interestRates: [5.0, 6.5, 7.25, 8.0, 9.99],
  paymentFrequencies: ['Monthly', 'Bi-Weekly', 'Weekly'],
  statusOptions: ['Current', 'Late', 'Default', 'Paid Off'],
  defaultLoan: {
    amount: 25000,
    rate: 7.25,
    termMonths: 60,
    downPayment: 3000,
    startDate: '2023-01-01'
  },
  samplePayments: [
    {
      id: 'pmt-001',
      date: '2024-01-15',
      amount: 450,
      status: 'Completed'
    },
    {
      id: 'pmt-002',
      date: '2024-02-15',
      amount: 450,
      status: 'Pending'
    }
  ]
}

export default mockFinance