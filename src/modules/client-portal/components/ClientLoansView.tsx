import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DollarSign, Calendar, CreditCard, Eye, TrendingUp, AlertCircle } from 'lucide-react'
import { useLoans } from '@/modules/finance/hooks/useLoans'
import { Loan, LoanStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ClientLoanDetail } from './ClientLoanDetail'

export function ClientLoansView() {
  const { getPortalLoansByCustomer } = useLoans()
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)

  // Mock customer ID - in real app, this would come from portal session
  const customerId = 'portal-customer-001'
  const loans = getPortalLoansByCustomer(customerId)

  const getStatusColor = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.CURRENT:
      case LoanStatus.ACTIVE:
        return 'bg-green-100 text-green-800'
      case LoanStatus.LATE:
        return 'bg-yellow-100 text-yellow-800'
      case LoanStatus.DEFAULT:
        return 'bg-red-100 text-red-800'
      case LoanStatus.PAID_OFF:
        return 'bg-blue-100 text-blue-800'
      case LoanStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.CURRENT:
      case LoanStatus.ACTIVE:
        return <TrendingUp className="h-4 w-4" />
      case LoanStatus.LATE:
      case LoanStatus.DEFAULT:
        return <AlertCircle className="h-4 w-4" />
      case LoanStatus.PAID_OFF:
        return <CreditCard className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const calculateProgress = (loan: Loan) => {
    const totalAmount = loan.loanAmount - loan.downPayment
    const paidAmount = loan.totalPaid
    return totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0
  }

  if (selectedLoan) {
    return (
      <ClientLoanDetail
        loan={selectedLoan}
        onBack={() => setSelectedLoan(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">My Loans</h1>
        <p className="text-muted-foreground">
          View your loan details, payment history, and make payments
        </p>
      </div>

      {/* Loan Summary Cards */}
      {loans.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Loans</p>
                  <p className="text-2xl font-bold">{loans.length}</p>
                </div>
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(loans.reduce((sum, loan) => sum + loan.remainingBalance, 0))}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {formatCurrency(loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0))}
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
            Click on any loan to view details and make payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loans.map((loan) => {
              const progress = calculateProgress(loan)
              const nextPaymentDate = new Date(loan.nextPaymentDate)
              const isPaymentDue = nextPaymentDate <= new Date()
              
              return (
                <div
                  key={loan.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedLoan(loan)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(loan.status)}
                        <div>
                          <h4 className="font-semibold">
                            {loan.vehicleInfo || `Loan #${loan.id.slice(-6).toUpperCase()}`}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Started {formatDate(loan.startDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(loan.status)}>
                          {loan.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {isPaymentDue && loan.status !== LoanStatus.PAID_OFF && (
                          <Badge variant="destructive">
                            Payment Due
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Remaining Balance</p>
                          <p className="font-semibold">{formatCurrency(loan.remainingBalance)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Payment</p>
                          <p className="font-semibold">{formatCurrency(loan.monthlyPayment)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Payment</p>
                          <p className="font-semibold">
                            {loan.status === LoanStatus.PAID_OFF ? 'Paid Off' : formatDate(loan.nextPaymentDate)}
                          </p>
                        </div>
                      </div>
                      
                      {loan.status !== LoanStatus.PAID_OFF && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Loan Progress</span>
                            <span>{Math.round(progress)}% paid</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}
                      
                      {loan.portalNotes && (
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-sm">{loan.portalNotes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {loans.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Loans Found</h3>
                <p className="text-muted-foreground">
                  You don't have any loans visible in the portal at this time.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Payment Questions</h4>
              <p className="text-sm text-muted-foreground">
                Have questions about your payments or need to set up automatic payments?
              </p>
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Loan Information</h4>
              <p className="text-sm text-muted-foreground">
                Need help understanding your loan terms or payment schedule?
              </p>
              <Button variant="outline" size="sm">
                View FAQ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}