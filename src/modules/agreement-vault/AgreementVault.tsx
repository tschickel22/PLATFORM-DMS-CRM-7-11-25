import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, FileText, BookTemplate as FileTemplate, Eye, Edit, Trash2, Download, Send, Filter, Settings } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Agreement, AgreementType, AgreementStatus } from '@/types'
import { mockAgreements } from '@/mocks/agreementsMock'
import { formatDate, formatCurrency } from '@/lib/utils'
import { AgreementTemplatesPage } from './components/AgreementTemplatesPage'
import { useToast } from '@/hooks/use-toast'
import { NewAgreementForm } from './components/NewAgreementForm'
import { AgreementViewer } from './components/AgreementViewer'
import { useAgreementManagement } from './hooks/useAgreementManagement'

function AgreementVaultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const {
    agreements,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    createAgreement,
    updateAgreement,
    deleteAgreement,
    sendSignatureRequest,
    filteredAgreements
  } = useAgreementManagement()
  
  const [showNewAgreementForm, setShowNewAgreementForm] = useState(false)
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null)
  const [showAgreementViewer, setShowAgreementViewer] = useState(false)

  const handleCreateAgreement = async (agreementData: Partial<Agreement>) => {
    try {
      await createAgreement(agreementData)
      setShowNewAgreementForm(false)
      toast({
        title: 'Agreement Created',
        description: 'New agreement has been created successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create agreement.',
        variant: 'destructive'
      })
    }
  }

  const handleViewAgreement = (agreement: Agreement) => {
    setSelectedAgreement(agreement)
    setShowAgreementViewer(true)
  }

  const handleEditAgreement = (agreement: Agreement) => {
    setSelectedAgreement(agreement)
    setShowNewAgreementForm(true)
  }

  const handleDeleteAgreement = async (agreementId: string) => {
    if (window.confirm('Are you sure you want to delete this agreement?')) {
      try {
        await deleteAgreement(agreementId)
        toast({
          title: 'Agreement Deleted',
          description: 'Agreement has been deleted successfully.',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete agreement.',
          variant: 'destructive'
        })
      }
    }
  }

  const handleSendSignatureRequest = async (agreementId: string) => {
    try {
      await sendSignatureRequest(agreementId)
      toast({
        title: 'Signature Request Sent',
        description: 'Signature request has been sent to the customer.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send signature request.',
        variant: 'destructive'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = mockAgreements.agreementStatuses.find(s => s.value === status)
    if (!statusConfig) return null
    
    return (
      <Badge className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = mockAgreements.agreementTypes.find(t => t.value === type)
    return typeConfig ? typeConfig.label : type
  }

  const handleDownload = (agreementId: string) => {
    toast({
      title: 'Download Started',
      description: `Downloading agreement ${agreementId}`,
    })
  }

  return (
    <div className="space-y-6">
      {/* New Agreement Form Modal */}
      {showNewAgreementForm && (
        <NewAgreementForm
          agreement={selectedAgreement}
          onSave={handleCreateAgreement}
          onCancel={() => {
            setShowNewAgreementForm(false)
            setSelectedAgreement(null)
          }}
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
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/agreements/templates')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Templates
            </Button>
            <Button onClick={() => setShowNewAgreementForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Agreement
            </Button>
          </div>
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px] shadow-sm">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {mockAgreements.agreementTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] shadow-sm">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {mockAgreements.agreementStatuses.map(status => (
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
                        onClick={() => handleViewAgreement(agreement)}
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
                          onClick={() => handleSendSignatureRequest(agreement.id)}
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

      {/* Agreement Viewer Modal */}
      {showAgreementViewer && selectedAgreement && (
        <AgreementViewer
          agreement={selectedAgreement}
          onClose={() => setShowAgreementViewer(false)}
          onEdit={() => handleEditAgreement(selectedAgreement)}
        />
      )}
    </div>
  )
}

export default function AgreementVault() {
  return (
    <Routes>
      <Route path="/" element={<AgreementVaultPage />} />
      <Route path="/templates" element={<AgreementTemplatesPage />} />
      <Route path="/templates/*" element={<AgreementTemplatesPage />} />
      <Route path="/*" element={<AgreementVaultPage />} />
    </Routes>
  )
}