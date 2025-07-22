import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter, Download, Upload, Package, Home, MapPin, X } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { mockInventory } from '@/mocks/inventoryMock'
import { mockLandAssets } from '@/mocks/mockLandAssets'

// Define RV and MH specific types and features
const RV_VEHICLE_TYPES = ['RV', 'Motorhome', 'Travel Trailer', 'Fifth Wheel', 'Toy Hauler']
const MANUFACTURED_HOME_TYPES = ['Single Wide', 'Double Wide', 'Triple Wide', 'Park Model', 'Modular Home']

const RV_FEATURES = ['AC', 'Solar Prep', 'Generator Ready', 'Slide Outs', 'Awning', 'Outdoor Kitchen', 'Satellite Prep']
const MH_FEATURES = ['Washer/Dryer', 'Porch', 'Skirting', 'Central Air', 'Fireplace', 'Appliances Included', 'Garden Tub']

function InventoryManagementPage() {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('vehicles')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [vehicleModalMode, setVehicleModalMode] = useState<'vehicle' | 'home'>('vehicle')
  const [editingVehicle, setEditingVehicle] = useState<any>(null)
  const [vehicles, setVehicles] = useState(mockInventory.exampleInventory)
  const [landAssets, setLandAssets] = useState(mockLandAssets.sampleLandAssets)
  const [newVehicle, setNewVehicle] = useState({
    stockNumber: '',
    vin: '',
    year: new Date().getFullYear(),
    make: '',
    model: '',
    type: '',
    condition: 'New',
    status: 'Available',
    location: 'Main Lot',
    price: 0,
    cost: 0,
    features: [] as string[]
  })

  // Get platform-specific labels
  const getVehicleLabel = () => {
    const platformType = tenant?.settings?.platformType || 'both'
    const labelOverrides = tenant?.settings?.labelOverrides || {}
    
    if (labelOverrides['general.vehicle']) {
      return labelOverrides['general.vehicle']
    }
    
    switch (platformType) {
      case 'rv':
        return 'RV'
      case 'mh':
        return 'Home'
      case 'both':
      default:
        return 'Home/RV'
    }
  }

  const getInventoryLabel = () => {
    const platformType = tenant?.settings?.platformType || 'both'
    const labelOverrides = tenant?.settings?.labelOverrides || {}
    
    if (labelOverrides['general.inventory']) {
      return labelOverrides['general.inventory']
    }
    
    return 'Inventory'
  }

  // Initialize default type based on modal mode
  useEffect(() => {
    if (showVehicleModal) {
      const defaultType = vehicleModalMode === 'vehicle' 
        ? RV_VEHICLE_TYPES[0] 
        : MANUFACTURED_HOME_TYPES[0]
      
      setNewVehicle(prev => ({
        ...prev,
        type: defaultType
      }))
    }
  }, [vehicleModalMode, showVehicleModal])

  const handleOpenVehicleModal = (mode: 'vehicle' | 'home') => {
    setVehicleModalMode(mode)
    setEditingVehicle(null)
    const defaultType = mode === 'vehicle' ? RV_VEHICLE_TYPES[0] : MANUFACTURED_HOME_TYPES[0]
    setNewVehicle({
      stockNumber: '',
      vin: '',
      year: new Date().getFullYear(),
      make: '',
      model: '',
      type: defaultType,
      condition: 'New',
      status: 'Available',
      location: 'Main Lot',
      price: 0,
      cost: 0,
      features: []
    })
    setShowVehicleModal(true)
  }

  const handleCloseVehicleModal = () => {
    setShowVehicleModal(false)
    setEditingVehicle(null)
    setNewVehicle({
      stockNumber: '',
      vin: '',
      year: new Date().getFullYear(),
      make: '',
      model: '',
      type: '',
      condition: 'New',
      status: 'Available',
      location: 'Main Lot',
      price: 0,
      cost: 0,
      features: []
    })
  }

  const handleSaveVehicle = () => {
    if (!newVehicle.stockNumber || !newVehicle.vin || !newVehicle.make || !newVehicle.model) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.stockNumber === editingVehicle.stockNumber ? newVehicle : v))
      toast({
        title: 'Vehicle Updated',
        description: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model} has been updated`
      })
    } else {
      setVehicles([...vehicles, newVehicle])
      toast({
        title: 'Vehicle Added',
        description: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model} has been added to inventory`
      })
    }
    
    handleCloseVehicleModal()
  }

  const handleEditVehicle = (vehicle: any) => {
    setEditingVehicle(vehicle)
    setNewVehicle(vehicle)
    setVehicleModalMode(RV_VEHICLE_TYPES.includes(vehicle.type) ? 'vehicle' : 'home')
    setShowVehicleModal(true)
  }

  const handleDeleteVehicle = (stockNumber: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(v => v.stockNumber !== stockNumber))
      toast({
        title: 'Vehicle Deleted',
        description: 'Vehicle has been removed from inventory'
      })
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setNewVehicle(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  // Filter vehicles based on search and filters
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.stockNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter
    const matchesLocation = locationFilter === 'all' || vehicle.location === locationFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesLocation
  })

  // Get unique values for filters
  const uniqueStatuses = [...new Set(vehicles.map(v => v.status))]
  const uniqueTypes = [...new Set(vehicles.map(v => v.type))]
  const uniqueLocations = [...new Set(vehicles.map(v => v.location))]

  // Get current features based on modal mode
  const getCurrentFeatures = () => {
    return vehicleModalMode === 'vehicle' ? RV_FEATURES : MH_FEATURES
  }

  // Get current types based on modal mode
  const getCurrentTypes = () => {
    return vehicleModalMode === 'vehicle' ? RV_VEHICLE_TYPES : MANUFACTURED_HOME_TYPES
  }

  // Get modal title based on mode
  const getModalTitle = () => {
    if (editingVehicle) {
      return vehicleModalMode === 'vehicle' ? 'Edit Vehicle' : 'Edit Home'
    }
    return vehicleModalMode === 'vehicle' ? 'Add New Vehicle' : 'Add New Home'
  }

  // Get placeholder text based on mode
  const getMakePlaceholder = () => {
    return vehicleModalMode === 'vehicle' ? 'e.g., Ford, Winnebago' : 'e.g., Clayton, Fleetwood'
  }

  const getModelPlaceholder = () => {
    return vehicleModalMode === 'vehicle' ? 'e.g., Cherokee, Montana' : 'e.g., The Breeze, Inspiration'
  }

  return (
    <div className="space-y-6">
      {/* Vehicle Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">
                      {getModalTitle()}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Enter {vehicleModalMode === 'vehicle' ? 'vehicle' : 'home'} details and specifications
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCloseVehicleModal}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-6 pt-0 space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Basic Information</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="vin">VIN *</Label>
                      <Input
                        id="vin"
                        value={newVehicle.vin}
                        onChange={(e) => setNewVehicle(prev => ({ ...prev, vin: e.target.value }))}
                        placeholder="Enter VIN"
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">Year *</Label>
                      <Input
                        id="year"
                        type="number"
                        value={newVehicle.year}
                        onChange={(e) => setNewVehicle(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                        placeholder="2025"
                      />
                    </div>
                    <div>
                      <Label htmlFor="make">Make *</Label>
                      <Input
                        id="make"
                        value={newVehicle.make}
                        onChange={(e) => setNewVehicle(prev => ({ ...prev, make: e.target.value }))}
                        placeholder={getMakePlaceholder()}
                      />
                    </div>
                    <div>
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        value={newVehicle.model}
                        onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value }))}
                        placeholder={getModelPlaceholder()}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type *</Label>
                      <Select
                        value={newVehicle.type}
                        onValueChange={(value) => setNewVehicle(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {getCurrentTypes().map(type => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newVehicle.status}
                        onValueChange={(value) => setNewVehicle(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {mockInventory.statuses.map(status => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Pricing</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="price">Sale Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newVehicle.price}
                        onChange={(e) => setNewVehicle(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cost">Cost</Label>
                      <Input
                        id="cost"
                        type="number"
                        value={newVehicle.cost}
                        onChange={(e) => setNewVehicle(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={newVehicle.location}
                    onValueChange={(value) => setNewVehicle(prev => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockInventory.locations.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Features</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {getCurrentFeatures().map(feature => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={newVehicle.features.includes(feature)}
                          onCheckedChange={() => handleFeatureToggle(feature)}
                        />
                        <Label htmlFor={feature} className="font-normal">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleCloseVehicleModal}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveVehicle}>
                    {editingVehicle ? 'Update' : 'Add'} {vehicleModalMode === 'vehicle' ? 'Vehicle' : 'Home'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">{getInventoryLabel()} Management</h1>
            <p className="ri-page-description">
              Manage your {getVehicleLabel().toLowerCase()} inventory and land assets
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total {getVehicleLabel()}s</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">
              {vehicles.filter(v => v.status === 'Available').length} available
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
              ${vehicles.reduce((sum, v) => sum + v.price, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Inventory value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Land Assets</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{landAssets.length}</div>
            <p className="text-xs text-muted-foreground">
              {landAssets.filter(l => l.status === 'Available').length} available
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
              ${vehicles.length > 0 ? Math.round(vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average unit price
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="vehicles">{getVehicleLabel()}s</TabsTrigger>
            <TabsTrigger value="land">Land Assets</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            {activeTab === 'vehicles' && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenVehicleModal('vehicle')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenVehicleModal('home')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Home
                </Button>
              </>
            )}
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{getVehicleLabel()} Inventory</CardTitle>
              <CardDescription>
                Manage your {getVehicleLabel().toLowerCase()} inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="ri-search-bar">
                  <Search className="ri-search-icon" />
                  <Input
                    placeholder={`Search ${getVehicleLabel().toLowerCase()}s...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ri-search-input"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {uniqueStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vehicle List */}
              <div className="space-y-4">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.stockNumber}
                    className="ri-table-row"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-semibold">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Stock: {vehicle.stockNumber} • VIN: {vehicle.vin}
                          </p>
                        </div>
                        <Badge className={`ri-badge-status ${
                          vehicle.status === 'Available' ? 'bg-green-100 text-green-800' :
                          vehicle.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          vehicle.status === 'Sold' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {vehicle.status}
                        </Badge>
                        <Badge variant="outline">{vehicle.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Location: {vehicle.location} • Features: {vehicle.features.join(', ') || 'None'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${vehicle.price.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Cost: ${vehicle.cost.toLocaleString()}</div>
                    </div>
                    <div className="ri-action-buttons">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditVehicle(vehicle)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteVehicle(vehicle.stockNumber)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                
                {filteredVehicles.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No {getVehicleLabel().toLowerCase()}s found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="land" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Land Assets</CardTitle>
              <CardDescription>
                Manage your land inventory and lot assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {landAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="ri-table-row"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-semibold">{asset.label}</h4>
                          <p className="text-sm text-muted-foreground">
                            Parcel: {asset.parcelNumber} • {asset.lotSizeSqFt.toLocaleString()} sq ft
                          </p>
                        </div>
                        <Badge className={mockLandAssets.statusColors[asset.status]}>
                          {asset.status}
                        </Badge>
                        <Badge className={mockLandAssets.ownershipColors[asset.ownershipStatus]} variant="outline">
                          {asset.ownershipStatus}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {asset.address}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {asset.pricing.salePrice ? `$${asset.pricing.salePrice.toLocaleString()}` : 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Lease: ${asset.pricing.leaseRate.toLocaleString()}/mo
                      </div>
                    </div>
                    <div className="ri-action-buttons">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                
                {landAssets.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No land assets found</p>
                    <p className="text-sm">Add your first land asset to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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