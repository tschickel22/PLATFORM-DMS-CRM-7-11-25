import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Brain, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { DocumentField } from '../types'

interface DetectedField {
  id: string
  label: string
  type: 'text' | 'signature' | 'date' | 'checkbox' | 'dropdown'
  confidence: number
  position: { x: number; y: number; width: number; height: number }
  suggestedMergeField?: string
  reasoning: string
}

interface AIFieldDetectionProps {
  documentUrl: string
  onFieldsDetected: (fields: DocumentField[]) => void
  onClose: () => void
  existingFields: DocumentField[]
}

export function AIFieldDetection({ documentUrl, onFieldsDetected, onClose, existingFields }: AIFieldDetectionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detectedFields, setDetectedFields] = useState<DetectedField[]>([])
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set())
  const [showPreview, setShowPreview] = useState(true)
  const [analysisComplete, setAnalysisComplete] = useState(false)

  const handleAnalyzeDocument = async () => {
    setIsAnalyzing(true)
    
    try {
      // Simulate AI analysis with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock AI-detected fields with realistic positioning and confidence scores
      const mockDetectedFields: DetectedField[] = [
        {
          id: 'ai-field-1',
          label: 'Customer Name',
          type: 'text',
          confidence: 0.95,
          position: { x: 15, y: 25, width: 200, height: 30 },
          suggestedMergeField: 'customer_name',
          reasoning: 'Found text pattern "Name:" followed by blank line'
        },
        {
          id: 'ai-field-2',
          label: 'Customer Email',
          type: 'text',
          confidence: 0.88,
          position: { x: 15, y: 35, width: 250, height: 30 },
          suggestedMergeField: 'customer_email',
          reasoning: 'Detected email format placeholder with "@" symbol'
        },
        {
          id: 'ai-field-3',
          label: 'Vehicle Information',
          type: 'text',
          confidence: 0.92,
          position: { x: 15, y: 45, width: 300, height: 30 },
          suggestedMergeField: 'vehicle_info',
          reasoning: 'Found "Vehicle:" label with adjacent blank space'
        },
        {
          id: 'ai-field-4',
          label: 'Purchase Amount',
          type: 'text',
          confidence: 0.90,
          position: { x: 15, y: 55, width: 150, height: 30 },
          suggestedMergeField: 'total_amount',
          reasoning: 'Detected currency symbol "$" with blank field'
        },
        {
          id: 'ai-field-5',
          label: 'Customer Signature',
          type: 'signature',
          confidence: 0.97,
          position: { x: 15, y: 75, width: 200, height: 50 },
          suggestedMergeField: 'customer_signature',
          reasoning: 'Found "Signature:" label with signature line'
        },
        {
          id: 'ai-field-6',
          label: 'Agreement Date',
          type: 'date',
          confidence: 0.85,
          position: { x: 250, y: 75, width: 120, height: 30 },
          suggestedMergeField: 'effective_date',
          reasoning: 'Detected "Date:" label with date format placeholder'
        }
      ]
      
      setDetectedFields(mockDetectedFields)
      // Auto-select high confidence fields
      const highConfidenceFields = new Set(
        mockDetectedFields
          .filter(field => field.confidence > 0.9)
          .map(field => field.id)
      )
      setSelectedFields(highConfidenceFields)
      setAnalysisComplete(true)
      
    } catch (error) {
      console.error('AI analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleFieldSelection = (fieldId: string) => {
    const newSelection = new Set(selectedFields)
    if (newSelection.has(fieldId)) {
      newSelection.delete(fieldId)
    } else {
      newSelection.add(fieldId)
    }
    setSelectedFields(newSelection)
  }

  const handleApplyFields = () => {
    const selectedDetectedFields = detectedFields.filter(field => 
      selectedFields.has(field.id)
    )
    
    const newFields: DocumentField[] = selectedDetectedFields.map(field => ({
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: field.type,
      label: field.label,
      position: field.position,
      required: field.type === 'signature',
      mergeField: field.suggestedMergeField || '',
      defaultValue: '',
      options: field.type === 'dropdown' ? ['Option 1', 'Option 2'] : undefined
    }))
    
    onFieldsDetected([...existingFields, ...newFields])
    onClose()
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800'
    if (confidence >= 0.8) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'signature': return '✍️'
      case 'date': return '📅'
      case 'checkbox': return '☑️'
      case 'dropdown': return '📋'
      default: return '📝'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                AI Field Detection
              </CardTitle>
              <CardDescription>
                Automatically detect and map form fields in your document
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex gap-6">
          {/* Document Preview */}
          {showPreview && (
            <div className="flex-1 border rounded-lg bg-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-gray-600">Document Preview</p>
                  <p className="text-sm text-gray-500">AI-detected fields will be highlighted here</p>
                </div>
              </div>
              
              {/* Overlay detected fields */}
              {detectedFields.map(field => (
                <div
                  key={field.id}
                  className={`absolute border-2 rounded transition-all ${
                    selectedFields.has(field.id)
                      ? 'border-blue-500 bg-blue-100/30'
                      : 'border-gray-400 bg-gray-100/30'
                  }`}
                  style={{
                    left: `${field.position.x}%`,
                    top: `${field.position.y}%`,
                    width: `${field.position.width}px`,
                    height: `${field.position.height}px`
                  }}
                >
                  <div className="absolute -top-6 left-0 text-xs bg-white px-1 rounded border">
                    {getFieldTypeIcon(field.type)} {field.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Analysis Panel */}
          <div className="w-96 space-y-4">
            {!analysisComplete && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    {!isAnalyzing ? (
                      <>
                        <Brain className="h-12 w-12 mx-auto text-primary" />
                        <div>
                          <h3 className="font-semibold">Ready to Analyze</h3>
                          <p className="text-sm text-muted-foreground">
                            AI will scan your document and identify form fields automatically
                          </p>
                        </div>
                        <Button onClick={handleAnalyzeDocument} className="w-full">
                          <Brain className="h-4 w-4 mr-2" />
                          Analyze Document with AI
                        </Button>
                      </>
                    ) : (
                      <>
                        <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
                        <div>
                          <h3 className="font-semibold">Analyzing Document...</h3>
                          <p className="text-sm text-muted-foreground">
                            AI is scanning for form fields and signatures
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {analysisComplete && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      Analysis Complete
                    </CardTitle>
                    <CardDescription>
                      Found {detectedFields.length} potential form fields
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detected Fields</CardTitle>
                    <CardDescription>
                      Select the fields you want to add to your template
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {detectedFields.map(field => (
                      <div
                        key={field.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedFields.has(field.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleFieldSelection(field.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={selectedFields.has(field.id)}
                            onChange={() => toggleFieldSelection(field.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium">
                                {getFieldTypeIcon(field.type)} {field.label}
                              </span>
                              <Badge className={getConfidenceColor(field.confidence)}>
                                {Math.round(field.confidence * 100)}%
                              </Badge>
                            </div>
                            {field.suggestedMergeField && (
                              <div className="text-xs text-blue-600 mb-1">
                                → {field.suggestedMergeField}
                              </div>
                            )}
                            <p className="text-xs text-gray-600">
                              {field.reasoning}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleApplyFields}
                    disabled={selectedFields.size === 0}
                    className="flex-1"
                  >
                    Add {selectedFields.size} Fields
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}