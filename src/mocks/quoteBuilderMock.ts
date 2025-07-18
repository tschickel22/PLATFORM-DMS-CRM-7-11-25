export const mockQuoteBuilder = {
  termLengths: [12, 24, 36, 48, 60, 72],
  interestRates: [5.99, 6.99, 7.99, 9.99],
  paymentFrequencies: ['Monthly', 'Bi-Weekly', 'Weekly'],
  defaultDownPayments: [0, 500, 1000, 1500],
  dealerFees: ['Document Fee', 'Prep Fee', 'Delivery Fee'],
  templates: [
    {
      name: 'Standard Quote',
      description: 'Includes base unit, delivery, and standard fees.'
    },
    {
      name: 'Promo Offer',
      description: 'Includes discount and waived delivery fee.'
    }
  ]
}

export default mockQuoteBuilder