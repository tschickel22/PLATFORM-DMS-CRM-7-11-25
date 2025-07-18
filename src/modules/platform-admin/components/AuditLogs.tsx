import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/utils'
import { mockPlatformAdmin } from '@/mocks/platformAdminMock'

export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterModule, setFilterModule] = useState('all')
  const [filterAction, setFilterAction] = useState('all')

  // Flatten audit logs from all sample tenants for demonstration
  // In a real app, this would come from an API with proper pagination
  const auditLogs = mockPlatformAdmin.sampleTenants.flatMap(tenant => 
    (tenant.auditTrail || []).map(log => ({
      ...log,
      tenantId: tenant.id,
      tenantName: tenant.name,
      timestamp: typeof log.timestamp === 'string' ? log.timestamp : log.timestamp.toISOString(),
      ipAddress: '192.168.1.100' // Mock IP for demo
    }))
  )

  // Get unique modules and actions from audit logs for filters
  const availableModules = [...new Set(auditLogs.map(log => log.module))].sort()
  const availableActions = [...new Set(auditLogs.map(log => log.action))].sort()

  // Filter logs based on search and filters
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesModule = filterModule === 'all' || log.module === filterModule
    const matchesAction = filterAction === 'all' || log.action === filterAction
    
    return matchesSearch && matchesModule && matchesAction
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                View system activity and audit trail across all tenants
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All modules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {availableModules.map(module => (
                  <SelectItem key={module} value={module}>
                    {module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {availableActions.map(action => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Tenant / User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {formatDateTime(new Date(log.timestamp))}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.tenantName}</div>
                        <div className="text-sm text-muted-foreground">{log.user}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.action}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{log.module}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.details}</TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {log.ipAddress || 'N/A'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No audit logs found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}