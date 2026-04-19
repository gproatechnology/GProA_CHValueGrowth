import { useState, useEffect } from 'react';

export function useMetrics() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('/api/v1/metrics')
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);
  
  return { data, isLoading, error };
}

export function useProductStats() {
  return useMetrics();
}

export function useCurrentUser() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);
  
  return { data, isLoading, error, refetch: () => {} };
}