import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabaseClient'

interface Deal {
  id?: string
  customer_id?: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  vehicle_id?: string
  vehicle_info?: string
  stage: string
  amount?: number
  source?: string
  type?: string
  priority?: string
  rep_id?: string
  rep_name?: string
  probability?: number
  expected_close_date?: string
  notes?: string
}

interface DealFormProps {
  deal?: Deal
  onSave: (deal: Deal) => void
  onCancel: () => void
}

export function DealForm({ deal, onSave, onCancel }: DealFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Deal>({
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
    notes: '',
    ...deal
  })

  const dealStages = ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost']
  const dealSources = ['Walk-in', 'Online', 'Referral', 'Trade Show', 'Phone Call', 'Email Campaign']
  const dealTypes = ['New Sale', 'Trade-in', 'Lease', 'Financing']
  const priorities = ['Low', 'Medium', 'High', 'Urgent']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customer_name) {
      toast({
        title: 'Validation Error',
        description: 'Customer name is required',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      if (deal?.id) {
        // Update existing deal
        const { error } = await supabase
          .from('deals')
          .update({
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            customer_phone: formData.customer_phone,
            vehicle_info: formData.vehicle_info,
            stage: formData.stage,
            amount: formData.amount,
            source: formData.source,
            type: formData.type,
            priority: formData.priority,
            rep_name: formData.rep_name,
            probability: formData.probability,
            expected_close_date: formData.expected_close_date,
            notes: formData.notes
          })
          .eq('id', deal.id)

        if (error) throw error
      } else {
        // Create new deal
        const { data, error } = await supabase
          .from('deals')
          .insert([{
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            customer_phone: formData.customer_phone,
            vehicle_info: formData.vehicle_info,
            stage: formData.stage,
            amount: formData.amount,
            source: formData.source,
            type: formData.type,
            priority: formData.priority,
            rep_name: formData.rep_name,
            probability: formData.probability,
            expected_close_date: formData.expected_close_date,
            notes: formData.notes
          }])
          .select()
          .single()

        if (error) throw error
        formData.id = data.id
      }

      onSave(formData)
      toast({
        title: 'Success',
        description: `Deal ${deal?.id ? 'updated' : 'created'} successfully`
      })
    } catch (error) {
      console.error('Error saving deal:', error)
      toast({
        title: 'Error',
        description: `Failed to ${deal?.id ? 'update' : 'create'} deal`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{deal?.id ? 'Edit Deal' : 'New Deal'}</CardTitle>
        <CardDescription>
          {deal?.id ? 'Update deal information' : 'Create a new sales deal'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="customer_name">Customer Name *</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="customer_email">Customer Email</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email || ''}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="customer_phone">Customer Phone</Label>
              <Input
                id="customer_phone"
                value={formData.customer_phone || ''}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="vehicle_info">Vehicle Information</Label>
              <Input
                id="vehicle_info"
                value={formData.vehicle_info || ''}
                onChange={(e) => setFormData({ ...formData, vehicle_info: e.target.value })}
                placeholder="e.g., 2023 Forest River Cherokee"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="stage">Deal Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={(value) => setFormData({ ...formData, stage: value })}
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
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="source">Lead Source</Label>
              <Select
                value={formData.source || ''}
                onValueChange={(value) => setFormData({ ...formData, source: value })}
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
                value={formData.type || 'New Sale'}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority || 'Medium'}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
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
                value={formData.rep_name || ''}
                onChange={(e) => setFormData({ ...formData, rep_name: e.target.value })}
                placeholder="Assigned sales representative"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="probability">Probability (%)</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={formData.probability || ''}
                onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="expected_close_date">Expected Close Date</Label>
              <Input
                id="expected_close_date"
                type="date"
                value={formData.expected_close_date || ''}
                onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Additional notes about this deal..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {deal?.id ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {deal?.id ? 'Update Deal' : 'Create Deal'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default DealForm