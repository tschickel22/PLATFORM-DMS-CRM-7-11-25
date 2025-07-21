import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save } from 'lucide-react'
import { Vehicle, VehicleType, VehicleStatus } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { mockInventory } from '@/mocks/inventoryMock'

interface VehicleFormProps {
  vehicle?: Vehicle
  onSave: (vehicle: Partial<Vehicle>) => void
  onCancel: () => void
  mode?: string
}

export function VehicleForm({ vehicle, onSave, onCancel, mode }: VehicleFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    vin: vehicle?.vin || '',
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    type: vehicle?.type || VehicleType.RV,
    status: vehicle?.status || VehicleStatus.AVAILABLE,
    price: vehicle?.price || 0,
    cost: vehicle?.cost || 0,
    location: vehicle?.location || '',
    features: vehicle?.features || [],
    images: vehicle?.images || [],
    customFields: vehicle?.customFields || {}
  })

  // Available options from mock data
  const vehicleTypes = Object.values(VehicleType)
  const vehicleStatuses = Object.values(VehicleStatus)
  const locations = mockInventory.locations
  const availableFeatures = mockInventory.features

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.vin || !formData.make || !formData.model) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave({
        ...formData,
        id: vehicle?.id || `vh-${Date.now()}`,
        createdAt: vehicle?.createdAt || new Date(),
        updatedAt: new Date()
      })
      
      toast({
        title: 'Success',
        description: `${mode === 'home' ? 'Home' : 'Vehicle'} ${vehicle ? 'updated' : 'added'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${vehicle ? 'update' : 'add'} ${mode === 'home' ? 'home' : 'vehicle'}`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  // Filter vehicle types based on mode
  const getFilteredVehicleTypes = () => {
    if (mode === 'home') {
      // Only show manufactured home types
      return vehicleTypes.filter(type => 
        [VehicleType.SINGLE_WIDE, VehicleType.DOUBLE_WIDE, VehicleType.TRIPLE_WIDE, 
         VehicleType.PARK_MODEL, VehicleType.MODULAR_HOME].includes(type)
      )
    }
    // For vehicles, show RV types
    return vehicleTypes.filter(type => 
      [VehicleType.RV, VehicleType.MOTORHOME, VehicleType.TRAVEL_TRAILER, 
       VehicleType.FIFTH_WHEEL, VehicleType.TOY_HAULER].includes(type)
    )
  }

  // Set default type based on mode
  React.useEffect(() => {
    if (mode === 'home' && !vehicle) {
      setFormData(prev => ({ ...prev, type: VehicleType.SINGLE_WIDE }))
    } else if (mode === 'vehicle' && !vehicle) {
      setFormData(prev => ({ ...prev, type: VehicleType.RV }))
    }
  }, [mode, vehicle])

  const filteredVehicleTypes = getFilteredVehicleTypes()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {vehicle ? `Edit ${mode === 'home' ? 'Home' : 'Vehicle'}` : `Add New ${mode === 'home' ? 'Home' : 'Vehicle'}`}
            </CardTitle>
            <CardDescription>
              {mode === 'home' 
                ? 'Enter manufactured home details and specifications'
                : 'Enter vehicle details and specifications'
              }
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="vin">
                  {mode === 'home' ? 'Serial Number' : 'VIN'} *
                </Label>
                <Input
                  id="vin"
                  value={formData.vin}
                  onChange={(e) => setFormData(prev => ({ ...prev, vin: e.target.value }))}
                  placeholder={mode === 'home' ? 'Enter serial number' : 'Enter VIN'}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                  placeholder={mode === 'home' ? 'e.g., Clayton, Fleetwood' : 'e.g., Ford, Winnebago'}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  placeholder={mode === 'home' ? 'e.g., Inspiration, Vision' : 'e.g., Cherokee, Montana'}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: VehicleType) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredVehicleTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: VehicleStatus) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleStatuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="price">Sale Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Select
              value={formData.location}
              onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {availableFeatures.map(feature => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={formData.features.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={feature} className="font-normal">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {vehicle ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {vehicle ? 'Update' : 'Add'} {mode === 'home' ? 'Home' : 'Vehicle'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}