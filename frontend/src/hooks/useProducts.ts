// React Query hooks for products
import { useQuery, useMutation } from '@tanstack/react-query'
import { searchProducts, getOrCreateProduct } from '../services/products'
import type { ProductFilters, GetOrCreateProductRequest } from '../services/products'

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => searchProducts(filters),
    staleTime: 1000 * 60 * 5,
  })
}

export function useGetOrCreateProduct() {
  return useMutation({
    mutationFn: getOrCreateProduct,
  })
}