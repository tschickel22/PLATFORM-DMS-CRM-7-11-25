import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, Eye, Edit, CheckCircle, XCircle, Clock } from 'lucide-react'
import { mockPDI } from '@/mocks/pdiMock'
import { formatDate } from '@/lib/utils'

interface PDIInspectionListProps {
  onNewInspection: () => void
  onViewInspection: (id: string) => void
  onEditInspection: (id: string) => void
}

export function PDIInspectionList({ onNewInspection, onViewInspection, onEditInspection }: PDIInspectionListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [technicianFilter, setTechnicianFilter] = useState('all')

  // Use mock data as fallback - in real app, fetch from API
  const inspections = mockPDI.sampleInspections

  const getStatusColor = (status: string) => {
    return mockPDI.statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'In Progress': return <Clock className="h-4 w-4 text-blue-600" />
      case 'Failed': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = inspection.unitInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.stockNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.technicianName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter
    const matchesTechnician = technicianFilter === 'all' || inspection.technicianId === technicianFilter
    
    return matchesSearch && matchesStatus && matchesTechnician
  })

  const calculateProgress = (inspection: any) => {
    if (!inspection.findings || inspection.findings.length === 0) return 0
    const completedItems = inspection.findings.filter((f: any) => f.status === 'Pass' || f.status === 'Fail').length
    return Math.round((completedItems / inspection.findings.length) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PDI Inspections</h1>
          <p className="text-muted-foreground">
            Manage pre-delivery inspections for RVs and vehicles
          </p>
        </div>
        <Button onClick={onNewInspection}>
          <Plus className="mr-2 h-4 w-4" />
          New Inspection
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inspection List</CardTitle>
          <CardDescription>
            View and manage all PDI inspections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inspections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {mockPDI.checklistStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All technicians" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technicians</SelectItem>
                {mockPDI.technicianOptions.map(tech => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit Info</TableHead>
                <TableHead>Stock #</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium">{inspection.unitInfo}</TableCell>
                  <TableCell>{inspection.stockNumber}</TableCell>
                  <TableCell>{inspection.technicianName}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(inspection.status)}
                      <Badge className={getStatusColor(inspection.status)}>
                        {inspection.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{calculateProgress(inspection)}% Complete</div>
                  </TableCell>
                  <TableCell>{formatDate(inspection.startedDate)}</TableCell>
                  <TableCell>
                    {inspection.completedDate ? formatDate(inspection.completedDate) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewInspection(inspection.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditInspection(inspection.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredInspections.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No inspections found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}