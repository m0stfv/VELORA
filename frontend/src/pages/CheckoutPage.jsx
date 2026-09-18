import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ErrorMessage from '../components/ErrorMessage';
import ScrollReveal from '../components/ScrollReveal';
import PageTransition from '../components/PageTransition';
import api from '../services/api';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import { useLanguage } from '../i18n/LanguageContext';

const inputClass =
  'w-full px-4 py-3 bg-transparent border border-stone-dark text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, getAddresses } = useAuthStore();
  const { isAr } = useLanguage();
  const { items, subtotal, shippingCost, total, clearCart } = useCartStore();
  const { createOrder, loading, error } = useOrderStore();

  const [codEnabled, setCodEnabled] = useState(true);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    paymentMethod: 'COD',
  });
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  useEffect(() => {
    api.get('/settings').then((res) => {
      const enabled = res.data.data?.codEnabled !== false;
      setCodEnabled(enabled);
      if (!enabled) setFormData((prev) => ({ ...prev, paymentMethod: '' }));
    }).catch(() => {});
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    getAddresses().catch(() => {});
  }, [getAddresses, isAuthenticated, items, navigate]);

  useEffect(() => {
    const defaultAddress = user?.addresses?.find((address) => address.isDefault) || user?.addresses?.[0];
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress._id || '');
      setFormData({
        street: defaultAddress.street || '',
        city: defaultAddress.city || '',
        state: defaultAddress.state || '',
        country: defaultAddress.country || '',
        zipCode: defaultAddress.zipCode || '',
        paymentMethod: 'COD',
      });
    }
  }, [user?.addresses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectSavedAddress = (addressId) => {
    const address = user?.addresses?.find((item) => (item._id || item.id) === addressId);
    if (!address) return;
    setSelectedAddressId(addressId);
    setFormData({
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      country: address.country || '',
      zipCode: address.zipCode || '',
      paymentMethod: 'COD',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.street || !formData.city || !formData.state || !formData.country || !formData.zipCode) {
      toast.error('Please fill in all address fields');
      return;
    }

    try {
      const shippingAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
      };

      const createdOrder = await createOrder(shippingAddress, formData.paymentMethod || 'COD');
      await clearCart();
      setCreatedOrderId(createdOrder?._id || '');
      setOrderPlaced(true);
    } catch (err) {
      toast.error(err.message || 'Could not place order');
    }
  };

  if (!isAuthenticated) return null;
  if (items.length === 0) return null;

  if (orderPlaced) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen bg-cream">
          <Navbar />
          <div className="flex-1 flex items-center justify-center px-6 py-20">
            <div className="text-center">
              <p className="font-serif text-5xl text-olive mb-6">✓</p>
              <h2 className="font-serif text-3xl text-ink mb-3">Order placed</h2>
              <p className="text-sm text-ink-soft mb-8">Your order is confirmed and will be paid on delivery.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                {createdOrderId && (
                  <button type="button" onClick={() => navigate(`/orders/${createdOrderId}`)} className="velora-button">
                    View Order Details
                  </button>
                )}
                <button type="button" onClick={() => navigate('/orders')} className="velora-button velora-button-secondary">
                  View All Orders
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-cream" dir={isAr ? 'rtl' : 'ltr'}>
        <Navbar />

        <div className="flex-1 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-1 text-xs text-ink-soft hover:text-ink mb-8 transition"
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
              Back to Bag
            </button>

            <div className="mb-10 border-b border-ink/15 pb-7"><p className="velora-eyebrow mb-3">VELORA / FINAL STEP</p><h1 className="velora-display text-5xl text-ink md:text-6xl">Complete your order.</h1></div>

            {error && <ErrorMessage message={error} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <ScrollReveal>
                    <div className="border border-ink/15 bg-paper p-6 md:p-8">
                      <h2 className="text-[11px] tracking-widest2 text-ink mb-6">SHIPPING ADDRESS</h2>

                      {user?.addresses?.length > 0 && (
                        <div className="mb-5">
                          <label className="mb-2 block text-[10px] tracking-widest2 text-ink-soft">SAVED ADDRESSES</label>
                          <select
                            value={selectedAddressId}
                            onChange={(event) => handleSelectSavedAddress(event.target.value)}
                            className={inputClass}
                          >
                            <option value="">Use a different address</option>
                            {user.addresses.map((address) => (
                              <option key={address._id || address.id} value={address._id || address.id}>
                                {address.street}, {address.city} ({address.isDefault ? 'Default' : 'Saved'})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="space-y-4">
                        <input type="text" name="street" placeholder="Street Address" value={formData.street} onChange={handleInputChange} className={inputClass} />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className={inputClass} />
                          <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleInputChange} className={inputClass} />
                          <input type="text" name="zipCode" placeholder="ZIP Code" value={formData.zipCode} onChange={handleInputChange} className={inputClass} />
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={0.1}>
                    <div className="border border-ink/15 bg-paper p-6 md:p-8">
                      <h2 className="text-[11px] tracking-widest2 text-ink mb-6">PAYMENT METHOD</h2>
                      <div className="space-y-3">
                        {codEnabled && (
                        <label className={`flex items-center gap-3 p-4 border cursor-pointer transition ${formData.paymentMethod === 'COD' ? 'border-ink' : 'border-stone-dark'}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="COD"
                            checked={formData.paymentMethod === 'COD'}
                            onChange={handleInputChange}
                            className="w-4 h-4 accent-ink"
                          />
                          <Banknote size={17} strokeWidth={1.5} className="text-ink-soft" />
                          <span className="text-sm text-ink">Cash on Delivery</span>
                        </label>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-ink text-cream py-4 text-[11px] tracking-widest2 hover:bg-clay transition disabled:opacity-50"
                  >
                    {loading ? 'PROCESSING...' : 'PLACE ORDER'}
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <ScrollReveal delay={0.2}>
                  <div className="sticky top-24 border border-ink/20 bg-paper p-6 shadow-[0_18px_42px_rgba(36,35,32,0.06)]">
                    <h2 className="text-[11px] tracking-widest2 text-ink mb-6">ORDER SUMMARY</h2>

                    <div className="space-y-3 mb-6 border-b border-stone-dark pb-6 text-sm">
                      {items.map((item) => (
                        <div key={item.productId} className="flex justify-between text-ink-soft">
                          <span>{item.productName} ×{item.quantity}</span>
                          <span>EGP {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-ink-soft">
                        <span>Subtotal</span>
                        <span>EGP {subtotal}</span>
                      </div>
                      <div className="flex justify-between text-ink-soft">
                        <span>Shipping</span>
                        <span>EGP {shippingCost}</span>
                      </div>
                      <div className="border-t border-stone-dark pt-3 flex justify-between text-ink">
                        <span>Total</span>
                        <span className="text-clay">EGP {total}</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}
