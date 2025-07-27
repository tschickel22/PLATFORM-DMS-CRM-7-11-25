// ✅ Connected to Supabase: pdi_checklists
// ⚠️ RLS disabled in dev – re-enable with policies in production

import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, FileText, Settings, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react'
import { usePDIManagement } from './hooks/usePDIManagement'
import { useToast } from '@/hooks/use-toast'
import { PdiChecklist, ChecklistItem } from '@/types'

export default function PDIChecklist() {
  const { toast } = useToast()
  const {
    inspections,
    settings,
    loading,
    error,
    usingFallback,
    supabaseStatus,
    createInspection,
    updateInspection,
    deleteInspection,
    updateSetting
  } = usePDIManagement()
  
  const [activeTab, setActiveTab] = useState('inspections')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showNewInspectionForm, setShowNewInspectionForm] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<PdiChecklist | null>(null)
  
  // Form state for new inspection
  const [newInspectionForm, setNewInspectionForm] = useState({
    vehicle_id: '',
    technicianId: '',
    status: 'Not Started',
    notes: ''
  })

  // Display error toast if there's an error
  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Error loading PDI data',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Filter inspections based on search and status
  const filteredInspections = React.useMemo(() => {
    let currentInspections = inspections

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      currentInspections = currentInspections.filter(inspection =>
        (inspection.vehicle_id && inspection.vehicle_id.toLowerCase().includes(lowerCaseQuery)) ||
        (inspection.technician && inspection.technician.toLowerCase().includes(lowerCaseQuery))
      )
    }

    if (statusFilter !== 'all') {
      currentInspections = currentInspections.filter(inspection => inspection.status === statusFilter)
    }

    return currentInspections
  }, [inspections, searchQuery, statusFilter])

  const handleCreateInspection = async () => {
    if (!newInspectionForm.vehicle_id || !newInspectionForm.technicianId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    const newInspection = await createInspection({
      vehicle_id: newInspectionForm.vehicle_id,
      technician: newInspectionForm.technicianId,
      status: newInspectionForm.status,
      checklist_data: []
    })

    if (newInspection) {
      setNewInspectionForm({
        vehicle_id: '',
        technicianId: '',
        status: 'Not Started',
        notes: ''
      })
      setShowNewInspectionForm(false)
      toast({
        title: 'Success',
        description: 'PDI inspection created successfully'
      })
    }
  }

  const handleUpdateInspectionStatus = async (inspectionId: string, newStatus: string) => {
    await updateInspection(inspectionId, { status: newStatus })
    toast({
      title: 'Success',
      description: 'Inspection status updated successfully'
    })
  }

  const handleDeleteInspection = async (inspectionId: string) => {
    if (window.confirm('Are you sure you want to delete this inspection?')) {
      await deleteInspection(inspectionId)
      toast({
        title: 'Success',
        description: 'Inspection deleted successfully'
      })
    }
  }

  const handleUpdateSetting = async (key: string, value: string) => {
    await updateSetting(key, value)
    toast({
      title: 'Success',
      description: 'Setting updated successfully'
    })
  }

  const getStatusColor = (status: string) => {
    const statusColors = {
      'Not Started': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Complete': 'bg-green-100 text-green-800',
      'Failed': 'bg-red-100 text-red-800',
      'Pending Review': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-emerald-100 text-emerald-800'
    }
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-3 text-muted-foreground">Loading PDI data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Supabase Status Banner */}
      <Alert>
        <AlertDescription>
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading PDI data...
            </span>
          ) : usingFallback ? (
            <span>
              📊 <strong>Demo Mode:</strong> Using fallback PDI data.
            </span>
          ) : (
            <span>
              ✅ <strong>Live Data:</strong> Connected to Supabase for PDI.
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">PDI Checklist</h1>
            <p className="ri-page-description">
              Manage pre-delivery inspections and quality control
            </p>
          </div>
          <Button onClick={() => setShowNewInspectionForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Inspection
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inspections.length}</div>
            <p className="text-xs text-muted-foreground">
              All time inspections
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inspections.filter(i => i.status === 'In Progress').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inspections.filter(i => i.status === 'Complete').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inspections.filter(i => i.status === 'Failed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="inspections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>PDI Inspections</CardTitle>
              <CardDescription>
                Manage pre-delivery inspection checklists
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by vehicle ID or technician"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Complete">Complete</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Pending Review">Pending Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredInspections.map((inspection) => (
                  <div
                    key={inspection.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold">Vehicle: {inspection.vehicle_id}</h4>
                        <Badge className={getStatusColor(inspection.status)}>
                          {inspection.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Technician: {inspection.technician} • 
                        Created: {new Date(inspection.created_at).toLocaleDateString()} •
                        Updated: {new Date(inspection.updated_at).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Checklist Items: {inspection.checklist_data.length}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={inspection.status}
                        onValueChange={(newStatus) => handleUpdateInspectionStatus(inspection.id, newStatus)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Complete">Complete</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                          <SelectItem value="Pending Review">Pending Review</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInspection(inspection)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteInspection(inspection.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                
                {filteredInspections.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No inspections found</p>
                    <p className="text-sm">Create your first PDI inspection to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>PDI Settings</CardTitle>
              <CardDescription>
                Configure PDI inspection defaults and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{setting.key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                      <p className="text-sm text-muted-foreground">Current value: {setting.value}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newValue = prompt(`Enter new value for ${setting.key}:`, setting.value)
                        if (newValue !== null) {
                          handleUpdateSetting(setting.key, newValue)
                        }
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
                
                {settings.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No settings configured</p>
                    <p className="text-sm">Settings will appear here when configured</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Inspection Form Modal */}
      {showNewInspectionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>New PDI Inspection</CardTitle>
              <CardDescription>
                Create a new pre-delivery inspection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vehicleId">Vehicle ID *</Label>
                <Input
                  id="vehicleId"
                  value={newInspectionForm.vehicle_id}
                  onChange={(e) => setNewInspectionForm(prev => ({
                    ...prev,
                    vehicle_id: e.target.value
                  }))}
                  placeholder="Enter vehicle ID"
                />
              </div>
              
              <div>
                <Label htmlFor="technician">Technician *</Label>
                <Input
                  id="technician"
                  value={newInspectionForm.technicianId}
                  onChange={(e) => setNewInspectionForm(prev => ({
                    ...prev,
                    technicianId: e.target.value
                  }))}
                  placeholder="Enter technician name"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Initial Status</Label>
                <Select
                  value={newInspectionForm.status}
                  onValueChange={(value) => setNewInspectionForm(prev => ({
                    ...prev,
                    status: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newInspectionForm.notes}
                  onChange={(e) => setNewInspectionForm(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  placeholder="Optional notes"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowNewInspectionForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateInspection}>
                  Create Inspection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Inspection Detail Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Inspection Details</CardTitle>
                  <CardDescription>
                    Vehicle: {selectedInspection.vehicle_id}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedInspection(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Vehicle ID</Label>
                    <p className="text-sm">{selectedInspection.vehicle_id}</p>
                  </div>
                  <div>
                    <Label>Technician</Label>
                    <p className="text-sm">{selectedInspection.technician}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedInspection.status)}>
                      {selectedInspection.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Created</Label>
                    <p className="text-sm">{new Date(selectedInspection.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <Label>Checklist Items</Label>
                  <div className="mt-2 space-y-2">
                    {selectedInspection.checklist_data.length > 0 ? (
                      selectedInspection.checklist_data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{item.step}</span>
                          <Badge variant="outline">{item.status}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No checklist items added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}