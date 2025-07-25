export interface ServiceRequest {
  id: string
  title: string
  description?: string
  status: string
  priority?: string
  assigned_to?: string
  customer_id?: string
  requested_date?: string
  completed_date?: string
  created_at?: string
  updated_at?: string
}

export interface ServiceLog {
  id: string
  request_id: string
  note: string
  created_by?: string
  created_at?: string
}