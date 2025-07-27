import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Eye, Edit, Filter } from 'lucide-react'
import { PdiChecklist } from '@/types'

interface PDIInspectionListProps {
  inspections: PdiChecklist[]
  statusColors: Record<string, string>
  onCreateInspection: () => void
  onViewInspection: (inspection: PdiChecklist) => void
  onEditInspection: (inspection: PdiChecklist) => void
  loading?: boolean
}

export function PDIInspectionList({
  inspections,
  statusColors,
  onCreateInspection,
  onViewInspection,
  onEditInspection,
  loading = false
}: PDIInspectionListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Get unique statuses from inspections for filter dropdown
  const availableStatuses = Array.from(new Set(inspections.map(inspection => inspection.status)))

  // Filter inspections based on search and status
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = !searchQuery || 
      inspection.vehicle_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.technician.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading inspections...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>PDI Inspections</CardTitle>
            <CardDescription>
              Manage pre-delivery inspections and quality checks
            </CardDescription>
          </div>
          <Button onClick={onCreateInspection}>
            <Plus className="h-4 w-4 mr-2" />
            New Inspection
          </Button>
        </div>
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
              {availableStatuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Inspections List */}
        <div className="space-y-4">
          {filteredInspections.length > 0 ? (
            filteredInspections.map((inspection) => (
              <div
                key={inspection.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">
                      Vehicle ID: {inspection.vehicle_id}
                    </h4>
                    <Badge className={statusColors[inspection.status] || 'bg-gray-100 text-gray-800'}>
                      {inspection.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Technician: {inspection.technician} • 
                    Created: {new Date(inspection.created_at).toLocaleDateString()} •
                    Updated: {new Date(inspection.updated_at).toLocaleDateString()}
                  </div>
                  {inspection.checklist_data && inspection.checklist_data.length > 0 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Checklist items: {inspection.checklist_data.length}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewInspection(inspection)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditInspection(inspection)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              {searchQuery || statusFilter !== 'all' ? (
                <>
                  <p>No inspections found matching your criteria</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </>
              ) : (
                <>
                  <p>No PDI inspections found</p>
                  <p className="text-sm">Create your first inspection to get started</p>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}