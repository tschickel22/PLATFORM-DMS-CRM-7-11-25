import React from 'react'

/**
 * Automatic Mock Data Discovery System
 * 
 * This utility automatically discovers and maps mock data files to client portal sections.
 * It provides a centralized way to manage mock data relationships and makes it easy
 * to add new products/modules without manual configuration.
 */

interface MockDataSource {
  path: string
  exportName: string
  dataKey: string
  description: string
  customerIdField?: string
  customerNameField?: string
  filterFunction?: (item: any, customerId: string, customerName: string) => boolean
}

interface PortalSection {
  id: string
  name: string
  description: string
  mockDataSources: MockDataSource[]
  component?: string
}

/**
 * Registry of all mock data sources and their relationships to portal sections
 */
export const MOCK_DATA_REGISTRY: Record<string, PortalSection> = {
  loans: {
    id: 'loans',
    name: 'Loans',
    description: 'Customer loan accounts and payment history',
    component: 'ClientLoansView',
    mockDataSources: [
      {
        path: '@/mocks/financeMock',
        exportName: 'mockFinance',
        dataKey: 'sampleLoans',
        description: 'Customer loan accounts',
        customerIdField: 'customerId',
        customerNameField: 'customerName'
      },
      {
        path: '@/mocks/financeMock',
        exportName: 'mockFinance',
        dataKey: 'samplePayments',
        description: 'Loan payment history',
        filterFunction: (payment, customerId, customerName) => {
          // Custom filter to match payments to customer loans
          const { mockFinance } = require('@/mocks/financeMock')
          const customerLoans = mockFinance.sampleLoans.filter((loan: any) => 
            loan.customerId === customerId || loan.customerName === customerName
          )
          return customerLoans.some((loan: any) => loan.id === payment.loanId)
        }
      }
    ]
  },
  
  agreements: {
    id: 'agreements',
    name: 'Agreements',
    description: 'Customer agreements and contracts',
    component: 'ClientAgreements',
    mockDataSources: [
      {
        path: '@/mocks/agreementsMock',
        exportName: 'mockAgreements',
        dataKey: 'sampleAgreements',
        description: 'Customer agreements and contracts',
        customerIdField: 'customerId',
        customerNameField: 'customerName'
      }
    ]
  },
  
  financeApplications: {
    id: 'finance-applications',
    name: 'Finance Applications',
    description: 'Customer finance application submissions',
    component: 'PortalApplicationView',
    mockDataSources: [
      {
        path: '@/modules/finance-application/mocks/financeApplicationMock',
        exportName: 'mockFinanceApplications',
        dataKey: 'sampleApplications',
        description: 'Finance application submissions',
        customerIdField: 'customerId',
        customerNameField: 'customerName'
      }
    ]
  },
  
  serviceTickets: {
    id: 'service-tickets',
    name: 'Service Tickets',
    description: 'Customer service requests and tickets',
    component: 'ClientServiceTickets',
    mockDataSources: [
      {
        path: '@/mocks/serviceOpsMock',
        exportName: 'mockServiceOps',
        dataKey: 'sampleTickets',
        description: 'Service tickets and requests',
        customerIdField: 'customerId',
        customerNameField: 'customerName'
      }
    ]
  },
  
  quotes: {
    id: 'quotes',
    name: 'Quotes',
    description: 'Customer quotes and estimates',
    component: 'ClientQuotes',
    mockDataSources: [
      {
        path: '@/mocks/quoteBuilderMock',
        exportName: 'mockQuoteBuilder',
        dataKey: 'sampleQuotes',
        description: 'Customer quotes and estimates',
        customerIdField: 'customerId',
        customerNameField: 'customerName'
      }
    ]
  },
  
  invoices: {
    id: 'invoices',
    name: 'Invoices',
    description: 'Customer invoices and billing',
    component: 'ClientInvoices',
    mockDataSources: [
      {
        path: '@/mocks/invoiceMock',
        exportName: 'mockInvoice',
        dataKey: 'sampleInvoices',
        description: 'Customer invoices and billing',
        customerNameField: 'customerName'
      }
    ]
  },
  
  deliveries: {
    id: 'deliveries',
    name: 'Deliveries',
    description: 'Customer delivery tracking',
    component: 'ClientDeliveries',
    mockDataSources: [
      {
        path: '@/mocks/deliveryMock',
        exportName: 'mockDelivery',
        dataKey: 'sampleDeliveries',
        description: 'Delivery tracking and status',
        customerIdField: 'customerId',
        customerNameField: 'customerName'
      }
    ]
  }
}

/**
 * Automatically discovers available mock data for a customer
 */
export function discoverCustomerData(customerId: string, customerName: string) {
  const customerData: Record<string, any[]> = {}
  
  Object.entries(MOCK_DATA_REGISTRY).forEach(([sectionId, section]) => {
    customerData[sectionId] = []
    
    section.mockDataSources.forEach(source => {
      try {
        // Dynamically import the mock data
        const mockModule = require(source.path)
        const mockData = mockModule[source.exportName]
        const dataArray = mockData[source.dataKey] || []
        
        // Filter data for the customer
        const customerItems = dataArray.filter((item: any) => {
          // Use custom filter function if provided
          if (source.filterFunction) {
            return source.filterFunction(item, customerId, customerName)
          }
          
          // Use standard field matching
          const matchesId = source.customerIdField && item[source.customerIdField] === customerId
          const matchesName = source.customerNameField && item[source.customerNameField] === customerName
          
          return matchesId || matchesName
        })
        
        customerData[sectionId].push(...customerItems)
      } catch (error) {
        console.warn(`Failed to load mock data from ${source.path}:`, error)
      }
    })
  })
  
  return customerData
}

/**
 * Gets available portal sections with data counts for a customer
 */
export function getPortalSectionsWithCounts(customerId: string, customerName: string) {
  const customerData = discoverCustomerData(customerId, customerName)
  
  return Object.entries(MOCK_DATA_REGISTRY).map(([sectionId, section]) => ({
    ...section,
    dataCount: customerData[sectionId]?.length || 0,
    hasData: (customerData[sectionId]?.length || 0) > 0
  }))
}

/**
 * Registers a new mock data source for automatic discovery
 */
export function registerMockDataSource(
  sectionId: string, 
  sectionConfig: Omit<PortalSection, 'id'>
) {
  MOCK_DATA_REGISTRY[sectionId] = {
    id: sectionId,
    ...sectionConfig
  }
}

/**
 * Gets mock data for a specific portal section and customer
 */
export function getCustomerDataForSection(
  sectionId: string, 
  customerId: string, 
  customerName: string
) {
  const section = MOCK_DATA_REGISTRY[sectionId]
  if (!section) {
    console.warn(`Portal section '${sectionId}' not found in registry`)
    return []
  }
  
  const customerData = discoverCustomerData(customerId, customerName)
  return customerData[sectionId] || []
}

/**
 * Validates that all required mock data sources are available
 */
export function validateMockDataSources() {
  const results: Record<string, { available: boolean; error?: string }> = {}
  
  Object.entries(MOCK_DATA_REGISTRY).forEach(([sectionId, section]) => {
    section.mockDataSources.forEach(source => {
      const key = `${sectionId}.${source.dataKey}`
      try {
        const mockModule = require(source.path)
        const mockData = mockModule[source.exportName]
        const dataArray = mockData[source.dataKey]
        
        results[key] = {
          available: Array.isArray(dataArray),
          error: Array.isArray(dataArray) ? undefined : 'Data is not an array'
        }
      } catch (error) {
        results[key] = {
          available: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })
  })
  
  return results
}

/**
 * Hook for using mock data discovery in React components
 */
export function useMockDataDiscovery(customerId: string, customerName: string) {
  const [customerData, setCustomerData] = React.useState<Record<string, any[]>>({})
  const [loading, setLoading] = React.useState(true)
  
  React.useEffect(() => {
    setLoading(true)
    try {
      const data = discoverCustomerData(customerId, customerName)
      setCustomerData(data)
    } catch (error) {
      console.error('Failed to discover customer data:', error)
    } finally {
      setLoading(false)
    }
  }, [customerId, customerName])
  
  return {
    customerData,
    loading,
    getSectionData: (sectionId: string) => customerData[sectionId] || [],
    getSectionCount: (sectionId: string) => customerData[sectionId]?.length || 0,
    hasDataForSection: (sectionId: string) => (customerData[sectionId]?.length || 0) > 0
  }
}

/**
 * Example of how to add a new product/module to the portal:
 * 
 * 1. Create your mock data file (e.g., src/mocks/newProductMock.ts)
 * 2. Register it with the discovery system:
 * 
 * registerMockDataSource('newProduct', {
 *   name: 'New Product',
 *   description: 'Description of the new product',
 *   component: 'ClientNewProduct',
 *   mockDataSources: [
 *     {
 *       path: '@/mocks/newProductMock',
 *       exportName: 'mockNewProduct',
 *       dataKey: 'sampleData',
 *       description: 'New product data',
 *       customerIdField: 'customerId',
 *       customerNameField: 'customerName'
 *     }
 *   ]
 * })
 * 
 * 3. Create your component (e.g., src/modules/client-portal/components/ClientNewProduct.tsx)
 * 4. Add the route to ClientPortalLayout.tsx
 * 5. Add navigation item to ClientPortal.tsx
 * 
 * The system will automatically discover and filter the data for each customer!
 */
// Export types for use in other files
export type { MockDataSource, PortalSection }