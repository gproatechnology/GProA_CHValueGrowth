// React Query hook for suppliers
import { useQuery } from '@tanstack/react-query'
import { listSuppliers } from '../services/suppliers'

export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: listSuppliers,
    staleTime: 1000 * 60 * 5,
  })
}