import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotificationTemplates() {
  console.log('🔔 NotificationTemplates component loaded')

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Notification Templates</CardTitle>
        <CardDescription>
          Configure email and SMS templates for automated communications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            This section will allow configuration of:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Welcome email templates</li>
            <li>Quote and invoice notifications</li>
            <li>Service appointment reminders</li>
            <li>Delivery notifications</li>
            <li>Custom email and SMS templates</li>
          </ul>
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">
              🚧 Feature coming soon
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}