import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  MapPin, 
  Home, 
  Link, 
  Trash2, 
  Layers, 
  PackageCheck, 
  Plus, 
  Search, 
  Edit,
  Filter,
  DollarSign,
  Package,
  Users,
  TrendingUp
} from 'lucide-react'
import { useLandInventory } from '../hooks/useLandInventory'
import { useTenant } from '@/contexts/TenantContext'
import { LandAsset } from '../models/LandAsset'
import { LandAssetModal } from './LandAssetModal'
import { mockLandAssets } from '@/mocks/mockLandAssets'
import { mockInventory } from '@/mocks/inventoryMock'
import { formatCurrency } from '@/lib/utils'

export function LandInventoryDashboard() {
  const { tenant } = useTenant()
  const {
    landAssets,
    loading,
    searchLandAssets,
    filterLandAssets,
    deleteLandAsset,
    bundleToInventory,
    unbundleLandAsset,
    getAvailableLandAssets
  } = useLandInventory()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ownershipFilter, setOwnershipFilter] = useState('all')
  const [zoningFilter, setZoningFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingAsset, setEditingAsset] = useState<LandAsset | null>(null)
  const [showBundleModal, setShowBundleModal] = useState(false)
  const [selectedAssetForBundle, setSelectedAssetForBundle] = useState<LandAsset | null>(null)
  const [selectedInventoryId, setSelectedInventoryId] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Check if land management should be visible based on platform type
  const isLandManagementVisible = useMemo(() => {
    const platformType = tenant?.settings?.platformType || 'both'
    const landFeatureEnabled = tenant?.settings?.features?.landManagement !== false
    
    // For RV-only platforms, land management is only visible if manually enabled
    if (platformType === 'rv') {
      return landFeatureEnabled
    }
    
    // For MH or mixed platforms, it's enabled by default
    return true
  }, [tenant?.settings?.platformType, tenant?.settings?.features?.landManagement])

  // If land management is not visible for this platform, don't render
  if (!isLandManagementVisible) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">Land Management Not Available</h3>
            <p className="text-muted-foreground mb-4">
              Land management features are not enabled for your platform type.
            </p>
            <p className="text-sm text-muted-foreground">
              Contact your administrator to enable this feature if needed.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Apply filters and search
  const filteredAssets = React.useMemo(() => {
    let assets = landAssets

    // Apply search
    if (searchQuery.trim()) {
      assets = searchLandAssets(searchQuery)
    }

    // Apply filters
    const filters: any = {}
    if (statusFilter !== 'all') filters.status = statusFilter
    if (ownershipFilter !== 'all') filters.ownershipStatus = ownershipFilter
    if (zoningFilter !== 'all') filters.zoningType = zoningFilter

    if (Object.keys(filters).length > 0) {
      assets = filterLandAssets(filters)
    }

    return assets
  }, [landAssets, searchQuery, statusFilter, ownershipFilter, zoningFilter, searchLandAssets, filterLandAssets])

  const handleCreateAsset = () => {
    setEditingAsset(null)
    setShowModal(true)
  }

  const handleEditAsset = (asset: LandAsset) => {
    setEditingAsset(asset)
    setShowModal(true)
  }

  const handleDeleteAsset = (asset: LandAsset) => {
    if (window.confirm(`Are you sure you want to delete "${asset.label}"?`)) {
      deleteLandAsset(asset.id)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingAsset(null)
  }

  const handleBundle = (asset: LandAsset) => {
    setSelectedAssetForBundle(asset)
    setSelectedInventoryId('')
    setShowBundleModal(true)
  }

  const handleUnbundle = (asset: LandAsset) => {
    if (window.confirm('Are you sure you want to unbundle this land asset?')) {
      unbundleLandAsset(asset.id)
    }
  }

  const handleConfirmBundle = () => {
    if (selectedAssetForBundle && selectedInventoryId) {
      bundleToInventory(selectedInventoryId, selectedAssetForBundle.id)
      setShowBundleModal(false)
      setSelectedAssetForBundle(null)
      setSelectedInventoryId('')
    }
  }

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = landAssets.length
    const available = landAssets.filter(a => a.status === 'Available').length
    const bundled = landAssets.filter(a => a.status === 'Bundled').length
    const totalValue = landAssets.reduce((sum, asset) => 
      sum + (asset.pricing?.salePrice || 0), 0
    )

    return { total, available, bundled, totalValue }
  }, [landAssets])

  // Get available inventory items for bundling (mock data for now)
  const availableInventory = mockInventory.exampleInventory.filter(item => 
    ['Single Wide', 'Double Wide', 'Triple Wide', 'Park Model'].includes(item.type)
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Land Management</h1>
          <p className="ri-page-description">Loading land assets...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Bundle Modal */}
      {showBundleModal && selectedAssetForBundle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Bundle Land with Home</CardTitle>
              <CardDescription>
                Select a home to bundle with {selectedAssetForBundle.label}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Home/Unit</label>
                <Select value={selectedInventoryId} onValueChange={setSelectedInventoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a home to bundle" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableInventory.map((item) => (
                      <SelectItem key={item.stockNumber} value={item.stockNumber}>
                        {item.year} {item.make} {item.model} - {item.stockNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md">
                <h4 className="font-medium text-sm mb-2">Bundle Details</h4>
                <div className="space-y-1 text-sm">
                  <div>Land: {selectedAssetForBundle.label}</div>
                  <div>Address: {selectedAssetForBundle.address}</div>
                  <div>Lot Size: {selectedAssetForBundle.lotSizeSqFt?.toLocaleString()} sq ft</div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowBundleModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmBundle}
                  disabled={!selectedInventoryId}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Create Bundle
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Land Asset Modal */}
      {showModal && (
        <LandAssetModal
          asset={editingAsset}
          onClose={handleModalClose}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="ri-page-title flex items-center">
              <MapPin className="h-8 w-8 mr-3 text-primary" />
              Land Management
            </h1>
            <p className="ri-page-description">
          <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
            </p>
          </div>
          <Button onClick={handleCreateAsset}>
            <Plus className="h-4 w-4 mr-2" />
            Add Land Asset
          </Button>
        </div>
      </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Land Assets</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Land parcels in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.available}</div>
            <p className="text-xs text-muted-foreground">
              Ready for bundling
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bundled Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bundled}</div>
            <p className="text-xs text-muted-foreground">
              Land + Home packages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Combined land value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search by label, address, or parcel number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ri-search-input"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {mockLandAssets.landStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Ownership Filter */}
            <Select value={ownershipFilter} onValueChange={setOwnershipFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Ownership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ownership</SelectItem>
                {mockLandAssets.ownershipStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Zoning Filter */}
            <Select value={zoningFilter} onValueChange={setZoningFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Zoning" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zoning Types</SelectItem>
                {mockLandAssets.zoningTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Land Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Land Assets ({filteredAssets.length})</CardTitle>
          <CardDescription>
            Manage your land inventory and bundle with homes
          </CardDescription>
            <div className="space-y-4 overflow-x-auto">
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-8 gap-4 p-4 bg-muted/50 font-medium text-sm">
                    <div>Label</div>
                    <div>Address</div>
                    <div>Size (sq ft)</div>
                    <div>Zoning</div>
                    <div>Ownership</div>
                    <div>Status</div>
                    <div>Price</div>
                    <div>Actions</div>
                  </div>
                  {filteredAssets.map((asset) => (
                    <div key={asset.id} className="grid grid-cols-8 gap-4 p-4 border-t hover:bg-accent/50 transition-colors">
                      <div className="font-medium">{asset.label}</div>
                      <div className="text-sm text-muted-foreground truncate">{asset.address}</div>
                      <div className="text-sm">{asset.lotSizeSqFt?.toLocaleString()}</div>
                      <div className="text-sm">{asset.zoningType}</div>
                      <div>
                        <Badge className={mockLandAssets.ownershipColors[asset.ownershipStatus]} variant="secondary">
                          {asset.ownershipStatus}
                        </Badge>
                      </div>
                      <div>
                        <Badge className={mockLandAssets.statusColors[asset.status]} variant="secondary">
                          {asset.status}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        {asset.pricing.salePrice ? formatCurrency(asset.pricing.salePrice) : 'Lease Only'}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAsset(asset)}
                        >
                          Edit
                        </Button>
                        {asset.status === 'Available' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBundleAsset(asset)}
                          >
                            <Link className="h-4 w-4 mr-1" />
                            Bundle
                          </Button>
                        )}
                        {asset.status === 'Bundled' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnbundleAsset(asset.id)}
                          >
                            Unlink
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAsset(asset.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden space-y-4">
        <CardContent>
                <Card key={asset.id} className="overflow-hidden">
                  <CardContent className="p-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Address</TableHead>
                          <h4 className="font-semibold text-sm sm:text-base">{asset.label}</h4>
                  <TableHead>Zoning</TableHead>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{asset.address}</p>
                  <TableHead>Status</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>Linked Unit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">
                      <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm mb-4">
                        {asset.parcelNumber && (
                          <div className="text-sm text-muted-foreground">
                            {asset.parcelNumber}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={asset.address}>
                        {asset.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      {asset.lotSizeSqFt ? asset.lotSizeSqFt.toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{asset.zoningType || 'N/A'}</div>
                    </TableCell>
                          <span className="text-xs sm:text-sm font-medium text-blue-900">
                      <Badge className={mockLandAssets.ownershipColors[asset.ownershipStatus]}>
                        {asset.ownershipStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={mockLandAssets.statusColors[asset.status]}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      {asset.linkedInventoryId && (
                        <Badge variant="outline" className="ml-2">
                          <Link className="h-3 w-3 mr-1" />
                          Linked
                          className="flex-1 sm:flex-none"
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {asset.pricing?.salePrice 
                        ? formatCurrency(asset.pricing.salePrice)
                        : 'N/A'
                      }
                            className="flex-1 sm:flex-none"
                    </TableCell>
                    <TableCell>
                            <span className="hidden sm:inline">Bundle</span>
                        <div className="flex items-center text-sm">
                          <Link className="h-3 w-3 mr-1 text-blue-600" />
                          <span className="text-blue-600">{asset.linkedInventoryId}</span>
              <CardTitle className="text-xs sm:text-sm font-medium">Total Assets</CardTitle>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                            className="flex-1 sm:flex-none"
              <div className="text-xl sm:text-2xl font-bold">{stats.totalAssets}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                      <div className="ri-action-buttons">
                        {asset.status === 'Available' && (
                          <Button
                            variant="outline"
                      <div className="flex space-x-2 w-full sm:w-auto justify-end">
                            onClick={() => handleBundle(asset)}
                          >
              <CardTitle className="text-xs sm:text-sm font-medium">Available</CardTitle>
                            Bundle
                          </Button>
                          title="Coming soon - CRM integration"
                          className="text-xs"
              <div className="text-xl sm:text-2xl font-bold">{stats.availableAssets}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnbundle(asset)}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Unbundle
                          </Button>
                            className="text-xs"
              <CardTitle className="text-xs sm:text-sm font-medium">Bundled</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
              <div className="text-xl sm:text-2xl font-bold">{stats.bundledAssets}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                          <Edit className="h-3 w-3" />
                        </Button>
                          className="text-red-600 hover:text-red-700"
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAsset(asset)}
                          disabled={asset.status === 'Bundled'}
                  </CardContent>
                </Card>
                        </Button>
              </div>
                      </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                ))}
              </TableBody>
            </Table>

            {filteredAssets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <Card className="overflow-hidden">
                  <>
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between mb-4 sm:hidden">
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Desktop Filters - Always Visible */}
              <Select value={zoningFilter} onValueChange={setZoningFilter}>
                    <p className="text-sm">Add your first land asset to get started</p>
                  </>
                ) : (
                  <>
                    <p>No land assets found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Integration Placeholders */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Actions</CardTitle>
          <CardDescription>
            Future integration points for CRM and marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" disabled className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Assign Customer (CRM Integration)
            </Button>
            <Button variant="outline" disabled className="justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Post Bundled Listing (Marketplace)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            These features will be available in future phases
          </p>
        </CardContent>
      </Card>
    </div>
  )
}