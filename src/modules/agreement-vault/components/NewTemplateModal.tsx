import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Upload, FileText, Trash2, AlertCircle } from 'lucide-react'
import { useTemplateManagement } from '../hooks/useTemplateManagement'
import { TemplateCategory, AgreementTemplate } from '../types/template'
import { FileProcessor } from '../utils/fileProcessor'
import { useToast } from '@/hooks/use-toast'

interface NewTemplateModalProps {
  onClose: () => void
  onSuccess: (template: AgreementTemplate) => void
}

export function NewTemplateModal({ onClose, onSuccess }: NewTemplateModalProps) {
  const { createTemplate, loading } = useTemplateManagement()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    category: TemplateCategory.PURCHASE,
    description: ''
  })
  const [files, setFiles] = useState<File[]>([])
  const [processingFiles, setProcessingFiles] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setErrors([])
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const newErrors = rejectedFiles.map(({ file, errors }) => 
        `${file.name}: ${errors.map((e: any) => e.message).join(', ')}`
      )
      setErrors(newErrors)
    }

    // Validate accepted files
    const validFiles: File[] = []
    const validationErrors: string[] = []

    acceptedFiles.forEach(file => {
      const validation = FileProcessor.validateFile(file)
      if (validation.valid) {
        validFiles.push(file)
      } else {
        validationErrors.push(`${file.name}: ${validation.error}`)
      }
    })

    if (validationErrors.length > 0) {
      setErrors(prev => [...prev, ...validationErrors])
    }

    setFiles(prev => [...prev, ...validFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Template name is required',
        variant: 'destructive'
      })
      return
    }

    if (files.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one file is required',
        variant: 'destructive'
      })
      return
    }

    setProcessingFiles(true)
    try {
      // Process all files
      const processedFiles = await Promise.all(
        files.map(file => FileProcessor.processFile(file))
      )

      // Create template
      const template = await createTemplate({
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim() || undefined,
        files: processedFiles
      })

      onSuccess(template)
    } catch (error) {
      console.error('Error creating template:', error)
      toast({
        title: 'Error',
        description: 'Failed to create template. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setProcessingFiles(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create New Template</CardTitle>
              <CardDescription>
                Upload documents and create a reusable agreement template
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Standard Purchase Agreement"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: TemplateCategory) => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TemplateCategory.PURCHASE}>Purchase Agreement</SelectItem>
                    <SelectItem value={TemplateCategory.LEASE}>Lease Agreement</SelectItem>
                    <SelectItem value={TemplateCategory.SERVICE}>Service Agreement</SelectItem>
                    <SelectItem value={TemplateCategory.WARRANTY}>Warranty Agreement</SelectItem>
                    <SelectItem value={TemplateCategory.CUSTOM}>Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description of this template..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <Label>Upload Documents *</Label>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF and DOCX files up to 10MB each
                  </p>
                </div>
              </div>

              {/* Error Messages */}
              {errors.length > 0 && (
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div key={index} className="flex items-center text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {error}
                    </div>
                  ))}
                </div>
              )}

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files ({files.length})</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)} • {file.type.includes('pdf') ? 'PDF' : 'DOCX'}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || processingFiles || files.length === 0}
              >
                {processingFiles ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Files...
                  </>
                ) : loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Template...
                  </>
                ) : (
                  'Create Template'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}