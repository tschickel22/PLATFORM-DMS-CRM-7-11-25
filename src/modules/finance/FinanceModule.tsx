// src/modules/finance/FinanceModule.tsx
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, DollarSign, TrendingUp, Users, Calculator, History, Settings, Search } from 'lucide-react'
import { mockFinance } from '@/mocks/financeMock'
import { useTenant } from '@/contexts/TenantContext'
import { NewLeadForm } from '@/modules/crm-prospecting/components/NewLeadForm'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { useLoans } from './hooks/useLoans'
import { NewLoanForm } from './components/NewLoanForm'
import { NewLoanForm as OriginalNewLoanForm } from './components/NewLoanForm'
import { LoanCalculator } from './components/LoanCalculator'
import { PaymentHistory } from './components/PaymentHistory'
import { LoanSettings } from './components/LoanSettings'
import { AmortizationSchedule } from './components/AmortizationSchedule'
import { LoanPaymentHistory } from './components/LoanPaymentHistory' // Import the new component
import { Payment, PaymentMethod, PaymentStatus, Loan } from '@/types'

function FinanceModulePage() {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const { loans, setLoans, getLoansByCustomer } = useLoans()
  const { vehicles } = useInventoryManagement()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showLoanForm, setShowLoanForm] = useState(false)
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false) 
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null) 
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLoans = loans.filter(loan => {
    // Safe string comparisons with null checks
    const matchesSearch = 
      (loan?.customerName?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false) ||
      (loan?.vehicleInfo?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false)
    const matchesFilter = filterStatus === 'all' || loan?.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Filter loans based on search and status
  const filteredLoansNew = loans.filter(loan => {
    const matchesSearch = !searchQuery || 
      loan.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.vehicleInfo.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate metrics from mock data
  const totalLoans = mockFinance.sampleLoans.length
  const activeLoans = mockFinance.sampleLoans.filter(loan => loan.status === 'Current').length
  const totalPortfolio = mockFinance.sampleLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0)
  const avgLoanAmount = totalLoans > 0 ? totalPortfolio / totalLoans : 0

  // Get platform-specific labels
  const getModuleLabel = () => {
    switch (tenant?.platform) {
      case 'rv':
        return 'RV Finance'
      case 'marine':
        return 'Marine Finance'
      case 'manufactured_home':
        return 'MH Finance'
      default:
        return 'Finance Management'
    }
  }

  const handleCreateLoan = () => {
    setSelectedLoan(null)
    setShowLoanForm(true)
  }

  const handleEditLoan = (loan: Loan) => {
    setSelectedLoan(loan)
    setShowLoanForm(true)
  }

  const handleCloseLoanForm = () => {
    setShowLoanForm(false)
    setSelectedLoan(null)
  }

  const handleLoanSuccess = (loan: Loan) => {
    toast({
      title: selectedLoan ? 'Loan Updated' : 'Loan Created',
      description: `Loan has been ${selectedLoan ? 'updated' : 'created'} successfully.`
    })
  }

  const handleViewPaymentHistory = (loan: Loan) => { 
    if (loan) {
      setSelectedLoan(loan);
      setShowPaymentHistoryModal(true);
    }
  }

  const handleRecordPayment = async (paymentData: Partial<Payment>): Promise<void> => {
    if (!selectedLoan) {
      toast({
        title: "Error",
        description: "No loan selected",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a new payment
      const newPayment: Payment = {
        id: `payment-${Math.random().toString(36).substring(2, 9)}`,
        loanId: selectedLoan.id,
        amount: paymentData.amount || 0,
        method: paymentData.method || PaymentMethod.CASH,
        status: paymentData.status || PaymentStatus.COMPLETED,
        processedDate: paymentData.processedDate || new Date(),
        notes: paymentData.notes || '',
        transactionId: paymentData.transactionId || `txn_${Math.random().toString(36).substring(2, 9)}`,
        customFields: {},
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Update the loans state with the new payment
      setLoans(prevLoans => {
        return prevLoans.map(loan => {
          if (loan.id === selectedLoan.id) {
            return {
              ...loan,
              payments: [...loan.payments, newPayment]
            };
          }
          return loan;
        });
      });

      const getStatusColor = (status: string) => {
        return mockFinance.statusColors[status] || 'bg-gray-100 text-gray-800'
      }

      toast({
        title: "Payment Recorded",
        description: `Payment of ${formatCurrency(newPayment.amount)} has been recorded.`
      });

      return Promise.resolve();
    } catch (error) {
      console.error("Error recording payment:", error);
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Loan Form Modal */}
      {showLoanForm && (
        <NewLoanForm
          loan={selectedLoan || undefined}
          onClose={handleCloseLoanForm}
          onSuccess={handleLoanSuccess}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">{getModuleLabel()}</h1>
            <p className="ri-page-description">
              Manage loans, payments, and financial operations
            </p>
          </div>
          <div>
            <Button onClick={handleCreateLoan}>
              <Plus className="h-4 w-4 mr-2" />
              New Loan
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLoans}</div>
            <p className="text-xs text-muted-foreground">
              {activeLoans} active loans
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPortfolio)}</div>
            <p className="text-xs text-muted-foreground">
              Outstanding balance
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Loan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgLoanAmount)}</div>
            <p className="text-xs text-muted-foreground">
              Average loan amount
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Default Rate</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1%</div>
            <p className="text-xs text-muted-foreground">
              -0.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="ri-content-grid">
            <Card>
              <CardHeader>
                <CardTitle>Recent Loans</CardTitle>
                <CardDescription>
                  Latest loan applications and approvals
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loans.length > 0 ? (
                  <div className="space-y-4">
                    {loans.slice(0, 5).map((loan) => (
                      <div 
                        key={loan.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => handleEditLoan(loan)}
                      >
                        <div>
                          <h4 className="font-semibold">
                            {loan.customerName} - {loan.vehicleInfo || 'Loan'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            ${loan.loanAmount.toLocaleString()} • {loan.interestRate}% • {loan.termMonths} months
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge>{loan.status.replace('_', ' ').toUpperCase()}</Badge>
                          {loan.isPortalVisible && (
                            <Badge variant="outline">Portal</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No loans created yet</p>
                    <p className="text-sm">Create your first loan to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Activity</CardTitle>
                <CardDescription>
                  Recent payment transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Payment Received</h4>
                      <p className="text-sm text-muted-foreground">John Smith - $372.86</p>
                    </div>
                    <Badge variant="outline">Today</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Payment Received</h4>
                      <p className="text-sm text-muted-foreground">Maria Rodriguez - $485.20</p>
                    </div>
                    <Badge variant="outline">Yesterday</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="loans" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Loans</CardTitle>
                  <CardDescription>
                    Manage customer loans and financing
                  </CardDescription>
                </div>
                <Button onClick={handleCreateLoan}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Loan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer or vehicle"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {mockFinance.statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredLoansNew.length > 0 ? filteredLoansNew.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold">{loan.customerName}</h4>
                        <Badge className={mockFinance.statusColors[loan.status] || 'bg-gray-100 text-gray-800'}>
                          {loan.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {loan.vehicleInfo} • {formatCurrency(loan.loanAmount)} • {loan.termMonths} months
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Balance: {formatCurrency(loan.remainingBalance)} • Next Payment: {formatDate(loan.nextPaymentDate)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Payment History
                      </Button>
                    </div>
                  </div>
                )) : (
                  // Show mock data when no filtered results or no loans
                  mockFinance.sampleLoans.map((loan) => (
                    <div
                      key={loan.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold">{loan.customerName}</h4>
                          <Badge className={mockFinance.statusColors[loan.status] || 'bg-gray-100 text-gray-800'}>
                            {loan.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {loan.vehicleInfo} • {formatCurrency(loan.loanAmount)} • {loan.termMonths} months
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Balance: {formatCurrency(loan.remainingBalance)} • Next Payment: {formatDate(loan.nextPaymentDate)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Payment History
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                
                {mockFinance.sampleLoans.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No loans found</p>
                    <p className="text-sm">Create your first loan to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <LoanCalculator />
        </TabsContent>

        <TabsContent value="payments">
          <LoanPaymentHistory 
            loan={filteredLoans.length > 0 ? filteredLoans[0] : null}
            onClose={() => setShowPaymentHistoryModal(false)}
            onRecordPayment={handleRecordPayment}
          />
        </TabsContent>

        <TabsContent value="settings">
          <LoanSettings />
        </TabsContent>
      </Tabs>

      {showPaymentHistoryModal && selectedLoan && (
        <LoanPaymentHistory 
          loan={selectedLoan}
          onClose={() => setShowPaymentHistoryModal(false)}
          onRecordPayment={handleRecordPayment}
        />
      )}
    </div>
  )
}

export const FinanceModule = FinanceModulePage