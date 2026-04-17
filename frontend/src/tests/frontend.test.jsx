"""
Tests para el frontend - CHValueGrowth
"""

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';


describe('App Component', () => {
  test('renders without crashing', () => {
    render(<BrowserRouter><App /></BrowserRouter>);
  });
});


describe('ProductsTable', () => {
  test('shows loading state', () => {
    render(<ProductsTable />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });
});


describe('OrdersTable', () => {
  test('shows loading state', () => {
    render(<OrdersTable />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });
});


describe('CustomersTable', () => {
  test('shows loading state', () => {
    render(<CustomersTable />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });
});


describe('LoadingSpinner', () => {
  test('renders with default text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });
  
  test('renders with custom text', () => {
    render(<LoadingSpinner text="Cargando datos..." />);
    expect(screen.getByText(/cargando datos/i)).toBeInTheDocument();
  });
});


describe('ErrorDisplay', () => {
  test('renders error message', () => {
    const error = new Error('Test error');
    render(<ErrorDisplay error={error} />);
    expect(screen.getByText(/test error/i)).toBeInTheDocument();
  });
  
  test('shows retry button when onRetry provided', () => {
    const mockRetry = jest.fn();
    const error = new Error('Test error');
    render(<ErrorDisplay error={error} onRetry={mockRetry} />);
    expect(screen.getByText(/reintentar/i)).toBeInTheDocument();
  });
});


describe('EmptyState', () => {
  test('renders title', () => {
    render(<EmptyState title="No hay datos" />);
    expect(screen.getByText(/no hay datos/i)).toBeInTheDocument();
  });
  
  test('renders description when provided', () => {
    render(<EmptyState title="No hay datos" description="No se encontraron elementos" />);
    expect(screen.getByText(/no se encontraron/i)).toBeInTheDocument();
  });
});


describe('useApi hooks', () => {
  test('useProducts returns data', async () => {
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
  
  test('useOrders returns data', async () => {
    const { result } = renderHook(() => useOrders());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
  
  test('useCustomers returns data', async () => {
    const { result } = renderHook(() => useCustomers());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
  
  test('useMetrics returns data', async () => {
    const { result } = renderHook(() => useMetrics());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});