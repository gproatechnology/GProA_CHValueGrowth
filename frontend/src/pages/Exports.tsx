function Exports() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Exportar</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Exportar a Excel</h3>
          <p className="text-sm text-gray-600 mb-4">
            Descarga los datos de precios en formato Excel compatible con Tableau y Salesforce.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Descargar Excel
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Programar Exportación</h3>
          <p className="text-sm text-gray-600 mb-4">
            Configura exportaciones automáticas periódicas.
          </p>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Configurar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Exports