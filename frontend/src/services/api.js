import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// === Categories API ===
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// === Accounts API ===
export const accountsAPI = {
  getAll: () => api.get('/accounts'),
  create: (data) => api.post('/accounts', data),
  update: (id, data) => api.put(`/accounts/${id}`, data),
  delete: (id) => api.delete(`/accounts/${id}`),
};

// === Transactions API ===
export const transactionsAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.type && params.type !== 'all') queryParams.append('type', params.type);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return api.get(`/transactions${queryString ? `?${queryString}` : ''}`);
  },
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  export: () => api.get('/transactions/export', { responseType: 'blob' }),
  import: (formData) => api.post('/transactions/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// === Clients API ===
export const clientsAPI = {
  getAll: () => api.get('/clients'),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
};

// === Vendors API ===
export const vendorsAPI = {
  getAll: () => api.get('/vendors'),
  create: (data) => api.post('/vendors', data),
  update: (id, data) => api.put(`/vendors/${id}`, data),
  delete: (id) => api.delete(`/vendors/${id}`),
};

// === Budgets API ===
export const budgetsAPI = {
  getAll: () => api.get('/budgets'),
  create: (data) => api.post('/budgets', data),
  update: (categoryId, data) => api.put(`/budgets/${categoryId}`, data),
  delete: (categoryId) => api.delete(`/budgets/${categoryId}`),
};

// === Dashboard API ===
export const dashboardAPI = {
  getKPIs: () => api.get('/dashboard/kpis'),
  getCharts: () => api.get('/dashboard/charts'),
};

// === Utility Functions ===
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.detail || error.response.data?.message || 'Server error occurred';
    return { success: false, message, status: error.response.status };
  } else if (error.request) {
    // Network error
    return { success: false, message: 'Network error - please check your connection', status: 0 };
  } else {
    // Other error
    return { success: false, message: error.message || 'An unexpected error occurred', status: 0 };
  }
};

export const showApiSuccess = (message = 'Operation completed successfully') => {
  return { success: true, message };
};

export default api;