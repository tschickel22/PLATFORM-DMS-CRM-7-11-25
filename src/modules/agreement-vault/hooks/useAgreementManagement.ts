import { useState, useEffect, useMemo } from 'react'
import { Agreement, AgreementType, AgreementStatus } from '@/types'
import { mockAgreements } from '@/mocks/agreementsMock'
import { generateId } from '@/lib/utils'

export function useAgreementManagement() {
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Initialize with mock data
  useEffect(() => {
    setAgreements(mockAgreements.sampleAgreements)
  }, [])

  // Filtered agreements based on search and filters
  const filteredAgreements = useMemo(() => {
    return agreements.filter(agreement => {
      const matchesSearch = 
        agreement.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.vehicleInfo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.type.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || agreement.status === statusFilter
      const matchesType = typeFilter === 'all' || agreement.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [agreements, searchTerm, statusFilter, typeFilter])

  const createAgreement = async (agreementData: Partial<Agreement>) => {
    setLoading(true)
    try {
      const newAgreement: Agreement = {
        id: generateId(),
        type: agreementData.type as AgreementType || AgreementType.PURCHASE,
        status: AgreementStatus.DRAFT,
        customerId: agreementData.customerId || '',
        customerName: agreementData.customerName || '',
        customerEmail: agreementData.customerEmail || '',
        customerPhone: agreementData.customerPhone || '',
        vehicleId: agreementData.vehicleId || '',
        vehicleInfo: agreementData.vehicleInfo || '',
        quoteId: agreementData.quoteId || '',
        terms: agreementData.terms || '',
        effectiveDate: agreementData.effectiveDate || new Date().toISOString(),
        expirationDate: agreementData.expirationDate || null,
        signedBy: null,
        signedAt: null,
        ipAddress: null,
        signatureData: null,
        documents: agreementData.documents || [],
        customFields: agreementData.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user', // In real app, get from auth context
        totalAmount: agreementData.totalAmount,
        downPayment: agreementData.downPayment,
        financingAmount: agreementData.financingAmount,
        monthlyPayment: agreementData.monthlyPayment,
        securityDeposit: agreementData.securityDeposit,
        annualFee: agreementData.annualFee,
        coverageLevel: agreementData.coverageLevel
      }

      setAgreements(prev => [newAgreement, ...prev])
      return newAgreement
    } catch (error) {
      console.error('Error creating agreement:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateAgreement = async (agreementId: string, updates: Partial<Agreement>) => {
    setLoading(true)
    try {
      setAgreements(prev => 
        prev.map(agreement => 
          agreement.id === agreementId 
            ? { ...agreement, ...updates, updatedAt: new Date() }
            : agreement
        )
      )
    } catch (error) {
      console.error('Error updating agreement:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteAgreement = async (agreementId: string) => {
    setLoading(true)
    try {
      setAgreements(prev => prev.filter(agreement => agreement.id !== agreementId))
    } catch (error) {
      console.error('Error deleting agreement:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const sendSignatureRequest = async (agreementId: string) => {
    setLoading(true)
    try {
      // In a real app, this would send an email/SMS to the customer
      // For now, we'll just update the status to PENDING
      await updateAgreement(agreementId, { 
        status: AgreementStatus.PENDING 
      })
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return true
    } catch (error) {
      console.error('Error sending signature request:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signAgreement = async (agreementId: string, signatureData: string, ipAddress?: string) => {
    setLoading(true)
    try {
      const signedAt = new Date().toISOString()
      
      await updateAgreement(agreementId, {
        status: AgreementStatus.SIGNED,
        signedAt,
        signatureData,
        ipAddress: ipAddress || 'unknown',
        signedBy: 'Customer' // In real app, get from customer context
      })
      
      return true
    } catch (error) {
      console.error('Error signing agreement:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getAgreementById = (agreementId: string) => {
    return agreements.find(agreement => agreement.id === agreementId)
  }

  const getAgreementsByCustomer = (customerId: string) => {
    return agreements.filter(agreement => agreement.customerId === customerId)
  }

  const getAgreementsByStatus = (status: AgreementStatus) => {
    return agreements.filter(agreement => agreement.status === status)
  }

  const getAgreementsByType = (type: AgreementType) => {
    return agreements.filter(agreement => agreement.type === type)
  }

  return {
    agreements,
    filteredAgreements,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    createAgreement,
    updateAgreement,
    deleteAgreement,
    sendSignatureRequest,
    signAgreement,
    getAgreementById,
    getAgreementsByCustomer,
    getAgreementsByStatus,
    getAgreementsByType
  }
}