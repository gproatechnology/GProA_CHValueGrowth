import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = 'Cargando...', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative">
        <div className={`${sizes[size]} border-4 border-[#1E90FF]/30 border-t-[#1E90FF] rounded-full animate-spin`}>
          <Loader2 className="w-full h-full text-[#1E90FF] animate-spin" size={sizes[size]} />
        </div>
      </div>
      {text && <p className={`text-[#AFC8E6] ${textSizes[size]} font-medium`}>{text}</p>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-[#050c1a] to-[#0B1E3A] flex items-center justify-center z-50">
    <LoadingSpinner size="lg" text="Cargando NeumatiQ..." />
  </div>
);

export const ErrorDisplay = ({ error, onRetry }) => {
  const message = error instanceof Error ? error.message : 'Error desconocido';
  
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center max-w-md">
        <p className="text-red-400 font-semibold mb-2">⚠️ Error</p>
        <p className="text-[#AFC8E6] text-sm mb-4">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] px-4 py-2 rounded-lg text-sm font-medium"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};

export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      {Icon && <Icon className="w-12 h-12 text-[#AFC8E6] opacity-50" />}
      <h3 className="text-[#EAF3FF] font-semibold">{title}</h3>
      {description && <p className="text-[#AFC8E6] text-sm max-w-md">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default { LoadingSpinner, PageLoader, ErrorDisplay, EmptyState };