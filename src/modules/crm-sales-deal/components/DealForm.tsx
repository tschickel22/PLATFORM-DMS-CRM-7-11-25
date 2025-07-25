import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Save } from 'lucide-react'
import { useDeals } from '@/hooks/useCrmSupabase'
import { useToast } from '@/hooks/use-toast'

interface DealFormProps {
  deal?: any
  onClose: () => void
  onSuccess?: (deal: any) => void
}

export function DealForm({ deal, onClose, onSuccess }: DealFormProps) {
  const { createDeal, updateDeal } = useDeals()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicleInfo: '',
    stage: 'New',
    amount: 0,
    source: '',
    type: 'New Sale',
    priority: 'Medium',
    repName: '',
    probability: 25,
    expectedCloseDate: '',
    notes: ''
  })

  // Initialize form with deal data if editing
  useEffect(() => {
    if (deal) {
      setFormData({
        customerName: deal.customer_name || '',
        customerEmail: deal.customer_email || '',
        customerPhone: deal.customer_phone || '',
        vehicleInfo: deal.vehicle_info || '',
        stage: deal.stage || 'New',
        amount: deal.amount || 0,
        source: deal.source || '',
        type: deal.type || 'New Sale',
        priority: deal.priority || 'Medium',
        repName: deal.rep_name || '',
        probability: deal.probability || 25,
        expectedCloseDate: deal.expected_close_date || '',
        notes: deal.notes || ''
      })
    }
  }, [deal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerName) {
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
      } else {
        result = await createDeal(formData)
      }
      
      toast({
        title: 'Success',
        description: `Deal ${deal ? 'updated' : 'created'} successfully`
      })
      
      onSuccess?.(result)
      onClose()
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setLoading(false)
    }
  }

  const dealStages = ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost']
  const dealSources = ['Walk-in', 'Online', 'Referral', 'Trade Show', 'Phone Call', 'Email Campaign']
  const dealTypes = ['New Sale', 'Trade-in', 'Lease', 'Financing']
  const priorities = ['Low', 'Medium', 'High', 'Urgent']

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
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
        <CardContent className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleInfo">Vehicle/Home Info</Label>
                  <Input
                    id="vehicleInfo"
                    value={formData.vehicleInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleInfo: e.target.value }))}
                    placeholder="e.g., 2023 Forest River Cherokee"
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
                    onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
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
                  <Label htmlFor="type">Deal Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
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
                    onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
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
                  <Label htmlFor="repName">Sales Rep</Label>
                  <Input
                    id="repName"
                    value={formData.repName}
                    onChange={(e) => setFormData(prev => ({ ...prev, repName: e.target.value }))}
                    placeholder="Enter sales rep name"
                  />
                </div>
                <div>
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    value={formData.probability}
                    onChange={(e) => setFormData(prev => ({ ...prev, probability: Number(e.target.value) }))}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                  <Input
                    id="expectedCloseDate"
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
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