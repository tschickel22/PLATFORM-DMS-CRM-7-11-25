import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Save, Send, FileText } from 'lucide-react'
import { FinanceApplication, ApplicationTemplate, ApplicationData } from '../types'
import { useFinanceApplications } from '../hooks/useFinanceApplications'
import { ApplicationSectionForm } from './ApplicationSectionForm'
import { useTenant } from '@/contexts/TenantContext'

interface FinanceApplicationFormProps {
  application: FinanceApplication
  onSave: (data: Partial<FinanceApplication>) => void
  onCancel: () => void
  onSubmit: (data: Partial<FinanceApplication>) => void
}

export function FinanceApplicationForm({ 
  application, 
  onSave, 
  onCancel, 
  onSubmit 
}: FinanceApplicationFormProps) {
  const { tenant } = useTenant()
  const { getTemplateById } = useFinanceApplications()
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [formData, setFormData] = useState<ApplicationData>(application.data || {})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const template = getTemplateById(application.templateId)
  
  if (!template) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Template not found</p>
        <Button onClick={onCancel} className="mt-4">Go Back</Button>
      </div>
    )
  }

  const sections = template.sections.sort((a, b) => a.order - b.order)
  const currentSection = sections[currentSectionIndex]
  const progress = ((currentSectionIndex + 1) / sections.length) * 100

  // Get platform-specific labels
  const getApplicationLabel = () => {
    const platformType = tenant?.settings?.platformType || 'mh'
    const labelOverrides = tenant?.settings?.labelOverrides || {}
    
    if (labelOverrides['finance.application']) {
      return labelOverrides['finance.application']
    }
    
    switch (platformType) {
      case 'rv':
        return 'RV Loan Application'
      case 'auto':
        return 'Auto Loan Application'
      case 'mh':
      default:
        return 'MH Finance Application'
    }
  }

  const handleSectionDataChange = (sectionId: string, sectionData: Record<string, any>) => {
    const updatedData = {
      ...formData,
      [sectionId]: {
        ...formData[sectionId],
        ...sectionData
      }
    }
    setFormData(updatedData)
  }

  const validateCurrentSection = (): boolean => {
    const errors: Record<string, string> = {}
    const sectionData = formData[currentSection.id] || {}
    
    currentSection.fields.forEach(field => {
      if (field.required && !sectionData[field.id]) {
        errors[`${currentSection.id}.${field.id}`] = `${field.label} is required`
      }
      
      // Additional validation based on field type
      if (sectionData[field.id] && field.validation) {
        const value = sectionData[field.id]
        const validation = field.validation
        
        if (validation.minLength && value.length < validation.minLength) {
          errors[`${currentSection.id}.${field.id}`] = `${field.label} must be at least ${validation.minLength} characters`
        }
        
        if (validation.maxLength && value.length > validation.maxLength) {
          errors[`${currentSection.id}.${field.id}`] = `${field.label} must be no more than ${validation.maxLength} characters`
        }
        
        if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
          errors[`${currentSection.id}.${field.id}`] = `${field.label} format is invalid`
        }
        
        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors[`${currentSection.id}.${field.id}`] = 'Please enter a valid email address'
        }
      }
    })
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (validateCurrentSection()) {
      if (currentSectionIndex < sections.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1)
    }
  }

  const handleSave = () => {
    onSave({
      data: formData,
      status: 'draft'
    })
  }

  const handleSubmit = async () => {
    // Validate all sections
    let allValid = true
    const allErrors: Record<string, string> = {}
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      const sectionData = formData[section.id] || {}
      
      section.fields.forEach(field => {
        if (field.required && !sectionData[field.id]) {
          allErrors[`${section.id}.${field.id}`] = `${field.label} is required`
          allValid = false
        }
      })
    }
    
    if (!allValid) {
      setValidationErrors(allErrors)
      // Find first section with errors and navigate to it
      const firstErrorSection = sections.findIndex(section => 
        Object.keys(allErrors).some(key => key.startsWith(section.id))
      )
      if (firstErrorSection !== -1) {
        setCurrentSectionIndex(firstErrorSection)
      }
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onSubmit({
      data: formData,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    })
    
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{getApplicationLabel()}</h1>
            <p className="text-muted-foreground">
              {application.customerName || 'New Application'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {application.status.replace('_', ' ').toUpperCase()}
          </Badge>
          {application.fraudCheckStatus && (
            <Badge variant="secondary">
              IDV: {application.fraudCheckStatus.charAt(0).toUpperCase() + application.fraudCheckStatus.slice(1)}
            </Badge>
          )}
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentSectionIndex + 1} of {sections.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {currentSection.title}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Section Form */}
      <Card>
        <CardHeader>
          <CardTitle>{currentSection.title}</CardTitle>
          {currentSection.description && (
            <CardDescription>{currentSection.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <ApplicationSectionForm
            section={currentSection}
            data={formData[currentSection.id] || {}}
            onChange={(data) => handleSectionDataChange(currentSection.id, data)}
            validationErrors={validationErrors}
            applicationId={application.id}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentSectionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          
          {currentSectionIndex === sections.length - 1 ? (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}