import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Bell, Shield, Mail, Phone, Save } from 'lucide-react'
import { usePortal } from '@/contexts/PortalContext'
import { useToast } from '@/hooks/use-toast'

export function ClientSettings() {
  const { getDisplayName, getDisplayEmail } = usePortal()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: getDisplayName(),
    email: getDisplayEmail(),
    phone: '(555) 123-4567',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345'
  })
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    agreementUpdates: true,
    serviceUpdates: true,
    marketingEmails: false
  })
  
  // Communication preferences
  const [communication, setCommunication] = useState({
    preferredMethod: 'email',
    language: 'en',
    timezone: 'America/New_York'
  })

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been saved successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Preferences Updated',
        description: 'Your notification preferences have been saved.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update preferences. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={profileData.state}
                    onValueChange={(value) => setProfileData({ ...profileData, state: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={profileData.zipCode}
                    onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Communication Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Communication Preferences</CardTitle>
              <CardDescription>
                Choose how you'd like to receive communications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="preferredMethod">Preferred Contact Method</Label>
                  <Select
                    value={communication.preferredMethod}
                    onValueChange={(value) => setCommunication({ ...communication, preferredMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="sms">Text Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={communication.timezone}
                    onValueChange={(value) => setCommunication({ ...communication, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose which notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emailNotifications"
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({
                        ...notifications,
                        emailNotifications: !!checked
                      })}
                    />
                    <Label htmlFor="emailNotifications" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smsNotifications"
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => setNotifications({
                        ...notifications,
                        smsNotifications: !!checked
                      })}
                    />
                    <Label htmlFor="smsNotifications" className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      SMS notifications
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="paymentReminders"
                      checked={notifications.paymentReminders}
                      onCheckedChange={(checked) => setNotifications({
                        ...notifications,
                        paymentReminders: !!checked
                      })}
                    />
                    <Label htmlFor="paymentReminders">Payment reminders and due dates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreementUpdates"
                      checked={notifications.agreementUpdates}
                      onCheckedChange={(checked) => setNotifications({
                        ...notifications,
                        agreementUpdates: !!checked
                      })}
                    />
                    <Label htmlFor="agreementUpdates">Agreement status updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="serviceUpdates"
                      checked={notifications.serviceUpdates}
                      onCheckedChange={(checked) => setNotifications({
                        ...notifications,
                        serviceUpdates: !!checked
                      })}
                    />
                    <Label htmlFor="serviceUpdates">Service appointment updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketingEmails"
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => setNotifications({
                        ...notifications,
                        marketingEmails: !!checked
                      })}
                    />
                    <Label htmlFor="marketingEmails">Marketing emails and promotions</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Password</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button variant="outline">
                    Update Password
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">SMS Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Receive verification codes via text message
                    </p>
                  </div>
                  <Button variant="outline">
                    Enable
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Privacy</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dataSharing" />
                    <Label htmlFor="dataSharing">
                      Allow data sharing for service improvements
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="analytics" />
                    <Label htmlFor="analytics">
                      Enable usage analytics
                    </Label>
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