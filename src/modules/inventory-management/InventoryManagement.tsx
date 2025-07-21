import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  MapPin,
  Home,
  Car
} from 'lucide-react'
import { Vehicle, VehicleType } from '@/types'
import { mockInventory } from '@/mocks/inventoryMock'
import { mockLandAssets } from '@/mocks/mockLandAssets'
import { VehicleForm } from './components/VehicleForm'
import { LandAssetModal } from './components/LandAssetModal'
import { LandAsset } from './models/LandAsset'

// Define vehicle type categories
const RV_VEHICLE_TYPES = [VehicleType.RV, VehicleType.MOTORHOME, VehicleType.TRAVEL_TRAILER, VehicleType.FIFTH_WHEEL, VehicleType.TOY_HAULER]
const MANUFACTURED_HOME_TYPES = [VehicleType.SINGLE_WIDE, VehicleType.DOUBLE_WIDE, VehicleType.TRIPLE_WIDE, VehicleType.PARK_MODEL, VehicleType.MODULAR_HOME]

// Helper function to get filtered inventory based on tab
const getFilteredInventory = (mode: 'vehicles' | 'homes') => {
  const typeFilter = mode === 'vehicles' ? RV_VEHICLE_TYPES : MANUFACTURED_HOME_TYPES
  
  // Create extended mock inventory with proper typing and additional properties
  const extendedInventory = mockInventory.exampleInventory.map((item, index) => ({
    id: `inv-${index + 1}`,
    vin: item.vin || `VIN${String(index + 1).padStart(6, '0')}`,
    make: item.make,
    model: item.model,
    year: item.year,
    type: item.type as VehicleType,
    status: item.status as any,
    location: item.location,
    price: 45000 + (index * 15000), // Mock pricing
    cost: 35000 + (index * 12000), // Mock cost
    features: ['AC', 'Washer/Dryer', 'Solar Prep'],
    images: [],
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date()
  }))

  return extendedInventory.filter(item => typeFilter.includes(item.type))
}

function InventoryManagementPage() {
  const [activeTab, setActiveTab] = useState('vehicles')
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [vehicleModalMode, setVehicleModalMode] = useState<'vehicle' | 'home'>('vehicle')
  const [showLandModal, setShowLandModal] = useState(false)
  const [selectedLandAsset, setSelectedLandAsset] = useState<LandAsset | null>(null)

  // Search and filter states for vehicles tab
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState('')
  const [vehicleMakeFilter, setVehicleMakeFilter] = useState('all')
  const [vehicleModelFilter, setVehicleModelFilter] = useState('all')
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState('all')
  const [vehicleLocationFilter, setVehicleLocationFilter] = useState('all')

  // Search and filter states for homes tab
  const [homeSearchQuery, setHomeSearchQuery] = useState('')
  const [homeMakeFilter, setHomeMakeFilter] = useState('all')
  const [homeModelFilter, setHomeModelFilter] = useState('all')
  const [homeStatusFilter, setHomeStatusFilter] = useState('all')
  const [homeLocationFilter, setHomeLocationFilter] = useState('all')

  // Search and filter states for land assets tab
  const [landSearchQuery, setLandSearchQuery] = useState('')
  const [landStatusFilter, setLandStatusFilter] = useState('all')
  const [landOwnershipFilter, setLandOwnershipFilter] = useState('all')

  const handleOpenVehicleModal = (mode: 'vehicle' | 'home') => {
    setVehicleModalMode(mode)
    setShowVehicleModal(true)
  }

  const handleOpenLandModal = (asset?: LandAsset) => {
    setSelectedLandAsset(asset || null)
    setShowLandModal(true)
  }

  const handleCloseLandModal = () => {
    setSelectedLandAsset(null)
    setShowLandModal(false)
  }

  const renderInventoryTab = (mode: 'vehicles' | 'homes') => {
    const filteredInventory = getFilteredInventory(mode)
    const labelPrefix = mode === 'vehicles' ? 'Vehicle' : 'Home'
    const sectionTitle = mode === 'vehicles' ? 'Vehicles' : 'Homes'
    
    // Get appropriate state variables based on mode
    const searchQuery = mode === 'vehicles' ? vehicleSearchQuery : homeSearchQuery
    const setSearchQuery = mode === 'vehicles' ? setVehicleSearchQuery : setHomeSearchQuery
    const makeFilter = mode === 'vehicles' ? vehicleMakeFilter : homeMakeFilter
    const setMakeFilter = mode === 'vehicles' ? setVehicleMakeFilter : setHomeMakeFilter
    const modelFilter = mode === 'vehicles' ? vehicleModelFilter : homeModelFilter
    const setModelFilter = mode === 'vehicles' ? setVehicleModelFilter : setHomeModelFilter
    const statusFilter = mode === 'vehicles' ? vehicleStatusFilter : homeStatusFilter
    const setStatusFilter = mode === 'vehicles' ? setVehicleStatusFilter : setHomeStatusFilter
    const locationFilter = mode === 'vehicles' ? vehicleLocationFilter : homeLocationFilter
    const setLocationFilter = mode === 'vehicles' ? setVehicleLocationFilter : setHomeLocationFilter

    // Calculate stats
    const totalUnits = filteredInventory.length
    const totalValue = filteredInventory.reduce((sum, item) => sum + item.price, 0)
    const availableUnits = filteredInventory.filter(item => item.status === 'Available').length
    const soldUnits = filteredInventory.filter(item => item.status === 'Sold').length

    // Apply filters
    let displayedInventory = filteredInventory

    if (searchQuery) {
      displayedInventory = displayedInventory.filter(item =>
        item.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vin.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (makeFilter !== 'all') {
      displayedInventory = displayedInventory.filter(item => item.make === makeFilter)
    }

    if (modelFilter !== 'all') {
      displayedInventory = displayedInventory.filter(item => item.model === modelFilter)
    }

    if (statusFilter !== 'all') {
      displayedInventory = displayedInventory.filter(item => item.status === statusFilter)
    }

    if (locationFilter !== 'all') {
      displayedInventory = displayedInventory.filter(item => item.location === locationFilter)
    }

    // Get unique values for filters
    const uniqueMakes = [...new Set(filteredInventory.map(item => item.make))]
    const uniqueModels = [...new Set(filteredInventory.map(item => item.model))]
    const uniqueStatuses = [...new Set(filteredInventory.map(item => item.status))]
    const uniqueLocations = [...new Set(filteredInventory.map(item => item.location))]

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Available':
          return 'bg-green-100 text-green-800'
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'Sold':
          return 'bg-blue-100 text-blue-800'
        case 'Service':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="ri-stats-grid">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total {sectionTitle}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUnits}</div>
              <p className="text-xs text-muted-foreground">
                {availableUnits} available, {soldUnits} sold
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Inventory value
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available {sectionTitle}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableUnits}</div>
              <p className="text-xs text-muted-foreground">
                Ready for sale
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalUnits > 0 ? Math.round(totalValue / totalUnits).toLocaleString() : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Average unit price
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{sectionTitle} Inventory</CardTitle>
                <CardDescription>
                  Manage your {sectionTitle.toLowerCase()} inventory and track availability
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenVehicleModal(mode)}>
                <Plus className="h-4 w-4 mr-2" />
                Add {labelPrefix}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="ri-search-bar">
                <Search className="ri-search-icon" />
                <Input
                  placeholder={`Search ${sectionTitle.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ri-search-input"
                />
              </div>
              
              <Select value={makeFilter} onValueChange={setMakeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Makes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Makes</SelectItem>
                  {uniqueMakes.map(make => (
                    <SelectItem key={make} value={make}>{make}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={modelFilter} onValueChange={setModelFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Models" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  {uniqueModels.map(model => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Inventory Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Make/Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>VIN/Serial</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.make}</div>
                          <div className="text-sm text-muted-foreground">{item.model}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.year}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{item.vin}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>${item.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="ri-action-buttons">
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
              
              {displayedInventory.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No {sectionTitle.toLowerCase()} found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderLandAssetsTab = () => {
    const landAssets = mockLandAssets.sampleLandAssets
    
    // Apply filters
    let filteredAssets = landAssets

    if (landSearchQuery) {
      filteredAssets = filteredAssets.filter(asset =>
        asset.label.toLowerCase().includes(landSearchQuery.toLowerCase()) ||
        asset.address.toLowerCase().includes(landSearchQuery.toLowerCase()) ||
        asset.parcelNumber.toLowerCase().includes(landSearchQuery.toLowerCase())
      )
    }

    if (landStatusFilter !== 'all') {
      filteredAssets = filteredAssets.filter(asset => asset.status === landStatusFilter)
    }

    if (landOwnershipFilter !== 'all') {
      filteredAssets = filteredAssets.filter(asset => asset.ownershipStatus === landOwnershipFilter)
    }

    // Calculate stats
    const totalAssets = landAssets.length
    const availableAssets = landAssets.filter(asset => asset.status === 'Available').length
    const bundledAssets = landAssets.filter(asset => asset.status === 'Bundled').length
    const totalValue = landAssets.reduce((sum, asset) => sum + (asset.pricing.salePrice || 0), 0)

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="ri-stats-grid">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Land Assets</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssets}</div>
              <p className="text-xs text-muted-foreground">
                {availableAssets} available, {bundledAssets} bundled
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Land asset value
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Assets</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableAssets}</div>
              <p className="text-xs text-muted-foreground">
                Ready for sale/lease
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalAssets > 0 ? Math.round(totalValue / totalAssets).toLocaleString() : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Average asset price
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Land Assets</CardTitle>
                <CardDescription>
                  Manage land parcels and property assets
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenLandModal()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Land Asset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="ri-search-bar">
                <Search className="ri-search-icon" />
                <Input
                  placeholder="Search land assets..."
                  value={landSearchQuery}
                  onChange={(e) => setLandSearchQuery(e.target.value)}
                  className="ri-search-input"
                />
              </div>
              
              <Select value={landStatusFilter} onValueChange={setLandStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {mockLandAssets.landStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={landOwnershipFilter} onValueChange={setLandOwnershipFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Ownership" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ownership</SelectItem>
                  {mockLandAssets.ownershipStatuses.map(ownership => (
                    <SelectItem key={ownership} value={ownership}>{ownership}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Land Assets Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>Parcel Number</TableHead>
                    <TableHead>Size (sq ft)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ownership</TableHead>
                    <TableHead>Sale Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{asset.label}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {asset.address}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{asset.parcelNumber}</TableCell>
                      <TableCell>{asset.lotSizeSqFt.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={mockLandAssets.statusColors[asset.status]}>
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={mockLandAssets.ownershipColors[asset.ownershipStatus]} variant="outline">
                          {asset.ownershipStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {asset.pricing.salePrice ? `$${asset.pricing.salePrice.toLocaleString()}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="ri-action-buttons">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenLandModal(asset)}>
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
              
              {filteredAssets.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No land assets found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="ri-page-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="ri-page-title">Inventory Management</h1>
              <p className="ri-page-description">
                Manage your RV and manufactured home inventory
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Reports
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="vehicles" className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Vehicles</span>
            </TabsTrigger>
            <TabsTrigger value="homes" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Homes</span>
            </TabsTrigger>
            <TabsTrigger value="land" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Land Assets</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            {renderInventoryTab('vehicles')}
          </TabsContent>

          <TabsContent value="homes">
            {renderInventoryTab('homes')}
          </TabsContent>

          <TabsContent value="land">
            {renderLandAssetsTab()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Vehicle/Home Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <VehicleForm
              mode={vehicleModalMode}
              onClose={() => setShowVehicleModal(false)}
              onSave={(vehicleData) => {
                console.log('Saving vehicle:', vehicleData)
                setShowVehicleModal(false)
              }}
            />
          </Card>
        </div>
      )}

      {/* Land Asset Modal */}
      {showLandModal && (
        <LandAssetModal
          asset={selectedLandAsset}
          onClose={handleCloseLandModal}
          onSave={(assetData) => {
            console.log('Saving land asset:', assetData)
            handleCloseLandModal()
          }}
        />
      )}
    </>
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