import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/**
 * Error Boundary simple para capturar errores no manejados
 * en toda la aplicación.
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
    // Aquí podrías enviar el error a un servicio como Sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
          <div className="neumorph-card text-center max-w-md">
            <h1 className="text-2xl font-bold text-red-400 mb-4">⚠️ Algo salió mal</h1>
            <p className="text-text-secondary mb-4">
              Ha ocurrido un error inesperado. Por favor, recarga la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="neumorph-btn bg-accent-blue text-white px-6 py-2"
            >
              Recargar aplicación
            </button>
            <details className="mt-4 text-left text-xs text-text-muted">
              <summary>Detalles técnicos</summary>
              <pre className="mt-2 p-2 bg-secondary rounded overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Verifica que el elemento root exista en el DOM.
 * Si no existe, lanza un error descriptivo.
 */
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No se encontró el elemento con id "root". Asegúrate de que exista en index.html.');
}

// Crear root de React con opciones de rendimiento (opcional)
const root = ReactDOM.createRoot(rootElement);

// Renderizar aplicación con StrictMode y ErrorBoundary
root.render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
);

// Si deseas medir rendimiento (descomentar para producción)
// import { reportWebVitals } from './reportWebVitals';
// reportWebVitals(console.log);