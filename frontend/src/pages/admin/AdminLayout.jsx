import { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { FolderKanban, LayoutDashboard, LogOut, Menu, Package, Tags, Users, X, Star, ArrowUpRight, Settings } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useLanguage } from '../../i18n/LanguageContext';
import './admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { lang, t, toggle } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/');
    }
  }, [isAuthenticated, navigate, user?.role]);

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminLinks = [
    { path: '/admin', label: t.adminDashboard, icon: LayoutDashboard },
    { path: '/admin/products', label: t.adminProducts, icon: Package },
    { path: '/admin/categories', label: t.adminCategories, icon: Tags },
    { path: '/admin/orders', label: t.adminOrders, icon: FolderKanban },
    { path: '/admin/users', label: t.adminCustomers, icon: Users },
    { path: '/admin/reviews', label: t.adminReviews, icon: Star },
  ];

  return (
    <div className="admin-shell flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-20'} admin-sidebar fixed left-0 top-0 flex h-screen flex-col transition-all duration-300 max-md:w-64 ${sidebarOpen ? '' : 'admin-drawer-closed'}`}
      >
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            {sidebarOpen && <div><p className="text-[9px] tracking-[0.28em] text-white/45">VELORA</p><h1 className="mt-1 font-serif text-2xl tracking-[0.2em] text-white">VELORA</h1></div>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-white/60 hover:bg-white/10" aria-label="Toggle admin navigation">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <p className={`${sidebarOpen ? 'block' : 'hidden'} mb-4 px-3 text-[9px] tracking-[0.22em] text-white/35`}>{t.adminWorkspace}</p>
          <div className="space-y-1">
            {adminLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-4 p-3 text-sm"
                aria-current={location.pathname === link.path ? 'page' : undefined}
              >
                <link.icon size={17} strokeWidth={1.5} />
                {sidebarOpen && <span className="font-semibold">{link.label}</span>}
              </Link>
            ))}
            <div className="mt-8 border-t border-white/10 pt-5"><Link to="/admin/settings" className="flex items-center gap-4 p-3 text-sm"><Settings size={17} strokeWidth={1.5} />{sidebarOpen && <span className="font-semibold">{t.adminSettings}</span>}</Link><p className={`${sidebarOpen ? 'block' : 'hidden'} mb-2 px-3 text-[9px] tracking-[0.22em] text-white/35`}>{t.adminSystem}</p></div>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-white/10 p-4">
          {sidebarOpen && <div className="mb-4 flex items-center gap-3 px-3"><div className="flex h-8 w-8 items-center justify-center bg-beige text-xs text-ink">{(user?.name || 'A').slice(0, 1).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-xs text-white">{user?.name || 'Admin'}</p><p className="text-[9px] tracking-[0.12em] text-white/40">ADMINISTRATOR</p></div></div>}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 p-3 text-sm"
          >
            <LogOut size={24} />
            {sidebarOpen && <span className="font-semibold">{t.adminLogout}</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex min-h-screen flex-1 flex-col transition-all duration-300 max-md:ml-0`}>
        <header className="flex min-h-[72px] items-center justify-between border-b border-white/10 bg-[#292723] px-5 text-[#f5f1e9] md:px-8">
          <div className="flex items-center gap-4"><button onClick={() => setSidebarOpen(!sidebarOpen)} className="admin-button !border-white/20 !bg-transparent !px-2 !text-[#f5f1e9] md:hidden" aria-label="Toggle admin navigation"><Menu size={19} /></button><div><p className="text-[9px] font-medium tracking-[0.2em] text-[#968d81]">{t.adminDashboard} / {new Date().getFullYear()}</p><p className="mt-1 text-sm text-[#f5f1e9]">{t.adminGoodToSeeYou}, {user?.name || 'Admin'}</p></div></div>
          <button type="button" onClick={toggle} className="admin-lang-toggle" aria-label="Toggle language">{lang === 'ar' ? 'EN' : 'عربي'}</button><Link to="/" className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.14em] text-[#c8bfb2] hover:text-[#a85d61]">{t.adminViewStore} <ArrowUpRight size={14} /></Link>
        </header>
        <div className="admin-content flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
