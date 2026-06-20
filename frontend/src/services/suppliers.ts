// Suppliers API service
import api from './index'

export interface Supplier {
  id: string
  name: string
  country_code: string
}

export async function listSuppliers(): Promise<Supplier[]> {
  const response = await api.get<Supplier[]>('/suppliers/')
  return response.data
}