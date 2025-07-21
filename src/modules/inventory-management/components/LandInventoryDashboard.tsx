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
import { LandAsset } from '../models/LandAsset'
import { LandAssetModal } from './LandAssetModal'
import { mockLandAssets } from '@/mocks/mockLandAssets'
import { mockInventory } from '@/mocks/inventoryMock'
import { formatCurrency } from '@/lib/utils'

export function LandInventoryDashboard() {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title flex items-center">
              <MapPin className="h-8 w-8 mr-3 text-primary" />
              Land Management
            </h1>
            <p className="ri-page-description">
              Manage land assets and bundle with inventory units
            </p>
          </div>
          <Button onClick={handleCreateAsset}>
            <Plus className="h-4 w-4 mr-2" />
            Add Land Asset
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
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
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Size (Sq Ft)</TableHead>
                  <TableHead>Zoning</TableHead>
                  <TableHead>Ownership</TableHead>
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
                        <div className="font-semibold">{asset.label}</div>
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
                    <TableCell>
                      <Badge className={mockLandAssets.ownershipColors[asset.ownershipStatus]}>
                        {asset.ownershipStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={mockLandAssets.statusColors[asset.status]}>
                        {asset.status}
                      </Badge>
                      {asset.linkedInventoryId && (
                        <Badge variant="outline" className="ml-2">
                          <Link className="h-3 w-3 mr-1" />
                          Linked
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {asset.pricing?.salePrice 
                        ? formatCurrency(asset.pricing.salePrice)
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      {asset.linkedInventoryId ? (
                        <div className="flex items-center text-sm">
                          <Link className="h-3 w-3 mr-1 text-blue-600" />
                          <span className="text-blue-600">{asset.linkedInventoryId}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="ri-action-buttons">
                        {asset.status === 'Available' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBundle(asset)}
                          >
                            <Link className="h-4 w-4 mr-1" />
                            Bundle
                          </Button>
                        )}
                        {asset.status === 'Bundled' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnbundle(asset)}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Unbundle
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAsset(asset)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAsset(asset)}
                          disabled={asset.status === 'Bundled'}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAssets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                {landAssets.length === 0 ? (
                  <>
                    <p>No land assets yet</p>
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