import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Package, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react'
import { useInventoryManagement, InventoryItem } from './hooks/useInventoryManagement'
import { VehicleForm } from './components/VehicleForm'
import { VehicleDetail } from './components/VehicleDetail'
import { useToast } from '@/hooks/use-toast'

function InventoryDashboard() {
  const {
    items,
    loading,
    error,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    totalItems,
    availableItems,
    soldItems,
    serviceItems
  } = useInventoryManagement()
  
  const { toast } = useToast()
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Filter items based on search and filters
  const filteredItems = React.useMemo(() => {
    let filtered = items

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        (item.serial_number && item.serial_number.toLowerCase().includes(query)) ||
        (item.location && item.location.toLowerCase().includes(query))
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter)
    }

    return filtered
  }, [items, searchQuery, statusFilter, typeFilter])

  const handleAddItem = async (itemData: any) => {
    const newItem = await addInventoryItem(itemData)
    if (newItem) {
      setShowAddForm(false)
    }
  }

  const handleUpdateItem = async (id: string, updates: any) => {
    const success = await updateInventoryItem(id, updates)
    if (success) {
      setSelectedItem(null)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      const success = await deleteInventoryItem(id)
      if (success) {
        setSelectedItem(null)
      }
    }
  }

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

  const getUniqueTypes = () => {
    const types = items.map(item => item.type).filter(Boolean)
    return [...new Set(types)]
  }

  const getUniqueStatuses = () => {
    const statuses = items.map(item => item.status).filter(Boolean)
    return [...new Set(statuses)]
  }

  if (showAddForm) {
    return (
      <VehicleForm
        onSave={handleAddItem}
        onCancel={() => setShowAddForm(false)}
      />
    )
  }

  if (selectedItem) {
    return (
      <VehicleDetail
        item={selectedItem}
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteItem}
        onClose={() => setSelectedItem(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Inventory Management</h1>
            <p className="ri-page-description">
              Manage your inventory of homes, RVs, and equipment
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : totalItems}</div>
            <p className="text-xs text-muted-foreground">
              All inventory items
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : availableItems}</div>
            <p className="text-xs text-muted-foreground">
              Ready for sale
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : soldItems}</div>
            <p className="text-xs text-muted-foreground">
              Completed sales
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Service</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : serviceItems}</div>
            <p className="text-xs text-muted-foreground">
              Under maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search by name, serial number, or location..."
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
                {getUniqueStatuses().map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {getUniqueTypes().map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            {loading ? 'Loading inventory...' : `${filteredItems.length} items found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading inventory...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 font-medium">Error Loading Inventory</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="ri-table-row"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          {item.type && (
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          )}
                          {item.status && (
                            <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                              {item.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {item.serial_number && (
                        <span>Serial: {item.serial_number} • </span>
                      )}
                      {item.location && (
                        <span>Location: {item.location} • </span>
                      )}
                      <span>Added: {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="ri-action-buttons">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredItems.length === 0 && !loading && !error && (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  {items.length === 0 ? (
                    <>
                      <p>No inventory items yet</p>
                      <p className="text-sm">Add your first item to get started</p>
                      <Button onClick={() => setShowAddForm(true)} className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Item
                      </Button>
                    </>
                  ) : (
                    <>
                      <p>No items match your search criteria</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function InventoryManagement() {
  return (
    <Routes>
      <Route path="/" element={<InventoryDashboard />} />
      <Route path="/*" element={<InventoryDashboard />} />
    </Routes>
  )
}