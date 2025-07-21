import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Eye, Calendar, DollarSign, User } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { mockAgreements } from '@/mocks/agreementsMock'
import { formatCurrency, formatDate } from '@/lib/utils'

export function ClientAgreements() {
  const { getDisplayName, getCustomerId } = usePortal()
  const [selectedAgreement, setSelectedAgreement] = useState<string | null>(null)
  
  // Get customer-specific agreements
  const customerId = getCustomerId()
  const customerAgreements = mockAgreements.sampleAgreements.filter(agreement => 
    agreement.customerId === customerId || agreement.customerName === getDisplayName()
  )

  const getStatusColor = (status: string) => {
    const statusConfig = mockAgreements.agreementStatuses.find(s => s.value === status)
    return statusConfig?.color || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const statusConfig = mockAgreements.agreementStatuses.find(s => s.value === status)
    return statusConfig?.label || status
  }

  const getTypeLabel = (type: string) => {
    const typeConfig = mockAgreements.agreementTypes.find(t => t.value === type)
    return typeConfig?.label || type
  }

  if (selectedAgreement) {
    const agreement = customerAgreements.find(a => a.id === selectedAgreement)
    
    if (!agreement) return null

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedAgreement(null)}>
              ← Back to Agreements
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Agreement Details</h1>
              <p className="text-muted-foreground">{agreement.vehicleInfo}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(agreement.status)}>
              {getStatusLabel(agreement.status)}
            </Badge>
          </div>
        </div>

        {/* Agreement Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Agreement Information</CardTitle>
            <CardDescription>
              {getTypeLabel(agreement.type)} Agreement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-3">Agreement Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{getTypeLabel(agreement.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(agreement.status)} variant="outline">
                      {getStatusLabel(agreement.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Effective Date:</span>
                    <span>{formatDate(agreement.effectiveDate)}</span>
                  </div>
                  {agreement.expirationDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expiration Date:</span>
                      <span>{formatDate(agreement.expirationDate)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Financial Details</h4>
                <div className="space-y-2 text-sm">
                  {agreement.totalAmount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Amount:</span>
                      <span className="font-semibold">{formatCurrency(agreement.totalAmount)}</span>
                    </div>
                  )}
                  {agreement.downPayment && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Down Payment:</span>
                      <span>{formatCurrency(agreement.downPayment)}</span>
                    </div>
                  )}
                  {agreement.monthlyPayment && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Payment:</span>
                      <span>{formatCurrency(agreement.monthlyPayment)}</span>
                    </div>
                  )}
                  {agreement.financingAmount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Financed Amount:</span>
                      <span>{formatCurrency(agreement.financingAmount)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {agreement.terms && (
              <div>
                <h4 className="font-semibold mb-3">Terms & Conditions</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm">{agreement.terms}</p>
                </div>
              </div>
            )}

            {agreement.signedBy && (
              <div>
                <h4 className="font-semibold mb-3">Signature Information</h4>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Signed By:</span>
                    <p className="font-medium">{agreement.signedBy}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Signed Date:</span>
                    <p className="font-medium">{agreement.signedAt ? formatDate(agreement.signedAt) : 'Not signed'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        {agreement.documents && agreement.documents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Agreement documents and attachments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agreement.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(document.size / 1024 / 1024).toFixed(2)} MB • Uploaded {formatDate(document.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
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

      {/* Agreement Summary */}
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
                  <p className="text-sm font-medium text-muted-foreground">Active Agreements</p>
                  <p className="text-2xl font-bold">
                    {customerAgreements.filter(a => ['SIGNED', 'ACTIVE'].includes(a.status)).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Signature</p>
                  <p className="text-2xl font-bold">
                    {customerAgreements.filter(a => a.status === 'PENDING').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-muted-foreground" />
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
            View details and documents for your agreements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerAgreements.map((agreement) => (
              <div
                key={agreement.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold">{getTypeLabel(agreement.type)} Agreement</h4>
                      <Badge className={getStatusColor(agreement.status)}>
                        {getStatusLabel(agreement.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Vehicle</p>
                        <p className="font-medium">{agreement.vehicleInfo || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Effective Date</p>
                        <p className="font-medium">{formatDate(agreement.effectiveDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {agreement.totalAmount ? 'Total Amount' : 
                           agreement.monthlyPayment ? 'Monthly Payment' : 'Status'}
                        </p>
                        <p className="font-medium">
                          {agreement.totalAmount ? formatCurrency(agreement.totalAmount) :
                           agreement.monthlyPayment ? formatCurrency(agreement.monthlyPayment) :
                           getStatusLabel(agreement.status)}
                        </p>
                      </div>
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
                      onClick={() => setSelectedAgreement(agreement.id)}
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
                  You don't have any agreements at this time.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}