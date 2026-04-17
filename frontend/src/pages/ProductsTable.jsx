import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
import { useProducts } from '../hooks/useApi';
import { LoadingSpinner, ErrorDisplay, EmptyState } from '../components/LoadingSpinner';

const ProductsTable = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  
  const { data, isLoading, error, refetch } = useProducts({ page, limit: 20 });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/v1/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  if (isLoading) return <LoadingSpinner text="Cargando productos..." />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} />;
  if (!data?.data?.length) return <EmptyState icon={Package} title="No hay productos" description="No se encontraron productos en la base de datos." />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#0B1E3A] text-[#AFC8E6]">
          <tr>
            <th className="p-3 text-left">Marca</th>
            <th className="p-3 text-left">Título</th>
            <th className="p-3 text-right">Precio</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-[#EAF3FF]">
          {data.data.map((product) => (
            <tr key={product.id} className="border-b border-[#1E90FF]/10 hover:bg-[#1E4D7A]/30">
              <td className="p-3">{product.brand || '-'}</td>
              <td className="p-3 truncate max-w-xs">{product.title}</td>
              <td className="p-3 text-right text-[#1E90FF]">${product.price?.toLocaleString()}</td>
              <td className="p-3 text-right">
                <button
                  onClick={() => deleteMutation.mutate(product.id)}
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

export default ProductsTable;