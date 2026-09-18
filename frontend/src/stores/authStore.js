import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  authInitialized: false,
  loading: false,
  error: null,

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', response.data.token);
      set({
        token: response.data.token,
        user: response.data.data,
        isAuthenticated: true,
        loading: false,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      set({
        token: response.data.token,
        user: response.data.data,
        isAuthenticated: true,
        loading: false,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data.data });
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 401) {
        set({ isAuthenticated: false, token: null, user: null });
        localStorage.removeItem('token');
      }
      throw error;
    }
  },

  setAuthInitialized: (value) => set({ authInitialized: value }),

  getAddresses: async () => {
    const response = await api.get('/auth/addresses');
    set((state) => ({ user: { ...state.user, addresses: response.data.data || [] } }));
    return response.data.data || [];
  },

  addAddress: async (address) => {
    const response = await api.post('/auth/addresses', address);
    set((state) => ({ user: { ...state.user, addresses: response.data.data || [] } }));
    return response.data.data || [];
  },

  updateAddress: async (addressId, address) => {
    const response = await api.put(`/auth/addresses/${addressId}`, address);
    set((state) => ({ user: { ...state.user, addresses: response.data.data || [] } }));
    return response.data.data || [];
  },

  deleteAddress: async (addressId) => {
    const response = await api.delete(`/auth/addresses/${addressId}`);
    set((state) => ({ user: { ...state.user, addresses: response.data.data || [] } }));
    return response.data.data || [];
  },

  setDefaultAddress: async (addressId) => {
    const response = await api.patch(`/auth/addresses/${addressId}/default`);
    set((state) => ({ user: { ...state.user, addresses: response.data.data || [] } }));
    return response.data.data || [];
  },

  clearError: () => set({ error: null }),

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/forgot-password', { email });
      set({ loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      set({ error: message, loading: false });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      set({ loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      set({ error: message, loading: false });
      throw error;
    }
  },
}));
