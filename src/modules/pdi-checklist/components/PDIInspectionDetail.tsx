import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, Clock, User, Calendar, FileText, Camera } from 'lucide-react'
import { mockPDI } from '@/mocks/pdiMock'
import { formatDate } from '@/lib/utils'

interface PDIInspectionDetailProps {
  inspectionId: string
  onEdit?: () => void
  onApprove?: () => void
}

export function PDIInspectionDetail({ inspectionId, onEdit, onApprove }: PDIInspectionDetailProps) {
  // Use mock data as fallback - in real app, fetch by inspectionId
  const inspection = mockPDI.sampleInspections.find(insp => insp.id === inspectionId) || mockPDI.sampleInspections[0]

  const getStatusColor = (status: string) => {
    return mockPDI.statusColors[status] || mockPDI.findingStatusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const calculateProgress = () => {
    const totalItems = inspection.findings.length
    const completedItems = inspection.findings.filter(f => f.status !== 'Pending').length
    return Math.round((completedItems / totalItems) * 100)
  }

  // Group findings by category using mock categories
  const groupedFindings = inspection.findings.reduce((acc: any, finding: any) => {
    if (!acc[finding.category]) {
      acc[finding.category] = []
    }
    acc[finding.category].push(finding)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">PDI Inspection Report</h1>
          <p className="text-muted-foreground">{inspection.unitInfo}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(inspection.status)}>
            {inspection.status}
          </Badge>
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onApprove && inspection.status === 'Complete' && (
            <Button onClick={onApprove}>
              Approve for Delivery
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Technician</p>
                <p className="text-sm text-muted-foreground">{inspection.technicianName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-sm text-muted-foreground">
                  {inspection.completedDate ? formatDate(inspection.completedDate) : 'In Progress'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Template</p>
                <p className="text-sm text-muted-foreground">{inspection.templateName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Progress</p>
                <div className="flex items-center space-x-2">
                  <Progress value={calculateProgress()} className="w-16" />
                  <span className="text-sm text-muted-foreground">{calculateProgress()}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Unit Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock Number:</span>
                  <span className="font-medium">{inspection.stockNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VIN:</span>
                  <span className="font-medium">{inspection.vin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Started:</span>
                  <span className="font-medium">{formatDate(inspection.startedDate)}</span>
                </div>
                {inspection.completedDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="font-medium">{formatDate(inspection.completedDate)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inspection Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Items:</span>
                  <span className="font-medium">{inspection.findings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Passed:</span>
                  <span className="font-medium text-green-600">
                    {inspection.findings.filter(f => f.status === 'Pass').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Failed:</span>
                  <span className="font-medium text-red-600">
                    {inspection.findings.filter(f => f.status === 'Fail').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Notified:</span>
                  <span className="font-medium">
                    {inspection.customerNotified ? 'Yes' : 'No'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="checklist" className="space-y-4">
          {mockPDI.inspectionCategories.map(category => {
            const categoryFindings = groupedFindings[category.name] || []
            return (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryFindings.map((finding: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{finding.item}</span>
                            <Badge className={getStatusColor(finding.status)}>
                              {finding.status}
                            </Badge>
                          </div>
                          {finding.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{finding.notes}</p>
                          )}
                        </div>
                        <div className="ml-4">
                          {finding.status === 'Pass' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : finding.status === 'Fail' ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-600" />
                          )}
                        </div>
                      </div>
                    ))}
                    {categoryFindings.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No items inspected in this category
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overall Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {inspection.overallNotes || 'No additional notes provided.'}
              </p>
            </CardContent>
          </Card>

          {inspection.findings.filter(f => f.notes).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Item-Specific Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {inspection.findings
                  .filter(f => f.notes)
                  .map((finding, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{finding.item}</span>
                        <Badge className={getStatusColor(finding.status)}>
                          {finding.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{finding.notes}</p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}