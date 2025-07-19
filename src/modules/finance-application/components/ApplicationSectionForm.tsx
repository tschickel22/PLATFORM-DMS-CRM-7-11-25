import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ApplicationSection, ApplicationField } from '../types'
import { FileUploadSection } from './FileUploadSection'

interface ApplicationSectionFormProps {
  section: ApplicationSection
  data: Record<string, any>
  onChange: (data: Record<string, any>) => void
  validationErrors: Record<string, string>
  applicationId: string
}

export function ApplicationSectionForm({
  section,
  data,
  onChange,
  validationErrors,
  applicationId
}: ApplicationSectionFormProps) {
  const fields = section.fields.sort((a, b) => a.order - b.order)

  const handleFieldChange = (fieldId: string, value: any) => {
    onChange({
      ...data,
      [fieldId]: value
    })
  }

  const shouldShowField = (field: ApplicationField): boolean => {
    if (!field.conditionalLogic) return true
    
    const dependentValue = data[field.conditionalLogic.dependsOn]
    const condition = field.conditionalLogic.condition
    const expectedValue = field.conditionalLogic.value
    
    switch (condition) {
      case 'equals':
        return dependentValue === expectedValue
      case 'not_equals':
        return dependentValue !== expectedValue
      case 'contains':
        return dependentValue && dependentValue.includes(expectedValue)
      case 'greater_than':
        return Number(dependentValue) > Number(expectedValue)
      case 'less_than':
        return Number(dependentValue) < Number(expectedValue)
      default:
        return true
    }
  }

  const renderField = (field: ApplicationField) => {
    const fieldKey = `${section.id}.${field.id}`
    const hasError = validationErrors[fieldKey]
    const value = data[field.id] || ''

    if (!shouldShowField(field)) {
      return null
    }

    const commonProps = {
      id: field.id,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleFieldChange(field.id, e.target.value),
      placeholder: field.placeholder,
      className: hasError ? 'border-red-500' : ''
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            />
            {hasError && (
              <p className="text-sm text-red-500">{validationErrors[fieldKey]}</p>
            )}
          </div>
        )

      case 'number':
      case 'currency':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
              {field.type === 'currency' && (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
              )}
              <Input
                {...commonProps}
                type="number"
                className={`${hasError ? 'border-red-500' : ''} ${field.type === 'currency' ? 'pl-8' : ''}`}
                min={field.validation?.min}
                max={field.validation?.max}
                step={field.type === 'currency' ? '0.01' : '1'}
              />
            </div>
            {hasError && (
              <p className="text-sm text-red-500">{validationErrors[fieldKey]}</p>
            )}
          </div>
        )

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="date"
            />
            {hasError && (
              <p className="text-sm text-red-500">{validationErrors[fieldKey]}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(newValue) => handleFieldChange(field.id, newValue)}
            >
              <SelectTrigger className={hasError ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-sm text-red-500">{validationErrors[fieldKey]}</p>
            )}
          </div>
        )

      case 'radio':
        return (
          <div key={field.id} className="space-y-3">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${field.id}-${option}`}
                    name={field.id}
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`${field.id}-${option}`} className="font-normal">
                    {option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
            {hasError && (
              <p className="text-sm text-red-500">{validationErrors[fieldKey]}</p>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={value === true}
                onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
              />
              <Label htmlFor={field.id} className="font-normal">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {hasError && (
              <p className="text-sm text-red-500">{validationErrors[fieldKey]}</p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={hasError ? 'border-red-500' : ''}
              rows={4}
            />
            {hasError && (
              <p className="text-sm text-red-500">{validationErrors[fieldKey]}</p>
            )}
          </div>
        )

      case 'file':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <FileUploadSection
              fieldId={field.id}
              applicationId={applicationId}
              validation={field.validation}
              multiple={true}
            />
            {hasError && (
              <p className="text-sm text-red-500">{validationErrors[fieldKey]}</p>
            )}
          </div>
        )

      case 'signature':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">Electronic signature will be captured here</p>
              <Button variant="outline" type="button">
                Add Signature
              </Button>
            </div>
            {hasError && (
              <p className="text-sm text-red-500">{validationErrors[fieldKey]}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {fields.map(renderField)}
    </div>
  )
}