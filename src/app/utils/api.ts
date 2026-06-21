const API_BASE = import.meta.env.VITE_API_BASE || 'https://coffeeduduk.onrender.com/api';

type ApiOptions = RequestInit & {
  skipAuth?: boolean;
};

function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('access_token');
}

function storeAuth(data: any) {
  const token = data.token || data.session?.access_token;

  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('access_token', token);
  }

  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('role', data.user.role);
  }
}

export async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token && !options.skipAuth) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  // Auth
  register: (email: string, password: string, name: string, role: string = 'customer') =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
      skipAuth: true,
    }),

  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });
    storeAuth(data);
    return data;
  },

  getMe: () => apiRequest('/auth/me'),

  // Products
  getProducts: () => apiRequest('/products', { skipAuth: true }),
  getProduct: (id: string) => apiRequest(`/products/${id}`, { skipAuth: true }),
  createProduct: (product: any) =>
    apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),
  updateProduct: (id: string, product: any) =>
    apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),
  deleteProduct: (id: string) =>
    apiRequest(`/products/${id}`, { method: 'DELETE' }),

  // Orders
  createOrder: (order: any) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
  getMyOrders: () => apiRequest('/orders/my-orders'),
  getAllOrders: () => apiRequest('/orders'),
  updateOrderStatus: (id: string, status: string) =>
    apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Stats
  getCustomerStats: () => apiRequest('/dashboard/customer'),
  getAdminStats: () => apiRequest('/dashboard/admin'),
};
