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

export const NurtureSequences = ({
  leads,
  onSequenceStart, 
  onSequencePause, 
  onSequenceReset
}: NurtureSequencesProps) => {
  // Use mock data as fallback for sequence options and safe leads array
  const sequences = mockCrmProspecting.nurtureSequences
  const safeLeads = leads || []
  const [selectedSequence, setSelectedSequence] = useState('')
  
  // Use mock nurture leads as fallback for testing
  const displayLeads = safeLeads.length > 0 ? safeLeads : mockCrmProspecting.nurtureLeads

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
              {sequences.map(sequence => (
                <SelectItem key={sequence.id} value={sequence.id}>
                  {sequence.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {displayLeads.length > 0 ? (
          displayLeads.map(lead => {
            const Icon = getSequenceIcon(lead.sequenceType || 'email')
            const currentSequence = sequences.find(seq => seq.id === lead.sequenceId)
            
            return (
              <Card key={lead.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{lead.firstName} {lead.lastName}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                        {currentSequence && (
                          <p className="text-xs text-muted-foreground">
                            {currentSequence.name} - Step {lead.sequenceStep || 1}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {lead.sequenceStatus && (
                        <Badge className={getSequenceColor(lead.sequenceStatus)}>
                          {lead.sequenceStatus.charAt(0).toUpperCase() + lead.sequenceStatus.slice(1)}
                        </Badge>
                      )}
                      
                      {lead.nextSequenceAction && (
                        <div className="text-xs text-muted-foreground">
                          Next: {new Date(lead.nextSequenceAction).toLocaleDateString()}
                        </div>
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
          })
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No leads available for nurturing sequences</p>
              <p className="text-sm text-muted-foreground mt-1">
                Leads will appear here when they are added to the system
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}