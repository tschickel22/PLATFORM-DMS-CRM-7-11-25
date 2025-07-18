import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, Save, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { mockPlatformAdmin } from '@/mocks/platformAdminMock'
import { mockPlatformAdmin } from '@/mocks/platformAdminMock'

interface AddTenantFormProps {
  onClose: () => void
}

export function AddTenantForm({ onClose }: AddTenantFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [tenantName, setTenantName] = useState('')
  const [domain, setDomain] = useState('')
  const [platformType, setPlatformType] = useState(mockPlatformAdmin.platformTypes[0].value)
  const [adminEmail, setAdminEmail] = useState('')
    platformType: mockPlatformAdmin.platformTypes[0].value,
    timezone: 'America/New_York', // Keep as reasonable default
    currency: 'USD', // Keep as reasonable default
  // Initialize selected features with default permissions
  React.useEffect(() => {
    setSelectedFeatures(Object.keys(mockPlatformAdmin.defaultPermissions).reduce((acc, key) => {
      acc[key] = mockPlatformAdmin.defaultPermissions[key].read
      return acc
    }, {} as Record<string, boolean>))
  }, [])

  const availableFeatures = Object.keys(mockPlatformAdmin.defaultPermissions).map(key => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
  }))

  const handleFeatureToggle = (featureKey: string) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [featureKey]: !prev[featureKey]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tenantName || !domain || !adminEmail || !adminName) {
      toast({
        title: 'Validation Error',
        description: 'All fields are required',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: 'Success',
        description: 'Tenant created successfully',
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create tenant',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
              value={mockPlatformAdmin.subscriptionPlans[1].id}
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                Add New Tenant
              </CardTitle>
              <CardDescription>
                {mockPlatformAdmin.platformTypes.map(type => (
                {mockPlatformAdmin.subscriptionPlans.map(plan => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - ${plan.price}/month
                  </SelectItem>
                ))}
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tenant Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tenant Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="tenantName">Tenant Name *</Label>
                  <Input
                    id="tenantName"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="e.g., Sunshine RV Dealership"
                    className="shadow-sm"
                  />
                </div>
                
                <div>
                  <Label htmlFor="domain">Domain *</Label>
                  <Input
                    id="domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g., sunshine-rv"
                    className="shadow-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Will create: {domain || 'your-domain'}.renterinsight.com
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="platformType">Platform Type *</Label>
                <Select value={platformType} onValueChange={setPlatformType}>
                  <SelectTrigger className="shadow-sm">
                    <SelectValue placeholder="Select platform type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPlatformAdmin.platformTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Admin User */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Admin User</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="adminName">Admin Name *</Label>
                  <Input
                    id="adminName"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="e.g., John Smith"
                    className="shadow-sm"
                  />
                </div>
                
                <div>
                  <Label htmlFor="adminEmail">Admin Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="e.g., admin@sunshine-rv.com"
                    className="shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Enabled Features</h3>
              
              <div className="grid gap-3 md:grid-cols-2">
                {availableFeatures.map(feature => (
                  <div key={feature.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature.key}`}
                      checked={selectedFeatures[feature.key] || false}
                      onCheckedChange={() => handleFeatureToggle(feature.key)}
                    />
                    <Label htmlFor={`feature-${feature.key}`} className="text-sm">
                      {feature.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Tenant
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}