import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, Eye, Edit, DollarSign } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Commission {
  id: string
  repId: string
  repName?: string
  amount: number
  period: string
  ruleId: string
  ruleName?: string
  saleAmount?: number
  status: string
  createdAt: string
  updatedAt: string
}

interface CommissionListProps {
  commissions: Commission[]
  statusColors: Record<string, string>
  onCreateCommission: () => void
  onViewCommission: (commission: Commission) => void
  onEditCommission: (commission: Commission) => void
  loading?: boolean
}

export function CommissionList({
  commissions,
  statusColors,
  onCreateCommission,
  onViewCommission,
  onEditCommission,
  loading = false
}: CommissionListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')

  // Get unique statuses and periods from commissions for filter dropdowns
  const availableStatuses = Array.from(new Set(commissions.map(commission => commission.status)))
  const availablePeriods = Array.from(new Set(commissions.map(commission => commission.period)))

  // Filter commissions based on search and filters
  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = !searchQuery || 
      commission.repName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commission.ruleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commission.period.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter
    const matchesPeriod = periodFilter === 'all' || commission.period === periodFilter
    
    return matchesSearch && matchesStatus && matchesPeriod
  })

  // Calculate totals
  const totalCommissions = filteredCommissions.reduce((sum, commission) => sum + commission.amount, 0)
  const paidCommissions = filteredCommissions
    .filter(commission => commission.status === 'Paid')
    .reduce((sum, commission) => sum + commission.amount, 0)

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading commissions...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Commission Tracking</CardTitle>
            <CardDescription>
              Track and manage sales commission payments
            </CardDescription>
          </div>
          <Button onClick={onCreateCommission}>
            <Plus className="h-4 w-4 mr-2" />
            New Commission
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Commissions</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalCommissions)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paid Commissions</p>
                  <p className="text-2xl font-bold">{formatCurrency(paidCommissions)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Commissions</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalCommissions - paidCommissions)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by rep name, rule, or period"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
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
          <Select
            value={periodFilter}
            onValueChange={setPeriodFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              {availablePeriods.map(period => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Commissions Table */}
        {filteredCommissions.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sales Rep</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Commission Amount</TableHead>
                  <TableHead>Sale Amount</TableHead>
                  <TableHead>Rule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell className="font-medium">
                      {commission.repName || commission.repId}
                    </TableCell>
                    <TableCell>{commission.period}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(commission.amount)}
                    </TableCell>
                    <TableCell>
                      {commission.saleAmount ? formatCurrency(commission.saleAmount) : '-'}
                    </TableCell>
                    <TableCell>
                      {commission.ruleName || commission.ruleId}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[commission.status] || 'bg-gray-100 text-gray-800'}>
                        {commission.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(commission.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewCommission(commission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditCommission(commission)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            {searchQuery || statusFilter !== 'all' || periodFilter !== 'all' ? (
              <>
                <p>No commissions found matching your criteria</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </>
            ) : (
              <>
                <p>No commissions found</p>
                <p className="text-sm">Commission records will appear here when they are created</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}