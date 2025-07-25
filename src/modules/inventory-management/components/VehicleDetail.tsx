import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, Calendar, MapPin, Hash, Package } from 'lucide-react'
import { InventoryItem, UpdateInventoryItemData } from '../hooks/useInventoryManagement'
import { VehicleForm } from './VehicleForm'

interface VehicleDetailProps {
  item: InventoryItem
  onUpdate: (id: string, updates: UpdateInventoryItemData) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export function VehicleDetail({ item, onUpdate, onDelete, onClose }: VehicleDetailProps) {
  const [isEditing, setIsEditing] = useState(false)

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800'
      case 'Reserved':
        return 'bg-yellow-100 text-yellow-800'
      case 'Sold':
        return 'bg-blue-100 text-blue-800'
      case 'Service':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleUpdate = (data: UpdateInventoryItemData) => {
    onUpdate(item.id, data)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <VehicleForm
        item={item}
        onSave={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{item.name}</h1>
            <p className="text-muted-foreground">
              Inventory Item Details
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onDelete(item.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Item Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>
                Added {new Date(item.created_at).toLocaleDateString()}
                {item.updated_at !== item.created_at && (
                  <span> • Updated {new Date(item.updated_at).toLocaleDateString()}</span>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {item.type && (
                <Badge variant="outline">
                  {item.type}
                </Badge>
              )}
              {item.status && (
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <p className="text-sm text-muted-foreground">
                      {item.type || 'Not specified'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Serial Number</p>
                    <p className="text-sm text-muted-foreground">
                      {item.serial_number || 'Not specified'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {item.location || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Important Dates</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Purchase Date</p>
                    <p className="text-sm text-muted-foreground">
                      {item.purchase_date 
                        ? new Date(item.purchase_date).toLocaleDateString()
                        : 'Not specified'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Warranty Expiration</p>
                    <p className="text-sm text-muted-foreground">
                      {item.warranty_expiration 
                        ? new Date(item.warranty_expiration).toLocaleDateString()
                        : 'Not specified'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Added to Inventory</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photos */}
      {item.photos && item.photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <CardDescription>
              {item.photos.length} photo(s) available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {item.photos.map((photo, index) => (
                <div key={index} className="space-y-2">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={photo}
                      alt={`${item.name} - Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg'
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    Photo {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Photos State */}
      {(!item.photos || item.photos.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <CardDescription>
              No photos available for this item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No photos uploaded</p>
              <p className="text-sm">Edit this item to add photos</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}