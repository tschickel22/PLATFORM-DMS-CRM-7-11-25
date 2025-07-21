import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DollarSign, Calendar, TrendingUp, Eye, Download, CreditCard } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockFinance } from '@/mocks/financeMock'
import { formatCurrency, formatDate } from '@/lib/utils'

export function ClientLoansView() {
  const { getDisplayName, getCustomerId } = usePortal()
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null)
  
  // Get customer-specific loans
  const customerId = getCustomerId()
  const customerLoans = mockFinance.sampleLoans.filter(loan => 
    loan.customerId === customerId || loan.customerName === getDisplayName()
  )
  
  // Get payments for customer loans
  const customerPayments = mockFinance.samplePayments.filter(payment => 
    customerLoans.some(loan => loan.id === payment.loanId)
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'current':
        return 'bg-green-100 text-green-800'
      case 'late':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid off':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateProgress = (loan: any) => {
    const totalPayments = loan.termMonths
    const paidPayments = totalPayments - loan.paymentsRemaining
    return (paidPayments / totalPayments) * 100
  }

  if (selectedLoan) {
    const loan = customerLoans.find(l => l.id === selectedLoan)
    const loanPayments = customerPayments.filter(p => p.loanId === selectedLoan)
    
    if (!loan) return null

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedLoan(null)}>
              ← Back to Loans
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Loan Details</h1>
              <p className="text-muted-foreground">{loan.vehicleInfo}</p>
            </div>
          </div>
        </div>

        {/* Loan Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Remaining Balance</p>
                  <p className="text-2xl font-bold">{formatCurrency(loan.remainingBalance)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Payment</p>
                  <p className="text-2xl font-bold">{formatCurrency(loan.monthlyPayment)}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Next Payment</p>
                  <p className="text-2xl font-bold">{formatDate(loan.nextPaymentDate)}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payments Remaining</p>
                  <p className="text-2xl font-bold">{loan.paymentsRemaining}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loan Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Progress</CardTitle>
            <CardDescription>
              Track your loan repayment progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Loan Progress</span>
                <span>{Math.round(calculateProgress(loan))}% Complete</span>
              </div>
              <Progress value={calculateProgress(loan)} className="h-3" />
              <div className="grid gap-4 md:grid-cols-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Original Amount</p>
                  <p className="font-semibold">{formatCurrency(loan.loanAmount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Paid</p>
                  <p className="font-semibold">{formatCurrency(loan.totalPaid)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Interest Rate</p>
                  <p className="font-semibold">{loan.interestRate}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              Recent payment transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loanPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{formatCurrency(payment.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(payment.paymentDate)} • {payment.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {payment.status}
                    </Badge>
                    {payment.transactionId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {payment.transactionId}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              {loanPayments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No payment history available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">My Loans</h1>
        <p className="text-muted-foreground">
          Manage and track your loan accounts
        </p>
      </div>

      {/* Loan Summary Cards */}
      {customerLoans.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Loans</p>
                  <p className="text-2xl font-bold">{customerLoans.length}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(customerLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0))}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Payment</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(customerLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0))}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loans List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Loans</CardTitle>
          <CardDescription>
            View details and payment history for your loans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerLoans.map((loan) => (
              <div
                key={loan.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold">{loan.vehicleInfo}</h4>
                      <Badge className={getStatusColor(loan.status)}>
                        {loan.status}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Remaining Balance</p>
                        <p className="font-semibold">{formatCurrency(loan.remainingBalance)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monthly Payment</p>
                        <p className="font-semibold">{formatCurrency(loan.monthlyPayment)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Payment</p>
                        <p className="font-semibold">{formatDate(loan.nextPaymentDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Payments Remaining</p>
                        <p className="font-semibold">{loan.paymentsRemaining}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(calculateProgress(loan))}%</span>
                      </div>
                      <Progress value={calculateProgress(loan)} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLoan(loan.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {customerLoans.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Loans Found</h3>
                <p className="text-muted-foreground">
                  You don't have any active loans at this time.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}