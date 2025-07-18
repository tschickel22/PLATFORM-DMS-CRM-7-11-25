import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, X, Save, Send, Eye, Calendar } from 'lucide-react'
import { Agreement, AgreementType, AgreementStatus, Document } from '@/types'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { mockAgreements } from '@/mocks/agreementsMock'
import { formatDate } from '@/lib/utils'

interface AgreementFormProps {
  agreement?: Agreement
  onSave: (agreement: Partial<Agreement>) => Promise<void>
  onCancel: () => void
  customers?: Array<{ id: string; name: string; email: string }>
  vehicles?: Array<{ id: string; info: string }>
  quotes?: Array<{ id: string; number: string }>
}

export function AgreementForm({ 
  agreement, 
  onSave, 
  onCancel, 
  customers = [], 
  vehicles = [], 
  quotes = [] 
}: AgreementFormProps) {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Agreement>>({
    ...mockAgreements.defaultAgreement,
    ...agreement
  })
  const [documents, setDocuments] = useState<Document[]>(agreement?.documents || [])

  // Use tenant agreement types if available, otherwise fallback to mock
  // Use tenant data if available, otherwise fallback to mock data
  const agreementTypes = tenant?.agreementTypes || mockAgreements.agreementTypes
  const agreementStatuses = mockAgreements.agreementStatuses

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSave({
        ...formData,
        documents
      })
      
      toast({
        title: 'Success',
        description: `Agreement ${agreement ? 'updated' : 'created'} successfully`,
      })
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      // In a real app, you would upload to a storage service
      const newDocument: Document = {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file), // Temporary URL for demo
        size: file.size,
        uploadedAt: new Date()
      }
      
      setDocuments(prev => [...prev, newDocument])
    })
  }

  const removeDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
  }

  const getStatusColor = (status: string) => {
    const statusConfig = agreementStatuses.find(s => s.value === status)
    return statusConfig?.color || 'bg-gray-100 text-gray-800'
  }

  const selectedCustomer = customers.find(c => c.id === formData.customerId)
  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId)
  const selectedQuote = quotes.find(q => q.id === formData.quoteId)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                {agreement ? 'Edit Agreement' : 'New Agreement'}
              </CardTitle>
              <CardDescription>
                {agreement ? 'Update agreement details' : 'Create a new agreement'}
              </CardDescription>
            </div>
            {formData.status && (
              <Badge className={getStatusColor(formData.status)}>
                {agreementStatuses.find(s => s.value === formData.status)?.label || formData.status}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="type">Agreement Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: AgreementType) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select agreement type" />
                  </SelectTrigger>
                  <SelectContent>
                    {agreementTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: AgreementStatus) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {agreementStatuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Customer and Vehicle Selection */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="customerId">Customer *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} ({customer.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCustomer && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Email: {selectedCustomer.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="vehicleId">Vehicle</Label>
                <Select
                  value={formData.vehicleId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.info}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quote Selection */}
            <div>
              <Label htmlFor="quoteId">Related Quote</Label>
              <Select
                value={formData.quoteId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, quoteId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quote (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {quotes.map(quote => (
                    <SelectItem key={quote.id} value={quote.id}>
                      Quote #{quote.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="effectiveDate">Effective Date *</Label>
                <Input
                  type="date"
                  id="effectiveDate"
                  value={formData.effectiveDate ? new Date(formData.effectiveDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: new Date(e.target.value) }))}
                />
              </div>

              <div>
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <Input
                  type="date"
                  id="expirationDate"
                  value={formData.expirationDate ? new Date(formData.expirationDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value ? new Date(e.target.value) : undefined }))}
                />
              </div>
            </div>

            {/* Terms */}
            <div>
              <Label htmlFor="terms">Terms and Conditions *</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                placeholder="Enter agreement terms and conditions..."
                rows={6}
              />
            </div>

            {/* Document Upload */}
            <div>
              <Label>Documents</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Upload agreement documents
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Document List */}
              {documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Uploaded Documents</Label>
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(doc.size / 1024).toFixed(1)} KB • {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Signature Information (if signed) */}
            {formData.signedBy && (
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-sm">Signature Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <Label className="text-xs">Signed By</Label>
                      <p className="font-medium">{formData.signedBy}</p>
                    </div>
                    <div>
                      <Label className="text-xs">Signed At</Label>
                      <p className="font-medium">
                        {formData.signedAt ? formatDate(formData.signedAt) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs">IP Address</Label>
                      <p className="font-medium">{formData.ipAddress || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs">Signature</Label>
                      {formData.signatureData ? (
                        <img 
                          src={formData.signatureData} 
                          alt="Signature" 
                          className="h-12 border rounded"
                        />
                      ) : (
                        <p className="text-muted-foreground">No signature data</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
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