import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronLeft, Circle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ProductImage from '../components/ProductImage';
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../i18n/LanguageContext';
import { getDisplayText } from '../utils/localizedText';

const ORDER_STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { order, loading, error, fetchOrder } = useOrderStore();
  const { isAr, lang } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [fetchOrder, isAuthenticated, navigate, orderId]);

  if (!isAuthenticated) return null;

  const statusLabels = {
    PENDING: isAr ? 'قيد الانتظار' : 'PENDING',
    CONFIRMED: isAr ? 'مؤكد' : 'CONFIRMED',
    PROCESSING: isAr ? 'قيد التجهيز' : 'PREPARING',
    SHIPPED: isAr ? 'تم الشحن' : 'SHIPPED',
    DELIVERED: isAr ? 'تم التسليم' : 'DELIVERED',
    CANCELLED: isAr ? 'ملغي' : 'CANCELLED',
  };

  return (
    <PageTransition>
      <div className="velora-page flex min-h-screen flex-col" dir={isAr ? 'rtl' : 'ltr'}>
        <Navbar />

        <div className="flex-1 py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate('/orders')}
              className="mb-8 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-ink-soft transition hover:text-clay"
            >
              <ChevronLeft size={18} />
              {isAr ? 'العودة إلى طلباتي' : 'BACK TO MY ORDERS'}
            </button>

            {error && <ErrorMessage message={error} />}

            {loading ? (
              <LoadingSpinner />
            ) : order ? (
              <div className="space-y-10">
                <header className="border-b border-ink/10 pb-8">
                  <p className="mb-3 text-[10px] tracking-[0.22em] text-clay">
                    {isAr ? 'رحلتك' : 'YOUR JOURNEY'}
                  </p>
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <h1 className="font-serif text-4xl text-ink md:text-5xl">
                        {isAr ? 'رحلتك' : 'Your journey'}
                      </h1>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-[10px] tracking-[0.2em] text-muted">
                        {isAr ? 'رقم الطلب' : 'ORDER'} #{order._id}
                      </p>
                      <p className="mt-2 text-sm text-ink-soft">
                        {isAr ? 'تاريخ الطلب' : 'Placed'} {new Date(order.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                      </p>
                    </div>
                  </div>
                </header>

                <section className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[10px] tracking-[0.22em] text-ink-soft">
                      {isAr ? 'الحالة' : 'STATUS'}
                    </p>
                    <span className="border border-ink/15 bg-stone/40 px-2.5 py-1 text-[10px] tracking-[0.2em] text-ink">
                      {statusLabels[order.orderStatus] || order.orderStatus}
                    </span>
                  </div>

                  <div className="velora-order-timeline grid gap-3 sm:grid-cols-5">
                    {ORDER_STEPS.map((step, index) => {
                      const currentIndex = ORDER_STEPS.indexOf(order.orderStatus);
                      const complete = order.orderStatus !== 'CANCELLED' && index <= currentIndex;
                      const isCurrent = index === currentIndex;

                      return (
                        <div key={step} className="relative flex items-center gap-3 sm:block">
                          <div className="flex items-center sm:block">
                            <div className={`relative z-10 flex h-8 w-8 items-center justify-center border text-[9px] ${
                              complete
                                ? 'border-ink bg-ink text-cream'
                                : isCurrent
                                  ? 'border-ink bg-transparent text-ink'
                                  : 'border-stone-dark bg-transparent text-muted'
                            }`}>
                              {index + 1}
                            </div>
                            {index < ORDER_STEPS.length - 1 && (
                              <div className={`hidden h-px flex-1 sm:mt-3 sm:block ${
                                complete ? 'bg-ink' : 'bg-stone-dark'
                              }`} />
                            )}
                          </div>
                          <p className={`mt-2 text-[9px] tracking-[0.18em] ${complete || isCurrent ? 'text-ink' : 'text-muted'}`}>
                            {step === 'PENDING' ? (isAr ? 'تم الطلب' : 'ORDER PLACED') : step === 'CONFIRMED' ? (isAr ? 'مؤكد' : 'CONFIRMED') : step === 'PROCESSING' ? (isAr ? 'تجهيز' : 'PREPARING') : step === 'SHIPPED' ? (isAr ? 'تم الشحن' : 'SHIPPED') : isAr ? 'تم التسليم' : 'DELIVERED'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
                  <div className="space-y-8">
                    <div className="border-b border-ink/10 pb-8">
                      <h2 className="mb-6 font-serif text-3xl text-ink">{isAr ? 'المنتجات' : 'Items'}</h2>

                      <div className="space-y-6">
                        {order.orderItems?.map((item) => {
                          const productName = getDisplayText(item.product?.name || item.productName || item.name, lang, 'Product');
                          const categoryName = getDisplayText(item.product?.category?.name || item.categoryName, lang, 'Collection');

                          return (
                            <div key={item._id} className="flex flex-col gap-4 border-b border-ink/10 pb-5 sm:flex-row sm:items-center">
                              <div className="overflow-hidden bg-stone sm:w-[160px]">
                                <ProductImage
                                  src={item.product?.images?.[0] || '/fashion-placeholder.svg'}
                                  alt={productName}
                                  className="h-32 w-full object-cover sm:h-40"
                                />
                              </div>

                              <div className="flex-1 space-y-2">
                                <p className="text-[10px] tracking-[0.2em] text-muted">{categoryName}</p>
                                <h3 className="text-lg text-ink">{productName}</h3>
                                {(item.size || item.color) && (
                                  <p className="text-sm text-ink-soft">{[item.size, item.color].filter(Boolean).join(' · ')}</p>
                                )}
                                <p className="text-sm text-ink-soft">
                                  {isAr ? 'الكمية' : 'Quantity'}: {item.quantity}
                                </p>
                              </div>

                              <div className="sm:text-right">
                                <p className="text-[10px] tracking-[0.2em] text-muted">{isAr ? 'السعر' : 'Price'}</p>
                                <p className="mt-2 text-lg text-clay">EGP {Number(item.price || 0)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-b border-ink/10 pb-8">
                      <h2 className="mb-5 font-serif text-3xl text-ink">{isAr ? 'عنوان الشحن' : 'Shipping address'}</h2>
                      <div className="max-w-md space-y-2 text-sm text-ink-soft">
                        {order.shippingAddress?.street && <p>{order.shippingAddress.street}</p>}
                        <p>
                          {order.shippingAddress?.city && `${order.shippingAddress.city}, `}
                          {order.shippingAddress?.state && `${order.shippingAddress.state} `}
                          {order.shippingAddress?.zipCode}
                        </p>
                        {order.shippingAddress?.country && <p>{order.shippingAddress.country}</p>}
                      </div>
                    </div>
                  </div>

                  <aside className="lg:pl-6">
                    <div className="border-t border-ink/10 pt-8 xl:border-t-0 xl:border-l xl:pl-8 xl:pt-0">
                      <h2 className="mb-6 font-serif text-3xl text-ink">{isAr ? 'ملخص الطلب' : 'Order summary'}</h2>
                      <div className="space-y-4 text-sm text-ink-soft">
                        <div className="flex items-center justify-between gap-4">
                          <span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                          <span className="text-ink">EGP {Number(order.subtotal ?? (Number(order.totalPrice || 0) - Number(order.shippingCost || 0)))}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span>{isAr ? 'الشحن' : 'Shipping'}</span>
                          <span className="text-ink">EGP {Number(order.shippingCost || 0)}</span>
                        </div>
                        <div className="border-t border-ink/10 pt-4">
                          <div className="flex items-center justify-between gap-4 text-base text-ink">
                            <span>{isAr ? 'الإجمالي' : 'Total'}</span>
                            <span className="text-clay">EGP {Number(order.totalPrice || 0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>
                </section>
              </div>
            ) : (
              <ErrorMessage message="Order not found" />
            )}
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}
