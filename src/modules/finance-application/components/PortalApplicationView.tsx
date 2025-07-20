import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { FileText, Plus, Eye, Edit, Clock, CheckCircle, XCircle } from 'lucide-react'
import { FinanceApplication } from '../types'
import { useFinanceApplications } from '../hooks/useFinanceApplications'
import { FinanceApplicationForm } from './FinanceApplicationForm'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'

export function PortalApplicationView() {
  const { tenant } = useTenant()
  const { toast } = useToast()
  const {
    applications,
    templates,
    createApplication,
    updateApplication,
    getApplicationsByCustomer
  } = useFinanceApplications()
  
  const [selectedApplication, setSelectedApplication] = useState<FinanceApplication | null>(null)
  const [showNewApplicationForm, setShowNewApplicationForm] = useState(false)

  // Mock customer ID - in real app, this would come from portal session
  const customerId = 'portal-customer-001'
  const customerApplications = getApplicationsByCustomer(customerId)

  // Get platform-specific labels
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4" />
      case 'submitted':
      case 'under_review':
        return <Clock className="h-4 w-4" />
      case 'approved':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'denied':
        return <XCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
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

  const getApplicationProgress = (application: FinanceApplication) => {
    const template = templates.find(t => t.id === application.templateId)
    if (!template) return 0

    const totalFields = template.sections.reduce((total, section) => 
      total + section.fields.filter(field => field.required).length, 0
    )
    
    const completedFields = template.sections.reduce((total, section) => {
      const sectionData = application.data[section.id] || {}
      return total + section.fields.filter(field => 
        field.required && sectionData[field.id]
      ).length
    }, 0)

    return totalFields > 0 ? (completedFields / totalFields) * 100 : 0
  }

  const handleCreateApplication = () => {
    const defaultTemplate = templates.find(t => t.isActive) || templates[0]
    if (!defaultTemplate) {
      toast({
        title: 'No Templates Available',
        description: 'Please contact support to set up application templates.',
        variant: 'destructive'
      })
      return
    }

    const newApp = createApplication({
      customerId,
      customerName: 'Portal Customer', // In real app, get from session
      customerEmail: 'customer@email.com', // In real app, get from session
      templateId: defaultTemplate.id,
      status: 'draft'
    })
    
    setSelectedApplication(newApp)
    setShowNewApplicationForm(true)
  }

  const handleViewApplication = (application: FinanceApplication) => {
    setSelectedApplication(application)
    setShowNewApplicationForm(application.status === 'draft')
  }

  const handleSaveApplication = (data: Partial<FinanceApplication>) => {
    if (selectedApplication) {
      updateApplication(selectedApplication.id, data)
      toast({
        title: 'Application Saved',
        description: 'Your application has been saved successfully.'
      })
    }
  }

  const handleSubmitApplication = (data: Partial<FinanceApplication>) => {
    if (selectedApplication) {
      updateApplication(selectedApplication.id, { ...data, status: 'submitted' })
      setSelectedApplication(null)
      setShowNewApplicationForm(false)
      toast({
        title: 'Application Submitted',
        description: 'Your application has been submitted for review. You will be notified of the decision.'
      })
    }
  }

  if (showNewApplicationForm && selectedApplication) {
    return (
      <FinanceApplicationForm
        application={selectedApplication}
        onSave={handleSaveApplication}
        onCancel={() => {
          setSelectedApplication(null)
          setShowNewApplicationForm(false)
        }}
        onSubmit={handleSubmitApplication}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Applications</h1>
            <p className="text-muted-foreground">
              Manage your {getApplicationLabel().toLowerCase()}s
            </p>
          </div>
          <Button onClick={handleCreateApplication}>
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </div>
      </div>

      {/* Application Status Overview */}
      {customerApplications.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold">{customerApplications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Review</p>
                  <p className="text-2xl font-bold">
                    {customerApplications.filter(app => 
                      ['submitted', 'under_review'].includes(app.status)
                    ).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">
                    {customerApplications.filter(app => 
                      ['approved', 'completed'].includes(app.status)
                    ).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Applications</CardTitle>
          <CardDescription>
            View and manage your finance applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerApplications.map((application) => {
              const progress = getApplicationProgress(application)
              
              return (
                <div
                  key={application.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(application.status)}
                        <div>
                          <h4 className="font-semibold">
                            {getApplicationLabel()} #{application.id.slice(-6).toUpperCase()}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(application.createdAt).toLocaleDateString()}
                            {application.submittedAt && (
                              <span> • Submitted {new Date(application.submittedAt).toLocaleDateString()}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {application.fraudCheckStatus && (
                          <Badge variant="outline">
                            IDV: {application.fraudCheckStatus.charAt(0).toUpperCase() + application.fraudCheckStatus.slice(1)}
                          </Badge>
                        )}
                      </div>
                      
                      {application.status === 'draft' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Completion Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}
                      
                      {application.notes && (
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-sm">{application.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplication(application)}
                      >
                        {application.status === 'draft' ? (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            Continue
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {customerApplications.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your first finance application
                </p>
                <Button onClick={handleCreateApplication}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Application
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Application Process</h4>
                <p className="text-sm text-muted-foreground">
                  Learn about our finance application process and requirements
                </p>
                <Button variant="outline" size="sm">
                  View Guide
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Contact Support</h4>
                <p className="text-sm text-muted-foreground">
                  Have questions? Our finance team is here to help
                </p>
                <Button variant="outline" size="sm">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}