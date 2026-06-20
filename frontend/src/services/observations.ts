// Observations API service
import api from './index'

export interface CreateObservationRequest {
  supplier_id: string
  product_id: string
  currency_code: string
  price_total: number
  source_url?: string
}

export async function createObservation(payload: CreateObservationRequest): Promise<{ id: string; status: string }> {
  const response = await api.post<{ id: string; status: string }>('/observations', payload)
  return response.data
}