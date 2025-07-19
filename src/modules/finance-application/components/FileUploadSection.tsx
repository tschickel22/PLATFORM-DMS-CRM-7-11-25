import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, File, X, Eye } from 'lucide-react'
import { useFinanceApplications } from '../hooks/useFinanceApplications'
import { FieldValidation, UploadedFile } from '../types'
import { useToast } from '@/hooks/use-toast'

interface FileUploadSectionProps {
  fieldId: string
  applicationId: string
  validation?: FieldValidation
  multiple?: boolean
}

export function FileUploadSection({
  fieldId,
  applicationId,
  validation,
  multiple = false
}: FileUploadSectionProps) {
  const { getApplicationById, uploadFile, removeFile } = useFinanceApplications()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const application = getApplicationById(applicationId)
  const fieldFiles = application?.uploadedFiles.filter(file => file.fieldId === fieldId) || []

  const validateFile = (file: File): string | null => {
    if (validation?.maxFileSize && file.size > validation.maxFileSize) {
      const maxSizeMB = Math.round(validation.maxFileSize / 1024 / 1024)
      return `File size must be less than ${maxSizeMB}MB`
    }

    if (validation?.fileTypes) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      if (fileExtension && !validation.fileTypes.includes(fileExtension)) {
        return `File type must be one of: ${validation.fileTypes.join(', ')}`
      }
    }

    return null
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setUploading(true)

    try {
      for (const file of files) {
        const validationError = validateFile(file)
        if (validationError) {
          toast({
            title: 'File Validation Error',
            description: `${file.name}: ${validationError}`,
            variant: 'destructive'
          })
          continue
        }

        await uploadFile(applicationId, fieldId, file)
      }

      toast({
        title: 'Files Uploaded',
        description: `${files.length} file(s) uploaded successfully`
      })
    } catch (error) {
      toast({
        title: 'Upload Error',
        description: 'Failed to upload files. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveFile = (fileId: string) => {
    removeFile(applicationId, fileId)
    toast({
      title: 'File Removed',
      description: 'File has been removed successfully'
    })
  }

  const handlePreviewFile = (file: UploadedFile) => {
    // In a real app, this would open a proper file viewer
    window.open(file.url, '_blank')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    return <File className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
        <div className="text-center">
          <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {multiple ? 'Drop files here or click to browse' : 'Drop file here or click to browse'}
            </p>
            {validation?.fileTypes && (
              <p className="text-xs text-muted-foreground">
                Accepted formats: {validation.fileTypes.join(', ').toUpperCase()}
              </p>
            )}
            {validation?.maxFileSize && (
              <p className="text-xs text-muted-foreground">
                Max file size: {Math.round(validation.maxFileSize / 1024 / 1024)}MB
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Choose {multiple ? 'Files' : 'File'}
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple={multiple}
            accept={validation?.fileTypes?.map(type => `.${type}`).join(',')}
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Uploaded Files */}
      {fieldFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          <div className="space-y-2">
            {fieldFiles.map((file) => (
              <Card key={file.id}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.name)}
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreviewFile(file)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}