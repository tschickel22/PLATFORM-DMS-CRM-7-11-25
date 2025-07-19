import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, FileText, Users } from 'lucide-react'

interface ApplicationTypeSelectionModalProps {
  onClose: () => void
  onSelectType: (type: 'completeNow' | 'inviteCustomer') => void
}

export function ApplicationTypeSelectionModal({ 
  onClose, 
  onSelectType 
}: ApplicationTypeSelectionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create New Application</CardTitle>
              <CardDescription>
                Choose how you'd like to create the application
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-6"
            onClick={() => onSelectType('completeNow')}
          >
            <div className="flex items-start space-x-4">
              <FileText className="h-8 w-8 text-primary mt-1" />
              <div className="text-left">
                <div className="font-semibold text-base">Complete Now</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Fill out the application immediately in the system
                </div>
              </div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-6"
            onClick={() => onSelectType('inviteCustomer')}
          >
            <div className="flex items-start space-x-4">
              <Users className="h-8 w-8 text-primary mt-1" />
              <div className="text-left">
                <div className="font-semibold text-base">Invite Customer</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Send an invitation for the customer to complete online
                </div>
              </div>
            </div>
          </Button>
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}