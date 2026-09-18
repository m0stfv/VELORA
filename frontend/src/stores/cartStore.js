import { create } from 'zustand';
import api from '../services/api';
import { FREE_SHIPPING_THRESHOLD } from '../utils/formatPrice';
import { getLocalizedText } from '../utils/localizedText';

const GUEST_KEY = 'velora_guest_cart';
const SHIPPING_COST = 80;

const totalsFrom = (items) => {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shippingCost = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  return { subtotal, shippingCost, total: subtotal + shippingCost };
};

const readGuest = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeGuest = (items) => {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
};

const productIdOf = (item) => item.product?._id || item.productId;

const normalizeItems = (items = []) =>
  items.map((item) => {
    const product = item.product;
    const currentLanguage = localStorage.getItem('velora-lang') || 'ar';
    return {
      ...item,
      productId: product?._id || item.productId,
      productName: getLocalizedText(product?.name || item.productName, currentLanguage, 'ar'),
      productImage: product?.images?.[0] || item.productImage,
      size: item.size || '',
      color: item.color || '',
    };
  });

const applyCart = (set, data) => {
  const items = normalizeItems(data.items || []);
  const totals = data.subtotal != null ? {
    subtotal: data.subtotal,
    shippingCost: data.shippingCost || 0,
    total: data.total ?? data.subtotal + (data.shippingCost || 0),
  } : totalsFrom(items);
  set({ items, ...totals, loading: false, error: null });
};

const isAuthed = () => Boolean(localStorage.getItem('token'));

export const useCartStore = create((set, get) => ({
  items: [],
  subtotal: 0,
  shippingCost: 0,
  total: 0,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    if (!isAuthed()) {
      const items = normalizeItems(readGuest());
      set({ items, ...totalsFrom(items), loading: false });
      return;
    }
    try {
      const response = await api.get('/cart');
      applyCart(set, response.data.data);
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addToCart: async (productId, quantity, extra = {}) => {
    const { size = '', color = '', product } = extra;
    set({ loading: true, error: null });

    if (!isAuthed()) {
      const items = normalizeItems(readGuest());
      const existing = items.find(
        (item) => item.productId === productId && item.size === size && item.color === color
      );
      const price = product?.discountPrice || product?.price || 0;
      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push({
          productId,
          productName: product?.name,
          productImage: product?.images?.[0],
          quantity,
          price,
          size,
          color,
          product,
        });
      }
      writeGuest(items);
      set({ items, ...totalsFrom(items), loading: false });
      return;
    }

    try {
      const response = await api.post('/cart', { productId, quantity, size, color });
      applyCart(set, response.data.data);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      set({ error: message, loading: false });
      throw error;
    }
  },

  updateQuantity: async (productId, quantity, extra = {}) => {
    const { size = '', color = '' } = extra;
    set({ loading: true, error: null });

    if (!isAuthed()) {
      const items = normalizeItems(readGuest()).map((item) =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      );
      writeGuest(items);
      set({ items, ...totalsFrom(items), loading: false });
      return;
    }

    try {
      const response = await api.put(`/cart/${productId}`, { quantity, size, color });
      applyCart(set, response.data.data);
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  removeFromCart: async (productId, extra = {}) => {
    const { size = '', color = '' } = extra;
    set({ loading: true, error: null });

    if (!isAuthed()) {
      const items = normalizeItems(readGuest()).filter(
        (item) => !(item.productId === productId && item.size === size && item.color === color)
      );
      writeGuest(items);
      set({ items, ...totalsFrom(items), loading: false });
      return;
    }

    try {
      const response = await api.delete(`/cart/${productId}`, { params: { size, color } });
      applyCart(set, response.data.data);
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  mergeGuestCart: async () => {
    const guest = readGuest();
    if (!guest.length || !isAuthed()) return;
    for (const item of guest) {
      await api.post('/cart', {
        productId: productIdOf(item),
        quantity: item.quantity,
        size: item.size || '',
        color: item.color || '',
      });
    }
    writeGuest([]);
    await get().fetchCart();
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    writeGuest([]);
    if (!isAuthed()) {
      set({ items: [], subtotal: 0, shippingCost: 0, total: 0, loading: false });
      return;
    }
    try {
      const response = await api.delete('/cart');
      applyCart(set, response.data.data || { items: [] });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
