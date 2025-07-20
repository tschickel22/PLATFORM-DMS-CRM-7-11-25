import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Download, Edit, Search, Filter } from 'lucide-react'
import { Agreement, AgreementStatus } from '@/types'
import { useTenant } from '@/contexts/TenantContext'
import { usePortal } from '@/contexts/PortalContext'
import { mockAgreements } from '@/mocks/agreementsMock'
import { formatDate } from '@/lib/utils'

export function ClientAgreements() {
  const navigate = useNavigate()
  const { tenant } = useTenant()
  const { getCustomerId } = usePortal()
  
  // Get customer ID from portal context (handles both proxied and regular sessions)
  const currentClientId = getCustomerId()
  
  // Use tenant agreements or fallback to mock data
  const allAgreements = tenant?.agreements || mockAgreements.sampleAgreements
  const agreementStatuses = tenant?.agreementStatuses || mockAgreements.agreementStatuses
  
  // Filter agreements for current client
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [filteredAgreements, setFilteredAgreements] = useState<Agreement[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  useEffect(() => {
    // Filter agreements by client ID
    const clientAgreements = allAgreements.filter(agreement => 
      agreement.customerId === currentClientId
    )
    setAgreements(clientAgreements)
    setFilteredAgreements(clientAgreements)
  }, [allAgreements, currentClientId])
  
  useEffect(() => {
    let filtered = agreements
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(agreement =>
        agreement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (agreement.vehicleInfo && agreement.vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(agreement => agreement.status === statusFilter)
    }
    
    setFilteredAgreements(filtered)
  }, [agreements, searchTerm, statusFilter])
  
  const getStatusColor = (status: string) => {
    const statusConfig = agreementStatuses.find(s => s.value === status)
    return statusConfig?.color || 'bg-gray-100 text-gray-800'
  }
  
  const getStatusLabel = (status: string) => {
    const statusConfig = agreementStatuses.find(s => s.value === status)
    return statusConfig?.label || status
  }
  
  const handleViewAgreement = (agreementId: string) => {
    navigate(`/portal/agreements/${agreementId}`)
  }
  
  const handleSignAgreement = (agreementId: string) => {
    navigate(`/portal/agreements/${agreementId}/sign`)
  }
  
  const handleDownloadPDF = (agreement: Agreement) => {
    // In real app, generate and download PDF
    console.log('Downloading PDF for agreement:', agreement.id)
    // Mock download
    const link = document.createElement('a')
    link.href = '#'
    link.download = `agreement-${agreement.id}.pdf`
    link.click()
  }
  
  const canSign = (agreement: Agreement) => {
    return agreement.status === 'PENDING'
  }
  
  const canView = (agreement: Agreement) => {
    return ['SIGNED', 'ACTIVE', 'EXPIRED'].includes(agreement.status)
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Agreements</h1>
        <p className="text-muted-foreground">
          View and manage your agreements and contracts
        </p>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agreements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {agreementStatuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Agreements List */}
      <div className="space-y-4">
        {filteredAgreements.length > 0 ? (
          filteredAgreements.map((agreement) => (
            <Card key={agreement.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">
                        {agreement.type.replace('_', ' ')} Agreement
                      </h3>
                      <Badge className={getStatusColor(agreement.status)}>
                        {getStatusLabel(agreement.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {agreement.vehicleInfo && (
                        <p><span className="font-medium">Vehicle:</span> {agreement.vehicleInfo}</p>
                      )}
                      <p><span className="font-medium">Effective Date:</span> {formatDate(agreement.effectiveDate)}</p>
                      {agreement.expirationDate && (
                        <p><span className="font-medium">Expires:</span> {formatDate(agreement.expirationDate)}</p>
                      )}
                      {agreement.signedAt && (
                        <p><span className="font-medium">Signed:</span> {formatDate(agreement.signedAt)}</p>
                      )}
                      {agreement.totalAmount && (
                        <p><span className="font-medium">Amount:</span> ${agreement.totalAmount.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {canSign(agreement) && (
                      <Button 
                        onClick={() => handleSignAgreement(agreement.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Sign Agreement
                      </Button>
                    )}
                    
                    {canView(agreement) && (
                      <Button 
                        variant="outline"
                        onClick={() => handleViewAgreement(agreement.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline"
                      onClick={() => handleDownloadPDF(agreement)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Agreements Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No agreements match your current filters.' 
                    : 'You don\'t have any agreements yet.'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}