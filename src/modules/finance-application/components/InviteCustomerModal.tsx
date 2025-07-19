import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { X, Send, Plus, Search } from 'lucide-react'
import { CustomerInvite } from '../types'
import { useToast } from '@/hooks/use-toast'
import { useFinanceApplications } from '../hooks/useFinanceApplications'

interface InviteCustomerModalProps {
  onClose: () => void
  onInvite: (customer: CustomerInvite, templateId: string) => void
}

export function InviteCustomerModal({ onClose, onInvite }: InviteCustomerModalProps) {
  const { toast } = useToast()
  const { templates } = useFinanceApplications()
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInvite | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    templates.find(t => t.isActive)?.id || templates[0]?.id || ''
  )
  const [newCustomer, setNewCustomer] = useState<CustomerInvite>({
    name: '',
    email: '',
    phone: '',
    source: 'manual'
  })
  const [customMessage, setCustomMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock existing customers - in real app, this would come from CRM
  const existingCustomers: CustomerInvite[] = [
    {
      id: 'cust-001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      source: 'website'
    },
    {
      id: 'cust-002',
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@email.com',
      phone: '(555) 987-6543',
      source: 'referral'
    },
    {
      id: 'cust-003',
      name: 'David Johnson',
      email: 'david.johnson@email.com',
      phone: '(555) 456-7890',
      source: 'trade_show'
    }
  ]

  const filteredCustomers = existingCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInviteExisting = async () => {
    if (!selectedCustomer) {
      toast({
        title: 'Selection Required',
        description: 'Please select a customer to invite',
        variant: 'destructive'
      })
      return
    }

    if (!selectedTemplateId) {
      toast({
        title: 'Template Required',
        description: 'Please select an application template',
        variant: 'destructive'
      })
      return
    }
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onInvite(selectedCustomer, selectedTemplateId)
    setIsLoading(false)
  }

  const handleInviteNew = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast({
        title: 'Required Fields',
        description: 'Please fill in name and email address',
        variant: 'destructive'
      })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      })
      return
    }

    if (!selectedTemplateId) {
      toast({
        title: 'Template Required',
        description: 'Please select an application template',
        variant: 'destructive'
      })
      return
    }
    setIsLoading(true)
    
    // Simulate API call to create customer and send invite
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onInvite({
      ...newCustomer,
      id: `cust-${Date.now()}`
    }, selectedTemplateId)
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invite Customer to Complete Application</CardTitle>
              <CardDescription>
                Send a finance application invitation to a customer
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div>
            <Label htmlFor="template">Application Template *</Label>
            <Select
              value={selectedTemplateId}
              onValueChange={setSelectedTemplateId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select application template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Choose which application template the customer will complete
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('existing')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'existing'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Existing Customer
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'new'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              New Customer
            </button>
          </div>

          {/* Existing Customer Tab */}
          {activeTab === 'existing' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Search Customers</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCustomer?.id === customer.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{customer.name}</h4>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                        {customer.phone && (
                          <p className="text-sm text-muted-foreground">{customer.phone}</p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {customer.source?.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredCustomers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No customers found</p>
                    <p className="text-sm">Try adjusting your search or add a new customer</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* New Customer Tab */}
          {activeTab === 'new' && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="source">Lead Source</Label>
                  <Select
                    value={newCustomer.source}
                    onValueChange={(value) => setNewCustomer({ ...newCustomer, source: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Entry</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="trade_show">Trade Show</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="walk_in">Walk-in</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Custom Message */}
          <div>
            <Label htmlFor="message">Custom Message (Optional)</Label>
            <Textarea
              id="message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a personal message to the invitation email..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={activeTab === 'existing' ? handleInviteExisting : handleInviteNew}
              disabled={isLoading || (activeTab === 'existing' && !selectedCustomer) || !selectedTemplateId}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </>
              )}

              {/* Customer Edit Form */}
              {selectedCustomer && (
                <div className="space-y-4 mt-6 p-4 border rounded-lg bg-muted/20">
                  <h4 className="font-medium">Edit Customer Information</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="editName">Full Name *</Label>
                      <Input
                        id="editName"
                        value={selectedCustomer.name}
                        onChange={(e) => setSelectedCustomer({
                          ...selectedCustomer,
                          name: e.target.value
                        })}
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editEmail">Email Address *</Label>
                      <Input
                        id="editEmail"
                        type="email"
                        value={selectedCustomer.email}
                        onChange={(e) => setSelectedCustomer({
                          ...selectedCustomer,
                          email: e.target.value
                        })}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="editPhone">Phone Number</Label>
                    <Input
                      id="editPhone"
                      type="tel"
                      value={selectedCustomer.phone || ''}
                      onChange={(e) => setSelectedCustomer({
                        ...selectedCustomer,
                        phone: e.target.value
                      })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}