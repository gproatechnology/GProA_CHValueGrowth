import React from 'react';

export function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-[#1E90FF]/20 border-t-[#1E90FF]`} />
  );
}

export function ErrorDisplay({ message }) {
  return (
    <div className="p-4 bg-red-500/20 border border-red-500 rounded text-red-400">
      {message || 'Error'}
    </div>
  );
}