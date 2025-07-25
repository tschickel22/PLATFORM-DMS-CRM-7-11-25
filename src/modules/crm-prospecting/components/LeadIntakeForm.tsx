import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { X, Save } from 'lucide-react'

interface LeadIntakeFormProps {
  onClose: () => void
  onSuccess: (lead: CRMContact) => void
  onSuccess?: (lead: Lead) => void
}

export function LeadIntakeFormBuilder({ onClose, onSuccess }: LeadIntakeFormProps) {
  const { createContact } = useContacts()
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
        first_name: formData.firstName,
        last_name: formData.lastName,
      })
      return
    }

    setLoading(true)
    try {
      const newContact = await createContact({
      onSuccess(newContact)
    } catch (error) {
      console.error('Error creating contact:', error)
      toast({
        title: 'Error',
        description: 'Failed to create contact. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
        status: 'new',
        assigned_to: formData.assignedTo || undefined
      })
      onSuccess(newContact)
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  const leadSources = ['Walk-In', 'Referral', 'Website', 'Phone Call', 'Social Media', 'Trade Show']
  const leadStatuses = ['new', 'contacted', 'qualified', 'lost', 'converted']

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>New Lead</CardTitle>
              <CardDescription>
                Add a new lead to your CRM
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Enter last name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div>
              <Label htmlFor="source">Source</Label>
              <Select
                value={formData.source}
                onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead source" />
                </SelectTrigger>
                <SelectContent>
                  {leadSources.map(source => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                placeholder="Enter sales rep name"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes about this lead..."
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
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