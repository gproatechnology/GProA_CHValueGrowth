// Dashboard page - connected to API
import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useSuppliers } from '../hooks/useSuppliers'
import { useProducts } from '../hooks/useProducts'
import { listObservations } from '../services/observations'

function Dashboard() {
  const { data: suppliers, isLoading: suppliersLoading } = useSuppliers()
  const { data: products, isLoading: productsLoading } = useProducts()
  const { data: observations = [], isLoading: observationsLoading } = useQuery({
    queryKey: ['observations'],
    queryFn: () => listObservations({ limit: 1000 }),
  })

  const avgPrice = observations.length
    ? observations.reduce((sum, obs) => sum + obs.price_total, 0) / observations.length
    : 0

  const chartData = observations
    .slice()
    .sort((a, b) => new Date(a.observed_at ?? 0).getTime() - new Date(b.observed_at ?? 0).getTime())
    .slice(-30)
    .map((obs) => ({
      date: obs.observed_at ? new Date(obs.observed_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : 'N/A',
      price: Number(obs.price_total.toFixed(2)),
    }))

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
            {observationsLoading ? '...' : observations.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Precio Promedio</p>
          <p className="text-3xl font-bold text-gray-900">
            {observationsLoading ? '...' : `$${avgPrice.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Tendencia de Precios</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">Sin datos de observaciones aún.</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard