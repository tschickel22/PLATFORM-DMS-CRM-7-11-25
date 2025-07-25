import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FileText, 
  Plus, 
  Search, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAgreementVault } from './hooks/useAgreementVault'

function AgreementVaultDashboard() {
  const { toast } = useToast()
  const {
    agreements,
    templates,
    signatures,
    loading,
    usingFallback,
    refresh,
    createAgreement,
    updateAgreement,
    deleteAgreement,
    createTemplate,
    updateTemplate,
    deleteTemplate
  } = useAgreementVault()

  const [activeTab, setActiveTab] = useState('agreements')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  // Filter agreements based on search and status
  const filteredAgreements = React.useMemo(() => {
    let filtered = agreements

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(agreement =>
        agreement.title.toLowerCase().includes(query) ||
        agreement.status.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(agreement => agreement.status === statusFilter)
    }

    return filtered
  }, [agreements, searchQuery, statusFilter])

  // Filter templates based on search
  const filteredTemplates = React.useMemo(() => {
    if (!searchQuery) return templates

    const query = searchQuery.toLowerCase()
    return templates.filter(template =>
      template.name.toLowerCase().includes(query) ||
      template.description?.toLowerCase().includes(query)
    )
  }, [templates, searchQuery])

  const handleRefresh = async () => {
    setRefreshing(true)
    await refresh()
    setRefreshing(false)
  }

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
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'signed':
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'expired':
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Supabase Status Banner */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {usingFallback ? (
            <>
              <strong>Fallback Mode:</strong> Using offline data due to connection issues. 
              Live tables: <code>agreements</code>, <code>agreement_templates</code>, <code>agreement_signatures</code>
            </>
          ) : (
            <>
              <strong>Live Data:</strong> Connected to Supabase. 
              Tables: <code>agreements</code>, <code>agreement_templates</code>, <code>agreement_signatures</code>
            </>
          )}
        </AlertDescription>
      </Alert>

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Agreement Vault</h1>
            <p className="ri-page-description">
              Manage agreements, contracts, and digital signatures
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => createAgreement({})}>
              <Plus className="h-4 w-4 mr-2" />
              New Agreement
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : agreements.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : `${usingFallback ? 'Offline data' : 'Live data'}`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Signatures</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : agreements.filter(a => a.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Awaiting signature'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agreements</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : agreements.filter(a => a.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Currently active'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : templates.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Available templates'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="signatures">Signatures</TabsTrigger>
        </TabsList>

        <TabsContent value="agreements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agreements</CardTitle>
              <CardDescription>
                Manage customer agreements and contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search agreements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="signed">Signed</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading agreements...</p>
                </div>
              )}

              {/* Agreements List */}
              {!loading && (
                <div className="space-y-4">
                  {filteredAgreements.map((agreement) => (
                    <div
                      key={agreement.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(agreement.status)}
                          <div>
                            <h4 className="font-semibold">{agreement.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Created: {new Date(agreement.created_at).toLocaleDateString()}
                              {agreement.updated_at !== agreement.created_at && (
                                <span> • Updated: {new Date(agreement.updated_at).toLocaleDateString()}</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(agreement.status)}>
                          {agreement.status.toUpperCase()}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateAgreement(agreement.id, {})}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteAgreement(agreement.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredAgreements.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      {agreements.length === 0 ? (
                        <>
                          <p>No agreements found</p>
                          <p className="text-sm">Create your first agreement to get started</p>
                        </>
                      ) : (
                        <>
                          <p>No agreements match your search</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Agreement Templates</CardTitle>
                  <CardDescription>
                    Manage reusable agreement templates
                  </CardDescription>
                </div>
                <Button onClick={() => createTemplate({})}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading templates...</p>
                </div>
              )}

              {/* Templates List */}
              {!loading && (
                <div className="space-y-4">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-semibold">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {template.description || 'No description'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Created: {new Date(template.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={template.is_active ? 'default' : 'secondary'}>
                          {template.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateTemplate(template.id, {})}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredTemplates.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      {templates.length === 0 ? (
                        <>
                          <p>No templates found</p>
                          <p className="text-sm">Create your first template to get started</p>
                        </>
                      ) : (
                        <>
                          <p>No templates match your search</p>
                          <p className="text-sm">Try adjusting your search</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signatures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Digital Signatures</CardTitle>
              <CardDescription>
                Track signature requests and completions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading signatures...</p>
                </div>
              )}

              {/* Signatures List */}
              {!loading && (
                <div className="space-y-4">
                  {signatures.map((signature) => (
                    <div
                      key={signature.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(signature.status)}
                          <div>
                            <h4 className="font-semibold">{signature.signer_name || signature.signer_email}</h4>
                            <p className="text-sm text-muted-foreground">
                              {signature.signer_email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Created: {new Date(signature.created_at).toLocaleDateString()}
                              {signature.signed_at && (
                                <span> • Signed: {new Date(signature.signed_at).toLocaleDateString()}</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(signature.status)}>
                          {signature.status.toUpperCase()}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {signatures.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No signatures found</p>
                      <p className="text-sm">Signature requests will appear here</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
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