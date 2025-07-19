import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, FileText, Calendar, User, DollarSign, Filter, Settings, Eye, Download, Send } from 'lucide-react'
import { Agreement, AgreementType, AgreementStatus } from '@/types'
import { mockAgreements } from '@/mocks/agreementsMock'
import { formatDate, formatCurrency } from '@/lib/utils'
import { TemplateSelectorModal } from './components/TemplateSelectorModal'
import TemplateList from './templates/TemplateList'
import TemplateBuilder from './templates/TemplateBuilder'
import { Template } from './templates/templateTypes'
import { useToast } from '@/hooks/use-toast'

function AgreementVaultPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [agreements] = useState<Agreement[]>(mockAgreements.sampleAgreements)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showTemplateSelectorModal, setShowTemplateSelectorModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedCustomField, setSelectedCustomField] = useState<any>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const filteredAgreements = agreements.filter(agreement => {
    const matchesSearch = 
      agreement.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.vehicleInfo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || agreement.type === selectedType
    const matchesStatus = selectedStatus === 'all' || agreement.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = mockAgreements.agreementStatuses.find(s => s.value === status)
    if (!statusConfig) return null
    
    return (
      <Badge className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    )
  }

  const handleNewAgreement = () => {
    setShowTemplateSelectorModal(true)
  }

  const handleTemplateSelected = (template: Template) => {
    setSelectedTemplate(template)
    setShowNewAgreementForm(true)
  }

  const handleCreateNewTemplate = () => {
    navigate('/agreements/templates/new')
    navigate('/agreements/templates/new')
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = mockAgreements.agreementTypes.find(t => t.value === type)
    return typeConfig ? typeConfig.label : type
  }

  const handleViewAgreement = (agreementId: string) => {
    toast({
      title: 'Opening Agreement',
      description: `Opening agreement ${agreementId} for review`,
    })
  }

  const handleSendForSignature = (agreementId: string) => {
    toast({
      title: 'Signature Request Sent',
      description: `Signature request sent for agreement ${agreementId}`,
    })
  }

  const handleDownload = (agreementId: string) => {
    toast({
    // Use template data to create new agreement
      description: `Downloading agreement ${agreementId}`,
    })
  }
  return (
    <div className="space-y-6">
      {/* Template Selector Modal */}
      {showTemplateSelectorModal && (
        <TemplateSelectorModal
          onSelect={handleTemplateSelected}
          onClose={() => setShowTemplateSelectorModal(false)}
          onCreateNew={handleCreateNewTemplate}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Agreement Vault</h1>
            <p className="ri-page-description">
              Manage contracts, agreements, and digital signatures
            </p>
          </div>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Agreement
            <Button 
              variant="outline" 
              onClick={() => navigate('/agreements/templates')}
              className="shadow-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Templates
            </Button>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                className="ri-search-input shadow-sm"
                placeholder="Search agreements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border rounded-md shadow-sm"
              >
                <option value="all">All Types</option>
                {mockAgreements.agreementTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md shadow-sm"
              >
                <option value="all">All Statuses</option>
                {mockAgreements.agreementStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agreements Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Agreements</CardTitle>
          <CardDescription>
            {filteredAgreements.length} agreement{filteredAgreements.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agreement ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgreements.map((agreement) => (
                <TableRow key={agreement.id}>
                  <TableCell className="font-medium">
                    {agreement.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{agreement.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {agreement.customerEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTypeBadge(agreement.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {agreement.vehicleInfo || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(agreement.status)}
                  </TableCell>
                  <TableCell>
                    {agreement.totalAmount ? formatCurrency(agreement.totalAmount) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {formatDate(agreement.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="ri-action-buttons">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAgreement(agreement.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(agreement.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {agreement.status === 'PENDING' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendForSignature(agreement.id)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredAgreements.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No agreements found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AgreementVault() {
  return (
    <Routes>
      <Route path="/" element={<AgreementVaultPage />} />
      <Route path="/templates" element={<TemplateList />} />
      <Route path="/templates/new" element={<TemplateBuilder />} />
      <Route path="/templates/edit/:templateId" element={<TemplateBuilder />} />
      <Route path="/*" element={<AgreementVaultPage />} />
    </Routes>
  )
}