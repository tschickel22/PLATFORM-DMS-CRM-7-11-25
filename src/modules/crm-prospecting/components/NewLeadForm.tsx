import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Save, User } from 'lucide-react'
import { CRMContact } from '@/types'
import { useContacts } from '@/hooks/useCrmSupabase'
import { useToast } from '@/hooks/use-toast'

interface NewLeadFormProps {
  onClose: () => void
  onSuccess: (contact: CRMContact) => void
  embedded?: boolean
}

export function NewLeadForm({ lead, onClose, onSuccess, embedded = false }: NewLeadFormProps) {
  const { createContact } = useContacts()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<CRMContact>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    source: '',
    status: 'new',
    assignedTo: '',
    notes: '',
    custom_fields: {}
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast({
        title: 'Validation Error',
        description: 'First name and last name are required',
      })
      return
    }

    setLoading(true)
    try {
      const newContact = await createContact(formData)
      if (newContact) {
        onSuccess(newContact)
        onClose()
      }
    } finally {
      setLoading(false)
    }
  }

  // If embedded, render without modal wrapper
  if (embedded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{lead ? 'Edit Lead' : 'New Lead'}</CardTitle>
          <CardDescription>
            {lead ? 'Update lead information' : 'Add a new lead to your CRM'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderFormFields()}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {lead ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {lead ? 'Update Lead' : 'Create Lead'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  const renderFormFields = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            required
          />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="source">Lead Source</Label>
          <Select 
            value={formData.source} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="phone">Phone Call</SelectItem>
              <SelectItem value="walk_in">Walk-in</SelectItem>
              <SelectItem value="trade_show">Trade Show</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="advertising">Advertising</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="closed_won">Closed Won</SelectItem>
              <SelectItem value="closed_lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Input
          id="assignedTo"
          value={formData.assignedTo}
          onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
          placeholder="Sales rep name"
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Add any notes about this lead..."
          rows={3}
        />
      </div>
    </>
  )

  const leadSources = ['Walk-In', 'Referral', 'Website', 'Phone Call', 'Social Media', 'Trade Show']
  const leadStatuses = ['new', 'contacted', 'qualified', 'lost', 'converted']

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>New Lead</CardTitle>
                <CardDescription>
                  Add a new lead to your CRM
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
            {renderFormFields()}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
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
                    Create Lead
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

export default NewLeadForm