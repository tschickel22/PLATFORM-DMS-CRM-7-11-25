import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Plus, Settings, Users, Search, Eye, Edit, Trash2, PenTool } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useAgreementVault } from './hooks/useAgreementVault'
import { AgreementForm } from './components/AgreementForm'
import { AgreementViewer } from './components/AgreementViewer'
import TemplateList from './templates/TemplateList'
import { TemplateBuilder } from './templates/TemplateBuilder'

function AgreementVaultDashboard() {
  const { tenant } = useTenant()
  const {
    agreements,
    templates,
    signatures,
    loading,
    error,
    stats,
    createAgreement,
    updateAgreement,
    deleteAgreement,
    signAgreement
  } = useAgreementVault()
  
  const [activeTab, setActiveTab] = useState('agreements')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showNewAgreementForm, setShowNewAgreementForm] = useState(false)
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null)
  const [showAgreementViewer, setShowAgreementViewer] = useState(false)

  // Filter agreements based on search and status
  const filteredAgreements = React.useMemo(() => {
    let filtered = agreements

    if (searchQuery) {
      filtered = filtered.filter(agreement =>
        agreement.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agreement.vehicleInfo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agreement.type?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(agreement => agreement.status === statusFilter)
    }

    return filtered
  }, [agreements, searchQuery, statusFilter])

  // Calculate stats from live data
  const statsCards = [
    {
      name: 'Total Agreements',
      value: loading ? '...' : stats.totalAgreements.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: FileText,
    },
    {
      name: 'Pending Signatures',
      value: loading ? '...' : stats.pendingSignatures.toString(),
      change: '+3',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      name: 'Signed This Month',
      value: loading ? '...' : stats.signedThisMonth.toString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: Settings,
    },
    {
      name: 'Active Templates',
      value: loading ? '...' : stats.activeTemplates.toString(),
      change: '0',
      changeType: 'neutral' as const,
      icon: Plus,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'signed':
        return 'bg-blue-100 text-blue-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateAgreement = () => {
    setShowNewAgreementForm(true)
  }

  const handleViewAgreement = (agreement: any) => {
    setSelectedAgreement(agreement)
    setShowAgreementViewer(true)
  }

  const handleSignAgreement = async (agreementId: string) => {
    const agreement = agreements.find(a => a.id === agreementId)
    if (!agreement) return

    const success = await signAgreement(agreementId, {
      signer_name: agreement.customer_name,
      signer_email: agreement.customer_email,
      signature_data: 'demo_signature_data',
      ip_address: '192.168.1.100'
    })

    // Data will be refreshed automatically via the hook
  }

  const getModuleLabel = () => {
    const platformType = tenant?.settings?.platformType || 'mh'
    const labelOverrides = tenant?.settings?.labelOverrides || {}
    
    if (labelOverrides.agreementVault) {
      return labelOverrides.agreementVault
    }
    
    switch (platformType) {
      case 'mh':
        return 'Agreement Vault'
      case 'rv':
        return 'RV Agreement Center'
      case 'auto':
        return 'Auto Agreement Hub'
      default:
        return 'Agreement Vault'
    }
  }

  if (showNewAgreementForm) {
    return (
      <AgreementForm
        onClose={() => setShowNewAgreementForm(false)}
        onSave={(agreementData) => {
          // Handle save
          setShowNewAgreementForm(false)
        }}
      />
    )
  }

  if (showAgreementViewer && selectedAgreement) {
    return (
      <AgreementViewer
        agreement={selectedAgreement}
        onClose={() => {
          setShowAgreementViewer(false)
          setSelectedAgreement(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">{getModuleLabel()}</h1>
            <p className="ri-page-description">
              Manage agreements, contracts, and digital signatures
            </p>
          </div>
          <Button onClick={handleCreateAgreement}>
            <Plus className="h-4 w-4 mr-2" />
            New Agreement
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="ri-stats-grid">
        {statsCards.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={
                  stat.changeType === 'positive' ? 'text-green-600' :
                  stat.changeType === 'negative' ? 'text-red-600' :
                  'text-muted-foreground'
                }>
                  {stat.change}
                </span>
                {' '}from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="agreements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Agreements</CardTitle>
                  <CardDescription>
                    Latest agreement activity and status updates
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search agreements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading agreements...</p>
                  </div>
                )}
                {filteredAgreements.map((agreement) => (
                  <div
                    key={agreement.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold">{agreement.customer_name}</h4>
                        <Badge className={getStatusColor(agreement.status)}>
                          {agreement.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {agreement.vehicle_info && <span>{agreement.vehicle_info} • </span>}
                        {agreement.type} • 
                        Created: {new Date(agreement.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAgreement(agreement)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {agreement.status === 'pending' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSignAgreement(agreement.id)}
                        >
                          <PenTool className="h-4 w-4 mr-2" />
                          Sign
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {!loading && filteredAgreements.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    {agreements.length === 0 && !error ? (
                      <>
                        <p>No agreements created yet</p>
                        <p className="text-sm">Create your first agreement to get started</p>
                      </>
                    ) : (
                      <>
                        <p>No agreements match your search</p>
                        <p className="text-sm">Try adjusting your search terms</p>
                      </>
                    )}
                  </div>
                )}
                
                {error && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-red-400" />
                    <p className="text-red-600">Error loading agreements</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <TemplateList
            templates={templates}
            onCreateTemplate={() => {
              // Handle template creation
            }}
            onEditTemplate={(template) => {
              // Handle template editing
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function AgreementVault() {
  return (
    <Routes>
      <Route path="/" element={<AgreementVaultDashboard />} />
      <Route path="/*" element={<AgreementVaultDashboard />} />
    </Routes>
  )
}