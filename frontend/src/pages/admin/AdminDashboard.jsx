import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { ArrowUpRight, ShoppingBag, Users, WalletCards } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getProductName, getDisplayText } from '../../utils/localizedText';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const statCards = [
    { label: t.adminTotalSales, value: `EGP ${stats?.totalRevenue || 0}`, icon: WalletCards, change: '+12.5%' },
    { label: t.adminTotalOrders, value: stats?.totalOrders || 0, icon: ShoppingBag, change: '+8.2%' },
    { label: t.adminTotalCustomers, value: stats?.totalUsers || 0, icon: Users, change: '+15.4%' },
  ];

  return (
    <div className="admin-page">
      <div className="mb-10 flex flex-col justify-between gap-8 border-b border-white/10 pb-8 md:flex-row md:items-end">
        <div>
          <p className="admin-kicker">{t.adminDashboard}</p>
          <h1 className="admin-title mt-3">{`${t.adminGoodToSeeYou}.`}</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-[#b8afa3]">{t.adminDashboardIntro}</p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-[10px] font-medium tracking-[0.18em] text-[#8e877d]">APR 1, 2026 — APR 30, 2026</p>
          <p className="mt-2 text-sm text-[#f7f4ee]">{t.adminDashboard}</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.label} className="admin-stat">
            <div className="flex items-start justify-between">
              <p className="admin-stat-label">{card.label}</p>
              <card.icon size={18} strokeWidth={1.4} className="text-[#d9c9b2]" />
            </div>
            <strong className="admin-stat-value">{card.value}</strong>
            <span className="mt-3 block text-[10px] tracking-[0.12em] text-[#a5ae98]">{card.change} FROM LAST MONTH</span>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className="admin-panel p-5 md:p-7">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="admin-kicker">PERFORMANCE / 2026</p>
              <h2 className="mt-2 font-serif text-3xl">Sales overview</h2>
            </div>
            <span className="border border-white/10 px-3 py-2 text-[10px] tracking-[0.12em] text-white/55">APR 1 - APR 30</span>
          </div>
          <div className="relative h-56 border-b border-l border-white/10 bg-[#1e1e1e] p-4">
            <div className="absolute inset-x-4 top-1/4 border-t border-dashed border-white/10" />
            <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-white/10" />
            <div className="absolute inset-x-4 top-3/4 border-t border-dashed border-white/10" />
            <svg viewBox="0 0 700 220" preserveAspectRatio="none" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#dccc83" stopOpacity=".28" />
                  <stop offset="1" stopColor="#dccc83" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 190 C45 185 58 150 100 164 S155 120 195 145 S248 116 285 129 S342 82 378 112 S430 95 465 104 S520 54 552 76 S610 30 700 44 L700 220 L0 220 Z" fill="url(#salesFill)" />
              <path d="M0 190 C45 185 58 150 100 164 S155 120 195 145 S248 116 285 129 S342 82 378 112 S430 95 465 104 S520 54 552 76 S610 30 700 44" fill="none" stroke="#dccc83" strokeWidth="3" />
            </svg>
          </div>
          <div className="mt-3 flex justify-between text-[9px] tracking-[0.12em] text-white/40"><span>APR 01</span><span>APR 08</span><span>APR 15</span><span>APR 22</span><span>APR 30</span></div>
        </section>

        <section className="admin-panel p-5 md:p-7">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="admin-kicker">ACTIVITY / LIVE</p>
              <h2 className="mt-2 font-serif text-3xl">{t.adminOrders}</h2>
            </div>
            <button type="button" onClick={() => navigate('/admin/orders')} className="text-[10px] tracking-[0.12em] text-[#dccc83]">VIEW ALL</button>
          </div>
          <div className="space-y-4">
            {stats?.recentOrders?.slice(0, 4).map((order) => (
              <div key={order._id} className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <p className="text-xs text-[#f7f4ee]">#{order._id.slice(-7).toUpperCase()}</p>
                  <p className="mt-1 text-[10px] text-white/45">{order.user?.name || 'Customer'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#dccc83]">EGP {order.totalPrice}</p>
                  <span className="admin-badge mt-1">{order.orderStatus}</span>
                </div>
              </div>
            )) || <p className="text-sm text-white/45">No orders recorded yet.</p>}
          </div>
        </section>
      </div>

      <div className="mb-10 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <div className="admin-panel p-6 md:p-8">
          <div className="mb-12 flex items-start justify-between">
            <div>
              <p className="admin-kicker">OPERATIONS / PULSE</p>
              <h2 className="mt-2 font-serif text-3xl">What needs attention</h2>
            </div>
            <span className="text-[10px] tracking-[.16em] text-[#8e877d]">CURRENT</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <button onClick={() => navigate('/admin/orders')} className="admin-action-card">
              <span>
                <span className="label">PENDING ORDERS</span>
                <strong className="title">{stats?.pendingOrders || 0}</strong>
              </span>
              <ArrowUpRight size={17} />
            </button>
            <button onClick={() => navigate('/admin/products')} className="admin-action-card">
              <span>
                <span className="label">LOW STOCK</span>
                <strong className="title">{stats?.lowStockProducts || 0}</strong>
              </span>
              <ArrowUpRight size={17} />
            </button>
          </div>
        </div>

        <div className="bg-[#7d3f46] p-6 text-[#f5f1e9] md:p-8">
          <p className="text-[10px] font-medium tracking-[.18em] text-[#f5f1e9]/65">STUDIO NOTE</p>
          <p className="mt-16 font-serif text-4xl leading-[.95]">Keep the edit<br /><i>considered.</i></p>
          <p className="mt-8 text-sm leading-6 text-[#f5f1e9]/75">Review inventory and pending orders before the next collection drop.</p>
        </div>
      </div>

      <div className="mb-10 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <section className="admin-table-wrap overflow-hidden">
          <div className="flex items-end justify-between border-b border-black/10 p-6 md:p-8">
            <div>
              <p className="admin-kicker">ORDERS / LATEST</p>
              <h2 className="mt-2 font-serif text-3xl">{t.adminOrders}</h2>
            </div>
            <button type="button" onClick={() => navigate('/admin/orders')} className="text-[10px] font-medium tracking-[.14em] text-[#d9c9b2]">VIEW ALL <ArrowUpRight size={13} className="inline" /></button>
          </div>
          <div className="divide-y divide-black/10">
            {stats?.recentOrders?.length ? stats.recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between gap-4 px-6 py-4 md:px-8">
                <div>
                  <p className="text-sm text-[#f7f4ee]">{order.user?.name || 'Customer'}</p>
                  <p className="mt-1 text-[10px] tracking-[.12em] text-[#8e877d]">#{order._id.slice(-7).toUpperCase()} / {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#d9c9b2]">EGP {order.totalPrice}</p>
                  <span className="admin-badge mt-1">{order.orderStatus}</span>
                </div>
              </div>
            )) : <p className="p-8 text-sm text-[#625e57]">No orders recorded yet.</p>}
          </div>
        </section>

        <section className="admin-panel p-6 md:p-8">
          <div className="mb-7">
            <p className="admin-kicker">PRODUCTS / MOMENTUM</p>
            <h2 className="mt-2 font-serif text-3xl">Top products</h2>
          </div>
          <div className="space-y-5">
            {stats?.topProducts?.length ? stats.topProducts.map((product, index) => (
              <div key={product._id} className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-2xl text-[#d9c9b2]">0{index + 1}</span>
                  <span className="text-sm">{getDisplayText(product.name, lang, 'Product')}</span>
                </div>
                <span className="text-xs text-[#625e57]">{product.units} sold</span>
              </div>
            )) : <p className="text-sm text-[#625e57]">No product sales yet.</p>}
          </div>
        </section>
      </div>

      <div className="mb-10 grid gap-5 lg:grid-cols-2">
        <section className="admin-panel p-6 md:p-8">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="admin-kicker">INVENTORY / WATCH</p>
              <h2 className="mt-2 font-serif text-3xl">Low stock</h2>
            </div>
            <button type="button" onClick={() => navigate('/admin/products')} className="text-[10px] font-medium tracking-[.14em] text-[#d9c9b2]">MANAGE</button>
          </div>
          <div className="space-y-4">
            {stats?.lowStockList?.length ? stats.lowStockList.map((product) => (
              <div key={product._id} className="flex items-center justify-between border-b border-black/10 pb-3">
                <span className="text-sm">{getDisplayText(product.name, lang, 'Product')}</span>
                <span className="text-sm text-[#d9c9b2]">{product.stock} left</span>
              </div>
            )) : <p className="text-sm text-[#625e57]">No low-stock products.</p>}
          </div>
        </section>

        <section className="admin-panel p-6 md:p-8">
          <div className="mb-7">
            <p className="admin-kicker">CUSTOMER VOICE</p>
            <h2 className="mt-2 font-serif text-3xl">Recent reviews</h2>
          </div>
          <div className="space-y-4">
            {stats?.recentReviews?.length ? stats.recentReviews.map((review) => (
              <div key={review._id} className="border-b border-black/10 pb-4">
                <div className="flex justify-between gap-4">
                  <span className="text-sm">{getProductName(review.product, lang) || 'Product'}</span>
                  <span className="text-xs text-[#d9c9b2]">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#625e57]">{review.comment}</p>
              </div>
            )) : <p className="text-sm text-[#625e57]">No reviews yet.</p>}
          </div>
        </section>
      </div>

      <div className="admin-panel p-6 md:p-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="admin-kicker">SHORTCUTS</p>
            <h2 className="mt-2 font-serif text-3xl">{t.adminDashboard}</h2>
          </div>
          <span className="text-xs text-[#91897e]">Manage the edit</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <button onClick={() => navigate('/admin/products')} className="admin-action-card">
            <span>
              <span className="label">MANAGE</span>
              <strong className="title">{t.adminProducts}</strong>
            </span>
            <ArrowUpRight size={17} />
          </button>
          <button onClick={() => navigate('/admin/categories')} className="admin-action-card">
            <span>
              <span className="label">MANAGE</span>
              <strong className="title">{t.adminCategories}</strong>
            </span>
            <ArrowUpRight size={17} />
          </button>
          <button onClick={() => navigate('/admin/orders')} className="admin-action-card">
            <span>
              <span className="label">MANAGE</span>
              <strong className="title">{t.adminOrders}</strong>
            </span>
            <ArrowUpRight size={17} />
          </button>
          <button onClick={() => navigate('/admin/users')} className="admin-action-card">
            <span>
              <span className="label">MANAGE</span>
              <strong className="title">{t.adminCustomers}</strong>
            </span>
            <ArrowUpRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
