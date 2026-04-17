import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useCustomers } from '../hooks/useApi';
import { LoadingSpinner, ErrorDisplay, EmptyState } from '../components/LoadingSpinner';

const CustomersTable = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  
  const { data, isLoading, error, refetch } = useCustomers({ page, limit: 20 });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/v1/customers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  if (isLoading) return <LoadingSpinner text="Cargando clientes..." />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} />;
  if (!data?.data?.length) return <EmptyState icon={Users} title="No hay clientes" description="No se encontraron clientes." />;

  const statusColors = {
    active: 'text-emerald-400',
    inactive: 'text-gray-400',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#0B1E3A] text-[#AFC8E6]">
          <tr>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Teléfono</th>
            <th className="p-3 text-left">RFC</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-[#EAF3FF]">
          {data.data.map((customer) => (
            <tr key={customer.id} className="border-b border-[#1E90FF]/10 hover:bg-[#1E4D7A]/30">
              <td className="p-3 font-medium">{customer.name}</td>
              <td className="p-3 text-[#AFC8E6]">{customer.email}</td>
              <td className="p-3">{customer.phone || '-'}</td>
              <td className="p-3 font-mono text-xs">{customer.rfc || '-'}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs ${statusColors[customer.status] || 'text-gray-400'} bg-current/10`}>
                  {customer.status}
                </span>
              </td>
              <td className="p-3 text-right">
                <button
                  onClick={() => deleteMutation.mutate(customer.id)}
                  disabled={deleteMutation.isPending}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.pagination && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!data.pagination.has_prev}
            className="px-3 py-1 rounded bg-[#1E4D7A] text-white disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-3 py-1 text-[#AFC8E6]">
            {data.pagination.page} / {data.pagination.total_pages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!data.pagination.has_next}
            className="px-3 py-1 rounded bg-[#1E4D7A] text-white disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomersTable;