import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import PageTransition from '../components/PageTransition';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { orders, loading, error, fetchUserOrders } = useOrderStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserOrders();
  }, [fetchUserOrders, isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <PageTransition>
    <div className="velora-page flex flex-col">
      <Navbar />

      <div className="flex-1 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 border-b border-stone-dark pb-6">
            <p className="mb-3 text-[10px] tracking-widest2 text-clay">YOUR JOURNEY</p>
            <h1 className="font-serif text-4xl text-ink md:text-5xl">My Orders</h1>
          </div>

          {error && <ErrorMessage message={error} />}

          {loading ? (
            <LoadingSpinner />
          ) : orders && orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <Link
                  key={order._id}
                  to={`/orders/${order._id}`}
                  className="group block border-b border-stone-dark py-6 transition hover:border-ink"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        <div>
                          <p className="mb-2 text-[10px] tracking-widest2 text-muted">ORDER ID</p>
                          <p className="truncate text-sm text-ink">{order._id}</p>
                        </div>
                        <div>
                          <p className="mb-2 text-[10px] tracking-widest2 text-muted">DATE</p>
                          <p className="text-sm text-ink">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="mb-2 text-[10px] tracking-widest2 text-muted">STATUS</p>
                          <p className="text-sm text-ink">
                            <span
                              className={`inline-block border px-2 py-1 text-[10px] tracking-widest2 ${
                                order.orderStatus === 'DELIVERED'
                                  ? 'border-olive text-olive'
                                  : order.orderStatus === 'CANCELLED'
                                  ? 'border-red-700 text-red-700'
                                  : 'border-clay text-clay'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="mb-2 text-[10px] tracking-widest2 text-muted">TOTAL</p>
                          <p className="text-sm text-clay">EGP {Number(order.totalPrice ?? (order.subtotal || 0) + (order.shippingCost || 0))}</p>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="mt-5 text-xs text-ink-soft">
                        <p>
                          {order.orderItems?.length} item(s) •{' '}
                          {order.orderItems?.reduce((sum, item) => sum + item.quantity, 0)} units
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-muted transition group-hover:text-ink" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="velora-panel py-20 text-center">
              <p className="mb-6 font-serif text-2xl text-ink">You haven't placed any orders yet</p>
              <Link
                to="/shop"
                className="velora-button mx-auto"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
    </PageTransition>
  );
}
