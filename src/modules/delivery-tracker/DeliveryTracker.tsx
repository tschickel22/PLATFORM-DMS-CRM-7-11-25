import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  Search, 
  Plus, 
  RefreshCw,
  Package,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react'
import { useDeliveryManagement } from './hooks/useDeliveryManagement'
import { useToast } from '@/hooks/use-toast'

function DeliveryTrackerDashboard() {
  const { toast } = useToast()
  const {
    deliveries,
    loading,
    error,
    dataSource,
    createDelivery,
    refreshData,
    getDeliveriesByStatus
  } = useDeliveryManagement()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  // Filter deliveries based on search and filters
  const filteredDeliveries = React.useMemo(() => {
    let filtered = deliveries

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(delivery =>
        delivery.customer_name?.toLowerCase().includes(query) ||
        delivery.vehicle_info?.toLowerCase().includes(query) ||
        delivery.address?.toLowerCase().includes(query) ||
        delivery.driver_name?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === statusFilter)
    }

    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filtered = filtered.filter(delivery => {
        const deliveryDate = new Date(delivery.scheduled_date || delivery.created_at)
        return deliveryDate.setHours(0,0,0,0) >= filterDate.setHours(0,0,0,0)
      })
    }

    return filtered
  }, [deliveries, searchQuery, statusFilter, dateFilter])

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = deliveries.length
    const pending = getDeliveriesByStatus('Pending').length
    const scheduled = getDeliveriesByStatus('Scheduled').length
    const inTransit = getDeliveriesByStatus('In Transit').length
    const delivered = getDeliveriesByStatus('Delivered').length

    return { total, pending, scheduled, inTransit, delivered }
  }, [deliveries, getDeliveriesByStatus])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'in transit':
        return 'bg-orange-100 text-orange-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'scheduled':
        return <Calendar className="h-4 w-4" />
      case 'in transit':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const handleCreateDelivery = () => {
    createDelivery({})
  }

  return (
    <div className="space-y-6">
      {/* Supabase Status Banner */}
      <Alert>
        <AlertDescription>
          <strong>Delivery data source:</strong> {dataSource === 'supabase' ? 'Live Supabase (deliveries table)' : 'Fallback mock data'}
          {error && <span className="text-red-600 ml-2">• Error: {error}</span>}
          <span className="ml-2 text-blue-600">• Phase 1: Read-only mode</span>
        </AlertDescription>
      </Alert>

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Delivery Tracker</h1>
            <p className="ri-page-description">
              Track and manage vehicle deliveries and logistics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={refreshData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleCreateDelivery}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Delivery
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time deliveries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">
              Ready for delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.inTransit}</div>
            <p className="text-xs text-muted-foreground">
              Currently delivering
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.delivered}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Management</CardTitle>
          <CardDescription>
            Track and manage all vehicle deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search by customer, vehicle, address, or driver..."
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
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-[180px]"
              title="Filter by scheduled date (on or after)"
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading deliveries...</p>
            </div>
          )}

          {/* Deliveries List */}
          {!loading && (
            <div className="space-y-4">
              {filteredDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="ri-table-row"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(delivery.status)}
                      <div>
                        <h4 className="font-semibold">{delivery.customer_name || 'Unknown Customer'}</h4>
                        <p className="text-sm text-muted-foreground">
                          {delivery.vehicle_info || 'No vehicle info'}
                        </p>
                      </div>
                      <Badge className={getStatusColor(delivery.status)}>
                        {delivery.status || 'Unknown'}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{delivery.address || 'No address'}</span>
                      </div>
                      {delivery.scheduled_date && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(delivery.scheduled_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {delivery.driver_name && (
                        <div className="flex items-center space-x-1">
                          <Truck className="h-3 w-3" />
                          <span>{delivery.driver_name}</span>
                        </div>
                      )}
                      {delivery.eta && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>ETA: {delivery.eta}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ri-action-buttons">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredDeliveries.length === 0 && !loading && (
                <div className="text-center py-12 text-muted-foreground">
                  <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  {deliveries.length === 0 ? (
                    <>
                      <p>No deliveries found</p>
                      <p className="text-sm">Deliveries will appear here when available</p>
                    </>
                  ) : (
                    <>
                      <p>No deliveries match your criteria</p>
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

export default function DeliveryTracker() {
  return (
    <Routes>
      <Route path="/" element={<DeliveryTrackerDashboard />} />
      <Route path="/*" element={<DeliveryTrackerDashboard />} />
    </Routes>
  )
}