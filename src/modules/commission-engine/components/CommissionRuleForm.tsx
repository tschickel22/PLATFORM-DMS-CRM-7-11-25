import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { X, Save, Plus, Trash2, DollarSign, Percent } from 'lucide-react'
import { CommissionRule, FlatCommissionRule, PercentageCommissionRule, TieredCommissionRule, CommissionTier } from '../types'
import { useToast } from '@/hooks/use-toast'
import { mockCommissionEngine } from '@/mocks/commissionEngineMock'

interface CommissionRuleFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function CommissionRuleForm({ onSubmit, onCancel }: CommissionRuleFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: mockCommissionEngine.defaultSettings.commissionType,
    rate: mockCommissionEngine.defaultSettings.rate,
    criteria: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create Commission Rule</CardTitle>
              <CardDescription>
                Define a new commission calculation rule
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter rule name"
              />
            </div>

            <div>
              <Label htmlFor="type">Rule Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rule type" />
                </SelectTrigger>
                <SelectContent>
                  {mockCommissionEngine.ruleTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rate">Commission Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                value={formData.rate * 100}
                onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) / 100 })}
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="criteria">Criteria</Label>
              <Input
                id="criteria"
                value={formData.criteria}
                onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                placeholder="Enter criteria"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}