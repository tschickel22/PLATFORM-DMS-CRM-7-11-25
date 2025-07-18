import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Save, FileText, Plus, Trash2 } from 'lucide-react'
import { Agreement, AgreementType, Document } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { mockAgreements } from '@/mocks/agreementsMock'

interface NewAgreementFormProps {
  agreement?: Agreement | null
  onSave: (agreementData: Partial<Agreement>) => Promise<void>
  onCancel: () => void
}

export function NewAgreementForm({ agreement, onSave, onCancel }: NewAgreementFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Agreement>>({
    type: AgreementType.PURCHASE,
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicleId: '',
    vehicleInfo: '',
    quoteId: '',
    terms: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    expirationDate: '',
    documents: [],
    totalAmount: 0,
    downPayment: 0,
    financingAmount: 0,
    monthlyPayment: 0,
    securityDeposit: 0,
    annualFee: 0,
    coverageLevel: ''
  })

  // Initialize form with agreement data if editing
  useEffect(() => {
    if (agreement) {
      setFormData({
        ...agreement,
        effectiveDate: typeof agreement.effectiveDate === 'string' 
          ? agreement.effectiveDate.split('T')[0] 
          : new Date(agreement.effectiveDate).toISOString().split('T')[0],
        expirationDate: agreement.expirationDate 
          ? (typeof agreement.expirationDate === 'string' 
              ? agreement.expirationDate.split('T')[0] 
              : new Date(agreement.expirationDate).toISOString().split('T')[0])
          : ''
      })
    }
  }, [agreement])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerName || !formData.customerEmail || !formData.type) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${agreement ? 'update' : 'create'} agreement`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof Agreement, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addDocument = () => {
    const newDoc: Document = {
      id: Math.random().toString(36).substring(2, 9),
      name: 'New Document',
      type: 'application/pdf',
      url: '',
      size: 0,
      uploadedAt: new Date()
    }
    
    setFormData(prev => ({
      ...prev,
      documents: [...(prev.documents || []), newDoc]
    }))
  }

  const removeDocument = (docId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents?.filter(doc => doc.id !== docId) || []
    }))
  }

  const updateDocument = (docId: string, field: keyof Document, value: any) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents?.map(doc => 
        doc.id === docId ? { ...doc, [field]: value } : doc
      ) || []
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {agreement ? 'Edit Agreement' : 'New Agreement'}
              </CardTitle>
              <CardDescription>
                {agreement ? 'Update agreement details' : 'Create a new agreement'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="type">Agreement Type *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: AgreementType) => handleInputChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select agreement type" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAgreements.agreementTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="effectiveDate">Effective Date *</Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="quoteId">Related Quote</Label>
                  <Select 
                    value={formData.quoteId} 
                    onValueChange={(value) => handleInputChange('quoteId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quote (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAgreements.sampleQuotes.map(quote => (
                        <SelectItem key={quote.id} value={quote.id}>
                          {quote.number} - ${quote.amount.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customerEmail">Customer Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    placeholder="customer@email.com"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <Label htmlFor="vehicleInfo">Vehicle/Property</Label>
                  <Input
                    id="vehicleInfo"
                    value={formData.vehicleInfo}
                    onChange={(e) => handleInputChange('vehicleInfo', e.target.value)}
                    placeholder="Enter vehicle or property details"
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            {(formData.type === AgreementType.PURCHASE || formData.type === AgreementType.LEASE) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Financial Information</h3>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="totalAmount">Total Amount</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      value={formData.totalAmount}
                      onChange={(e) => handleInputChange('totalAmount', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="downPayment">Down Payment</Label>
                    <Input
                      id="downPayment"
                      type="number"
                      value={formData.downPayment}
                      onChange={(e) => handleInputChange('downPayment', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="financingAmount">Financing Amount</Label>
                    <Input
                      id="financingAmount"
                      type="number"
                      value={formData.financingAmount}
                      onChange={(e) => handleInputChange('financingAmount', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                {formData.type === AgreementType.LEASE && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="monthlyPayment">Monthly Payment</Label>
                      <Input
                        id="monthlyPayment"
                        type="number"
                        value={formData.monthlyPayment}
                        onChange={(e) => handleInputChange('monthlyPayment', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="securityDeposit">Security Deposit</Label>
                      <Input
                        id="securityDeposit"
                        type="number"
                        value={formData.securityDeposit}
                        onChange={(e) => handleInputChange('securityDeposit', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Service Agreement Fields */}
            {formData.type === AgreementType.SERVICE && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Information</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="annualFee">Annual Fee</Label>
                    <Input
                      id="annualFee"
                      type="number"
                      value={formData.annualFee}
                      onChange={(e) => handleInputChange('annualFee', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="coverageLevel">Coverage Level</Label>
                    <Select 
                      value={formData.coverageLevel} 
                      onValueChange={(value) => handleInputChange('coverageLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select coverage level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Terms and Conditions</h3>
              
              <div>
                <Label htmlFor="terms">Agreement Terms</Label>
                <Textarea
                  id="terms"
                  value={formData.terms}
                  onChange={(e) => handleInputChange('terms', e.target.value)}
                  placeholder="Enter the terms and conditions for this agreement..."
                  rows={6}
                />
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Documents</h3>
                <Button type="button" variant="outline" size="sm" onClick={addDocument}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.documents?.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 grid gap-2 md:grid-cols-2">
                      <Input
                        value={doc.name}
                        onChange={(e) => updateDocument(doc.id, 'name', e.target.value)}
                        placeholder="Document name"
                      />
                      <Input
                        value={doc.url}
                        onChange={(e) => updateDocument(doc.id, 'url', e.target.value)}
                        placeholder="Document URL or path"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                
                {(!formData.documents || formData.documents.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No documents added yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {agreement ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {agreement ? 'Update Agreement' : 'Create Agreement'}
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