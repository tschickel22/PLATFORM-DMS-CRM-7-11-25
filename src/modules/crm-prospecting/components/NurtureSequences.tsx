import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RotateCcw, Mail, MessageSquare, Phone } from 'lucide-react'
import { Lead } from '@/types'
import { mockCrmProspecting } from '@/mocks/crmProspectingMock'

interface NurtureSequencesProps {
  leads: Lead[]
  onSequenceStart: (leadId: string, sequenceId: string) => void
  onSequencePause: (leadId: string) => void
  onSequenceReset: (leadId: string) => void
}

export default function NurtureSequences({
  // Use mock data as fallback for sequence options
  leads, 
  onSequenceStart, 
  onSequencePause, 
  onSequenceReset 
}: NurtureSequencesProps) {
  const sequences = mockCrmProspecting.sequences
  const [selectedSequence, setSelectedSequence] = useState('')

  const getSequenceIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail
      case 'sms': return MessageSquare
      case 'call': return Phone
      default: return Mail
    }
  }

  const getSequenceColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Nurture Sequences</h3>
        <div className="flex items-center space-x-2">
          <Select value={selectedSequence} onValueChange={setSelectedSequence}>
            <SelectTrigger>
              <SelectValue placeholder="Select sequence" />
            </SelectTrigger>
            <SelectContent>
              {mockCrmProspecting.sequences.map(sequence => (
                <SelectItem key={sequence} value={sequence}>
                  {sequence}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {leads.map(lead => {
          const Icon = getSequenceIcon(lead.sequenceType || 'email')
          
          return (
            <Card key={lead.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {lead.sequenceStatus && (
                      <Badge className={getSequenceColor(lead.sequenceStatus)}>
                        {lead.sequenceStatus}
                      </Badge>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      {!lead.sequenceStatus && (
                        <Button
                          size="sm"
                          onClick={() => selectedSequence && onSequenceStart(lead.id, selectedSequence)}
                          disabled={!selectedSequence}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                      
                      {lead.sequenceStatus === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSequencePause(lead.id)}
                        >
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      )}
                      
                      {lead.sequenceStatus && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSequenceReset(lead.id)}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}