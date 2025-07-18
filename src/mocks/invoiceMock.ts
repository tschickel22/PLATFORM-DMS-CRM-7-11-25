export const mockInvoice = {
  sampleInvoices: [
    {
      id: 'inv-001',
      customerName: 'John Doe',
      dueDate: '2024-09-01',
      status: 'Paid',
      totalAmount: 1250,
      recurrence: 'Monthly',
      paymentMethod: 'ACH',
      lineItems: [
        { description: 'Base Rent', quantity: 1, unitPrice: 1000 },
        { description: 'Utilities', quantity: 1, unitPrice: 250 }
      ]
    },
    {
      id: 'inv-002',
      customerName: 'Jane Smith',
      dueDate: '2024-09-10',
      status: 'Overdue',
      totalAmount: 1450,
      recurrence: 'One-Time',
      paymentMethod: 'Credit Card',
      lineItems: [
        { description: 'Home Sale Commission', quantity: 1, unitPrice: 1200 },
        { description: 'Document Fees', quantity: 1, unitPrice: 250 }
      ]
    }
  ],

  formDefaults: {
    customerId: '',
    dueDate: '',
    recurrence: 'Monthly',
    notes: '',
    paymentMethod: 'ACH',
    lineItems: [{ description: '', quantity: 1, unitPrice: 0 }]
  },

  statusOptions: ['Draft', 'Unpaid', 'Paid', 'Overdue', 'Cancelled'],

  paymentMethods: ['ACH', 'Credit Card', 'Check', 'Cash'],

  csvFields: ['Invoice ID', 'Customer', 'Amount', 'Status', 'Due Date', 'Recurrence']
}

export default mockInvoice