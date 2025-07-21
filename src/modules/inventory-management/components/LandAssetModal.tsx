import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save } from 'lucide-react'
import { LandAsset } from '../models/LandAsset'
import { mockLandAssets } from '@/mocks/mockLandAssets'
import { useToast } from '@/hooks/use-toast'

interface LandAssetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (asset: Omit<LandAsset, 'id' | 'createdAt' | 'updatedAt'>) => void
  asset?: LandAsset | null
}

export function LandAssetModal({ isOpen, onClose, onSave, asset }: LandAssetModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(mockLandAssets.formDefaults)

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
    } else {
      setFormData(mockLandAssets.formDefaults)
    }
  }, [asset])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.label || !formData.parcelNumber || !formData.address) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      onClose()
      toast({
        title: 'Success',
        description: `Land asset ${asset ? 'updated' : 'created'} successfully`,
      })
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          <CardHeader className="shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{asset ? 'Edit Land Asset' : 'Add Land Asset'}</CardTitle>
                <CardDescription>
                  {asset ? 'Update land asset details' : 'Create a new land asset'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="label">Property Label *</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="e.g., Sunset Ridge Lot 15"
                  />
                </div>
                <div>
                  <Label htmlFor="parcelNumber">Parcel Number *</Label>
                  <Input
                    id="parcelNumber"
                    value={formData.parcelNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, parcelNumber: e.target.value }))}
                    placeholder="e.g., SR-015-2024"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Full property address"
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="lotSizeSqFt">Lot Size (sq ft)</Label>
                  <Input
                    id="lotSizeSqFt"
                    type="number"
                    value={formData.lotSizeSqFt || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      lotSizeSqFt: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    placeholder="8500"
                  />
                </div>
                <div>
                  <Label htmlFor="zoningType">Zoning Type</Label>
                  <Select
                    value={formData.zoningType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, zoningType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select zoning type" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLandAssets.zoningTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="utilityStatus">Utility Status</Label>
                  <Select
                    value={formData.utilityStatus}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, utilityStatus: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select utility status" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLandAssets.utilityStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ownershipStatus">Ownership Status</Label>
                  <Select
                    value={formData.ownershipStatus}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      ownershipStatus: value as 'Dealer-Owned' | 'Third-Party' | 'Leased'
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership status" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLandAssets.ownershipStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Pricing Information</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="salePrice">Sale Price</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={formData.pricing.salePrice || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        pricing: {
                          ...prev.pricing,
                          salePrice: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      }))}
                      placeholder="45000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leaseRate">Monthly Lease Rate</Label>
                    <Input
                      id="leaseRate"
                      type="number"
                      value={formData.pricing.leaseRate || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        pricing: {
                          ...prev.pricing,
                          leaseRate: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      }))}
                      placeholder="850"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rentToOwn"
                    checked={formData.pricing.rentToOwn}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      pricing: {
                        ...prev.pricing,
                        rentToOwn: !!checked
                      }
                    }))}
                  />
                  <Label htmlFor="rentToOwn">Rent-to-Own Available</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    status: value as 'Available' | 'Bundled' | 'Sold' | 'Archived'
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLandAssets.landStatuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
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
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}