import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Settings, CreditCard, Eye, Users } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { FinanceApplicationForm } from './components/FinanceApplicationForm'
import { AdminApplicationBuilder } from './components/AdminApplicationBuilder'
import { ApplicationTypeSelectionModal } from './components/ApplicationTypeSelectionModal'
import { PortalApplicationView } from './components/PortalApplicationView'
import { InviteCustomerModal } from './components/InviteCustomerModal'
import { useFinanceApplications } from './hooks/useFinanceApplications'
import { FinanceApplication as FinanceApplicationType } from './types'

function FinanceApplicationDashboard() {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('applications')
  const [showApplicationTypeSelectionModal, setShowApplicationTypeSelectionModal] = useState(false)
  const [applicationCreationMode, setApplicationCreationMode] = useState<'none' | 'completeNow' | 'inviteCustomer'>('none')
  const [selectedApplication, setSelectedApplication] = useState<FinanceApplicationType | null>(null)
  
  const {
    applications,
    templates,
    createApplication,
    updateApplication,
    deleteApplication,
    createTemplate,
    updateTemplate,
    deleteTemplate
  } = useFinanceApplications()

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

  const handleCloseApplicationForm = () => {
    setSelectedApplication(null)
    setApplicationCreationMode('none')
  }

  const handleCloseInviteModal = () => {
    setApplicationCreationMode('none')
  }

  const handleCreateApplicationFromInvite = () => {
    const newApp = createApplication({
      customerId: '',
      customerName: '',
      customerEmail: '',
      templateId: templates[0]?.id || '',
      status: 'draft'
    })
    setSelectedApplication(newApp)
  }

  const handleViewApplication = (application: FinanceApplicationType) => {
    setSelectedApplication(application)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'denied':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-emerald-100 text-emerald-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  return (
    <div className="space-y-6">
      {/* Application Type Selection Modal */}
      {showApplicationTypeSelectionModal && (
        <ApplicationTypeSelectionModal
          onClose={() => setShowApplicationTypeSelectionModal(false)}
          onSelectType={handleSelectApplicationType}
        />
      )}

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
              +12% from last month
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
              Awaiting approval
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
              +5% from last month
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
              -0.5 days from last month
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
              <div className="space-y-4">
                {applications.map((application) => (
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
                            IDV: {application.fraudCheckStatus}
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
                
                {applications.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No finance applications yet</p>
                    <p className="text-sm">Create your first application to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <AdminApplicationBuilder
            templates={templates}
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