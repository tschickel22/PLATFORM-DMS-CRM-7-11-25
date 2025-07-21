import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, MapPin } from 'lucide-react'
import { LandAsset, LandAssetFormData } from '../models/LandAsset'
import { useLandInventory } from '../hooks/useLandInventory'
import { mockLandAssets } from '@/mocks/mockLandAssets'
import { useToast } from '@/hooks/use-toast'

interface LandAssetModalProps {
  asset?: LandAsset | null
  onClose: () => void
}

export function LandAssetModal({ asset, onClose }: LandAssetModalProps) {
  const { saveLandAsset } = useLandInventory()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<LandAssetFormData>(mockLandAssets.formDefaults)

  // Initialize form with asset data if editing
  useEffect(() => {
    if (asset) {
      setFormData({
        label: asset.label,
        parcelNumber: asset.parcelNumber,
        address: asset.address,
        lotSizeSqFt: asset.lotSizeSqFt,
        zoningType: asset.zoningType,
        utilityStatus: asset.utilityStatus,
        ownershipStatus: asset.ownershipStatus,
        pricing: asset.pricing,
        status: asset.status
      })
    }
  }, [asset])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.label || !formData.address) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      saveLandAsset(formData, asset?.id)
      
      toast({
        title: 'Success',
        description: `Land asset ${asset ? 'updated' : 'created'} successfully`,
      })
      
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${asset ? 'update' : 'create'} land asset`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof LandAssetFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePricingChange = (field: keyof NonNullable<LandAssetFormData['pricing']>, value: any) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value
      }
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <CardHeader className="shrink-0 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  {asset ? 'Edit Land Asset' : 'Add Land Asset'}
                </CardTitle>
                <CardDescription>
                  {asset ? 'Update land asset details' : 'Create a new land asset'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="label">Label *</Label>
                    <Input
                      id="label"
                      value={formData.label}
                      onChange={(e) => handleInputChange('label', e.target.value)}
                      placeholder="e.g., Sunset Ridge Lot 15"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="parcelNumber">Parcel Number</Label>
                    <Input
                      id="parcelNumber"
                      value={formData.parcelNumber || ''}
                      onChange={(e) => handleInputChange('parcelNumber', e.target.value)}
                      placeholder="e.g., SR-015-2024"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter full address including lot number"
                    rows={2}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="lotSizeSqFt">Lot Size (Sq Ft)</Label>
                    <Input
                      id="lotSizeSqFt"
                      type="number"
                      value={formData.lotSizeSqFt || ''}
                      onChange={(e) => handleInputChange('lotSizeSqFt', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="e.g., 8500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="zoningType">Zoning Type</Label>
                    <Select
                      value={formData.zoningType || ''}
                      onValueChange={(value) => handleInputChange('zoningType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select zoning type" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockLandAssets.zoningTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="utilityStatus">Utility Status</Label>
                    <Select
                      value={formData.utilityStatus || ''}
                      onValueChange={(value) => handleInputChange('utilityStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select utility status" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockLandAssets.utilityStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="ownershipStatus">Ownership Status *</Label>
                    <Select
                      value={formData.ownershipStatus}
                      onValueChange={(value) => handleInputChange('ownershipStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockLandAssets.ownershipStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing Information</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="salePrice">Sale Price</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={formData.pricing?.salePrice || ''}
                      onChange={(e) => handlePricingChange('salePrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="leaseRate">Monthly Lease Rate</Label>
                    <Input
                      id="leaseRate"
                      type="number"
                      value={formData.pricing?.leaseRate || ''}
                      onChange={(e) => handlePricingChange('leaseRate', e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rentToOwn"
                    checked={formData.pricing?.rentToOwn || false}
                    onCheckedChange={(checked) => handlePricingChange('rentToOwn', checked)}
                  />
                  <Label htmlFor="rentToOwn">Rent-to-Own Available</Label>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Status</h3>
                
                <div>
                  <Label htmlFor="status">Current Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLandAssets.landStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </div>

          {/* Sticky Footer */}
          <div className="shrink-0 border-t bg-white p-4">
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {asset ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {asset ? 'Update' : 'Create'} Asset
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}