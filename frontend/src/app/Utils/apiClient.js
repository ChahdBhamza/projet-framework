// Frontend API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Auth endpoints
  auth: {
    signin: (email, password) =>
      apiClient.request('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    signup: (email, password, name) =>
      apiClient.request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }),
    verifyEmail: (token) =>
      apiClient.request('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      }),
    resendVerification: (email) =>
      apiClient.request('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    resetPassword: (email) =>
      apiClient.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    confirmReset: (token, newPassword) =>
      apiClient.request('/auth/reset-password/confirm', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      }),
  },

  // Meals endpoints
  meals: {
    getAll: () => apiClient.request('/meals'),
    getById: (id) => apiClient.request(`/meals/${id}`),
    create: (mealData) =>
      apiClient.request('/meals', {
        method: 'POST',
        body: JSON.stringify(mealData),
      }),
  },

  // Orders endpoints
  orders: {
    getAll: () => apiClient.request('/orders'),
    getMyOrders: () => apiClient.request('/orders/my-orders'),
    create: (orderData) =>
      apiClient.request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
  },

  // Purchases endpoints
  purchases: {
    getAll: () => apiClient.request('/purchases'),
    create: (purchaseData) =>
      apiClient.request('/purchases', {
        method: 'POST',
        body: JSON.stringify(purchaseData),
      }),
  },

  // Favorites endpoints
  favorites: {
    getAll: () => apiClient.request('/favorites'),
    add: (mealId) =>
      apiClient.request('/favorites', {
        method: 'POST',
        body: JSON.stringify({ mealId }),
      }),
    remove: (mealId) =>
      apiClient.request(`/favorites/${mealId}`, { method: 'DELETE' }),
  },

  // Meal plans endpoints
  mealPlans: {
    getAll: () => apiClient.request('/meal-plans'),
    getMyPlans: () => apiClient.request('/meal-plans/user/my-plans'),
    create: (planData) =>
      apiClient.request('/meal-plans', {
        method: 'POST',
        body: JSON.stringify(planData),
      }),
  },

  // User endpoints
  user: {
    getProfile: () => apiClient.request('/user/profile'),
    updateProfile: (profileData) =>
      apiClient.request('/user/update-profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
    changePassword: (currentPassword, newPassword) =>
      apiClient.request('/user/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },

  // Admin endpoints
  admin: {
    getActivityLogs: () => apiClient.request('/admin/activity-logs'),
    getSummary: () => apiClient.request('/admin/summary'),
  },
};

export default apiClient;
