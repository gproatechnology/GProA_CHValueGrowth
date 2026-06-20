// Application state store
import { create } from 'zustand'

interface AppState {
  selectedSupplier: string | null
  selectedCountry: string | null
  productFilters: {
    brand?: string
    width?: number
    aspect_ratio?: number
    rim_diameter?: number
  }
  setSelectedSupplier: (id: string | null) => void
  setSelectedCountry: (code: string | null) => void
  setProductFilters: (filters: AppState['productFilters']) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedSupplier: null,
  selectedCountry: null,
  productFilters: {},
  setSelectedSupplier: (id) => set({ selectedSupplier: id }),
  setSelectedCountry: (code) => set({ selectedCountry: code }),
  setProductFilters: (filters) => set({ productFilters: filters }),
}))