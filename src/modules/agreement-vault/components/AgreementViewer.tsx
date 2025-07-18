import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { X, Edit, Download, Send, FileText, User, Calendar, DollarSign } from 'lucide-react'
import { Agreement } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'
import { mockAgreements } from '@/mocks/agreementsMock'

interface AgreementViewerProps {
  agreement: Agreement
  onClose: () => void
  onEdit: () => void
}

export function AgreementViewer({ agreement, onClose, onEdit }: AgreementViewerProps) {
  const [activeTab, setActiveTab] = useState('details')

  const typeConfig = mockAgreements.agreementTypes.find(t => t.value === agreement.type)
  const statusConfig = mockAgreements.agreementStatuses.find(s => s.value === agreement.status)

  const getStatusColor = (status: string) => {
    const config = mockAgreements.agreementStatuses.find(s => s.value === status)
    return config?.color || 'bg-gray-100 text-gray-800'
  }

  const tabs = [
    { id: 'details', name: 'Details', icon: FileText },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'history', name: 'History', icon: Calendar }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  {typeConfig?.label || agreement.type} Agreement
                </CardTitle>
                <CardDescription>
                  {agreement.customerName} • Created {formatDate(new Date(agreement.createdAt))}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(agreement.status)}>
                {statusConfig?.label || agreement.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              {(agreement.status === 'DRAFT' || agreement.status === 'PENDING') && (
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Send for Signature
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Tabs */}
          <div className="border-b">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-sm">{agreement.customerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{agreement.customerEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-sm">{agreement.customerPhone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Vehicle/Property</label>
                    <p className="text-sm">{agreement.vehicleInfo || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Agreement Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Agreement Details
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <p className="text-sm">{typeConfig?.label || agreement.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <p className="text-sm">{statusConfig?.label || agreement.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Effective Date</label>
                    <p className="text-sm">{formatDate(new Date(agreement.effectiveDate))}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Expiration Date</label>
                    <p className="text-sm">
                      {agreement.expirationDate ? formatDate(new Date(agreement.expirationDate)) : 'No expiration'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              {(agreement.totalAmount || agreement.monthlyPayment || agreement.annualFee) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Financial Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      {agreement.totalAmount && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                          <p className="text-sm font-semibold">{formatCurrency(agreement.totalAmount)}</p>
                        </div>
                      )}
                      {agreement.downPayment && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Down Payment</label>
                          <p className="text-sm">{formatCurrency(agreement.downPayment)}</p>
                        </div>
                      )}
                      {agreement.financingAmount && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Financing Amount</label>
                          <p className="text-sm">{formatCurrency(agreement.financingAmount)}</p>
                        </div>
                      )}
                      {agreement.monthlyPayment && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Monthly Payment</label>
                          <p className="text-sm">{formatCurrency(agreement.monthlyPayment)}</p>
                        </div>
                      )}
                      {agreement.securityDeposit && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Security Deposit</label>
                          <p className="text-sm">{formatCurrency(agreement.securityDeposit)}</p>
                        </div>
                      )}
                      {agreement.annualFee && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Annual Fee</label>
                          <p className="text-sm">{formatCurrency(agreement.annualFee)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Terms and Conditions */}
              {agreement.terms && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Terms and Conditions</h3>
                    <div className="prose prose-sm max-w-none bg-muted/30 p-4 rounded-lg">
                      <div className="whitespace-pre-wrap">{processedTerms}</div>
                      {processedTerms !== agreement.terms && (
                        <div className="mt-4 pt-4 border-t border-muted-foreground/20">
                          <details className="text-xs text-muted-foreground">
                            <summary className="cursor-pointer hover:text-foreground">
                              View original template
                            </summary>
                            <div className="mt-2 p-2 bg-muted/50 rounded whitespace-pre-wrap font-mono text-xs">
                              {agreement.terms}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Signature Information */}
              {agreement.signedBy && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Signature Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Signed By</label>
                        <p className="text-sm">{agreement.signedBy}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Signed Date</label>
                        <p className="text-sm">
                          {agreement.signedAt ? formatDate(new Date(agreement.signedAt)) : 'Not signed'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                        <p className="text-sm">{agreement.ipAddress || 'Not recorded'}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Attached Documents</h3>
              
              {agreement.documents && agreement.documents.length > 0 ? (
                <div className="space-y-3">
                  {agreement.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.type} • {(doc.size / 1024).toFixed(1)} KB • 
                            Uploaded {formatDate(new Date(doc.uploadedAt))}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No documents attached</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Agreement History</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Agreement Created</p>
                    <p className="text-sm text-muted-foreground">
                      Created by {agreement.createdBy} on {formatDate(new Date(agreement.createdAt))}
                    </p>
                  </div>
                </div>
                
                {agreement.signedAt && (
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">Agreement Signed</p>
                      <p className="text-sm text-muted-foreground">
                        Signed by {agreement.signedBy} on {formatDate(new Date(agreement.signedAt))}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      Updated on {formatDate(new Date(agreement.updatedAt))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}