import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Edit, ExternalLink, MoreHorizontal, Mail, Phone, Calendar, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-01-15T10:30:00Z',
    department: 'IT',
    joinDate: '2023-06-15',
    permissions: ['read', 'write', 'admin']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 234-5678',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2024-01-14T15:45:00Z',
    department: 'Sales',
    joinDate: '2023-03-20',
    permissions: ['read', 'write']
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    phone: '+1 (555) 345-6789',
    role: 'User',
    status: 'Inactive',
    lastLogin: '2024-01-10T09:15:00Z',
    department: 'Marketing',
interface PortalAdminUserListProps {
    permissions: ['read']
  }
]

interface PortalAdminUserListProps {
  onImpersonate: (userId: string, userName: string) => void
}

export function PortalAdminUserList({ onImpersonate }: PortalAdminUserListProps) {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const { toast } = useToast()

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  const handleImpersonate = (user: typeof mockUsers[0]) => {
    onImpersonate(user.id, user.name)
    toast({
      title: "Impersonation Started",
      description: `You are now viewing as ${user.name}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'user':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        <Button>
          Add New User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.department}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge className={cn("text-xs", getStatusColor(user.status))}>
                      {user.status}
                    </Badge>
                    <Badge className={cn("text-xs", getRoleColor(user.role))}>
                      {user.role}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Last login: {new Date(user.lastLogin).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImpersonate(user)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Impersonate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}