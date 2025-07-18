import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Star, AlertCircle } from 'lucide-react'
import { Lead } from '@/types'
import { mockCrmProspecting } from '@/mocks/crmProspectingMock'

interface LeadScoringProps {
  lead: Lead
  onScoreUpdate?: (leadId: string, score: number) => void
}

export function LeadScoring({ lead, onScoreUpdate }: LeadScoringProps) {
  const [score, setScore] = useState(lead.score || 0)
  const [factors, setFactors] = useState<Array<{name: string, weight: number, value: number}>>([])

  useEffect(() => {
    // Calculate score based on various factors
    const scoringFactors = [
      { name: 'Email Engagement', weight: 0.3, value: lead.emailEngagement || 0 },
      { name: 'Website Activity', weight: 0.25, value: lead.websiteActivity || 0 },
      { name: 'Budget Match', weight: 0.2, value: lead.budgetMatch || 0 },
      { name: 'Timeline Urgency', weight: 0.15, value: lead.timelineUrgency || 0 },
      { name: 'Location Preference', weight: 0.1, value: lead.locationMatch || 0 }
    ]

    setFactors(scoringFactors)

    const calculatedScore = scoringFactors.reduce((total, factor) => {
      return total + (factor.value * factor.weight * 100)
    }, 0)

    const finalScore = Math.min(Math.round(calculatedScore), 100)
    setScore(finalScore)

    if (onScoreUpdate && finalScore !== lead.score) {
      onScoreUpdate(lead.id, finalScore)
    }
  }, [lead, onScoreUpdate])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Hot Lead'
    if (score >= 60) return 'Warm Lead'
    if (score >= 40) return 'Cool Lead'
    return 'Cold Lead'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Lead Score
            </CardTitle>
            <CardDescription>
              Automatically calculated based on engagement and fit
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <Badge variant={score >= 60 ? "default" : "secondary"}>
              {getScoreLabel(score)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium">Score Breakdown</h4>
          {factors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{factor.name}</span>
              <div className="flex items-center gap-2">
                <Progress 
                  value={factor.value * 100} 
                  className="w-20" 
                />
                <span className="text-sm font-medium w-8">
                  {Math.round(factor.value * factor.weight * 100)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lead Tags */}
        <div className="space-y-3">
          <h4 className="font-medium">Lead Tags</h4>
          <div className="flex flex-wrap gap-2">
            {mockCrmProspecting.tags.map(tag => (
              <Badge 
                key={tag} 
                variant={lead.customFields?.tags?.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Recommendations
          </h4>
          <div className="space-y-1 text-sm text-blue-700">
            {score >= 80 && (
              <p>• High priority lead - schedule immediate follow-up</p>
            )}
            {score >= 60 && score < 80 && (
              <p>• Good potential - maintain regular contact</p>
            )}
            {score >= 40 && score < 60 && (
              <p>• Nurture with educational content</p>
            )}
            {score < 40 && (
              <p>• Low priority - add to drip campaign</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}