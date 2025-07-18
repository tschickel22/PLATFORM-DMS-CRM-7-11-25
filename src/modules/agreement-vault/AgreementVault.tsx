import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FileText, Plus, Search, Filter, Download, Eye, Edit, Trash2, Send, FileCheck, TrendingUp, Calendar } from 'lucide-react'
import { Agreement, AgreementStatus, AgreementType } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'
import { mockAgreements } from '@/mocks/agreementsMock'
import { AgreementForm } from './components/AgreementForm'
import { AgreementViewer } from './components/AgreementViewer'
import { sendSignatureRequest, generateSignatureLink } from './utils/sendSignatureRequest'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { mockAgreements } from '@/mocks/agreementsMock'

const mockAgreements: Agreement[] = [
  {
    id: '1',
    type: AgreementType.PURCHASE,
    customerId: 'cust-1',
    vehicleId: 'veh-1',
    quoteId: 'quote-1',
    status: AgreementStatus.SIGNED,
    signedDate: new Date('2024-01-18'),
    effectiveDate: new Date('2024-01-18'),
    expirationDate: new Date('2025-01-18'),
    terms: 'Standard purchase agreement with 90-day warranty',
    documents: [
      {
        id: '1',
        name: 'Purchase Agreement.pdf',
        type: 'application/pdf',
        url: '/documents/purchase-agreement-1.pdf',
        size: 245760,
        uploadedAt: new Date('2024-01-18')
      }
    ],
    customFields: {},
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '2',
    type: AgreementType.SERVICE,
    customerId: 'cust-2',
    status: AgreementStatus.ACTIVE,
    effectiveDate: new Date('2024-01-10'),
    expirationDate: new Date('2024-07-10'),
    terms: 'Extended service contract for 6 months',
    documents: [
      {
        id: '2',
        name: 'Service Contract.pdf',
        type: 'application/pdf',
        url: '/documents/service-contract-2.pdf',
        size: 189440,
        uploadedAt: new Date('2024-01-10')
      }
    ],
    customFields: {},
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-10')
  }
]

function AgreementsList() {
  const [agreements] = useState<Agreement[]>(mockAgreements)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showViewer, setShowViewer] = useState(false)
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null)
  const [loading, setLoading] = useState(false)
  const [typeFilter, setTypeFilter] = useState('')

  const getStatusColor = (status: AgreementStatus) => {
    switch (status) {
      case AgreementStatus.DRAFT:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case AgreementStatus.PENDING:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case AgreementStatus.SIGNED:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case AgreementStatus.ACTIVE:
        return 'bg-green-50 text-green-700 border-green-200'
      case AgreementStatus.EXPIRED:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case AgreementStatus.CANCELLED:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTypeColor = (type: AgreementType) => {
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }

  // Use tenant agreements if available, otherwise fallback to mock data
  const tenant = null
  const agreementsData = tenant?.agreements || mockAgreements
  const agreementTypes = tenant?.agreementTypes || [
    { value: 'PURCHASE', label: 'Purchase Agreement' },
    { value: 'SERVICE', label: 'Service Contract' }
  ]
  const agreementStatuses = tenant?.agreementStatuses || [
    { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'SIGNED', label: 'Signed', color: 'bg-blue-100 text-blue-800' },
    { value: 'ACTIVE', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'EXPIRED', label: 'Expired', color: 'bg-orange-100 text-orange-800' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' }
  ]

  const filteredAgreements = agreements.filter(agreement =>
    agreement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.terms.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (agreement.customerName && agreement.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreateAgreement = () => {
    setSelectedAgreement(null)
    setShowForm(true)
  }

  const handleEditAgreement = (agreement: Agreement) => {
    setSelectedAgreement(agreement)
    setShowForm(true)
  }

  const handleViewAgreement = (agreement: Agreement) => {
    setSelectedAgreement(agreement)
    setShowViewer(true)
  }

  const handleSaveAgreement = async (agreementData: Partial<Agreement>) => {
    // In a real app, this would save to the backend
    console.log('Saving agreement:', agreementData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setShowForm(false)
    setSelectedAgreement(null)
    
    toast({
      title: 'Success',
      description: `Agreement ${selectedAgreement ? 'updated' : 'created'} successfully`,
    })
  }

  const handleSendSignatureRequest = async (agreementId: string) => {
    const agreement = agreements.find(a => a.id === agreementId)
    if (!agreement) return

    setLoading(true)
    try {
      // Generate signature link
      const signatureLink = generateSignatureLink(agreementId)
      
      // Get company settings from tenant
      const companySettings = {
        name: tenant?.name || 'Demo Company',
        phone: tenant?.settings?.phone,
        emailProvider: tenant?.settings?.emailProvider,
        emailApiKey: tenant?.settings?.emailApiKey,
        emailFromAddress: tenant?.settings?.emailFromAddress,
        emailFromName: tenant?.settings?.emailFromName,
        smsProvider: tenant?.settings?.smsProvider,
        smsApiKey: tenant?.settings?.smsApiKey,
        smsFromNumber: tenant?.settings?.smsFromNumber
      }

      // Send signature request
      const result = await sendSignatureRequest(
        {
          agreementId: agreement.id,
          customerName: agreement.customerName || 'Customer',
          customerEmail: agreement.customerEmail || '',
          customerPhone: agreement.customerPhone,
          agreementType: agreementTypes.find(t => t.value === agreement.type)?.label || agreement.type,
          vehicleInfo: agreement.vehicleInfo,
          effectiveDate: formatDate(agreement.effectiveDate),
          signatureLink
        },
        companySettings,
        undefined, // Platform settings would come from platform admin context
        false // Send SMS - could be made configurable
      )

      if (result.success) {
        toast({
          title: 'Signature Request Sent',
          description: result.message,
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send signature request',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAgreement = async (agreementId: string) => {
    if (!window.confirm('Are you sure you want to delete this agreement?')) return
    
    // In a real app, this would delete from the backend
    console.log('Deleting agreement:', agreementId)
    
    toast({
      title: 'Agreement Deleted',
      description: 'The agreement has been deleted successfully.',
    })
  }

  const getStatusColor2 = (status: string) => {
    const statusConfig = agreementStatuses.find(s => s.value === status)
    return statusConfig?.color || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const statusConfig = agreementStatuses.find(s => s.value === status)
    return statusConfig?.label || status
  }

  const getTypeLabel = (type: string) => {
    const typeConfig = agreementTypes.find(t => t.value === type)
    return typeConfig?.label || type
  }

  // Show form
  if (showForm) {
    return (
      <AgreementForm
        agreement={selectedAgreement || undefined}
        onSave={handleSaveAgreement}
        onCancel={() => {
          setShowForm(false)
          setSelectedAgreement(null)
        }}
        customers={[
          { id: 'cust-001', name: 'John Smith', email: 'john.smith@email.com' },
          { id: 'cust-002', name: 'Maria Rodriguez', email: 'maria.rodriguez@email.com' },
          { id: 'cust-003', name: 'David Johnson', email: 'david.johnson@email.com' }
        ]}
        vehicles={[
          { id: 'veh-001', info: '2023 Forest River Cherokee 274RK' },
          { id: 'veh-002', info: '2024 Keystone Montana 3761FL' },
          { id: 'veh-003', info: '2022 Grand Design Solitude 310GK' }
        ]}
        quotes={[
          { id: 'quote-001', number: 'Q-2024-001' },
          { id: 'quote-002', number: 'Q-2024-002' }
        ]}
      />
    )
  }

  // Show viewer
  if (showViewer && selectedAgreement) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowViewer(false)
              setSelectedAgreement(null)
            }}
          >
            ← Back to Agreements
          </Button>
        </div>
        <AgreementViewer
          agreement={selectedAgreement}
          onSendSignatureRequest={handleSendSignatureRequest}
          onEdit={handleEditAgreement}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Agreement Vault</h1>
            <p className="ri-page-description">
              Manage contracts, agreements, and legal documents
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleCreateAgreement}>
            <Plus className="h-4 w-4 mr-2" />
            New Agreement
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Agreements</CardTitle>
            <FileCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{agreements.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              All contracts
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Active</CardTitle>
            <FileCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {agreements.filter(a => a.status === AgreementStatus.ACTIVE).length}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Pending</CardTitle>
            <FileCheck className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {agreements.filter(a => a.status === AgreementStatus.PENDING).length}
            </div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Awaiting signature
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">0</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Next 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="ri-search-bar">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search agreements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ri-search-input shadow-sm"
          />
        </div>
        <Button variant="outline" className="shadow-sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        {agreementTypes.map(type => (
          <Button
            key={type.value}
            variant={typeFilter === type.value ? 'default' : 'outline'}
            onClick={() => setTypeFilter(type.value as AgreementType)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Agreements Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Agreements</CardTitle>
          <CardDescription>
            Manage contracts, purchase agreements, and legal documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAgreements.map((agreement) => (
              <div key={agreement.id} className="ri-table-row">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">Agreement #{agreement.id}</h3>
                      <Badge className={cn("ri-badge-status", getTypeColor(agreement.type))}>
                        {getTypeLabel(agreement.type)}
                      </Badge>
                      <Badge className={cn("ri-badge-status", getStatusColor2(agreement.status))}>
                        {getStatusLabel(agreement.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getTypeLabel(agreement.type)}
                      {agreement.customerName && ` • ${agreement.customerName}`}
                      {agreement.vehicleInfo && ` • ${agreement.vehicleInfo}`}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Customer:</span> {agreement.customerId}
                      </div>
                      <div>
                        <span className="font-medium">Effective:</span> {formatDate(agreement.effectiveDate)}
                      </div>
                      <div>
                        <span className="font-medium">Documents:</span> {agreement.documents.length}
                      </div>
                      {agreement.expirationDate && (
                        <div>
                          <span className="font-medium">Expires:</span> {formatDate(agreement.expirationDate)}
                        </div>
                      )}
                    </div>
                    {agreement.totalAmount && (
                      <div className="text-sm font-medium">
                        {formatCurrency(agreement.totalAmount)}
                      </div>
                    )}
                    <div className="mt-2 bg-muted/30 p-2 rounded-md">
                      <p className="text-xs text-muted-foreground">{agreement.terms}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewAgreement(agreement)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAgreement(agreement)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {agreement.status === AgreementStatus.DRAFT && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendSignatureRequest(agreement.id)}
                        disabled={loading}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAgreement(agreement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AgreementVault() {
  return (
    <Routes>
      <Route path="/" element={<AgreementsList />} />
      <Route path="/*" element={<AgreementsList />} />
    </Routes>
  )
}