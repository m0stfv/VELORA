import { create } from 'zustand';
import api from '../services/api';

export const useOrderStore = create((set) => ({
  orders: [],
  order: null,
  loading: false,
  error: null,

  createOrder: async (shippingAddress, paymentMethod = 'COD') => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/orders', {
        shippingAddress,
        paymentMethod,
      });
      set({ order: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create order';
      set({ error: message, loading: false });
      throw error;
    }
  },

  fetchUserOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/orders/my-orders');
      set({ orders: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/orders/${id}`);
      set({ order: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateOrderStatus: async (id, payload = {}) => {
    set({ loading: true, error: null });
    try {
      const requestBody = {
        orderStatus: payload.orderStatus ?? payload.status,
        paymentStatus: payload.paymentStatus,
      };
      const response = await api.put(`/orders/${id}/status`, requestBody);
      set({ order: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
