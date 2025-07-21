import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Package, Plus, Upload, Download, QrCode, TrendingUp, DollarSign, MapPin, Search, Filter, BarChart3 } from 'lucide-react'
import { Vehicle, VehicleStatus, VehicleType } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import { useToast } from '@/hooks/use-toast'
import { useTenant } from '@/contexts/TenantContext'
import { InventoryTable } from './components/InventoryTable'
import { VehicleForm } from './components/VehicleForm'
import { VehicleDetail } from './components/VehicleDetail'
import { CSVImport } from './components/CSVImport'
import { BarcodeScanner } from './components/BarcodeScanner'
import { LandInventoryDashboard } from './components/LandInventoryDashboard'
import { mockInventory } from '@/mocks/inventoryMock'

function InventoryList() {
  const { vehicles, createVehicle, updateVehicleStatus, deleteVehicle } = useInventoryManagement()
  const { toast } = useToast()
  const { tenant } = useTenant()
  const [activeTab, setActiveTab] = useState('vehicles')
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [showVehicleDetail, setShowVehicleDetail] = useState(false)
  const [showCSVImport, setShowCSVImport] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)

  // Check if land management feature is enabled
  const isLandManagementEnabled = tenant?.settings?.features?.landManagement
  
  // Debug logging
  console.log('InventoryManagement - tenant:', tenant)
  console.log('InventoryManagement - isLandManagementEnabled:', isLandManagementEnabled)
  console.log('InventoryManagement - tenant.settings.features:', tenant?.settings?.features)

  // Mock data for demonstration
  const mockVehicles = [
    {
      id: '1',
      make: 'Winnebago',
      model: 'View',
      year: 2023,
      vin: '1FDEE3FL6KDC12345',
      type: 'Class C',
      status: 'Available',
      location: 'Main Lot',
      price: 125000
    },
    {
      id: '2',
      make: 'Thor',
      model: 'Ace',
      year: 2022,
      vin: '1FDEE3FL6KDC67890',
      type: 'Class A',
      status: 'Available',
      location: 'Main Lot',
      price: 89000
    },
    {
      id: '3',
      make: 'Forest River',
      model: 'Sunseeker',
      year: 2023,
      vin: '1FDEE3FL6KDC11111',
      type: 'Class C',
      status: 'Available',
      location: 'Storage',
      price: 95000
    },
    {
      id: '4',
      make: 'Jayco',
      model: 'Redhawk',
      year: 2022,
      vin: '1FDEE3FL6KDC22222',
      type: 'Class C',
      status: 'Available',
      location: 'Main Lot',
      price: 110000
    },
    {
      id: '5',
      make: 'Coachmen',
      model: 'Mirada',
      year: 2023,
      vin: '1FDEE3FL6KDC33333',
      type: 'Class A',
      status: 'Available',
      location: 'Service Bay',
      price: 135000
    },
    {
      id: '6',
      make: 'Tiffin',
      model: 'Wayfarer',
      year: 2023,
      vin: '1FDEE3FL6KDC44444',
      type: 'Class C',
      status: 'Available',
      location: 'Main Lot',
      price: 65000
    }
  ]
  
  const handleCreateVehicle = () => {
    setSelectedVehicle(null)
    setShowVehicleForm(true)
  }
  
  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowVehicleForm(true)
  }
  
  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowVehicleDetail(true)
  }
  
  const handleDeleteVehicle = async (vehicleId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(vehicleId)
        toast({
          title: 'Vehicle Deleted',
          description: 'The vehicle has been removed from inventory',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete vehicle',
          variant: 'destructive'
        })
      }
    }
  }
  
  const handleStatusChange = async (vehicleId: string, status: VehicleStatus) => {
    try {
      await updateVehicleStatus(vehicleId, status)
      toast({
        title: 'Status Updated',
        description: `Vehicle status changed to ${status}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update vehicle status',
        variant: 'destructive'
      })
    }
  }
  
  const handleSaveVehicle = async (vehicleData: Partial<Vehicle>) => {
    try {
      if (selectedVehicle) {
        // Update existing vehicle
        await updateVehicleStatus(selectedVehicle.id, vehicleData.status || selectedVehicle.status)
        toast({
          title: 'Vehicle Updated',
          description: 'Vehicle information has been updated',
        })
      } else {
        // Create new vehicle
        await createVehicle(vehicleData)
        toast({
          title: 'Vehicle Added',
          description: 'New vehicle has been added to inventory',
        })
      }
      setShowVehicleForm(false)
      setSelectedVehicle(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${selectedVehicle ? 'update' : 'create'} vehicle`,
        variant: 'destructive'
      })
    }
  }
  
  const handleImportCSV = async (vehiclesToImport: Partial<Vehicle>[]) => {
    try {
      // In a real app, this would be a batch import
      for (const vehicle of vehiclesToImport) {
        await createVehicle(vehicle)
      }
      
      setShowCSVImport(false)
      toast({
        title: 'Import Successful',
        description: `Imported ${vehiclesToImport.length} vehicles`,
      })
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'There was an error importing the vehicles',
        variant: 'destructive'
      })
    }
  }
  
  const handleBarcodeScanned = (data: string) => {
    // Check if this VIN already exists
    const existingVehicle = vehicles.find(v => v.vin === data)
    
    if (existingVehicle) {
      setSelectedVehicle(existingVehicle)
      setShowVehicleDetail(true)
      toast({
        title: 'Vehicle Found',
        description: `Found existing vehicle with VIN: ${data}`,
      })
    } else {
      // Create a new vehicle with this VIN
      setSelectedVehicle(null)
      setShowVehicleForm(true)
      
      // Pre-fill the VIN field
      setTimeout(() => {
        const vinInput = document.getElementById('vin') as HTMLInputElement
        if (vinInput) {
          vinInput.value = data
          // Trigger a change event
          const event = new Event('input', { bubbles: true })
          vinInput.dispatchEvent(event)
        }
      }, 100)
      
      toast({
        title: 'New VIN Scanned',
        description: `Creating new vehicle with VIN: ${data}`,
      })
    }
    
    setShowBarcodeScanner(false)
  }

  return (
    <div className="space-y-8">
      {/* Vehicle Form Modal */}
      {showVehicleForm && (
        <VehicleForm
          vehicle={selectedVehicle || undefined}
          onSave={handleSaveVehicle}
          onCancel={() => {
            setShowVehicleForm(false)
            setSelectedVehicle(null)
          }}
        />
      )}
      
      {/* Vehicle Detail Modal */}
      {showVehicleDetail && selectedVehicle && (
        <VehicleDetail
          vehicle={selectedVehicle}
          onClose={() => setShowVehicleDetail(false)}
          onEdit={handleEditVehicle}
        />
      )}
      
      {/* CSV Import Modal */}
      {showCSVImport && (
        <CSVImport
          onImport={handleImportCSV}
          onCancel={() => setShowCSVImport(false)}
        />
      )}
      
      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowBarcodeScanner(false)}
        />
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowBarcodeScanner(true)}>
              <QrCode className="h-4 w-4 mr-2" />
              Scan Barcode
            </Button>
            <Button variant="outline" onClick={() => setShowCSVImport(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button onClick={handleCreateVehicle}>
              <Plus className="h-4 w-4 mr-2" />
              Add Home
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs for Vehicles and Land Assets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full ${isLandManagementEnabled ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          {isLandManagementEnabled && (
            <TabsTrigger value="land-assets">Land Assets</TabsTrigger>
          )}
        </TabsList>

        {/* Vehicles Tab Content */}
        <TabsContent value="vehicles" className="space-y-6">
          {/* Stats Grid */}
          <div className="ri-stats-grid">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
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
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground">
                  Ready for sale
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reserved</CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Pending sale
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$619,000.00</div>
                <p className="text-xs text-muted-foreground">
                  Inventory value
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search by make, model, VIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ri-search-input"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {mockInventory.statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {mockInventory.vehicleTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={locationFilter}
              onValueChange={setLocationFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {mockInventory.locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Inventory (6)</CardTitle>
                  <CardDescription>
                    Manage your RV and motorhome inventory
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Make/Model</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Year</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">VIN</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockVehicles.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap font-medium">{vehicle.make} {vehicle.model}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{vehicle.year}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{vehicle.vin}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{vehicle.type}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">{vehicle.location}</td>
                        <td className="px-4 py-2 whitespace-nowrap">${vehicle.price.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Land Assets Tab Content */}
        {isLandManagementEnabled && (
          <TabsContent value="land-assets" className="space-y-6">
            <LandInventoryDashboard />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

export default function InventoryManagement() {
  return (
    <Routes>
      <Route path="/" element={<InventoryList />} />
      <Route path="/*" element={<InventoryList />} />
    </Routes>
  )
}