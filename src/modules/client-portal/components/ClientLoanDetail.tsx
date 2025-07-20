import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  DollarSign, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  AlertCircle,
  Clock,
  CheckCircle,
  Receipt,
  Download
} from 'lucide-react'
import { Loan, LoanStatus, LoanHistoryType } from '@/types'
import { useLoans } from '@/modules/finance/hooks/useLoans'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface ClientLoanDetailProps {
  loan: Loan
  onBack: () => void
}

export function ClientLoanDetail({ loan, onBack }: ClientLoanDetailProps) {
  const { makePayment } = useLoans()
  const { toast } = useToast()
  const [paymentAmount, setPaymentAmount] = useState(loan.monthlyPayment.toString())
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

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

  const getHistoryIcon = (type: LoanHistoryType) => {
    switch (type) {
      case LoanHistoryType.PAYMENT:
        return <DollarSign className="h-4 w-4 text-green-600" />
      case LoanHistoryType.STATUS_CHANGE:
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case LoanHistoryType.PAYOFF:
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case LoanHistoryType.LATE_FEE:
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const calculateProgress = () => {
    const totalAmount = loan.loanAmount - loan.downPayment
    const paidAmount = loan.totalPaid
    return totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0
  }

  const handleMakePayment = async () => {
    const amount = parseFloat(paymentAmount)
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid payment amount.',
        variant: 'destructive'
      })
      return
    }

    if (amount > loan.remainingBalance) {
      toast({
        title: 'Amount Too High',
        description: 'Payment amount cannot exceed the remaining balance.',
        variant: 'destructive'
      })
      return
    }

    setIsProcessingPayment(true)

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      makePayment(loan.id, amount, 'Online Portal')
      
      toast({
        title: 'Payment Processed',
        description: `Your payment of ${formatCurrency(amount)} has been processed successfully.`,
      })
      
      // Reset payment amount to monthly payment
      setPaymentAmount(loan.monthlyPayment.toString())
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const progress = calculateProgress()
  const nextPaymentDate = new Date(loan.nextPaymentDate)
  const isPaymentDue = nextPaymentDate <= new Date()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Loans
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {loan.vehicleInfo || `Loan #${loan.id.slice(-6).toUpperCase()}`}
          </h1>
          <p className="text-muted-foreground">
            Loan Details and Payment History
          </p>
        </div>
      </div>

      {/* Loan Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Loan Overview
              <Badge className={getStatusColor(loan.status)}>
                {loan.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Original Amount</p>
                <p className="text-lg font-semibold">{formatCurrency(loan.loanAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Down Payment</p>
                <p className="text-lg font-semibold">{formatCurrency(loan.downPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interest Rate</p>
                <p className="text-lg font-semibold">{loan.interestRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Term</p>
                <p className="text-lg font-semibold">{loan.termMonths} months</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Remaining Balance</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(loan.remainingBalance)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(loan.totalPaid)}</p>
              </div>
            </div>

            {loan.status !== LoanStatus.PAID_OFF && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Loan Progress</span>
                  <span>{Math.round(progress)}% paid</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="text-lg font-semibold">{formatCurrency(loan.monthlyPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payments Remaining</p>
                <p className="text-lg font-semibold">{loan.paymentsRemaining}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Next Payment Due</p>
              <div className="flex items-center space-x-2">
                <p className="text-lg font-semibold">
                  {loan.status === LoanStatus.PAID_OFF ? 'Paid Off' : formatDate(loan.nextPaymentDate)}
                </p>
                {isPaymentDue && loan.status !== LoanStatus.PAID_OFF && (
                  <Badge variant="destructive">Due Now</Badge>
                )}
              </div>
            </div>

            {loan.status !== LoanStatus.PAID_OFF && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label htmlFor="paymentAmount">Make a Payment</Label>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        id="paymentAmount"
                        type="number"
                        step="0.01"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>
                    <Button
                      onClick={handleMakePayment}
                      disabled={isProcessingPayment}
                      className="min-w-[120px]"
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay Now
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPaymentAmount(loan.monthlyPayment.toString())}
                    >
                      Monthly Payment
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPaymentAmount(loan.remainingBalance.toString())}
                    >
                      Pay Off Loan
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Portal Notes */}
      {loan.portalNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{loan.portalNotes}</p>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Receipt className="h-5 w-5 mr-2" />
                Payment History
              </CardTitle>
              <CardDescription>
                View all payments and loan activity
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loan.history.length > 0 ? (
              loan.history
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((entry) => (
                  <div key={entry.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getHistoryIcon(entry.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{entry.description}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(entry.timestamp)}
                        </span>
                      </div>
                      
                      {entry.amount && (
                        <div className="mt-2 grid gap-2 md:grid-cols-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Amount: </span>
                            <span className="font-medium">{formatCurrency(entry.amount)}</span>
                          </div>
                          {entry.principalAmount && (
                            <div>
                              <span className="text-muted-foreground">Principal: </span>
                              <span className="font-medium">{formatCurrency(entry.principalAmount)}</span>
                            </div>
                          )}
                          {entry.interestAmount && (
                            <div>
                              <span className="text-muted-foreground">Interest: </span>
                              <span className="font-medium">{formatCurrency(entry.interestAmount)}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {entry.paymentMethod && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Payment Method: {entry.paymentMethod}
                          {entry.transactionId && (
                            <span> • Transaction ID: {entry.transactionId}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p>No payment history available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}