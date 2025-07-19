import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, FileText, Eye, Download, Send } from 'lucide-react'
import { Agreement, AgreementType, AgreementStatus } from '@/types'
import { mockAgreements } from '@/mocks/agreementsMock'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { TemplateManagement } from './components/TemplateManagement'

function AgreementVaultPage() {
  const { toast } = useToast()
  Send,
  Template
  const [agreements] = useState<Agreement[]>(mockAgreements.sampleAgreements)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [activeTab, setActiveTab] = useState(() => {
    return location.pathname.includes('/templates') ? 'templates' : 'agreements'
  })
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
      title: 'Download Started',
      description: `Downloading agreement ${agreementId}`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Agreement Vault</h1>
            <p className="ri-page-description">
              Manage contracts, agreements, templates, and digital signatures
            </p>
          </div>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Agreement
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="agreements" onClick={() => navigate('/agreements')}>
            <FileText className="h-4 w-4 mr-2" />
            Agreements
          </TabsTrigger>
          <TabsTrigger value="templates" onClick={() => navigate('/agreements/templates')}>
            <Template className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agreements" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <TemplateManagement />
        </TabsContent>
      </Tabs>

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
  const location = useLocation()
  
  // If we're on the templates route, show template management
  if (location.pathname.includes('/templates')) {
    return <TemplateManagement />
  }
  
  return (
    <Routes>
      <Route path="/" element={<AgreementVaultPage />} />
      <Route path="/templates" element={<TemplateManagement />} />
      <Route path="/*" element={<AgreementVaultPage />} />
    </Routes>
  )
}