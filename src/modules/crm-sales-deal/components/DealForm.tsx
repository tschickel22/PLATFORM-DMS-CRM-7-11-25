import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Save } from 'lucide-react'
import { useDealManagement, Deal } from '../hooks/useDealManagement'
import { useToast } from '@/hooks/use-toast'

interface DealFormProps {
  deal?: Deal
  onClose: () => void
  onSuccess?: (deal: Deal) => void
}

export function DealForm({ deal, onClose, onSuccess }: DealFormProps) {
  const { createDeal, updateDeal } = useDealManagement()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    vehicle_info: '',
    stage: 'New',
    amount: 0,
    source: '',
    type: 'New Sale',
    priority: 'Medium',
    rep_name: '',
    probability: 25,
    expected_close_date: '',
    notes: ''
  })

  // Initialize form with deal data if editing
  useEffect(() => {
    if (deal) {
      setFormData({
        customer_name: deal.customer_name || '',
        customer_email: deal.customer_email || '',
        customer_phone: deal.customer_phone || '',
        vehicle_info: deal.vehicle_info || '',
        stage: deal.stage || 'New',
        amount: deal.amount || 0,
        source: deal.source || '',
        type: deal.type || 'New Sale',
        priority: deal.priority || 'Medium',
        rep_name: deal.rep_name || '',
        probability: deal.probability || 25,
        expected_close_date: deal.expected_close_date || '',
        notes: deal.notes || ''
      })
    }
  }, [deal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customer_name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Customer name is required',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    
    try {
      let result
      if (deal) {
        result = await updateDeal(deal.id, formData)
        if (result && onSuccess) {
          onSuccess({ ...deal, ...formData })
        }
      } else {
        result = await createDeal(formData)
        if (result && onSuccess) {
          onSuccess(result)
        }
      }
      
      if (result) {
        onClose()
      }
    } catch (error) {
      console.error('Error saving deal:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const dealStages = ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost']
  const dealSources = ['Walk-in', 'Online', 'Referral', 'Trade Show', 'Phone Call', 'Email Campaign']
  const dealTypes = ['New Sale', 'Trade-in', 'Lease', 'Financing']
  const priorities = ['Low', 'Medium', 'High', 'Urgent']

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{deal ? 'Edit Deal' : 'New Deal'}</CardTitle>
              <CardDescription>
                {deal ? 'Update deal information' : 'Create a new sales deal'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="customer_name">Customer Name *</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => handleInputChange('customer_name', e.target.value)}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customer_email">Email</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => handleInputChange('customer_email', e.target.value)}
                    placeholder="customer@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="customer_phone">Phone</Label>
                  <Input
                    id="customer_phone"
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle_info">Vehicle/Home Info</Label>
                  <Input
                    id="vehicle_info"
                    value={formData.vehicle_info}
                    onChange={(e) => handleInputChange('vehicle_info', e.target.value)}
                    placeholder="2024 Forest River Cherokee"
                  />
                </div>
              </div>
            </div>

            {/* Deal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Deal Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="stage">Stage</Label>
                  <Select
                    value={formData.stage}
                    onValueChange={(value) => handleInputChange('stage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dealStages.map(stage => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Deal Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => handleInputChange('source', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {dealSources.map(source => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dealTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange('priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rep_name">Sales Rep</Label>
                  <Input
                    id="rep_name"
                    value={formData.rep_name}
                    onChange={(e) => handleInputChange('rep_name', e.target.value)}
                    placeholder="Enter sales rep name"
                  />
                </div>
                <div>
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    value={formData.probability}
                    onChange={(e) => handleInputChange('probability', parseInt(e.target.value) || 0)}
                    placeholder="25"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="expected_close_date">Expected Close Date</Label>
                  <Input
                    id="expected_close_date"
                    type="date"
                    value={formData.expected_close_date}
                    onChange={(e) => handleInputChange('expected_close_date', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any additional notes about this deal..."
                rows={4}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {deal ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {deal ? 'Update Deal' : 'Create Deal'}
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

export default DealForm