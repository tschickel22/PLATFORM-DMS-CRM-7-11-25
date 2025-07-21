import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  MapPin, 
  Home, 
  Link, 
  Package, 
  DollarSign, 
  Calendar, 
  Settings,
  Unlink,
  Eye
} from 'lucide-react'
import { Vehicle } from '@/types'
import { useTenant } from '@/contexts/TenantContext'
import { useLandInventory } from '../hooks/useLandInventory'
import { mockLandAssets } from '@/mocks/mockLandAssets'

interface VehicleDetailProps {
  vehicle: Vehicle
  onEdit: () => void
  onClose: () => void
}

  const { tenant } = useTenant()
export function VehicleDetail({ vehicle, onEdit, onClose }: VehicleDetailProps) {
  const {
    bundleToInventory,
    unbundleLandAsset,
    getLandAssetByInventoryId,
    getAvailableLandAssets
  } = useLandInventory()
  
  const [selectedLandId, setSelectedLandId] = useState('')
  const [showLandLinking, setShowLandLinking] = useState(false)
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


  // Check if this vehicle type supports land bundling
  const supportsLandBundling = [
    'Single Wide',
    'Double Wide', 
    'Triple Wide',
    'Park Model',
    'Modular Home'
  ].includes(vehicle.type)

  // Get linked land asset if any
  const linkedLandAsset = getLandAssetByInventoryId(vehicle.id)
  
  // Get available land assets for bundling
  const availableLandAssets = getAvailableLandAssets()

  const handleLinkToLand = () => {
    if (selectedLandId && vehicle.id) {
      bundleToInventory(vehicle.id, selectedLandId)
      setShowLandLinking(false)
      setSelectedLandId('')
    }
  }

  const handleUnlinkFromLand = () => {
    if (linkedLandAsset && window.confirm('Are you sure you want to unlink this land asset?')) {
      unbundleLandAsset(linkedLandAsset.id)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h2>
          <p className="text-muted-foreground">
            Stock #{vehicle.vin} • {vehicle.type}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onEdit}>
            <Settings className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">VIN</label>
              <p className="text-sm">{vehicle.vin}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div>
                <Badge className={
                  vehicle.status === 'Available' ? 'bg-green-100 text-green-800' :
                  vehicle.status === 'Reserved' ? 'bg-yellow-100 text-yellow-800' :
                  vehicle.status === 'Sold' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {vehicle.status}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Price</label>
              <p className="text-sm font-semibold">{formatCurrency(vehicle.price)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <p className="text-sm">{vehicle.location}</p>
            </div>
          </div>

          {vehicle.features && vehicle.features.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Features</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {vehicle.features.map((feature, index) => (
                  <Badge key={index} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Land Bundling Section - Only show for supported vehicle types */}
      {supportsLandBundling && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Land Asset Bundling
            </CardTitle>
            <CardDescription>
              Bundle this {vehicle.type.toLowerCase()} with a land asset
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {linkedLandAsset ? (
              // Show linked land asset
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900">Bundled with Land</h4>
                      <p className="text-sm text-green-700">{linkedLandAsset.label}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <Link className="h-3 w-3 mr-1" />
                    Bundled
                  </Badge>
                </div>

                {/* Land Asset Details */}
                <div className="grid gap-4 md:grid-cols-2 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-sm">{linkedLandAsset.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Lot Size</label>
                    <p className="text-sm">
                      {linkedLandAsset.lotSizeSqFt?.toLocaleString()} sq ft
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Zoning</label>
                <div className="space-y-4 overflow-hidden">
                  </div>
                  <div>
                      <div className="flex-1 min-w-0">
                    <p className="text-sm">{linkedLandAsset.utilityStatus}</p>
                  </div>
                  {linkedLandAsset.pricing?.salePrice && (
                    <div>
                        <h4 className="font-semibold text-base sm:text-lg mb-2 truncate">{linkedLand.label}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">{linkedLand.address}</p>
                        {formatCurrency(linkedLandAsset.pricing.salePrice)}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Package</label>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(vehicle.price + (linkedLandAsset.pricing?.salePrice || 0))}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Land Details
                      <div className="ml-2 sm:ml-4 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleUnlinkLand}
                          className="text-xs sm:text-sm"
                        >
                          Unlink
                        </Button>
                      </div>
                  </Button>
                </div>
              </div>
            ) : (
              // Show land linking options
              <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="text-center py-6 border-2 border-dashed rounded-lg">
                    <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="font-semibold mb-2">No Land Asset Linked</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Bundle this {vehicle.type.toLowerCase()} with a land asset to create a complete package
                    </p>
                    <Button onClick={() => setShowLandLinking(true)}>
                      <Link className="h-4 w-4 mr-2" />
                      Link to Land
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Select Land Asset</label>
                      <Select value={selectedLandId} onValueChange={setSelectedLandId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a land asset to bundle" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableLandAssets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id}>
                              <div className="flex flex-col">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                                <span className="text-xs text-muted-foreground">
                                  {asset.address} • {asset.lotSizeSqFt?.toLocaleString()} sq ft
                                </span>
                              </div>
                      className="w-full sm:w-auto text-xs sm:text-sm"
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedLandId && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                      className="w-full sm:w-auto text-xs sm:text-sm"
                        {(() => {
                          const selectedAsset = availableLandAssets.find(a => a.id === selectedLandId)
                          if (!selectedAsset) return null
                          
                          return (
                            <div className="space-y-2">
                              <h4 className="font-medium text-blue-900">Bundle Preview</h4>
                              <div className="grid gap-2 md:grid-cols-2 text-sm">
                                <div>
                                  <span className="text-blue-700">Home: </span>
                                  {vehicle.year} {vehicle.make} {vehicle.model}
                                </div>
                                <div>
                                  <span className="text-blue-700">Land: </span>
                                  {selectedAsset.label}
                                </div>
                                <div>
                                  <span className="text-blue-700">Home Price: </span>
                                  {formatCurrency(vehicle.price)}
                                </div>
                                <div>
                                  <span className="text-blue-700">Land Price: </span>
                                  {formatCurrency(selectedAsset.pricing?.salePrice || 0)}
                                </div>
                              </div>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                              <div className="text-lg font-bold text-blue-900">
                                Total Package: {formatCurrency(vehicle.price + (selectedAsset.pricing?.salePrice || 0))}
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowLandLinking(false)
                          setSelectedLandId('')
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleLinkToLand}
                        disabled={!selectedLandId}
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Create Bundle
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

        {isManufacturedHome && isLandManagementVisible && (
      <Card>
        <CardHeader>
          <CardTitle>Customer & Marketing</CardTitle>
          <CardDescription>
            Integration points for CRM and marketplace features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button variant="outline" disabled className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Assign Customer (CRM)
            </Button>
            <Button variant="outline" disabled className="justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Post to Marketplace
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            These features will be available in future updates
          </p>
        </CardContent>
      </Card>
    </div>
  )
}