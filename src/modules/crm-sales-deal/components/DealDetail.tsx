import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DealDetailProps {
  dealId?: string
}

export function DealDetail({ dealId }: DealDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Detail View</CardTitle>
        <CardDescription>
          Deal details will be implemented here
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>Deal Detail View (Stub)</p>
          {dealId && <p className="text-sm">Deal ID: {dealId}</p>}
        </div>
      </CardContent>
    </Card>
  )
}