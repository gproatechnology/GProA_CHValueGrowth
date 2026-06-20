// Dashboard page - connected to API
import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useSuppliers } from '../hooks/useSuppliers'
import { useProducts } from '../hooks/useProducts'

function Dashboard() {
  const { data: suppliers, isLoading: suppliersLoading } = useSuppliers()
  const { data: products, isLoading: productsLoading } = useProducts()

  const mockData = [
    { date: 'Ene', price: 2200 },
    { date: 'Feb', price: 2350 },
    { date: 'Mar', price: 2280 },
    { date: 'Abr', price: 2420 },
    { date: 'May', price: 2380 },
    { date: 'Jun', price: 2450 },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Productos</p>
          <p className="text-3xl font-bold text-gray-900">
            {productsLoading ? '...' : products?.length ?? 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Proveedores</p>
          <p className="text-3xl font-bold text-gray-900">
            {suppliersLoading ? '...' : suppliers?.length ?? 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Observaciones</p>
          <p className="text-3xl font-bold text-gray-900">
            0
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Precio Promedio</p>
          <p className="text-3xl font-bold text-gray-900">
            $0
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Tendencia de Precios</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Dashboard