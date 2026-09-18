import { create } from 'zustand';
import api from '../services/api';

export const useWishlistStore = create((set) => ({
  items: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/wishlist');
      set({ items: response.data.data?.products || [], loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addToWishlist: async (productId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/wishlist/${productId}`);
      const wishlist = response.data.data;
      set({ items: wishlist.products || [], loading: false });
      return wishlist;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to wishlist';
      set({ error: message, loading: false });
      throw error;
    }
  },

  removeFromWishlist: async (productId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/wishlist/${productId}`);
      const wishlist = response.data.data;
      set({ items: wishlist.products || [], loading: false });
      return wishlist;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
