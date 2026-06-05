import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import './index.css';
import 'leaflet/dist/leaflet.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Error Boundary simple para capturar errores no manejados
 */
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error no capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#050c1a] to-[#0B1E3A] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl p-8 w-full max-w-md border border-[#1E90FF]/20 shadow-2xl text-white">
            <h1 className="text-2xl font-bold text-red-400 mb-4">⚠️ Algo salió mal</h1>
            <p className="text-[#AFC8E6] mb-4">Recarga la página.</p>
            <button onClick={() => window.location.reload()} className="bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] px-6 py-2 rounded-lg font-semibold">
              Recargar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No root element');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <GlobalErrorBoundary>
          <App />
        </GlobalErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

