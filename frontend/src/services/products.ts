// Products API service
import api from './index'

export interface Product {
  id: string
  fingerprint: string
  sku: string
  name: string
  normalized_name: string
  brand_id: string
  tire_specification_id: string
  product_type: string
  status: string
}

export interface ProductFilters {
  brand?: string
  width?: number
  aspect_ratio?: number
  rim_diameter?: number
  page?: number
  page_size?: number
}

export interface GetOrCreateProductRequest {
  brand: string
  width: number
  aspect_ratio: number
  rim_diameter: number
  normalized_name: string
}

export async function searchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const response = await api.get<Product[]>('/products/', { params: filters })
  return response.data
}

export async function getOrCreateProduct(payload: GetOrCreateProductRequest): Promise<{ id: string; created: boolean }> {
  const response = await api.post<{ id: string; created: boolean }>('/products/get-or-create', payload)
  return response.data
}