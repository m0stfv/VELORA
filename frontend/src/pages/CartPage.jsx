import { useEffect } from 'react';
import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import PageTransition from '../components/PageTransition';
import ProductImage from '../components/ProductImage';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useLanguage } from '../i18n/LanguageContext';

const FREE_SHIPPING_THRESHOLD = 1500;

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { isAr } = useLanguage();
  const { items, subtotal, shippingCost, total, loading, error, fetchCart, removeFromCart, updateQuantity } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart, isAuthenticated]);

  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <PageTransition>
      <main className="velora-page" dir={isAr ? 'rtl' : 'ltr'}>
        <Navbar />

        <header className="border-b border-ink/10 bg-stone px-6 pb-14 pt-36 md:px-12">
          <div className="mx-auto max-w-[1400px]">
            <p className="velora-eyebrow">VELORA / YOUR EDIT</p>
            <h1 className="velora-display mt-5 text-7xl leading-[.82] md:text-[9rem]">Your <i>bag.</i></h1>
          </div>
        </header>

        <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-12">
          {error && <ErrorMessage message={error} />}

          {loading ? (
            <LoadingSpinner />
          ) : items.length > 0 ? (
            <div className="grid gap-14 lg:grid-cols-[1fr_370px]">
              <section>
                <div className="mb-8 flex items-center justify-between border-b border-ink pb-4">
                  <span className="text-[10px] tracking-[0.2em]">SELECTED PIECES</span>
                  <span className="text-xs text-muted">{String(items.length).padStart(2, '0')}</span>
                </div>

                <div className="divide-y divide-stone-dark">
                  {items.map((item) => (
                    <article key={`${item.productId}-${item.size || ''}-${item.color || ''}`} className="grid gap-5 py-7 sm:grid-cols-[150px_1fr_auto] sm:items-center">
                      <ProductImage src={item.productImage} alt={item.productName} className="h-48 w-full object-cover sm:h-44" />

                      <div>
                        <p className="mb-2 text-[9px] tracking-[0.2em] text-clay">VELORA PIECE</p>
                        <h2 className="font-serif text-3xl">{item.productName}</h2>
                        <p className="mt-2 text-sm text-ink-soft">EGP {item.price}</p>
                        {(item.size || item.color) && (
                          <p className="mt-3 text-xs text-muted">
                            {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(' · ')}
                          </p>
                        )}

                        <div className="mt-6 flex w-fit items-center border border-stone-dark">
                          <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1, item)} className="p-2" aria-label="Decrease quantity">
                            <Minus size={13} />
                          </button>
                          <span className="px-4 text-xs">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1, item)} className="p-2" aria-label="Increase quantity">
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-6 sm:block sm:text-right">
                        <p className="text-sm text-clay">EGP {item.price * item.quantity}</p>
                        <button type="button" onClick={() => removeFromCart(item.productId, item)} className="mt-5 text-muted hover:text-clay" aria-label="Remove item">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="self-start lg:sticky lg:top-24">
                <div className="border border-ink/20 bg-paper p-7 shadow-[0_18px_42px_rgba(36,35,32,0.06)]">
                  <p className="text-[10px] tracking-[0.2em]">ORDER / SUMMARY</p>

                  <div className="mt-10 space-y-4 text-sm">
                    <div className="flex justify-between text-ink-soft">
                      <span>Subtotal</span>
                      <span>EGP {subtotal}</span>
                    </div>
                    <div className="flex justify-between text-ink-soft">
                      <span>Shipping</span>
                      <span>{shippingCost ? `EGP ${shippingCost}` : 'FREE'}</span>
                    </div>
                    <div className="border-t border-stone-dark pt-4 flex justify-between text-lg">
                      <span>Total</span>
                      <span className="text-clay">EGP {total}</span>
                    </div>
                  </div>

                  <div className="mt-8 h-1 bg-stone">
                    <div className="h-1 bg-clay" style={{ width: `${progress}%` }} />
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/checkout')}
                    className="mt-8 flex w-full items-center justify-center gap-3 bg-ink py-4 text-[10px] tracking-[0.2em] text-cream hover:bg-clay"
                  >
                    CHECKOUT <ArrowRight size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/shop')}
                    className="mt-4 w-full border border-stone-dark py-3 text-[10px] tracking-[0.2em]"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              </aside>
            </div>
          ) : (
            <div className="border-t border-ink py-28 text-center">
              <p className="font-serif text-5xl">Your bag is empty.</p>
              <button type="button" onClick={() => navigate('/shop')} className="mt-8 inline-flex items-center gap-3 border-b border-ink pb-2 text-[10px] tracking-[0.2em]">
                START SHOPPING <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </PageTransition>
  );
}
