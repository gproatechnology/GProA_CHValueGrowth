// Suppliers page - connected to API
import { useSuppliers } from '../hooks/useSuppliers'

function Suppliers() {
  const { data: suppliers, isLoading, error } = useSuppliers()

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Proveedores</h2>
      <div className="bg-white rounded-lg shadow-sm border">
        {isLoading && (
          <div className="p-6 text-center">Cargando proveedores...</div>
        )}
        {error && (
          <div className="p-6 text-center text-red-500">Error cargando datos</div>
        )}
        {!isLoading && !error && (!suppliers || suppliers.length === 0) && (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  País
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No hay proveedores registrados
                </td>
              </tr>
            </tbody>
          </table>
        )}
        {!isLoading && !error && suppliers && suppliers.length > 0 && (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  País
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {supplier.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {supplier.country_code}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Activo
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

export default Suppliers