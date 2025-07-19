import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, Plus, Search, Filter, Eye, Edit, Trash2, Download, Send, FilePlus } from 'lucide-react'
import { Agreement, AgreementStatus, AgreementType } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { TemplateManagement } from './components/TemplateManagement'

function AgreementVaultPage() {
  const { toast } = useToast()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<AgreementStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<AgreementType | 'all'>('all')
  const [showNewAgreementForm, setShowNewAgreementForm] = useState(false)
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null)
  const [showAgreementDetail, setShowAgreementDetail] = useState(false)

  // Mock data for agreements
  const agreements: Agreement[] = [
    {
      id: 'AGR-001',
      type: 'PURCHASE',
      status: 'PENDING',
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      vehicleInfo: '2023 Honda Civic',
      totalAmount: 25000,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 'AGR-002',
      type: 'LEASE',
      status: 'SIGNED',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@email.com',
      vehicleInfo: '2024 Toyota Camry',
      totalAmount: 35000,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12')
    }
  ]

  const [activeTab, setActiveTab] = useState(() => {
    return location.pathname.includes('/templates') ? 'templates' : 'agreements'
  })

  const filteredAgreements = agreements.filter(agreement => {
    const matchesSearch = 
      agreement.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.vehicleInfo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || agreement.type === typeFilter
    const matchesStatus = statusFilter === 'all' || agreement.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: AgreementStatus) => {
    const statusColors = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      SIGNED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      EXPIRED: 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge className={statusColors[status]}>
        {status}
      </Badge>
    )
  }

  const getTypeBadge = (type: AgreementType) => {
    return (
      <Badge variant="outline">
        {type}
      </Badge>
    )
  }

  const handleViewAgreement = (agreement: Agreement) => {
    setSelectedAgreement(agreement)
    setShowAgreementDetail(true)
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
          <Button 
            className="shadow-sm"
            onClick={() => setShowNewAgreementForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Agreement
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="agreements" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Agreements</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <FilePlus className="h-4 w-4" />
            <span>Templates</span>
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
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as AgreementType | 'all')}
                    className="px-3 py-2 border rounded-md shadow-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="PURCHASE">Purchase</option>
                    <option value="LEASE">Lease</option>
                    <option value="SERVICE">Service</option>
                    <option value="WARRANTY">Warranty</option>
                  </select>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as AgreementStatus | 'all')}
                    className="px-3 py-2 border rounded-md shadow-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="DRAFT">Draft</option>
                    <option value="PENDING">Pending</option>
                    <option value="SIGNED">Signed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="EXPIRED">Expired</option>
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
                        {getTypeBadge(agreement.type)}
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
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <TemplateManagement />
        </TabsContent>
      </Tabs>
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