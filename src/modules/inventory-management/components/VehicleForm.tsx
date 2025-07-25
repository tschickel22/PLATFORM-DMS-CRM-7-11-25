import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import { CreateInventoryItemData, InventoryItem } from '../hooks/useInventoryManagement'

interface VehicleFormProps {
  item?: InventoryItem
  onSave: (data: CreateInventoryItemData) => void
  onCancel: () => void
}

export function VehicleForm({ item, onSave, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState<CreateInventoryItemData>({
    name: item?.name || '',
    type: item?.type || '',
    status: item?.status || 'Available',
    serial_number: item?.serial_number || '',
    location: item?.location || '',
    photos: item?.photos || [],
    purchase_date: item?.purchase_date ? item.purchase_date.split('T')[0] : '',
    warranty_expiration: item?.warranty_expiration ? item.warranty_expiration.split('T')[0] : ''
  })
  
  const [newPhotoUrl, setNewPhotoUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const typeOptions = [
    'Travel Trailer',
    'Fifth Wheel',
    'Motorhome',
    'Manufactured Home',
    'Park Model',
    'Equipment',
    'Other'
  ]

  const statusOptions = [
    'Available',
    'Reserved',
    'Sold',
    'Service',
    'On Hold'
  ]

  const locationOptions = [
    'Main Lot A-1',
    'Main Lot A-2',
    'Main Lot B-1',
    'Main Lot B-2',
    'Display Area',
    'Service Bay 1',
    'Service Bay 2',
    'Parts Warehouse',
    'Offsite Storage'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      return
    }

    setIsSubmitting(true)
    
    // Convert date strings to ISO format if provided
    const submitData = {
      ...formData,
      purchase_date: formData.purchase_date ? new Date(formData.purchase_date).toISOString() : undefined,
      warranty_expiration: formData.warranty_expiration ? new Date(formData.warranty_expiration).toISOString() : undefined
    }
    
    await onSave(submitData)
    setIsSubmitting(false)
  }

  const addPhotoUrl = () => {
    if (newPhotoUrl.trim() && !formData.photos?.includes(newPhotoUrl.trim())) {
      setFormData({
        ...formData,
        photos: [...(formData.photos || []), newPhotoUrl.trim()]
      })
      setNewPhotoUrl('')
    }
  }

  const removePhotoUrl = (url: string) => {
    setFormData({
      ...formData,
      photos: formData.photos?.filter(photo => photo !== url) || []
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {item ? 'Edit Item' : 'Add New Item'}
          </h1>
          <p className="text-muted-foreground">
            {item ? 'Update inventory item details' : 'Add a new item to your inventory'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
          <CardDescription>
            Enter the details for this inventory item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., 2023 Forest River Cherokee 274RK"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="serial_number">Serial Number</Label>
                <Input
                  id="serial_number"
                  value={formData.serial_number || ''}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                  placeholder="e.g., RV2023001"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type || ''}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(type => (
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
                  value={formData.status || 'Available'}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Select
                  value={formData.location || ''}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="purchase_date">Purchase Date</Label>
                <Input
                  id="purchase_date"
                  type="date"
                  value={formData.purchase_date || ''}
                  onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="warranty_expiration">Warranty Expiration</Label>
                <Input
                  id="warranty_expiration"
                  type="date"
                  value={formData.warranty_expiration || ''}
                  onChange={(e) => setFormData({ ...formData, warranty_expiration: e.target.value })}
                />
              </div>
            </div>

            {/* Photos */}
            <div>
              <Label>Photos</Label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Enter photo URL (e.g., https://example.com/photo.jpg)"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addPhotoUrl}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.photos && formData.photos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Added Photos:</p>
                    {formData.photos.map((url, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm truncate flex-1 mr-2">{url}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePhotoUrl(url)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {item ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {item ? 'Update Item' : 'Add Item'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}