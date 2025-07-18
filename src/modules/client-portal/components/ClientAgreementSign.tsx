import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { FileText, Pen, Type, Check, ArrowLeft } from 'lucide-react'
import { Agreement } from '@/types'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { mockAgreements } from '@/mocks/agreementsMock'
import { formatDate, formatDateTime } from '@/lib/utils'
import { sendSignatureRequest } from '@/modules/agreement-vault/utils/sendSignatureRequest'

export function ClientAgreementSign() {
  const { agreementId } = useParams<{ agreementId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { tenant } = useTenant()
  const { toast } = useToast()
  
  // Get client ID from impersonation or session
  const impersonateClientId = searchParams.get('impersonateClientId')
  const currentClientId = impersonateClientId || 'current-client-id'
  
  // Canvas ref for drawn signature
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  
  // State
  const [agreement, setAgreement] = useState<Agreement | null>(null)
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [signatureType, setSignatureType] = useState<'typed' | 'drawn'>('typed')
  const [typedSignature, setTypedSignature] = useState('')
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false)
  
  // Load agreement
  useEffect(() => {
    const allAgreements = tenant?.agreements || mockAgreements.sampleAgreements
    const foundAgreement = allAgreements.find(a => 
      a.id === agreementId && a.customerId === currentClientId
    )
    
    if (foundAgreement) {
      setAgreement(foundAgreement)
    }
    setLoading(false)
  }, [agreementId, currentClientId, tenant])
  
  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineTo(x, y)
      ctx.stroke()
      setHasDrawnSignature(true)
    }
  }
  
  const stopDrawing = () => {
    setIsDrawing(false)
  }
  
  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setHasDrawnSignature(false)
    }
  }
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }, [])
  
  const getSignatureData = (): string => {
    if (signatureType === 'typed') {
      // Create SVG for typed signature
      return `data:image/svg+xml;base64,${btoa(`
        <svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
          <text x="10" y="50" font-family="cursive" font-size="24" fill="black">${typedSignature}</text>
        </svg>
      `)}`
    } else {
      // Get canvas data
      const canvas = canvasRef.current
      return canvas ? canvas.toDataURL() : ''
    }
  }
  
  const handleSign = async () => {
    if (!agreement) return
    
    // Validate signature
    const hasSignature = signatureType === 'typed' 
      ? typedSignature.trim().length > 0 
      : hasDrawnSignature
    
    if (!hasSignature) {
      toast({
        title: 'Signature Required',
        description: 'Please provide your signature before submitting.',
        variant: 'destructive'
      })
      return
    }
    
    setSigning(true)
    
    try {
      // Get client IP (in real app, this would be done server-side)
      const ipAddress = '192.168.1.100' // Mock IP
      
      // Update agreement with signature data
      const signedAgreement: Agreement = {
        ...agreement,
        status: 'SIGNED',
        signedBy: agreement.customerName || 'Customer',
        signedAt: new Date().toISOString(),
        ipAddress,
        signatureData: getSignatureData()
      }
      
      // In real app, this would be an API call
      console.log('Signing agreement:', signedAgreement)
      
      // Send confirmation email/SMS using platform settings
      try {
        await sendSignatureRequest({
          agreementId: agreement.id,
          customerEmail: agreement.customerEmail || '',
          customerPhone: agreement.customerPhone || '',
          customerName: agreement.customerName || '',
          agreementType: agreement.type,
          vehicleInfo: agreement.vehicleInfo || '',
          effectiveDate: agreement.effectiveDate,
          isConfirmation: true // This is a confirmation, not a signature request
        })
      } catch (emailError) {
        console.warn('Failed to send confirmation email:', emailError)
        // Don't fail the signing process if email fails
      }
      
      toast({
        title: 'Agreement Signed Successfully',
        description: 'Your agreement has been signed and a confirmation has been sent to your email.',
      })
      
      // Redirect back to agreements list
      setTimeout(() => {
        navigate('/portal/agreements')
      }, 2000)
      
    } catch (error) {
      console.error('Error signing agreement:', error)
      toast({
        title: 'Signing Failed',
        description: 'There was an error signing your agreement. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setSigning(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (!agreement) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Agreement Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The requested agreement could not be found or you don't have access to it.
          </p>
          <Button onClick={() => navigate('/portal/agreements')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Agreements
          </Button>
        </div>
      </div>
    )
  }
  
  if (agreement.status !== 'PENDING') {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Agreement Already Processed</h3>
          <p className="text-muted-foreground mb-4">
            This agreement has already been {agreement.status.toLowerCase()} and cannot be modified.
          </p>
          <Button onClick={() => navigate('/portal/agreements')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Agreements
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sign Agreement</h1>
          <p className="text-muted-foreground">
            Review and sign your {agreement.type.replace('_', ' ').toLowerCase()} agreement
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/portal/agreements')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Agreements
        </Button>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Agreement Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Agreement Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div>
                <Label className="text-sm font-medium">Agreement Type</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">{agreement.type.replace('_', ' ')}</Badge>
                </div>
              </div>
              
              {agreement.vehicleInfo && (
                <div>
                  <Label className="text-sm font-medium">Vehicle</Label>
                  <p className="text-sm text-muted-foreground mt-1">{agreement.vehicleInfo}</p>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium">Effective Date</Label>
                <p className="text-sm text-muted-foreground mt-1">{formatDate(agreement.effectiveDate)}</p>
              </div>
              
              {agreement.expirationDate && (
                <div>
                  <Label className="text-sm font-medium">Expiration Date</Label>
                  <p className="text-sm text-muted-foreground mt-1">{formatDate(agreement.expirationDate)}</p>
                </div>
              )}
              
              {agreement.totalAmount && (
                <div>
                  <Label className="text-sm font-medium">Total Amount</Label>
                  <p className="text-sm text-muted-foreground mt-1">${agreement.totalAmount.toLocaleString()}</p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium">Terms & Conditions</Label>
              <div className="mt-2 p-3 bg-muted/30 rounded-md text-sm">
                {agreement.terms || 'Standard terms and conditions apply.'}
              </div>
            </div>
            
            {agreement.documents && agreement.documents.length > 0 && (
              <>
                <Separator />
                <div>
                  <Label className="text-sm font-medium">Documents</Label>
                  <div className="mt-2 space-y-2">
                    {agreement.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Signature Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Pen className="h-5 w-5 mr-2" />
              Electronic Signature
            </CardTitle>
            <CardDescription>
              Please provide your signature to complete this agreement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={signatureType} onValueChange={(value) => setSignatureType(value as 'typed' | 'drawn')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="typed" className="flex items-center">
                  <Type className="h-4 w-4 mr-2" />
                  Type Signature
                </TabsTrigger>
                <TabsTrigger value="drawn" className="flex items-center">
                  <Pen className="h-4 w-4 mr-2" />
                  Draw Signature
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="typed" className="space-y-4">
                <div>
                  <Label htmlFor="typedSignature">Type your full name</Label>
                  <Input
                    id="typedSignature"
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1 font-cursive text-lg"
                    style={{ fontFamily: 'cursive' }}
                  />
                </div>
                {typedSignature && (
                  <div className="p-4 border rounded-md bg-muted/30">
                    <Label className="text-sm font-medium">Preview:</Label>
                    <div className="mt-2 text-2xl font-cursive" style={{ fontFamily: 'cursive' }}>
                      {typedSignature}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="drawn" className="space-y-4">
                <div>
                  <Label>Draw your signature</Label>
                  <div className="mt-2 border rounded-md">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={150}
                      className="w-full cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm" onClick={clearCanvas}>
                      Clear Signature
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>By signing this agreement, you acknowledge that:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>You have read and understood all terms and conditions</li>
                  <li>You agree to be legally bound by this agreement</li>
                  <li>Your electronic signature has the same legal effect as a handwritten signature</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleSign} 
                disabled={signing || (signatureType === 'typed' ? !typedSignature.trim() : !hasDrawnSignature)}
                className="w-full"
                size="lg"
              >
                {signing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing Agreement...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Sign Agreement
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}