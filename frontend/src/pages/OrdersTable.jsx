import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useOrders } from '../hooks/useApi';
import { LoadingSpinner, ErrorDisplay, EmptyState } from '../components/LoadingSpinner';

const OrdersTable = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  
  const { data, isLoading, error, refetch } = useOrders({ page, limit: 20 });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/v1/orders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  if (isLoading) return <LoadingSpinner text="Cargando órdenes..." />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} />;
  if (!data?.data?.length) return <EmptyState icon={ShoppingCart} title="No hay órdenes" description="No se encontraron órdenes." />;

  const statusColors = {
    pending: 'text-amber-400',
    processing: 'text-blue-400',
    completed: 'text-emerald-400',
    cancelled: 'text-red-400',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#0B1E3A] text-[#AFC8E6]">
          <tr>
            <th className="p-3 text-left">Orden</th>
            <th className="p-3 text-left">Cliente ID</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 text-right">Total</th>
            <th className="p-3 text-right">Fecha</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-[#EAF3FF]">
          {data.data.map((order) => (
            <tr key={order.id} className="border-b border-[#1E90FF]/10 hover:bg-[#1E4D7A]/30">
              <td className="p-3 font-mono">{order.order_number}</td>
              <td className="p-3">{order.customer_id}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs ${statusColors[order.status] || 'text-gray-400'} bg-current/10`}>
                  {order.status}
                </span>
              </td>
              <td className="p-3 text-right text-[#1E90FF]">${order.total?.toLocaleString()}</td>
              <td className="p-3 text-right text-[#AFC8E6]">
                {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
              </td>
              <td className="p-3 text-right">
                <button
                  onClick={() => deleteMutation.mutate(order.id)}
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

export default OrdersTable;