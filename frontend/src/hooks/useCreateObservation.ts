// React Query hook for observations
import { useMutation } from '@tanstack/react-query'
import { createObservation } from '../services/observations'

export function useCreateObservation() {
  return useMutation({
    mutationFn: createObservation,
  })
}