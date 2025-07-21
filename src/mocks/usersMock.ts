export interface MockUser {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

export const mockUsers: { sampleUsers: MockUser[] } = {
  sampleUsers: [
    {
      id: 'user-1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      role: 'customer',
      status: 'Active',
      createdAt: '2024-01-10T09:30:00Z',
      updatedAt: '2024-01-15T14:30:00Z'
    },
    {
      id: 'user-2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 987-6543',
      role: 'customer',
      status: 'Active',
      createdAt: '2024-01-12T11:15:00Z',
      updatedAt: '2024-01-18T16:45:00Z'
    },
    {
      id: 'user-3',
      name: 'Michael Davis',
      email: 'michael.d@example.com',
      phone: '(555) 456-7890',
      role: 'customer',
      status: 'Inactive',
      createdAt: '2024-01-08T13:20:00Z',
      updatedAt: '2024-01-22T10:30:00Z'
    }
  ]
}

export default mockUsers