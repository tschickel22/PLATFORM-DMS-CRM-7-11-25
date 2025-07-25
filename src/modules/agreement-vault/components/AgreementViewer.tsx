import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FileText, Download, Send, Eye, Calendar, User, Car, FileCheck, Clock, MapPin, FileSignature as Signature } from 'lucide-react'
import { Agreement, Document } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { mockAgreements } from '@/mocks/agreementsMock'
import { formatDate, formatDateTime } from '@/lib/utils'

interface AgreementViewerProps {
  agreement: Agreement
  onSendSignatureRequest?: (agreementId: string) => Promise<void>
  onDownload?: (document: Document) => void
  onEdit?: (agreement: Agreement) => void
  readonly?: boolean
}

export function AgreementViewer({ 
  agreement, 
  onSendSignatureRequest, 
  onDownload, 
  onEdit,
  readonly = false 
}: AgreementViewerProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  // Use tenant data if available, otherwise fallback to mock data
  const agreementStatuses = tenant?.agreementStatuses || mockAgreements.agreementStatuses


  // Use mock data for status colors
  const getStatusColor = (status: string) => {
    const statusConfig = agreementStatuses.find(s => s.value === status)
    return statusConfig?.color || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const statusConfig = agreementStatuses.find(s => s.value === status)
    return statusConfig?.label || status
  }

  const getTypeLabel = (type: string) => {
    const typeConfig = mockAgreements.agreementTypes.find(t => t.value === type)
    return typeConfig?.label || type
  }

  const handleSendSignatureRequest = async () => {
    if (!onSendSignatureRequest) return
    
    setLoading(true)
    try {
      await onSendSignatureRequest(agreement.id)
      toast({
        title: 'Signature Request Sent',
        description: 'The signature request has been sent to the customer.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send signature request.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadDocument = (document: Document) => {
    if (onDownload) {
      onDownload(document)
    } else {
      // Default download behavior
      const link = document.createElement('a')
      link.href = document.url
      link.download = document.name
      link.click()
    }
  }

  const canSendSignatureRequest = agreement.status === 'DRAFT' || agreement.status === 'PENDING'
  const isSigned = agreement.status === 'SIGNED' || agreement.status === 'ACTIVE'

  return (
    <div className="space-y-6">
      {/* Agreement Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>{getTypeLabel(agreement.type)} Agreement</CardTitle>
                <CardDescription>Agreement ID: {agreement.id}</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(agreement.status)}>
                {getStatusLabel(agreement.status)}
              </Badge>
              {!readonly && (
                <div className="flex space-x-2">
                  {canSendSignatureRequest && onSendSignatureRequest && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSendSignatureRequest}
                      disabled={loading}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send for Signature
                    </Button>
                  )}
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={() => onEdit(agreement)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Agreement Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Customer</p>
                  <p className="text-sm text-muted-foreground">
                    {agreement.customerName || 'N/A'}
                  </p>
                  {agreement.customerEmail && (
                    <p className="text-xs text-muted-foreground">
                      {agreement.customerEmail}
                    </p>
                  )}
                </div>
              </div>

              {agreement.vehicleInfo && (
                <div className="flex items-center space-x-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Vehicle</p>
                    <p className="text-sm text-muted-foreground">
                      {agreement.vehicleInfo}
                    </p>
                  </div>
                </div>
              )}

              {agreement.quoteId && (
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Related Quote</p>
                    <p className="text-sm text-muted-foreground">
                      Quote #{agreement.quoteId}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Effective Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(agreement.effectiveDate)}
                  </p>
                </div>
              </div>

              {agreement.expirationDate && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Expiration Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(agreement.expirationDate)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(agreement.createdAt)}
                  </p>
                  {agreement.createdBy && (
                    <p className="text-xs text-muted-foreground">
                      by {agreement.createdBy}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Terms and Conditions */}
          <div>
            <h3 className="font-semibold mb-3">Terms and Conditions</h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{agreement.terms}</p>
            </div>
          </div>

          {/* Signature Information */}
          {isSigned && agreement.signedBy && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Signature className="h-4 w-4 mr-2" />
                  Signature Information
                </h3>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="font-medium">Signed By</p>
                      <p className="text-sm text-muted-foreground">{agreement.signedBy}</p>
                    </div>
                    <div>
                      <p className="font-medium">Signed At</p>
                      <p className="text-sm text-muted-foreground">
                        {agreement.signedAt ? formatDateTime(agreement.signedAt) : 'N/A'}
                      </p>
                    </div>
                    {agreement.ipAddress && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">IP Address</p>
                          <p className="text-xs text-muted-foreground">{agreement.ipAddress}</p>
                        </div>
                      </div>
                    )}
                    {agreement.signatureData && (
                      <div>
                        <p className="font-medium text-sm mb-2">Digital Signature</p>
                        <div className="border rounded p-2 bg-white">
                          <img 
                            src={agreement.signatureData} 
                            alt="Digital Signature" 
                            className="h-16 max-w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Documents */}
          {agreement.documents && agreement.documents.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Documents</h3>
                <div className="space-y-2">
                  {agreement.documents.map(document => (
                    <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{document.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(document.size / 1024).toFixed(1)} KB • Uploaded {formatDate(document.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadDocument(document)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}