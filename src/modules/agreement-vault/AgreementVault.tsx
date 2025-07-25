import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Plus, Users, Clock, CheckCircle } from 'lucide-react'
import { useAgreementVault } from './hooks/useAgreementVault'
import { useToast } from '@/hooks/use-toast'

function AgreementVaultDashboard() {
  const { agreements, templates, signatures, loading, error } = useAgreementVault()
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'signed':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Agreement Vault</h1>
          <p className="ri-page-description">
            Manage agreements, contracts, and digital signatures
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">Error loading agreements: {error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Agreement Vault</h1>
            <p className="ri-page-description">
              Manage agreements, contracts, and digital signatures
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Agreement
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : agreements.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Active agreements'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Signatures</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : agreements.filter(a => a.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Awaiting signature'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signed This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : signatures.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Completed signatures'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : templates.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : 'Available templates'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Agreements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Agreements</CardTitle>
          <CardDescription>
            Latest agreement activity and status updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading agreements...</p>
            </div>
          )}
          
          <div className="space-y-4">
            {agreements.map((agreement) => (
              <div
                key={agreement.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{agreement.title}</h4>
                    <Badge className={getStatusColor(agreement.status)}>
                      {agreement.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Type: {agreement.type} • Created: {new Date(agreement.created_at || '').toLocaleDateString()}
                    {agreement.signed_at && (
                      <span> • Signed: {new Date(agreement.signed_at).toLocaleDateString()}</span>
                    )}
                  </div>
                  {agreement.notes && (
                    <p className="text-sm text-muted-foreground mt-1">{agreement.notes}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
            
            {!loading && agreements.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No agreements found</p>
                <p className="text-sm">Create your first agreement to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AgreementVault() {
  return (
    <Routes>
      <Route path="/" element={<AgreementVaultDashboard />} />
      <Route path="/*" element={<AgreementVaultDashboard />} />
    </Routes>
  )
}