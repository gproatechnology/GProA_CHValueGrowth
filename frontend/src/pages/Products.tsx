// Products page - connected to API
import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useGetOrCreateProduct } from '../hooks/useProducts'
import type { ProductFilters } from '../services/products'

function Products() {
  const [filters, setFilters] = useState<ProductFilters>({})
  const { data: products, isLoading, error } = useProducts(filters)
  const getOrCreateMutation = useGetOrCreateProduct()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({
      ...filters,
      page: 1,
    })
  }

  const handleFilterChange = (key: keyof ProductFilters, value: string | number) => {
    setFilters({
      ...filters,
      [key]: value || undefined,
      page: 1,
    })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Productos</h2>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Marca"
            value={filters.brand || ''}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Width"
            value={filters.width || ''}
            onChange={(e) => handleFilterChange('width', parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg w-24"
          />
          <input
            type="number"
            placeholder="Aspect Ratio"
            value={filters.aspect_ratio || ''}
            onChange={(e) => handleFilterChange('aspect_ratio', parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg w-24"
          />
          <input
            type="number"
            placeholder="Rim Diameter"
            value={filters.rim_diameter || ''}
            onChange={(e) => handleFilterChange('rim_diameter', parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg w-24"
          />
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {isLoading && (
          <div className="p-6 text-center">Cargando productos...</div>
        )}
        {error && (
          <div className="p-6 text-center text-red-500">Error cargando datos</div>
        )}
        {!isLoading && !error && (!products || products.length === 0) && (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No hay productos registrados
                </td>
              </tr>
            </tbody>
          </table>
        )}
        {!isLoading && !error && products && products.length > 0 && (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.brand_id}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Products