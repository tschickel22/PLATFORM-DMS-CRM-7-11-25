import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Search, Plus, Edit, RotateCcw, Settings, Eye } from 'lucide-react'
import { mockUsers } from '@/mocks/usersMock'
import { ClientAgreements } from './components/ClientAgreements'

function ClientPortalAdminPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // Use shared mock users data
  const users = mockUsers.sampleUsers

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
  }

  const handleEditUser = (userId: string) => {
    console.log('Edit user:', userId)
    // TODO: Implement edit user functionality
  }

  const handleResetPassword = (userEmail: string) => {
    console.log('Reset password for:', userEmail)
    // TODO: Implement password reset functionality
  }

  const handleProxyAsClient = (user: any) => {
    // Open client portal in new tab with impersonation parameter
    const portalUrl = `/portalclient/?impersonateClientId=${user.id}`
    window.open(portalUrl, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Client Portal Admin</h1>
            <p className="ri-page-description">
              Manage client portal access and settings
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter(u => u.status === 'Active').length} active users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((users.filter(u => u.status === 'Active').length / users.length) * 100)}% active rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portal Features</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Available modules
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portal Users</CardTitle>
              <CardDescription>
                Manage client portal access and user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="ri-search-bar mb-6">
                <Search className="ri-search-icon" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ri-search-input"
                />
              </div>

              {/* Users List */}
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="ri-table-row">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {getInitials(user.name)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {user.email} • {user.phone} • Last login: {new Date(user.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {user.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResetPassword(user.email)}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset Password
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProxyAsClient(user)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Proxy as Client
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredUsers.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    {users.length === 0 ? (
                      <>
                        <p>No portal users found</p>
                        <p className="text-sm">Users will appear here once they're added to the system</p>
                      </>
                    ) : (
                      <>
                        <p>No users found matching your search</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agreements" className="space-y-4">
          <ClientAgreements />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portal Settings</CardTitle>
              <CardDescription>
                Configure client portal features and appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Portal Features</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Loan Management</h4>
                        <p className="text-sm text-muted-foreground">Allow clients to view loan details and payment history</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Agreement Signing</h4>
                        <p className="text-sm text-muted-foreground">Enable electronic signature capabilities</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Service Requests</h4>
                        <p className="text-sm text-muted-foreground">Allow clients to submit service requests</p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Document Library</h4>
                        <p className="text-sm text-muted-foreground">Provide access to important documents</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Appearance</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Portal Theme</label>
                      <div className="mt-1">
                        <select className="w-full p-2 border rounded-md">
                          <option>Light Theme</option>
                          <option>Dark Theme</option>
                          <option>Auto (System)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Brand Color</label>
                      <div className="mt-1 flex items-center space-x-2">
                        <input type="color" value="#3b82f6" className="w-12 h-10 border rounded" />
                        <span className="text-sm text-muted-foreground">#3b82f6</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ClientPortalAdmin() {
  return (
    <Routes>
      <Route path="/" element={<ClientPortalAdminPage />} />
      <Route path="/*" element={<ClientPortalAdminPage />} />
    </Routes>
  )
}