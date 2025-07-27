import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Save, X, Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CommissionRule {
  id: string
  name: string
  type: string
  rate: number
  criteria?: string
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

interface CommissionRuleFormProps {
  rules: CommissionRule[]
  onSave: (rule: Partial<CommissionRule>) => void
  onCancel: () => void
  editingRule?: CommissionRule | null
  loading?: boolean
}

export function CommissionRuleForm({
  rules,
  onSave,
  onCancel,
  editingRule = null,
  loading = false
}: CommissionRuleFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: editingRule?.name || '',
    type: editingRule?.type || 'Percentage',
    rate: editingRule?.rate || 0,
    criteria: editingRule?.criteria || '',
    description: editingRule?.description || '',
    isActive: editingRule?.isActive !== undefined ? editingRule.isActive : true
  })

  const ruleTypes = [
    { value: 'Percentage', label: 'Percentage' },
    { value: 'Flat', label: 'Flat Amount' },
    { value: 'Tiered', label: 'Tiered' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Rule name is required',
        variant: 'destructive'
      })
      return
    }

    if (formData.rate <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Rate must be greater than 0',
        variant: 'destructive'
      })
      return
    }

    // Check for duplicate rule names (excluding current rule if editing)
    const duplicateRule = rules.find(rule => 
      rule.name.toLowerCase() === formData.name.toLowerCase() && 
      rule.id !== editingRule?.id
    )
    
    if (duplicateRule) {
      toast({
        title: 'Validation Error',
        description: 'A rule with this name already exists',
        variant: 'destructive'
      })
      return
    }

    onSave({
      id: editingRule?.id,
      name: formData.name.trim(),
      type: formData.type,
      rate: formData.rate,
      criteria: formData.criteria.trim(),
      description: formData.description.trim(),
      isActive: formData.isActive
    })
  }

  const handleRateChange = (value: string) => {
    const numericValue = parseFloat(value)
    if (!isNaN(numericValue)) {
      setFormData(prev => ({ ...prev, rate: numericValue }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {editingRule ? 'Edit Commission Rule' : 'Create Commission Rule'}
            </CardTitle>
            <CardDescription>
              {editingRule 
                ? 'Update the commission rule configuration'
                : 'Create a new commission calculation rule'
              }
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rule Name */}
          <div>
            <Label htmlFor="ruleName">Rule Name *</Label>
            <Input
              id="ruleName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter rule name (e.g., '5% on RV Sales')"
              required
            />
          </div>

          {/* Rule Type and Rate */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="ruleType">Commission Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select commission type" />
                </SelectTrigger>
                <SelectContent>
                  {ruleTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="rate">
                Rate * {formData.type === 'Percentage' ? '(%)' : '($)'}
              </Label>
              <Input
                id="rate"
                type="number"
                step={formData.type === 'Percentage' ? '0.01' : '1'}
                min="0"
                value={formData.rate}
                onChange={(e) => handleRateChange(e.target.value)}
                placeholder={formData.type === 'Percentage' ? '5.00' : '1000'}
                required
              />
            </div>
          </div>

          {/* Criteria */}
          <div>
            <Label htmlFor="criteria">Criteria (Optional)</Label>
            <Input
              id="criteria"
              value={formData.criteria}
              onChange={(e) => setFormData(prev => ({ ...prev, criteria: e.target.value }))}
              placeholder="e.g., vehicle.type === 'RV' && sale.amount > 50000"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Define conditions when this rule applies (leave empty for all sales)
            </p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe when and how this commission rule is applied"
              rows={3}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
            />
            <Label htmlFor="isActive">Active Rule</Label>
            <p className="text-sm text-muted-foreground">
              Only active rules will be used for commission calculations
            </p>
          </div>

          {/* Preview */}
          {formData.name && formData.rate > 0 && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Rule Preview</h4>
              <p className="text-sm">
                <strong>{formData.name}</strong> - 
                {formData.type === 'Percentage' 
                  ? ` ${formData.rate}% commission`
                  : ` $${formData.rate} flat commission`
                }
                {formData.criteria && (
                  <span className="block mt-1 text-muted-foreground">
                    Applies when: {formData.criteria}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingRule ? 'Update Rule' : 'Create Rule'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}