import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Save, DollarSign } from 'lucide-react'
import { Loan, LoanStatus } from '@/types'
import { useLoans } from '../hooks/useLoans'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'

interface NewLoanFormProps {
  loan?: Loan
  onClose: () => void
  onSuccess?: (loan: Loan) => void
}

export function NewLoanForm({ loan, onClose, onSuccess }: NewLoanFormProps) {
  const { createLoan, updateLoan } = useLoans()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    customerId: loan?.customerId || '',
    customerName: loan?.customerName || '',
    customerEmail: loan?.customerEmail || '',
    customerPhone: loan?.customerPhone || '',
    vehicleId: loan?.vehicleId || '',
    vehicleInfo: loan?.vehicleInfo || '',
    loanAmount: loan?.loanAmount || 0,
    downPayment: loan?.downPayment || 0,
    interestRate: loan?.interestRate || 7.25,
    termMonths: loan?.termMonths || 60,
    startDate: loan?.startDate ? loan.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
    status: loan?.status || LoanStatus.ACTIVE,
    isPortalVisible: loan?.isPortalVisible || false,
    portalNotes: loan?.portalNotes || ''
  })

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const principal = formData.loanAmount - formData.downPayment
    const monthlyRate = formData.interestRate / 100 / 12
    const numPayments = formData.termMonths
    
    if (monthlyRate === 0) {
      return principal / numPayments
    }
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1)
    
    return monthlyPayment
  }

  const monthlyPayment = calculateMonthlyPayment()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const loanData = {
        ...formData,
        monthlyPayment,
        remainingBalance: formData.loanAmount - formData.downPayment,
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalPaid: 0,
        paymentsRemaining: formData.termMonths,
        history: []
      }

      let savedLoan: Loan
      if (loan) {
        updateLoan(loan.id, loanData)
        savedLoan = { ...loan, ...loanData }
      } else {
        savedLoan = createLoan(loanData)
      }

      toast({
        title: loan ? 'Loan Updated' : 'Loan Created',
        description: `Loan has been ${loan ? 'updated' : 'created'} successfully.`
      })

      onSuccess?.(savedLoan)
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${loan ? 'update' : 'create'} loan.`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                {loan ? 'Edit Loan' : 'Create New Loan'}
              </CardTitle>
              <CardDescription>
                {loan ? 'Update loan details and settings' : 'Enter loan information and configure portal visibility'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="customerId">Customer ID</Label>
                  <Input
                    id="customerId"
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    placeholder="Enter customer ID"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="vehicleId">Vehicle ID</Label>
                  <Input
                    id="vehicleId"
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                    placeholder="Enter vehicle ID"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleInfo">Vehicle Description</Label>
                  <Input
                    id="vehicleInfo"
                    value={formData.vehicleInfo}
                    onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
                    placeholder="e.g., 2023 Forest River Cherokee 274RK"
                  />
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Loan Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="loanAmount">Loan Amount</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    step="0.01"
                    value={formData.loanAmount}
                    onChange={(e) => setFormData({ ...formData, loanAmount: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="downPayment">Down Payment</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    step="0.01"
                    value={formData.downPayment}
                    onChange={(e) => setFormData({ ...formData, downPayment: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) || 0 })}
                    placeholder="7.25"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="termMonths">Term (Months)</Label>
                  <Select
                    value={formData.termMonths.toString()}
                    onValueChange={(value) => setFormData({ ...formData, termMonths: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="48">48 months</SelectItem>
                      <SelectItem value="60">60 months</SelectItem>
                      <SelectItem value="72">72 months</SelectItem>
                      <SelectItem value="84">84 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: LoanStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={LoanStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={LoanStatus.CURRENT}>Current</SelectItem>
                      <SelectItem value={LoanStatus.LATE}>Late</SelectItem>
                      <SelectItem value={LoanStatus.DEFAULT}>Default</SelectItem>
                      <SelectItem value={LoanStatus.PAID_OFF}>Paid Off</SelectItem>
                      <SelectItem value={LoanStatus.CANCELLED}>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Calculated Monthly Payment */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Calculated Monthly Payment:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(monthlyPayment)}
                  </span>
                </div>
              </div>
            </div>

            {/* Portal Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Portal Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPortalVisible"
                    checked={formData.isPortalVisible}
                    onCheckedChange={(checked) => setFormData({ 
                      ...formData, 
                      isPortalVisible: !!checked,
                      portalNotes: checked ? formData.portalNotes : ''
                    })}
                  />
                  <Label htmlFor="isPortalVisible" className="font-medium">
                    Make this loan visible in customer portal
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, customers can view this loan, payment history, and make payments through the portal.
                </p>

                {formData.isPortalVisible && (
                  <div>
                    <Label htmlFor="portalNotes">Portal Notes (Optional)</Label>
                    <Textarea
                      id="portalNotes"
                      value={formData.portalNotes}
                      onChange={(e) => setFormData({ ...formData, portalNotes: e.target.value })}
                      placeholder="Add any notes or messages that will be visible to the customer in the portal..."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      These notes will be displayed to the customer when they view this loan in the portal.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {loan ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {loan ? 'Update Loan' : 'Create Loan'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}