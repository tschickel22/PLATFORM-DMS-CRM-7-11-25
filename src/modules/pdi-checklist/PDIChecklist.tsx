// ✅ Connected to Supabase: pdi_checklists
// ⚠️ RLS disabled in dev – re-enable with policies in production

import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, FileText, Settings, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { usePdiSupabase } from '@/hooks/usePdiSupabase'
import { PDIInspectionList } from './components/PDIInspectionList'
import { PDINewInspectionForm } from './components/PDINewInspectionForm'
import { PDIInspectionForm } from './components/PDIInspectionForm'
import { PdiChecklist } from '@/types'

function PDIChecklistDashboard() {
  const {
    pdiChecklists,
    supabaseStatus,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    loading,
    usingFallback
  } = usePdiSupabase()
  
  const [activeTab, setActiveTab] = useState('inspections')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [technicianFilter, setTechnicianFilter] = useState('all')
  const [selectedInspection, setSelectedInspection] = useState<PdiChecklist | null>(null)
  const [showNewInspectionForm, setShowNewInspectionForm] = useState(false)
  const [showInspectionForm, setShowInspectionForm] = useState(false)

  // Status options for filtering
  const statusOptions = ['not_started', 'in_progress', 'complete', 'failed', 'pending_review', 'approved']
  const technicianOptions = ['Mike Johnson', 'Sarah Davis', 'Tom Wilson', 'Lisa Chen']

  // Filter inspections based on search and filters
  const filteredInspections = React.useMemo(() => {
    let currentInspections = pdiChecklists

    // Search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      currentInspections = currentInspections.filter(inspection =>
        (inspection.vehicle_id && inspection.vehicle_id.toLowerCase().includes(lowerCaseQuery)) ||
        (inspection.technician && inspection.technician.toLowerCase().includes(lowerCaseQuery))
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      currentInspections = currentInspections.filter(inspection => 
        inspection.status === statusFilter
      )
    }

    // Technician filter
    if (technicianFilter !== 'all') {
      currentInspections = currentInspections.filter(inspection => 
        inspection.technician === technicianFilter
      )
    }

    return currentInspections
  }, [pdiChecklists, searchQuery, statusFilter, technicianFilter])

  // Calculate stats
  const stats = React.useMemo(() => {
    return {
      total: pdiChecklists.length,
      inProgress: pdiChecklists.filter(i => i.status === 'in_progress').length,
      completed: pdiChecklists.filter(i => i.status === 'complete').length,
      failed: pdiChecklists.filter(i => i.status === 'failed').length
    }
  }, [pdiChecklists])

  const handleNewInspection = () => {
    setShowNewInspectionForm(true)
  }

  const handleEditInspection = (inspection: PdiChecklist) => {
    setSelectedInspection(inspection)
    setShowInspectionForm(true)
  }

  const handleSaveInspection = async (inspectionData: Partial<PdiChecklist>) => {
    try {
      if (selectedInspection) {
        await updateChecklist(selectedInspection.id, inspectionData)
      } else {
        await createChecklist(inspectionData)
      }
      setShowInspectionForm(false)
      setShowNewInspectionForm(false)
      setSelectedInspection(null)
    } catch (error) {
      console.error('Error saving inspection:', error)
    }
  }

  const handleDeleteInspection = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inspection?')) {
      try {
        await deleteChecklist(id)
      } catch (error) {
        console.error('Error deleting inspection:', error)
      }
    }
  }

  const handleCloseForm = () => {
    setShowInspectionForm(false)
    setShowNewInspectionForm(false)
    setSelectedInspection(null)
  }

  return (
    <div className="space-y-6">
      {/* Supabase Status Banner */}
      <Alert>
        <AlertDescription>
          {loading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Connecting to Supabase PDI checklists...
            </span>
          ) : !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY ? (
            <span>
              ⚙️ <strong>Configuration Required:</strong> Supabase environment variables not set. 
              {usingFallback ? 'Displaying demo data.' : 'No data available.'}
              <code className="ml-2 text-xs">
                VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'MISSING'}, 
                VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'}
              </code>
            </span>
          ) : usingFallback ? (
            <span>
              📊 <strong>Demo Mode:</strong> Supabase configured but using fallback data. 
              <code className="ml-2 text-xs">
                PDI Checklists: {supabaseStatus.checklists.error || 'Connection issue'}
              </code>
            </span>
          ) : (
            <span>
              ✅ <strong>Live Data:</strong> Connected to Supabase successfully. 
              <code className="ml-2 text-xs">
                pdi_checklists ({supabaseStatus.checklists.count})
              </code>
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Show forms when needed */}
      {showNewInspectionForm && (
        <PDINewInspectionForm
          onSave={handleSaveInspection}
          onCancel={handleCloseForm}
        />
      )}

      {showInspectionForm && selectedInspection && (
        <PDIInspectionForm
          inspection={selectedInspection}
          onSave={handleSaveInspection}
          onCancel={handleCloseForm}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">PDI Checklist</h1>
            <p className="ri-page-description">
              Pre-delivery inspection management
            </p>
          </div>
          <Button onClick={handleNewInspection} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Inspection
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
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
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search inspections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Technicians" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Technicians</SelectItem>
                    {technicianOptions.map(tech => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Inspections List */}
              <PDIInspectionList
                inspections={filteredInspections}
                onEditInspection={handleEditInspection}
                onDeleteInspection={handleDeleteInspection}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div>PDI Settings - Coming Soon</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function PDIChecklist() {
  return (
    <Routes>
      <Route path="/" element={<PDIChecklistDashboard />} />
      <Route path="/*" element={<PDIChecklistDashboard />} />
    </Routes>
  )
}