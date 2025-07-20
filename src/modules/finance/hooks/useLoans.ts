import { useState, useEffect } from 'react'
import { Loan, LoanHistoryEntry, LoanStatus, LoanHistoryType } from '@/types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

// Mock loan data
const mockLoans: Loan[] = [
  {
    id: 'loan-001',
    customerId: 'portal-customer-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '(555) 123-4567',
    vehicleId: 'vh-001',
    vehicleInfo: '2020 Forest River Cherokee 274RK',
    loanAmount: 45000,
    downPayment: 5000,
    interestRate: 7.25,
    termMonths: 60,
    monthlyPayment: 895.50,
    startDate: '2023-06-15T00:00:00Z',
    status: LoanStatus.CURRENT,
    remainingBalance: 38750,
    nextPaymentDate: '2024-02-15T00:00:00Z',
    totalPaid: 11250,
    paymentsRemaining: 43,
    history: [
      {
        id: 'hist-001',
        timestamp: '2024-01-15T08:30:00Z',
        type: LoanHistoryType.PAYMENT,
        amount: 895.50,
        principalAmount: 645.30,
        interestAmount: 250.20,
        description: 'Monthly payment processed',
        paymentMethod: 'ACH',
        transactionId: 'TXN-20240115-001',
        status: 'completed'
      },
      {
        id: 'hist-002',
        timestamp: '2023-12-15T08:30:00Z',
        type: LoanHistoryType.PAYMENT,
        amount: 895.50,
        principalAmount: 641.85,
        interestAmount: 253.65,
        description: 'Monthly payment processed',
        paymentMethod: 'ACH',
        transactionId: 'TXN-20231215-001',
        status: 'completed'
      },
      {
        id: 'hist-003',
        timestamp: '2023-06-15T10:00:00Z',
        type: LoanHistoryType.STATUS_CHANGE,
        description: 'Loan originated and activated',
        status: 'active'
      }
    ],
    isPortalVisible: true,
    portalNotes: 'Your RV loan is current and in good standing. Automatic payments are set up for the 15th of each month.',
    createdAt: '2023-06-10T14:30:00Z',
    updatedAt: '2024-01-15T09:20:00Z'
  },
  {
    id: 'loan-002',
    customerId: 'portal-customer-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '(555) 123-4567',
    vehicleId: 'vh-002',
    vehicleInfo: '2019 Keystone Montana 3761FL',
    loanAmount: 62000,
    downPayment: 8000,
    interestRate: 6.5,
    termMonths: 72,
    monthlyPayment: 1025.75,
    startDate: '2023-03-01T00:00:00Z',
    status: LoanStatus.CURRENT,
    remainingBalance: 51200,
    nextPaymentDate: '2024-02-01T00:00:00Z',
    totalPaid: 18900,
    paymentsRemaining: 61,
    history: [
      {
        id: 'hist-004',
        timestamp: '2024-01-01T08:30:00Z',
        type: LoanHistoryType.PAYMENT,
        amount: 1025.75,
        principalAmount: 692.40,
        interestAmount: 333.35,
        description: 'Monthly payment processed',
        paymentMethod: 'Check',
        transactionId: 'CHK-20240101-002',
        status: 'completed'
      },
      {
        id: 'hist-005',
        timestamp: '2023-03-01T10:00:00Z',
        type: LoanHistoryType.STATUS_CHANGE,
        description: 'Loan originated and activated',
        status: 'active'
      }
    ],
    isPortalVisible: true,
    portalNotes: 'This is your second RV loan with us. Thank you for your continued business!',
    createdAt: '2023-02-25T11:15:00Z',
    updatedAt: '2024-01-01T16:45:00Z'
  },
  {
    id: 'loan-003',
    customerId: 'cust-002',
    customerName: 'Maria Rodriguez',
    customerEmail: 'maria.rodriguez@email.com',
    customerPhone: '(555) 987-6543',
    vehicleId: 'vh-003',
    vehicleInfo: '2021 Grand Design Solitude 310GK',
    loanAmount: 55000,
    downPayment: 7000,
    interestRate: 7.0,
    termMonths: 60,
    monthlyPayment: 1089.25,
    startDate: '2023-08-01T00:00:00Z',
    status: LoanStatus.CURRENT,
    remainingBalance: 47500,
    nextPaymentDate: '2024-02-01T00:00:00Z',
    totalPaid: 6535.50,
    paymentsRemaining: 54,
    history: [
      {
        id: 'hist-006',
        timestamp: '2024-01-01T08:30:00Z',
        type: LoanHistoryType.PAYMENT,
        amount: 1089.25,
        principalAmount: 767.50,
        interestAmount: 321.75,
        description: 'Monthly payment processed',
        paymentMethod: 'ACH',
        transactionId: 'TXN-20240101-003',
        status: 'completed'
      }
    ],
    isPortalVisible: false, // This loan is not visible in portal
    createdAt: '2023-07-25T09:00:00Z',
    updatedAt: '2024-01-01T08:30:00Z'
  }
]

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([])

  // Load loans from localStorage on mount
  useEffect(() => {
    const savedLoans = loadFromLocalStorage<Loan[]>('loans', mockLoans)
    setLoans(savedLoans)
  }, [])

  // Save to localStorage whenever loans change
  useEffect(() => {
    saveToLocalStorage('loans', loans)
  }, [loans])

  const createLoan = (loanData: Partial<Loan>): Loan => {
    const newLoan: Loan = {
      id: `loan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerId: loanData.customerId || '',
      customerName: loanData.customerName || '',
      customerEmail: loanData.customerEmail || '',
      customerPhone: loanData.customerPhone || '',
      vehicleId: loanData.vehicleId || '',
      vehicleInfo: loanData.vehicleInfo || '',
      loanAmount: loanData.loanAmount || 0,
      downPayment: loanData.downPayment || 0,
      interestRate: loanData.interestRate || 0,
      termMonths: loanData.termMonths || 60,
      monthlyPayment: loanData.monthlyPayment || 0,
      startDate: loanData.startDate || new Date().toISOString(),
      status: loanData.status || LoanStatus.ACTIVE,
      remainingBalance: loanData.remainingBalance || (loanData.loanAmount || 0),
      nextPaymentDate: loanData.nextPaymentDate || new Date().toISOString(),
      totalPaid: loanData.totalPaid || 0,
      paymentsRemaining: loanData.paymentsRemaining || (loanData.termMonths || 60),
      history: loanData.history || [],
      isPortalVisible: loanData.isPortalVisible || false,
      portalNotes: loanData.portalNotes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setLoans(prev => [newLoan, ...prev])
    return newLoan
  }

  const updateLoan = (id: string, updates: Partial<Loan>) => {
    setLoans(prev => prev.map(loan => 
      loan.id === id 
        ? { ...loan, ...updates, updatedAt: new Date().toISOString() }
        : loan
    ))
  }

  const deleteLoan = (id: string) => {
    setLoans(prev => prev.filter(loan => loan.id !== id))
  }

  const getLoanById = (id: string): Loan | undefined => {
    return loans.find(loan => loan.id === id)
  }

  const getLoansByCustomer = (customerId: string): Loan[] => {
    return loans.filter(loan => loan.customerId === customerId)
  }

  const getPortalLoansByCustomer = (customerId: string): Loan[] => {
    return loans.filter(loan => 
      loan.customerId === customerId && loan.isPortalVisible
    )
  }

  const addLoanHistoryEntry = (loanId: string, entry: Omit<LoanHistoryEntry, 'id' | 'timestamp'>) => {
    const loan = getLoanById(loanId)
    if (!loan) return

    const newEntry: LoanHistoryEntry = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...entry
    }

    updateLoan(loanId, {
      history: [newEntry, ...loan.history]
    })
  }

  const makePayment = (loanId: string, amount: number, paymentMethod: string = 'Online') => {
    const loan = getLoanById(loanId)
    if (!loan) return

    // Calculate principal and interest (simplified calculation)
    const monthlyInterest = (loan.remainingBalance * (loan.interestRate / 100)) / 12
    const principalAmount = Math.max(0, amount - monthlyInterest)
    const interestAmount = Math.min(amount, monthlyInterest)

    const newBalance = Math.max(0, loan.remainingBalance - principalAmount)
    const newTotalPaid = loan.totalPaid + amount
    const newPaymentsRemaining = Math.max(0, loan.paymentsRemaining - 1)

    // Add payment to history
    addLoanHistoryEntry(loanId, {
      type: LoanHistoryType.PAYMENT,
      amount,
      principalAmount,
      interestAmount,
      description: `Payment processed via ${paymentMethod}`,
      paymentMethod,
      transactionId: `TXN-${Date.now()}`,
      status: 'completed'
    })

    // Update loan
    updateLoan(loanId, {
      remainingBalance: newBalance,
      totalPaid: newTotalPaid,
      paymentsRemaining: newPaymentsRemaining,
      status: newBalance === 0 ? LoanStatus.PAID_OFF : loan.status,
      nextPaymentDate: newBalance > 0 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Next month
        : loan.nextPaymentDate
    })

    // If loan is paid off, add payoff entry
    if (newBalance === 0) {
      addLoanHistoryEntry(loanId, {
        type: LoanHistoryType.PAYOFF,
        description: 'Loan paid in full',
        status: 'paid_off'
      })
    }
  }

  return {
    loans,
    createLoan,
    updateLoan,
    deleteLoan,
    getLoanById,
    getLoansByCustomer,
    getPortalLoansByCustomer,
    addLoanHistoryEntry,
    makePayment
  }
}