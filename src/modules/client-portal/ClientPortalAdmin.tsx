import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

function ClientPortalAdminDashboard() {
  const [filteredUsers, setFilteredUsers] = useState([])
  
  const getStatusBadgeColor = (status) => {
    return ''
  }
  
  const handleProxyAsClient = (id, email) => {
    
  }
  
  return (
    <div>
      <Tabs>
        <TabsContent>
          <Card>
            <CardContent>
              {/* Portal Users from Mock Data */}
              {filteredUsers.map((user) => {
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                const lastLogin = new Date(user.updatedAt).toLocaleDateString('en-US', {
                  month: 'numeric',
                  day: 'numeric',
                  year: 'numeric'
                })
                
                return (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">{initials}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.phone} • Last login: {lastLogin}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusBadgeColor(user.status)}>
                        {user.status.toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reset Password
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleProxyAsClient(user.id, user.email)}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Proxy as Client
                      </Button>
                    </div>
                  </div>
                )
              })}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No users found matching your search</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ClientAgreements() {
  return <div>Client Agreements</div>
}

function ClientAgreementSign() {
  return <div>Client Agreement Sign</div>
}

export default function ClientPortalAdmin() {
  return (
    <Routes>
      <Route path="/" element={<ClientPortalAdminDashboard />} />
      <Route path="/agreements" element={<ClientAgreements />} />
      <Route path="/agreements/:agreementId/sign" element={<ClientAgreementSign />} />
      <Route path="/*" element={<ClientPortalAdminDashboard />} />
    </Routes>
  )
}