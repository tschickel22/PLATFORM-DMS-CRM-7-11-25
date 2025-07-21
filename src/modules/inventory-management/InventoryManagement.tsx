import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LandAssetModal } from './components/LandAssetModal'
import { VehicleForm } from './components/VehicleForm'
import { useLandInventory } from './hooks/useLandInventory'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Package, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  BarChart3,
  MapPin,
  Home,
  Car,
  X
} from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { mockInventory } from '@/mocks/inventoryMock'
import { mockLandAssets } from '@/mocks/mockLandAssets'
import { LandAsset } from './models/LandAsset'

function InventoryManagementPage() {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('vehicles')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [showLandAssetModal, setShowLandAssetModal] = useState(false)
  const [editingLandAsset, setEditingLandAsset] = useState<LandAsset | null>(null)
  
  // Vehicle/Home modal state
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [vehicleModalType, setVehicleModalType] = useState<'home' | 'vehicle' | null>(null)

  // Use the land inventory hook
  const {
    landAssets,
    createLandAsset,
    updateLandAsset,
    deleteLandAsset
  } = useLandInventory()

  // Check if land management is enabled
  const isLandManagementEnabled = tenant?.settings?.features?.landManagement === true

  // Mock vehicle data
  const vehicles = [
    {
      id: 'vh-001',
      stockNumber: 'RV-2023-001',
      make: 'Forest River',
      model: 'Cherokee 274RK',
      year: 2024,
      type: 'MOTORHOME',
      status: 'AVAILABLE',
      location: 'Lot A-15',
      price: 125000,
      cost: 95000,
      vin: '1FXWE4FS8KDC12345',
      features: ['AC', 'Solar Prep', 'Appliances Included']
    },
    {
      id: 'vh-002',
      stockNumber: 'MH-2024-002',
      make: 'Clayton Homes',
      model: 'Inspiration',
      year: 2024,
      type: 'DOUBLE_WIDE',
      status: 'AVAILABLE',
      location: 'MH Section A-10',
      price: 125000,
      cost: 98000,
      vin: 'MH123456789012345',
      features: ['Washer/Dryer', 'Porch', 'Skirting']
    },
    {
      id: 'vh-003',
      stockNumber: 'RV-2023-003',
      make: 'Winnebago',
      model: 'View',
      year: 2023,
      type: 'RV',
      status: 'AVAILABLE',
      location: 'Lot B-08',
      price: 89000,
      cost: 72000,
      vin: '1FXWE4FS8KDC67890',
      features: ['AC', 'Solar Prep']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'reserved':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'sold':
        return 'bg-blue-100 text-blue-800'
      case 'bundled':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddVehicle = () => {
    setVehicleModalType('vehicle')
    setShowVehicleModal(true)
  }

  const handleAddHome = () => {
    setVehicleModalType('home')
    setShowVehicleModal(true)
  }

  const handleSaveVehicle = (vehicleData: any) => {
    // Mock save - in real app this would persist to database
    const itemType = vehicleModalType === 'home' ? 'Home' : 'Vehicle'
    toast({
      title: `${itemType} Added`,
      description: `New ${itemType.toLowerCase()} has been added successfully.`
    })
    setShowVehicleModal(false)
    setVehicleModalType(null)
  }

  const handleCancelVehicle = () => {
    setShowVehicleModal(false)
    setVehicleModalType(null)
  }

  const handleAddLandAsset = () => {
    setEditingLandAsset(null)
    setShowLandAssetModal(true)
  }

  const handleEditLandAsset = (asset: LandAsset) => {
    setEditingLandAsset(asset)
    setShowLandAssetModal(true)
  }

  const handleSaveLandAsset = (assetData: Partial<LandAsset>) => {
    if (editingLandAsset) {
      updateLandAsset(editingLandAsset.id, assetData)
      toast({
        title: 'Land Asset Updated',
        description: 'Land asset has been updated successfully.'
      })
    } else {
      createLandAsset(assetData)
      toast({
        title: 'Land Asset Created',
        description: 'New land asset has been created successfully.'
      })
    }
    setShowLandAssetModal(false)
    setEditingLandAsset(null)
  }

  const handleDeleteLandAsset = (assetId: string) => {
    if (window.confirm('Are you sure you want to delete this land asset?')) {
      deleteLandAsset(assetId)
      toast({
        title: 'Land Asset Deleted',
        description: 'Land asset has been deleted successfully.'
      })
    }
  }

  const renderVehiclesTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">
              +5 units this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.filter(v => v.status === 'AVAILABLE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for sale
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.filter(v => v.status === 'RESERVED').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending sale
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${vehicles.reduce((total, v) => total + v.price, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by make, model, VIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="rv">RV</SelectItem>
            <SelectItem value="motorhome">Motorhome</SelectItem>
            <SelectItem value="manufactured">Manufactured Home</SelectItem>
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="lot-a">Lot A</SelectItem>
            <SelectItem value="lot-b">Lot B</SelectItem>
            <SelectItem value="mh-section">MH Section</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventory ({vehicles.length})</CardTitle>
              <CardDescription>
                Manage your RV and motorhome inventory
              </CardDescription>
            </div>
            <Button onClick={handleAddVehicle}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead>Make/Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>VIN</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vehicle.make}</div>
                      <div className="text-sm text-muted-foreground">{vehicle.model}</div>
                    </div>
                  </TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell className="font-mono text-sm">{vehicle.vin}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {vehicle.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{vehicle.location}</TableCell>
                  <TableCell className="font-medium">
                    ${vehicle.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderLandAssetsTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Land Assets</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{landAssets.length}</div>
            <p className="text-xs text-muted-foreground">
              Properties managed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {landAssets.filter(asset => asset.status === 'Available').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for sale/lease
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bundled</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {landAssets.filter(asset => asset.status === 'Bundled').length}
            </div>
            <p className="text-xs text-muted-foreground">
              With inventory
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${landAssets.reduce((total, asset) => total + (asset.pricing.salePrice || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Land Assets Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Land Assets ({landAssets.length})</CardTitle>
              <CardDescription>
                Manage your land and property inventory
              </CardDescription>
            </div>
            <Button onClick={handleAddLandAsset}>
              <Plus className="h-4 w-4 mr-2" />
              Add Land Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {landAssets.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>Parcel Number</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Lot Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ownership</TableHead>
                    <TableHead>Sale Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {landAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.label}</TableCell>
                      <TableCell>{asset.parcelNumber}</TableCell>
                      <TableCell className="max-w-xs truncate">{asset.address}</TableCell>
                      <TableCell>{asset.lotSizeSqFt?.toLocaleString()} sq ft</TableCell>
                      <TableCell>
                        <Badge className={mockLandAssets.statusColors[asset.status]}>
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={mockLandAssets.ownershipColors[asset.ownershipStatus]}>
                          {asset.ownershipStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {asset.pricing.salePrice ? `$${asset.pricing.salePrice.toLocaleString()}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditLandAsset(asset)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteLandAsset(asset.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No land assets found</p>
                <p className="text-sm">Add your first land asset to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Land Asset Modal */}
      {showLandAssetModal && (
        <LandAssetModal
          isOpen={true}
          asset={editingLandAsset}
          onSave={handleSaveLandAsset}
          onClose={() => {
            setShowLandAssetModal(false)
            setEditingLandAsset(null)
          }}
        />
      )}

      {/* Vehicle/Home Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-semibold">
                    {vehicleModalType === 'home' ? 'Add New Home' : 'Add New Vehicle'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {vehicleModalType === 'home' 
                      ? 'Add a new manufactured home to inventory' 
                      : 'Add a new vehicle to inventory'
                    }
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelVehicle}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <VehicleForm
                  mode={vehicleModalType}
                  onSave={handleSaveVehicle}
                  onCancel={handleCancelVehicle}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Inventory Management</h1>
            <p className="ri-page-description">
              Manage your RV and motorhome inventory
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reports
            </Button>
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button onClick={handleAddHome}>
              <Plus className="h-4 w-4 mr-2" />
              Add Home
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {isLandManagementEnabled ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="vehicles" className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Vehicles</span>
            </TabsTrigger>
            <TabsTrigger value="land-assets" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Land Assets</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            {renderVehiclesTab()}
          </TabsContent>

          <TabsContent value="land-assets">
            {renderLandAssetsTab()}
          </TabsContent>
        </Tabs>
      ) : (
        renderVehiclesTab()
      )}
    </div>
  )
}

export default function InventoryManagement() {
  return (
    <Routes>
      <Route path="/" element={<InventoryManagementPage />} />
      <Route path="/*" element={<InventoryManagementPage />} />
    </Routes>
  )
}