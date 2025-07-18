import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Save, FileText, Eye, EyeOff } from 'lucide-react'
import { Agreement, AgreementTemplate, AgreementType } from '@/types'
import { mockAgreementTemplates } from '@/mocks/agreementTemplatesMock'
import { mockAgreements } from '@/mocks/agreementsMock'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, formatDate } from '@/lib/utils'

interface AgreementInstanceFormProps {
  agreement?: Agreement | null
  onSave: (agreement: Partial<Agreement>) => void
  onCancel: () => void
}

export function AgreementInstanceForm({ agreement, onSave, onCancel }: AgreementInstanceFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<AgreementTemplate | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState<Partial<Agreement>>({
    type: AgreementType.PURCHASE,
    status: 'DRAFT',
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
    ...mockAgreements.defaultAgreement
  })

  const [mergeFieldValues, setMergeFieldValues] = useState<Record<string, string>>({})

  // Available templates (active only)
  const availableTemplates = mockAgreementTemplates.sampleTemplates.filter(t => t.isActive)

  // Initialize form with agreement data if editing
  useEffect(() => {
    if (agreement) {
      setFormData(agreement)
      // If editing, try to find the original template (this would be stored in a real app)
      // For now, we'll just use the first template of the same type
      const matchingTemplate = availableTemplates.find(t => t.type === agreement.type)
      if (matchingTemplate) {
        setSelectedTemplate(matchingTemplate)
      }
    }
  }, [agreement])

  // When template is selected, initialize merge field values
  useEffect(() => {
    if (selectedTemplate) {
      const initialValues: Record<string, string> = {}
      
      // Pre-populate with existing form data if available
      selectedTemplate.mergeFields.forEach(field => {
        switch (field) {
          case 'customer_name':
            initialValues[field] = formData.customerName || ''
            break
          case 'customer_email':
            initialValues[field] = formData.customerEmail || ''
            break
          case 'customer_phone':
            initialValues[field] = formData.customerPhone || ''
            break
          case 'vehicle_info':
            initialValues[field] = formData.vehicleInfo || ''
            break
          case 'total_amount':
            initialValues[field] = formData.totalAmount ? formatCurrency(formData.totalAmount) : ''
            break
          case 'down_payment':
            initialValues[field] = formData.downPayment ? formatCurrency(formData.downPayment) : ''
            break
          case 'financing_amount':
            initialValues[field] = formData.financingAmount ? formatCurrency(formData.financingAmount) : ''
            break
          case 'monthly_payment':
            initialValues[field] = formData.monthlyPayment ? formatCurrency(formData.monthlyPayment) : ''
            break
          case 'effective_date':
            initialValues[field] = formData.effectiveDate ? formatDate(formData.effectiveDate) : ''
            break
          case 'expiration_date':
            initialValues[field] = formData.expirationDate ? formatDate(formData.expirationDate) : ''
            break
          case 'company_name':
            initialValues[field] = 'Demo RV Dealership'
            break
          case 'current_date':
            initialValues[field] = formatDate(new Date())
            break
          default:
            initialValues[field] = ''
        }
      })
      
      setMergeFieldValues(initialValues)
      
      // Update form data with template info
      setFormData(prev => ({
        ...prev,
        type: selectedTemplate.type as AgreementType,
        terms: selectedTemplate.terms
      }))
    }
  }, [selectedTemplate, formData.customerName, formData.customerEmail, formData.customerPhone, formData.vehicleInfo])

  const handleTemplateSelect = (templateId: string) => {
    const template = availableTemplates.find(t => t.id === templateId)
    setSelectedTemplate(template || null)
  }

  const handleMergeFieldChange = (field: string, value: string) => {
    setMergeFieldValues(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const processMergeFields = (terms: string): string => {
    let processedTerms = terms
    
    Object.entries(mergeFieldValues).forEach(([field, value]) => {
      const regex = new RegExp(`\\{\\{${field}\\}\\}`, 'g')
      processedTerms = processedTerms.replace(regex, value || `{{${field}}}`)
    })
    
    return processedTerms
  }

  const getFieldLabel = (field: string): string => {
    const mergeField = mockAgreementTemplates.commonMergeFields.find(f => f.key === field)
    return mergeField ? mergeField.label : field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getFieldCategory = (field: string): string => {
    const mergeField = mockAgreementTemplates.commonMergeFields.find(f => f.key === field)
    return mergeField ? mergeField.category : 'Other'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTemplate) {
      toast({
        title: 'Validation Error',
        description: 'Please select a template',
        variant: 'destructive'
      })
      return
    }

    // Check for required merge fields
    const missingFields = selectedTemplate.mergeFields.filter(field => !mergeFieldValues[field]?.trim())
    if (missingFields.length > 0) {
      toast({
        title: 'Missing Information',
        description: `Please fill in: ${missingFields.map(getFieldLabel).join(', ')}`,
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const processedTerms = processMergeFields(selectedTemplate.terms)
      
      const agreementData: Partial<Agreement> = {
        ...formData,
        terms: processedTerms,
        // Store original template reference (in a real app)
        // templateId: selectedTemplate.id,
        // mergeFieldValues: mergeFieldValues
      }

      await onSave(agreementData)
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

  // Group merge fields by category
  const groupedMergeFields = selectedTemplate?.mergeFields.reduce((groups, field) => {
    const category = getFieldCategory(field)
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(field)
    return groups
  }, {} as Record<string, string[]>) || {}

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{agreement ? 'Edit Agreement' : 'Create New Agreement'}</CardTitle>
              <CardDescription>
                {agreement ? 'Update agreement details' : 'Select a template and fill in the required information'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Selection */}
            {!agreement && (
              <div>
                <Label htmlFor="template">Select Agreement Template *</Label>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template to get started" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-muted-foreground">{template.description}</div>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {template.type}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <div className="mt-2 p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{selectedTemplate.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedTemplate.mergeFields.length} fields required
                        </div>
                      </div>
                      <Badge>{selectedTemplate.category}</Badge>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Merge Fields Form */}
            {selectedTemplate && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Agreement Information</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </div>

                {Object.entries(groupedMergeFields).map(([category, fields]) => (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        {fields.map(field => (
                          <div key={field}>
                            <Label htmlFor={field}>
                              {getFieldLabel(field)} *
                            </Label>
                            <Input
                              id={field}
                              value={mergeFieldValues[field] || ''}
                              onChange={(e) => handleMergeFieldChange(field, e.target.value)}
                              placeholder={`Enter ${getFieldLabel(field).toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Preview */}
                {showPreview && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Agreement Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg p-4 bg-white max-h-96 overflow-y-auto">
                        <div className="prose max-w-none whitespace-pre-wrap text-sm">
                          {processMergeFields(selectedTemplate.terms)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !selectedTemplate}>
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