import { useState, useEffect, useCallback } from 'react';
import { handleApiError } from '../services/api';

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useApiMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (apiFunction, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      return { success: true, data: result };
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo);
      return { success: false, error: errorInfo };
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error, setError };
};

export default useApi;