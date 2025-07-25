import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  AlertTriangle,
  Database,
  RefreshCw
} from 'lucide-react'
import { useInventoryManagement } from './hooks/useInventoryManagement'
import { useToast } from '@/hooks/use-toast'

function InventoryDashboard() {
  const { 
    inventory, 
    loading, 
    error, 
    usingFallback, 
    refreshInventory 
  } = useInventoryManagement()
  const { toast } = useToast()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Filter inventory based on search and filters
  const filteredInventory = React.useMemo(() => {
    let filtered = inventory

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.serial_number?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter)
    }

    return filtered
  }, [inventory, searchQuery, statusFilter, typeFilter])

  // Get unique values for filters
  const statuses = [...new Set(inventory.map(item => item.status).filter(Boolean))]
  const types = [...new Set(inventory.map(item => item.type).filter(Boolean))]

  const handleRefresh = async () => {
    await refreshInventory()
    toast({
      title: 'Inventory Refreshed',
      description: 'Inventory data has been refreshed from the database.'
    })
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800'
      case 'sold':
        return 'bg-blue-100 text-blue-800'
      case 'service':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Supabase Status Banner */}
      <Alert variant={usingFallback ? "destructive" : "default"}>
        <Database className="h-4 w-4" />
        <AlertDescription>
          {usingFallback ? (
            <>
              <strong>Fallback Mode:</strong> Using mock data. Supabase connection failed.
              {error && <span className="block text-xs mt-1">Error: {error}</span>}
            </>
          ) : (
            <>
              Inventory data is loaded from Supabase. Live table: <code className="bg-muted px-1 rounded">inventory_items</code>
            </>
          )}
        </AlertDescription>
      </Alert>

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Inventory Management</h1>
            <p className="ri-page-description">
              Manage your vehicle and equipment inventory
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Add Item (Phase 2)
            </Button>
          </div>
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
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'All inventory items'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.filter(item => item.status === 'Available').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for sale
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Service</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.filter(item => item.status === 'Service').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Under maintenance
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(inventory.map(item => item.location).filter(Boolean)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Storage locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            Search and filter your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search by name, serial number, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ri-search-input"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Inventory List */}
          <div className="space-y-4">
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading inventory...</p>
              </div>
            )}
            
            {!loading && filteredInventory.length === 0 && inventory.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Inventory Found</h3>
                <p className="mb-4">
                  {usingFallback 
                    ? 'No inventory data available in fallback mode'
                    : 'No items found in the inventory_items table'
                  }
                </p>
                <Button disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item (Phase 2)
                </Button>
              </div>
            )}
            
            {!loading && filteredInventory.length === 0 && inventory.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No items match your search criteria</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
            
            {filteredInventory.map((item) => (
              <div
                key={item.id}
                className="ri-table-row"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        {item.serial_number && (
                          <span>SN: {item.serial_number}</span>
                        )}
                        {item.location && (
                          <span>Location: {item.location}</span>
                        )}
                        {item.type && (
                          <span>Type: {item.type}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {item.status && (
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  )}
                  <div className="ri-action-buttons">
                    <Button variant="outline" size="sm" disabled>
                      View (Phase 2)
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Edit (Phase 2)
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phase 2 Features Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Phase 1 - Read Only:</strong> Create, update, and delete operations will be enabled in Phase 2.
          Currently displaying live data from Supabase inventory_items table.
        </AlertDescription>
      </Alert>
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