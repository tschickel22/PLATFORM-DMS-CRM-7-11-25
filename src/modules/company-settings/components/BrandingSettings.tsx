import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Palette, Upload, Image as ImageIcon, Save } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'
import { mockCompanySettings } from '@/mocks/companySettingsMock'
import { isColorLight } from '@/lib/utils'

export function BrandingSettings() {
  const { tenant, updateTenant } = useTenant()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [primaryColor, setPrimaryColor] = useState(tenant?.branding.primaryColor || mockCompanySettings.branding.primaryColor)
  const [secondaryColor, setSecondaryColor] = useState(tenant?.branding.secondaryColor || mockCompanySettings.branding.secondaryColor)
  const [fontFamily, setFontFamily] = useState(tenant?.branding.fontFamily || mockCompanySettings.branding.fontFamily)
  const [logoUrl, setLogoUrl] = useState(tenant?.branding.logo || mockCompanySettings.branding.logoUrl || '')
  const [sideMenuColor, setSideMenuColor] = useState(tenant?.branding.sideMenuColor || mockCompanySettings.branding.sideMenuColor || '')
  const [useDefaultSideMenuColor, setUseDefaultSideMenuColor] = useState(
    tenant?.branding.sideMenuColor === null || !tenant?.branding.sideMenuColor
  )
  const [logoPreview, setLogoPreview] = useState(tenant?.branding.logo || mockCompanySettings.branding.logoUrl || '')
  
  // Portal branding states
  const [portalName, setPortalName] = useState(tenant?.branding.portalName || mockCompanySettings.branding.portalName || '')
  const [portalLogoUrl, setPortalLogoUrl] = useState(tenant?.branding.portalLogo || mockCompanySettings.branding.portalLogo || '')
  const [portalLogoPreview, setPortalLogoPreview] = useState(tenant?.branding.portalLogo || mockCompanySettings.branding.portalLogo || '')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const portalLogoInputRef = useRef<HTMLInputElement>(null)
  
  const fontOptions = mockCompanySettings.branding.fontOptions

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload this file to a storage service
      // For this demo, we'll create an object URL
      const objectUrl = URL.createObjectURL(file)
      setLogoPreview(objectUrl)
      
      // In a real app, you would set the logoUrl to the URL returned from the storage service
      // For this demo, we'll just use the object URL
      setLogoUrl(objectUrl)
    }
  }

  const handlePortalLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload this file to a storage service
      // For this demo, we'll create an object URL
      const objectUrl = URL.createObjectURL(file)
      setPortalLogoPreview(objectUrl)
      
      // In a real app, you would set the portalLogoUrl to the URL returned from the storage service
      // For this demo, we'll just use the object URL
      setPortalLogoUrl(objectUrl)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateTenant({
        branding: {
          ...tenant?.branding,
          primaryColor,
          secondaryColor,
          fontFamily,
          logo: logoUrl,
          sideMenuColor: useDefaultSideMenuColor ? null : sideMenuColor,
          portalName,
          portalLogo: portalLogoUrl
        }
      })
      
      toast({
        title: 'Branding Updated',
        description: 'Your branding settings have been saved successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update branding settings.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-5 w-5 mr-2 text-primary" />
          Branding & Appearance
        </CardTitle>
        <CardDescription>
          Customize your dealership's visual identity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Logo Upload */}
        <div className="space-y-4">
          <Label>Company Logo</Label>
          <div className="flex items-center space-x-4">
            <div className="border rounded-md p-4 w-40 h-40 flex items-center justify-center bg-muted/30">
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Company Logo" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
              <Input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleLogoChange}
              />
              <p className="text-xs text-muted-foreground">
                Recommended size: 200x200px. Max file size: 2MB.
                <br />
                Supported formats: PNG, JPG, SVG
              </p>
            </div>
          </div>
        </div>

        {/* Portal Branding Section */}
        <div className="space-y-4 pt-6 border-t">
          <div>
            <h3 className="text-lg font-semibold mb-2">Client Portal Branding</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Customize the branding for your client-facing portal
            </p>
          </div>
          
          <div>
            <Label htmlFor="portalName">Portal Name</Label>
            <Input
              id="portalName"
              value={portalName}
              onChange={(e) => setPortalName(e.target.value)}
              placeholder="e.g., Customer Portal"
              className="shadow-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This name will appear in the portal header and browser title
            </p>
          </div>
          
          <div className="space-y-4">
            <Label>Portal Logo</Label>
            <div className="flex items-center space-x-4">
              <div className="border rounded-md p-4 w-40 h-40 flex items-center justify-center bg-muted/30">
                {portalLogoPreview ? (
                  <img 
                    src={portalLogoPreview} 
                    alt="Portal Logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => portalLogoInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Portal Logo
                </Button>
                <Input 
                  type="file" 
                  ref={portalLogoInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePortalLogoChange}
                />
                <p className="text-xs text-muted-foreground">
                  Portal-specific logo (optional). If not set, company logo will be used.
                  <br />
                  Recommended size: 200x200px. Max file size: 2MB.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Color Settings */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                type="color"
                id="primaryColor"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-16 h-10 shadow-sm"
              />
              <Input 
                value={primaryColor} 
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="shadow-sm" 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Used for buttons, links, and primary actions
            </p>
          </div>
          
          <div>
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                type="color"
                id="secondaryColor"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-16 h-10 shadow-sm"
              />
              <Input 
                value={secondaryColor} 
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="shadow-sm" 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Used for secondary elements and accents
            </p>
          </div>
        </div>

        {/* Font Settings */}
        <div>
          <Label htmlFor="fontFamily">Font Family</Label>
          <Select
            value={fontFamily}
            onValueChange={setFontFamily}
          >
            <SelectTrigger className="shadow-sm">
              <SelectValue placeholder="Select font family" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map(font => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            The primary font used throughout your application
          </p>
        </div>

        {/* Side Menu Color Settings */}
        <div>
          <Label htmlFor="sideMenuColor">Side Menu Color</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Input
              type="color"
              id="sideMenuColor"
              value={sideMenuColor}
              onChange={(e) => {
                setSideMenuColor(e.target.value)
                setUseDefaultSideMenuColor(false)
              }}
              className="w-16 h-10 shadow-sm"
              disabled={useDefaultSideMenuColor}
            />
            <Input 
              value={sideMenuColor} 
              onChange={(e) => {
                setSideMenuColor(e.target.value)
                setUseDefaultSideMenuColor(false)
              }}
              className="shadow-sm" 
              disabled={useDefaultSideMenuColor}
            />
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="useDefaultSideMenuColor"
              checked={useDefaultSideMenuColor}
              onCheckedChange={(checked) => setUseDefaultSideMenuColor(!!checked)}
            />
            <Label htmlFor="useDefaultSideMenuColor" className="font-normal">
              Use default theme color (matches primary site background)
            </Label>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            The background color for your application's side navigation menu
          </p>
        </div>

        {/* Preview */}
        <div className="border rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div 
            className="space-y-4 p-4 rounded-lg border"
            style={{
              fontFamily: fontFamily
            }}
          >
            <div className="space-y-2">
              <h4 className="font-semibold">Text Preview</h4>
              <p>This is how your text will appear with the selected font.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Color Preview</h4>
              <div className="flex space-x-4">
                <div 
                  className="w-20 h-10 rounded-md flex items-center justify-center text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  Primary
                </div>
                <div 
                  className="w-20 h-10 rounded-md flex items-center justify-center text-white"
                  style={{ backgroundColor: secondaryColor }}
                >
                  Secondary
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Button Preview</h4>
              <div className="flex space-x-4">
                <button 
                  className="px-4 py-2 rounded-md text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  Primary Button
                </button>
                <button 
                  className="px-4 py-2 rounded-md border"
                  style={{ borderColor: secondaryColor, color: secondaryColor }}
                >
                  Secondary Button
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Side Menu Preview</h4>
              <div 
                className="w-full h-20 rounded-md flex items-center justify-center text-sm"
                style={{ 
                  backgroundColor: useDefaultSideMenuColor ? 'var(--background)' : sideMenuColor,
                  color: useDefaultSideMenuColor 
                    ? 'var(--foreground)' 
                    : sideMenuColor && isColorLight(sideMenuColor)
                      ? 'var(--foreground)'
                      : 'white',
                  border: useDefaultSideMenuColor ? '1px dashed var(--border)' : 'none'
                }}
              >
                Side Menu Background
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Portal Preview</h4>
              <div className="border rounded-md p-4 bg-muted/20">
                <div className="flex items-center space-x-3 mb-2">
                  {portalLogoPreview && (
                    <img 
                      src={portalLogoPreview} 
                      alt="Portal Logo" 
                      className="w-8 h-8 object-contain"
                    />
                  )}
                  <h5 className="font-semibold">
                    {portalName || 'Customer Portal'}
                  </h5>
                </div>
                <p className="text-sm text-muted-foreground">
                  This is how your client portal header will appear
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Branding
              </>
            )}
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}