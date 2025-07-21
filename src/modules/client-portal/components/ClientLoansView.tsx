import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DollarSign, Calendar, FileText, Eye, CreditCard, TrendingUp, AlertCircle } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { useMockDataDiscovery } from '@/utils/mockDataDiscovery'
import { formatCurrency, formatDate } from '@/lib/utils'

export function ClientLoansView() {
  const { getCustomerId, getDisplayName } = usePortal()
  const customerId = getCustomerId()
  const customerName = getDisplayName()
  
  // Use the mock data discovery system
  const { customerData, loading, getSectionCount } = useMockDataDiscovery(customerId, customerName)
  
  const [selectedLoan, setSelectedLoan] = useState<any>(null)
  
  // Get customer-specific data
  const customerLoans = customerData.loans || []
  const customerPayments = customerData.loanPayments || []
  
  // Calculate stats
  const activeLoans = customerLoans.filter(loan => ['Current', 'Active'].includes(loan.status))
  const totalBalance = activeLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0)
  const totalMonthlyPayment = activeLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0)
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Current':
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Late':
        return 'bg-yellow-100 text-yellow-800'
      case 'Default':
        return 'bg-red-100 text-red-800'
      case 'Paid Off':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLoanPayments = (loanId: string) => {
    return customerPayments.filter(payment => payment.loanId === loanId)
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (selectedLoan) {
    const loanPayments = getLoanPayments(selectedLoan.id)
    const paymentProgress = ((selectedLoan.termMonths - selectedLoan.paymentsRemaining) / selectedLoan.termMonths) * 100

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => setSelectedLoan(null)}>
          ← Back to Loans
        </Button>

        {/* Loan Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Loan Details</h1>
          <p className="text-muted-foreground">{selectedLoan.vehicleInfo}</p>
        </div>

        {/* Loan Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Remaining Balance</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedLoan.remainingBalance)}</p>
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
                  <p className="text-2xl font-bold">{formatCurrency(selectedLoan.monthlyPayment)}</p>
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
                  <p className="text-2xl font-bold">{formatDate(selectedLoan.nextPaymentDate)}</p>
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
                  <p className="text-2xl font-bold">{selectedLoan.paymentsRemaining}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Progress</CardTitle>
            <CardDescription>
              {selectedLoan.termMonths - selectedLoan.paymentsRemaining} of {selectedLoan.termMonths} payments completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(paymentProgress)}%</span>
              </div>
              <Progress value={paymentProgress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Started: {formatDate(selectedLoan.startDate)}</span>
                <span>Total Paid: {formatCurrency(selectedLoan.totalPaid)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>
              Your payment history for this loan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loanPayments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      payment.status === 'Completed' ? 'bg-green-500' : 
                      payment.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{formatCurrency(payment.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(payment.paymentDate)} • {payment.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <Badge className={
                    payment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {payment.status}
                  </Badge>
                </div>
              ))}
              
              {loanPayments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
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
          Manage your loan accounts and payment history
        </p>
      </div>

      {/* Loan Summary Stats */}
      {activeLoans.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
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
                  <p className="text-2xl font-bold">{formatCurrency(totalMonthlyPayment)}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Loans</p>
                  <p className="text-2xl font-bold">{activeLoans.length}</p>
                </div>
                <CreditCard className="h-8 w-8 text-muted-foreground" />
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
            {customerLoans.map((loan) => {
              const paymentProgress = ((loan.termMonths - loan.paymentsRemaining) / loan.termMonths) * 100
              
              return (
                <div
                  key={loan.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-semibold">{loan.vehicleInfo}</h4>
                          <p className="text-sm text-muted-foreground">
                            Loan #{loan.id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(loan.status)}>
                          {loan.status}
                        </Badge>
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
                          <p className="font-semibold">{formatDate(loan.nextPaymentDate)}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Payment Progress</span>
                          <span>{Math.round(paymentProgress)}%</span>
                        </div>
                        <Progress value={paymentProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {loan.termMonths - loan.paymentsRemaining} of {loan.termMonths} payments completed
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLoan(loan)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {customerLoans.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Loans Found</h3>
                <p className="text-muted-foreground">
                  You don't have any loans associated with your account.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}