import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ReportType } from '@/types'
import { Search, Download, Filter, Eye, FileText, Calendar, ArrowUp, ArrowDown } from 'lucide-react'
import { mockReportingSuite } from '@/mocks/reportingSuiteMock'
import { useTenant } from '@/contexts/TenantContext'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table'

interface ReportDisplayTableProps {
  reportType: ReportType
  reportName: string
  data: any[]
  columns: ReportColumn[]
  onExportCSV: () => void
}

interface ReportColumn {
  key: string
  label: string
  type?: 'text' | 'number' | 'currency' | 'date' | 'boolean'
}

export function ReportDisplayTable({ 
  reportType, 
  reportName, 
  data, 
  columns, 
  onExportCSV 
}: ReportDisplayTableProps) {
  const { tenant } = useTenant()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Use provided data or fall back to mock sample reports
  const sampleReports = data || [
    {
      id: 'rpt-001',
      name: 'Monthly Sales Summary',
      type: 'finance-summary',
      category: 'Finance',
      generatedAt: '2024-01-20T10:30:00Z',
      generatedBy: 'John Smith',
      format: 'PDF',
      size: '2.4 MB',
      status: 'Completed'
    },
    {
      id: 'rpt-002', 
      name: 'Inventory Status Report',
      type: 'inventory-status',
      category: 'Inventory',
      generatedAt: '2024-01-19T14:15:00Z',
      generatedBy: 'Sarah Johnson',
      format: 'Excel',
      size: '1.8 MB',
      status: 'Completed'
    },
    {
      id: 'rpt-003',
      name: 'Quote Conversion Analysis',
      type: 'quote-conversions',
      category: 'Sales',
      generatedAt: '2024-01-18T09:45:00Z',
      generatedBy: 'Mike Davis',
      format: 'PDF',
      size: '3.1 MB',
      status: 'Completed'
    },
    {
      id: 'rpt-004',
      name: 'Service Performance Review',
      type: 'service-performance',
      category: 'Service',
      generatedAt: '2024-01-17T16:20:00Z',
      generatedBy: 'Lisa Chen',
      format: 'CSV',
      size: '0.9 MB',
      status: 'Processing'
    }
  ]
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  // Filter data based on search term
  const filteredData = data.filter(row => {
    return Object.values(row).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Sort data based on sort field and direction
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0
    
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (aValue === undefined || bValue === undefined) return 0
    
    // Handle different types of values
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc' 
        ? aValue.getTime() - bValue.getTime() 
        : bValue.getTime() - aValue.getTime()
    }
    
    // Default string comparison
    const aString = aValue.toString().toLowerCase()
    const bString = bValue.toString().toLowerCase()
    
    return sortDirection === 'asc' 
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString)
  })

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage)
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const formatCellValue = (value: any, type?: string) => {
    if (value === null || value === undefined) return '-'
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value)
      case 'number':
        return new Intl.NumberFormat('en-US').format(value)
      case 'date':
        return new Date(value).toLocaleDateString()
      case 'boolean':
        return value ? 'Yes' : 'No'
      default:
        return value.toString()
    }
  }

  // Get available categories from mock data
  const categories = ['All', ...mockReportingSuite.reportCategories.filter(cat => cat !== 'All')]
  
  // Filter reports based on search term and category
  const filteredReports = sampleReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf': return <FileText className="h-4 w-4" />
      case 'excel': return <FileText className="h-4 w-4" />
      case 'csv': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getReportTypeName = (type: string) => {
    const report = mockReportingSuite.availableReports.find(r => r.id === type)
    return report?.name || type
  }

  const handleDownload = (reportId: string) => {
    // In a real application, this would trigger a download
    console.log('Downloading report:', reportId)
  }

  const handleView = (reportId: string) => {
    // In a real application, this would open the report viewer
    console.log('Viewing report:', reportId)
  }

  const handleSchedule = (reportId: string) => {
    // In a real application, this would open the scheduling modal
    console.log('Scheduling report:', reportId)
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{reportName}</CardTitle>
            <CardDescription>
              {data.length} records found
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search results..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex space-x-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Generated By</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>{getReportTypeName(report.type)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.category}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(report.generatedAt)}</TableCell>
                    <TableCell>{report.generatedBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getFormatIcon(report.format)}
                        <span>{report.format}</span>
                      </div>
                    </TableCell>
                    <TableCell>{report.size}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(report.id)}
                          disabled={report.status !== 'Completed'}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(report.id)}
                          disabled={report.status !== 'Completed'}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSchedule(report.id)}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    {searchTerm || selectedCategory !== 'All' 
                      ? 'No reports match your search criteria'
                      : 'No reports generated yet'
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredReports.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredReports.length} of {sampleReports.length} reports
            </p>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}