import { useState } from 'react'
import { mockCrmProspecting } from '@/mocks/crmProspectingMock'

export function useLeadManagement() {
  const [leadForms, setLeadForms] = useState(mockCrmProspecting.leadForms || [])

  const getRepById = (repId: string) => {
    return mockCrmProspecting.reps?.find(rep => rep.id === repId) || null
  }

  const saveLeadForm = (form: any) => {
    setLeadForms((prev: any[]) => [...prev, form])
  }

  return {
    leadForms,
    saveLeadForm,
    getRepById
  }
}