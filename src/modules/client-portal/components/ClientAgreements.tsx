import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Eye, Download, Calendar, User, DollarSign } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { useMockDataDiscovery } from '@/utils/mockDataDiscovery'
import { formatCurrency, formatDate } from '@/lib/utils'

export function ClientAgreements() {
  const { getCustomerId, getDisplayName } = usePortal()
  const customerId = getCustomerId()
  const customerName = getDisplayName()
  
  // Use the mock data discovery system
  const { customerData, loading } = useMockDataDiscovery(customerId, customerName)
  
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null)
  
  // Get customer-specific data
  const customerAgreements = customerData.agreements || []
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'SIGNED':
        return 'bg-blue-100 text-blue-800'
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'EXPIRED':
        return 'bg-red-100 text-red-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PURCHASE':
        return <DollarSign className="h-4 w-4" />
      case 'LEASE':
        return <Calendar className="h-4 w-4" />
      case 'SERVICE':
        return <FileText className="h-4 w-4" />
      case 'WARRANTY':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (selectedAgreement) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => setSelectedAgreement(null)}>
          ← Back to Agreements
        </Button>

        {/* Agreement Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            {getTypeIcon(selectedAgreement.type)}
            <h1 className="text-2xl font-bold">
              {selectedAgreement.type.charAt(0) + selectedAgreement.type.slice(1).toLowerCase()} Agreement
            </h1>
            <Badge className={getStatusColor(selectedAgreement.status)}>
              {selectedAgreement.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{selectedAgreement.vehicleInfo}</p>
        </div>

        {/* Agreement Details */}
        <Card>
          <CardHeader>
            <CardTitle>Agreement Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-3">Basic Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Agreement ID</p>
                    <p className="font-medium">{selectedAgreement.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{selectedAgreement.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(selectedAgreement.status)}>
                      {selectedAgreement.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{formatDate(selectedAgreement.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Financial Details</h4>
                <div className="space-y-2">
                  {selectedAgreement.totalAmount && (
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-medium">{formatCurrency(selectedAgreement.totalAmount)}</p>
                    </div>
                  )}
                  {selectedAgreement.downPayment && (
                    <div>
                      <p className="text-sm text-muted-foreground">Down Payment</p>
                      <p className="font-medium">{formatCurrency(selectedAgreement.downPayment)}</p>
                    </div>
                  )}
                  {selectedAgreement.monthlyPayment && (
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Payment</p>
                      <p className="font-medium">{formatCurrency(selectedAgreement.monthlyPayment)}</p>
                    </div>
                  )}
                  {selectedAgreement.annualFee && (
                    <div>
                      <p className="text-sm text-muted-foreground">Annual Fee</p>
                      <p className="font-medium">{formatCurrency(selectedAgreement.annualFee)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h4 className="font-medium mb-3">Important Dates</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Effective Date</p>
                  <p className="font-medium">{formatDate(selectedAgreement.effectiveDate)}</p>
                </div>
                {selectedAgreement.expirationDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Expiration Date</p>
                    <p className="font-medium">{formatDate(selectedAgreement.expirationDate)}</p>
                  </div>
                )}
                {selectedAgreement.signedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Signed Date</p>
                    <p className="font-medium">{formatDate(selectedAgreement.signedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Terms */}
            {selectedAgreement.terms && (
              <div>
                <h4 className="font-medium mb-3">Terms & Conditions</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm">{selectedAgreement.terms}</p>
                </div>
              </div>
            )}

            {/* Signature Information */}
            {selectedAgreement.signedBy && (
              <div>
                <h4 className="font-medium mb-3">Signature Information</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Signed By</p>
                    <p className="font-medium">{selectedAgreement.signedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">IP Address</p>
                    <p className="font-medium">{selectedAgreement.ipAddress || 'Not recorded'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        {selectedAgreement.documents && selectedAgreement.documents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Agreement documents and attachments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedAgreement.documents.map((document: any) => (
                  <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(document.size / 1024 / 1024).toFixed(2)} MB • 
                          Uploaded {formatDate(document.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">My Agreements</h1>
        <p className="text-muted-foreground">
          View and manage your agreements and contracts
        </p>
      </div>

      {/* Agreement Stats */}
      {customerAgreements.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Agreements</p>
                  <p className="text-2xl font-bold">{customerAgreements.length}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">
                    {customerAgreements.filter(agreement => agreement.status === 'ACTIVE').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Signature</p>
                  <p className="text-2xl font-bold">
                    {customerAgreements.filter(agreement => agreement.status === 'PENDING').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Agreements List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Agreements</CardTitle>
          <CardDescription>
            View details and status of your agreements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerAgreements.map((agreement) => (
              <div
                key={agreement.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(agreement.type)}
                      <div>
                        <h4 className="font-semibold">
                          {agreement.type.charAt(0) + agreement.type.slice(1).toLowerCase()} Agreement
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {agreement.vehicleInfo}
                        </p>
                      </div>
                      <Badge className={getStatusColor(agreement.status)}>
                        {agreement.status}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Effective Date</p>
                        <p className="font-semibold">{formatDate(agreement.effectiveDate)}</p>
                      </div>
                      {agreement.expirationDate && (
                        <div>
                          <p className="text-sm text-muted-foreground">Expiration Date</p>
                          <p className="font-semibold">{formatDate(agreement.expirationDate)}</p>
                        </div>
                      )}
                      {(agreement.totalAmount || agreement.monthlyPayment || agreement.annualFee) && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {agreement.totalAmount ? 'Total Amount' : 
                             agreement.monthlyPayment ? 'Monthly Payment' : 'Annual Fee'}
                          </p>
                          <p className="font-semibold">
                            {formatCurrency(agreement.totalAmount || agreement.monthlyPayment || agreement.annualFee)}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {agreement.status === 'PENDING' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <p className="text-sm text-yellow-800">
                          <strong>Action Required:</strong> This agreement is waiting for your signature.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAgreement(agreement)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {agreement.status === 'PENDING' && (
                      <Button size="sm">
                        Sign Agreement
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {customerAgreements.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Agreements Found</h3>
                <p className="text-muted-foreground">
                  You don't have any agreements associated with your account.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}