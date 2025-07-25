import React, { useState, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, FileText, Settings, CreditCard, Eye, Users, Search, Save, User, Clock } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { FinanceApplicationForm } from './components/FinanceApplicationForm'
import { AdminApplicationBuilder } from './components/AdminApplicationBuilder'
import { ApplicationTypeSelectionModal } from './components/ApplicationTypeSelectionModal'
import { PortalApplicationView } from './components/PortalApplicationView'
import { InviteCustomerModal } from './components/InviteCustomerModal'
import { useFinanceApplications } from './hooks/useFinanceApplications'
import { FinanceApplication as FinanceApplicationType } from './types'
import { mockFinanceApplications } from './mocks/financeApplicationMock'

function FinanceApplicationDashboard() {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('applications')
  const [showApplicationTypeSelectionModal, setShowApplicationTypeSelectionModal] = useState(false)
  const [applicationCreationMode, setApplicationCreationMode] = useState<'none' | 'completeNow' | 'inviteCustomer'>('none')
  const [selectedApplication, setSelectedApplication] = useState<FinanceApplicationType | null>(null)
  
  // Search and filter states
  const [applicationSearchQuery, setApplicationSearchQuery] = useState('')
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('all')
  const [applicationDateFilter, setApplicationDateFilter] = useState('')
  const [templateSearchQuery, setTemplateSearchQuery] = useState('')
  
  // Admin notes state
  const [currentAdminNote, setCurrentAdminNote] = useState('')
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const adminNotesRef = useRef<HTMLTextAreaElement>(null)
  
  const {
    applications,
    templates,
    loading,
    usingFallback,
    supabaseStatus,
    createApplication,
    updateApplication,
    deleteApplication,
    createTemplate,
    updateTemplate,
    deleteTemplate
  } = useFinanceApplications()

  // Filter applications based on search and filters
  const filteredApplications = React.useMemo(() => {
    let currentApplications = applications

    // Search filter (name, email, phone)
    if (applicationSearchQuery) {
      const lowerCaseQuery = applicationSearchQuery.toLowerCase()
      currentApplications = currentApplications.filter(app =>
        (app.customerName && app.customerName.toLowerCase().includes(lowerCaseQuery)) ||
        (app.customerEmail && app.customerEmail.toLowerCase().includes(lowerCaseQuery)) ||
        (app.customerPhone && app.customerPhone.toLowerCase().includes(lowerCaseQuery))
      )
    }

    // Status filter
    if (applicationStatusFilter !== 'all') {
      currentApplications = currentApplications.filter(app => app.status === applicationStatusFilter)
    }

    // Date filter (created on or after)
    if (applicationDateFilter) {
      const filterDate = new Date(applicationDateFilter)
      currentApplications = currentApplications.filter(app => {
        const appCreationDate = new Date(app.createdAt)
        return appCreationDate.setHours(0,0,0,0) >= filterDate.setHours(0,0,0,0)
      })
    }

    return currentApplications
  }, [applications, applicationSearchQuery, applicationStatusFilter, applicationDateFilter])

  // Filter templates based on search
  const filteredTemplates = React.useMemo(() => {
    let currentTemplates = templates

    if (templateSearchQuery) {
      const lowerCaseQuery = templateSearchQuery.toLowerCase()
      currentTemplates = currentTemplates.filter(template =>
        template.name.toLowerCase().includes(lowerCaseQuery) ||
        template.description.toLowerCase().includes(lowerCaseQuery)
      )
    }

    return currentTemplates
  }, [templates, templateSearchQuery])

  // Get platform-specific labels
  const getModuleLabel = () => {
    return 'Applications'
  }

  const getApplicationLabel = () => {
    const platformType = tenant?.settings?.platformType || 'mh'
    const labelOverrides = tenant?.settings?.labelOverrides || {}
    
    if (labelOverrides['finance.application']) {
      return labelOverrides['finance.application']
    }
    
    switch (platformType) {
      case 'rv':
        return 'RV Loan Application'
      case 'auto':
        return 'Auto Loan Application'
      case 'mh':
      default:
        return 'MH Finance Application'
    }
  }

  const handleOpenApplicationCreationFlow = () => {
    toast({
      title: 'Read-Only Mode',
      description: 'Creating applications is disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    return
    
    setShowApplicationTypeSelectionModal(true)
  }

  const handleSelectApplicationType = (type: 'completeNow' | 'inviteCustomer') => {
    setShowApplicationTypeSelectionModal(false)
    setApplicationCreationMode(type)
    
    if (type === 'completeNow') {
      const defaultTemplate = templates.find(t => t.isActive) || templates[0]
      if (!defaultTemplate) {
        toast({
          title: 'No Templates Available',
          description: 'Please create an application template first.',
          variant: 'destructive'
        })
        setApplicationCreationMode('none')
        return
      }
      
      const newApp = createApplication({
        customerId: '',
        customerName: '',
        customerEmail: '',
        templateId: defaultTemplate.id,
        status: 'draft'
      })
      setSelectedApplication(newApp)
    }
  }

  const handleStatusChange = (newStatus: string) => {
    toast({
      title: 'Read-Only Mode',
      description: 'Status changes are disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    return
    
    if (!selectedApplication) return
    
    // Check if changing FROM denied TO another status - requires note validation
    if (selectedApplication.status === 'denied' && newStatus !== 'denied') {
      if (!currentAdminNote.trim()) {
        // Set pending status but don't save yet
        setPendingStatus(newStatus)
        
        // Scroll to admin notes section
        adminNotesRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
        
        toast({
          title: 'Internal Note Required',
          description: 'Please add an internal note explaining the reason for changing from denied status.',
          variant: 'destructive'
        })
        return
      }
    }
    
    // Auto-save the status change
    const isStatusChanging = newStatus !== selectedApplication.status
    
    if (isStatusChanging) {
      const updateData: any = {
        status: newStatus,
        reviewedBy: 'Admin User', // In real app, get from auth context
        reviewedAt: new Date().toISOString(),
        adminNotes: currentAdminNote
      }
      
      // Update the application
      updateApplication(selectedApplication.id, updateData)
      
      // Update the selected application state to reflect changes immediately
      const updatedApplication = {
        ...selectedApplication,
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      setSelectedApplication(updatedApplication)
      
      // Clear pending status
      setPendingStatus(null)
      
      toast({
        title: 'Status Updated',
        description: `Application status changed to ${newStatus.replace('_', ' ')}.`
      })
    }
  }
  const handleCloseApplicationForm = () => {
    setSelectedApplication(null)
    setCurrentAdminNote('')
    setPendingStatus(null)
    setApplicationCreationMode('none')
  }

  const handleCloseInviteModal = () => {
    setApplicationCreationMode('none')
  }

  const handleViewApplication = (application: FinanceApplicationType) => {
    setSelectedApplication(application)
    setCurrentAdminNote(application.adminNotes || '')
    setPendingStatus(null)
    setApplicationCreationMode('none') // Reset creation mode when viewing
  }

  const getStatusColor = (status: string) => {
    const statusOption = mockFinanceApplications.statusOptions.find(s => s.value === status)
    return statusOption?.color || 'bg-gray-100 text-gray-800'
  }

  const handleSaveNotesAndStatus = () => {
    toast({
      title: 'Read-Only Mode',
      description: 'Saving notes and status changes is disabled in Phase 1. This will be enabled in Phase 2.',
      variant: 'destructive'
    })
    return
    
    if (selectedApplication) {
      const newStatusToApply = pendingStatus || selectedApplication.status
      const isStatusChanging = newStatusToApply !== selectedApplication.status
      
      // Check if note is required (changing FROM denied to another status)
      if (isStatusChanging && selectedApplication.status === 'denied' && newStatusToApply !== 'denied' && !currentAdminNote.trim()) {
        // Scroll to admin notes section
        adminNotesRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
        
        toast({
          title: 'Internal Note Required',
          description: 'Please add an internal note explaining the reason for changing from denied status.',
          variant: 'destructive'
        })
        return
      }
      
      // Prepare update data
      const updateData: any = {
        adminNotes: currentAdminNote
      }
      
      // Add status change data if status is changing
      if (isStatusChanging) {
        updateData.status = newStatusToApply
        updateData.reviewedBy = 'Admin User' // In real app, get from auth context
        updateData.reviewedAt = new Date().toISOString()
      }
      
      // Update the application
      updateApplication(selectedApplication.id, updateData)
      
      // Update the selected application state to reflect changes immediately
      const updatedApplication = {
        ...selectedApplication,
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      setSelectedApplication(updatedApplication)
      
      // Clear pending status
      setPendingStatus(null)
      
      toast({
        title: isStatusChanging ? 'Status and Notes Updated' : 'Admin Notes Saved',
        description: isStatusChanging 
          ? `Application status changed to ${newStatusToApply.replace('_', ' ')} and notes saved.`
          : 'Internal notes have been saved successfully.'
      })
    }
  }


  if (selectedApplication && applicationCreationMode === 'completeNow') {
    return (
      <FinanceApplicationForm
        application={selectedApplication}
        onSave={(data) => {
          updateApplication(selectedApplication.id, data)
          toast({
            title: 'Application Updated',
            description: 'Finance application has been saved successfully.'
          })
        }}
        onCancel={handleCloseApplicationForm}
        onSubmit={(data) => {
          updateApplication(selectedApplication.id, { ...data, status: 'submitted' })
          handleCloseApplicationForm()
          toast({
            title: 'Application Submitted',
            description: 'Finance application has been submitted for review.'
          })
        }}
      />
    )
  }

  if (applicationCreationMode === 'inviteCustomer') {
    return (
      <div className="space-y-6">
        <InviteCustomerModal
          onClose={handleCloseInviteModal}
          onInvite={(customerData, templateId) => {
            const newApp = createApplication({
              customerId: customerData.id || '',
              customerName: customerData.name,
              customerEmail: customerData.email,
              templateId: templateId,
              status: 'draft'
            })
            handleCloseInviteModal()
            toast({
              title: 'Invitation Sent',
              description: `Finance application invitation sent to ${customerData.name}`
            })
          }}
        />
      </div>
    )
  }

  // Add view mode for selected application
  if (selectedApplication && applicationCreationMode === 'none') {
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleCloseApplicationForm}>
              ← Back to Applications
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Application Details</h1>
              <p className="text-muted-foreground">
                {selectedApplication.customerName || 'Unnamed Application'}
              </p>
            </div>
          </div>
        </div>

        {/* Application Details Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Application #{selectedApplication.id.slice(-6).toUpperCase()}</CardTitle>
                <CardDescription>
                  Created {new Date(selectedApplication.createdAt).toLocaleDateString()}
                  {selectedApplication.submittedAt && (
                    <span> • Submitted {new Date(selectedApplication.submittedAt).toLocaleDateString()}</span>
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium">Status:</Label>
                  <Select
                    value={pendingStatus || selectedApplication.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { value: 'draft', label: 'Draft' },
                        { value: 'submitted', label: 'Submitted' },
                        { value: 'under_review', label: 'Under Review' },
                        { value: 'approved', label: 'Approved' },
                        { value: 'conditionally_approved', label: 'Conditionally Approved' },
                        { value: 'denied', label: 'Denied' },
                        { value: 'completed', label: 'Completed' }
                      ].map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedApplication.fraudCheckStatus && (
                  <Badge variant="outline">
                    IDV: {selectedApplication.fraudCheckStatus.charAt(0).toUpperCase() + selectedApplication.fraudCheckStatus.slice(1)}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm">{selectedApplication.customerName || 'Not provided'}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedApplication.customerEmail || 'Not provided'}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm">{selectedApplication.customerPhone || 'Not provided'}</p>
                </div>
                <div>
                  <Label>Customer ID</Label>
                  <p className="text-sm">{selectedApplication.customerId || 'Not assigned'}</p>
                </div>
              </div>
            </div>

            {/* Application Data */}
            {Object.keys(selectedApplication.data).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Application Data</h3>
                <div className="space-y-4">
                  {Object.entries(selectedApplication.data).map(([sectionId, sectionData]) => (
                    <div key={sectionId} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2 capitalize">{sectionId.replace('-', ' ')}</h4>
                      <div className="grid gap-2 md:grid-cols-2">
                        {Object.entries(sectionData as Record<string, any>).map(([fieldId, value]) => (
                          <div key={fieldId}>
                            <Label className="text-xs text-muted-foreground capitalize">
                              {fieldId.replace('-', ' ')}
                            </Label>
                            <p className="text-sm">{value || 'Not provided'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Files */}
            {selectedApplication.uploadedFiles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Uploaded Documents</h3>
                <div className="space-y-2">
                  {selectedApplication.uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedApplication.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Notes</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm">{selectedApplication.notes}</p>
                </div>
              </div>
            )}

            {/* Review Information */}
            {selectedApplication.reviewedAt && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Review Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Reviewed Date</Label>
                    <p className="text-sm">{new Date(selectedApplication.reviewedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Reviewed By</Label>
                    <p className="text-sm">{selectedApplication.reviewedBy || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Notes Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Admin Notes (Internal Only)</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveNotesAndStatus}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {pendingStatus && pendingStatus !== selectedApplication.status ? 'Save Status & Notes' : 'Save Notes'}
                </Button>
              </div>
              <Textarea
                ref={adminNotesRef}
                value={currentAdminNote}
                onChange={(e) => setCurrentAdminNote(e.target.value)}
                placeholder="Add internal notes about this application (not visible to customer)..."
                rows={4}
                className="mb-4"
              />
              <p className="text-xs text-muted-foreground">
                These notes are for internal use only and will not be visible to the customer.
                {pendingStatus && pendingStatus !== selectedApplication.status && (
                  <span className="block mt-1 text-orange-600 font-medium">
                    Status will be changed to "{mockFinanceApplications.statusOptions.find(s => s.value === pendingStatus)?.label}" when saved.
                  </span>
                )}
              </p>
            </div>

            {/* Application History */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Application History</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedApplication.history?.length > 0 ? (
                  selectedApplication.history
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((entry) => (
                      <div key={entry.id} className="flex items-start space-x-3 p-3 border rounded-lg bg-muted/20">
                        <div className="flex-shrink-0 mt-1">
                          {entry.action.includes('Status') ? (
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Settings className="h-4 w-4 text-blue-600" />
                            </div>
                          ) : entry.action.includes('Document') ? (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <FileText className="h-4 w-4 text-green-600" />
                            </div>
                          ) : entry.action.includes('Notes') ? (
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <FileText className="h-4 w-4 text-purple-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Clock className="h-4 w-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">{entry.action}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{entry.details}</p>
                          {(entry.oldValue || entry.newValue) && (
                            <div className="text-xs text-muted-foreground mt-2 space-y-1">
                              {entry.oldValue && (
                                <div>
                                  <span className="font-medium">From:</span> {entry.oldValue}
                                </div>
                              )}
                              {entry.newValue && (
                                <div>
                                  <span className="font-medium">To:</span> {entry.newValue}
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex items-center space-x-1 mt-2">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{entry.userName}</span>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm">No history available</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Application Type Selection Modal */}
      {showApplicationTypeSelectionModal && (
        <ApplicationTypeSelectionModal
          onClose={() => setShowApplicationTypeSelectionModal(false)}
          onSelectType={handleSelectApplicationType}
        />
      )}

      {/* Supabase Status Banner */}
      <Alert>
        <AlertDescription>
          {loading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Loading finance applications from Supabase...
            </span>
          ) : usingFallback ? (
            <span>
              📊 <strong>Demo Mode:</strong> Displaying sample finance applications. 
              Live Supabase data will be available when configured.
              <code className="ml-2 text-xs">
                Tables: finance_applications ({supabaseStatus.applications.error ? `Error: ${supabaseStatus.applications.error}` : 'No connection'}), 
                application_templates ({supabaseStatus.templates.error ? `Error: ${supabaseStatus.templates.error}` : 'No connection'})
              </code>
            </span>
          ) : (
            <span>
              ✅ <strong>Live Data:</strong> Connected to Supabase finance applications. 
              <code className="ml-2 text-xs">
                Tables: finance_applications ({supabaseStatus.applications.count}), 
                application_templates ({supabaseStatus.templates.count})
              </code>
              <span className="ml-2 text-xs text-orange-600">[Read-Only Mode - Phase 1]</span>
            </span>
          )}
        </AlertDescription>
      </Alert>
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">{getModuleLabel()}</h1>
            <p className="ri-page-description">
              Manage finance applications and approval workflows
            </p>
          </div>
          <div>
            <Button onClick={handleOpenApplicationCreationFlow}>
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : '+12% from last month'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === 'under_review').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Awaiting approval'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : '+5% from last month'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : '-0.5 days from last month'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Finance Applications</CardTitle>
              <CardDescription>
                Manage and review customer finance applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or phone"
                    value={applicationSearchQuery}
                    onChange={(e) => setApplicationSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={applicationStatusFilter}
                  onValueChange={setApplicationStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {[
                      { value: 'draft', label: 'Draft' },
                      { value: 'submitted', label: 'Submitted' },
                      { value: 'under_review', label: 'Under Review' },
                      { value: 'approved', label: 'Approved' },
                      { value: 'conditionally_approved', label: 'Conditionally Approved' },
                      { value: 'denied', label: 'Denied' },
                      { value: 'completed', label: 'Completed' }
                    ].map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={applicationDateFilter}
                  onChange={(e) => setApplicationDateFilter(e.target.value)}
                  className="w-[180px]"
                  title="Filter by creation date (on or after)"
                />
              </div>

              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading applications...</p>
                  </div>
                )}
                
                {filteredApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold">{application.customerName || 'Unnamed Application'}</h4>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {application.fraudCheckStatus && (
                          <Badge variant="outline">
                            IDV: {application.fraudCheckStatus.charAt(0).toUpperCase() + application.fraudCheckStatus.slice(1)}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {application.customerEmail && (
                          <span>{application.customerEmail} • </span>
                        )}
                        Created: {new Date(application.createdAt).toLocaleDateString()}
                        {application.submittedAt && (
                          <span> • Submitted: {new Date(application.submittedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplication(application)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                
                {!loading && filteredApplications.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    {applications.length === 0 ? (
                      <>
                        <p>No finance applications yet</p>
                        <p className="text-sm">Create your first application to get started</p>
                      </>
                    ) : (
                      <>
                        <p>No applications found matching your criteria</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {/* Template Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates by name or description"
              value={templateSearchQuery}
              onChange={(e) => setTemplateSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <AdminApplicationBuilder
            templates={filteredTemplates}
            onCreateTemplate={createTemplate}
            onUpdateTemplate={updateTemplate}
            onDeleteTemplate={deleteTemplate}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function FinanceApplication() {
  return (
    <Routes>
      <Route path="/" element={<FinanceApplicationDashboard />} />
      <Route path="/portal" element={<PortalApplicationView />} />
      <Route path="/*" element={<FinanceApplicationDashboard />} />
    </Routes>
  )
}