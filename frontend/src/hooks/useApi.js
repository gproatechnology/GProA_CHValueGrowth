import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('chvalue_token') || sessionStorage.getItem('chvalue_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const fetchApi = async (endpoint, options = {}) => {
  const response = await fetch(API_BASE + endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error de conexión' }));
    throw new Error(error.detail || error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
};

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchApi(`/products?${new URLSearchParams(params).toString()}`),
  });
};

export const useProductStats = (params = {}) => {
  return useQuery({
    queryKey: ['products', 'stats', params],
    queryFn: () => fetchApi(`/products/stats?${new URLSearchParams(params).toString()}`),
  });
};

export const useGroupedProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', 'grouped', params],
    queryFn: () => fetchApi(`/products/grouped?${new URLSearchParams(params).toString()}`),
  });
};

export const useMetrics = () => {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: () => fetchApi('/metrics'),
    refetchInterval: 60000,
  });
};

export const useOrders = (params = {}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => fetchApi(`/orders?${new URLSearchParams(params).toString()}`),
  });
};

export const useCustomers = (params = {}) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => fetchApi(`/customers?${new URLSearchParams(params).toString()}`),
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => fetchApi('/auth/me'),
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await fetch(API_BASE + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Login failed');
      }
      
      return data;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('chvalue_token', data.token);
      }
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => fetchApi('/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      localStorage.removeItem('chvalue_token');
      sessionStorage.removeItem('chvalue_token');
      queryClient.clear();
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async (refreshToken) => {
      const response = await fetch(API_BASE + '/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      return response.json();
    },
  });
};