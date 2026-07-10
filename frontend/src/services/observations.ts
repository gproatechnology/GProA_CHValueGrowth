// Observations API service
import api from './index'

export interface CreateObservationRequest {
  supplier_id: string
  product_id: string
  currency_code: string
  price_total: number
  source_url?: string
}

export interface Observation {
  id: string
  product_id: string
  supplier_id: string
  country_code: string
  currency_code: string
  price_total: number
  observed_at: string | null
  source_url: string | null
  raw_data: Record<string, unknown>
  product_name: string | null
  supplier_name: string | null
}

export async function createObservation(payload: CreateObservationRequest): Promise<{ id: string; status: string }> {
  const response = await api.post<{ id: string; status: string }>('/observations', payload)
  return response.data
}

export async function listObservations(params?: {
  product_id?: string
  supplier_id?: string
  limit?: number
  offset?: number
}): Promise<Observation[]> {
  const response = await api.get<Observation[]>('/observations', { params })
  return response.data
}