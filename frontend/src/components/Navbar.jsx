import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Heart, LogOut, Menu, Search, Settings, ShoppingBag, User, X } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useLanguage } from '../i18n/LanguageContext';

export default function Navbar({ overlay = false }) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const { lang, setLang, isAr, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    if (query.trim()) navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  const navItems = [
    ['/', isAr ? 'الرئيسية' : 'Home'],
    ['/shop', isAr ? 'المتجر' : 'Shop'],
    ['/about', isAr ? 'قصتنا' : 'About'],
    ['/journal', isAr ? 'المجلة' : 'Journal'],
  ];

  const dark = overlay && !scrolled;
  const active = (path) => {
    if (path === '/') return location.pathname === '/' ? 'opacity-100' : 'opacity-70';
    return location.pathname.startsWith(path) ? 'opacity-100' : 'opacity-70';
  };

  return (
    <>
      <header className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
        dark
          ? 'border-white/10 bg-transparent text-cream'
          : 'border-ink/10 bg-cream/95 text-ink shadow-sm backdrop-blur'
      }`}>
        <div className="mx-auto grid h-[72px] max-w-[1380px] grid-cols-[1fr_auto_1fr] items-center px-5 md:h-20 md:px-10">
          <Link to="/" className="font-serif text-[1.35rem] tracking-[0.28em]">VELORA</Link>

          <nav className="hidden items-center gap-8 text-[11px] tracking-[0.16em] md:flex">
            {navItems.map(([path, label]) => (
              <Link key={path} to={path} className={`transition hover:opacity-100 ${active(path)}`}>{label}</Link>
            ))}
          </nav>

          <div className={`flex items-center justify-end gap-4 ${dark ? 'text-cream' : 'text-ink-soft'}`}>
            <button type="button" onClick={() => setSearchOpen(true)} aria-label={isAr ? 'بحث' : 'Search'}><Search size={16} strokeWidth={1.4} /></button>
            <button type="button" onClick={() => setLang((value) => value === 'ar' ? 'en' : 'ar')} className="hidden text-[10px] tracking-widest2 md:block">{lang === 'ar' ? 'EN' : 'AR'}</button>
            {isAuthenticated && <Link to="/wishlist" aria-label={isAr ? 'المفضلة' : 'Wishlist'}><Heart size={16} strokeWidth={1.4} /></Link>}
            {isAuthenticated ? (
              <div className="relative hidden md:block" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-label={isAr ? 'الحساب' : 'Account'}
                  aria-expanded={accountOpen}
                >
                  <User size={16} strokeWidth={1.4} />
                </button>
                {accountOpen && (
                  <div className={`absolute top-full mt-3 min-w-[180px] border border-stone-dark bg-cream py-2 text-ink shadow-lg ${isAr ? 'left-0' : 'right-0'}`}>
                    <Link to="/profile" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-[11px] tracking-[0.14em] hover:bg-stone">
                      {isAr ? 'حسابي' : 'MY PROFILE'}
                    </Link>
                    <Link to="/orders" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-[11px] tracking-[0.14em] hover:bg-stone">
                      {isAr ? 'طلباتي' : 'MY ORDERS'}
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.14em] hover:bg-stone">
                        <Settings size={13} /> {isAr ? 'لوحة التحكم' : 'ADMIN DASHBOARD'}
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => { logout(); setAccountOpen(false); navigate('/'); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-[11px] tracking-[0.14em] hover:bg-stone"
                    >
                      <LogOut size={13} /> {isAr ? 'تسجيل الخروج' : 'LOGOUT'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" aria-label="Account" className="hidden md:block"><User size={16} strokeWidth={1.4} /></Link>
            )}
            <Link to={isAuthenticated ? '/profile' : '/login'} aria-label="Account" className="md:hidden"><User size={16} strokeWidth={1.4} /></Link>
            <Link to="/cart" className="relative" aria-label={isAr ? 'السلة' : 'Cart'}>
              <ShoppingBag size={16} strokeWidth={1.4} />
              <span className="absolute -right-2.5 -top-2 text-[9px]">{items.length}</span>
            </Link>
            <button type="button" onClick={() => setMenuOpen(true)} className="md:hidden" aria-label={isAr ? 'فتح القائمة' : 'Open menu'}><Menu size={17} /></button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-cream p-6 text-ink" role="dialog" aria-modal="true">
          <div className="flex items-center justify-between border-b border-stone-dark pb-5">
            <span className="font-serif text-2xl tracking-[0.25em]">VELORA</span>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label={isAr ? 'إغلاق' : 'Close'}><X size={21} /></button>
          </div>
          <nav className="flex flex-col gap-5 py-12 font-serif text-4xl">
            {navItems.map(([path, label]) => <Link key={path} to={path} onClick={() => setMenuOpen(false)}>{label}</Link>)}
            <Link to="/shop?category=shirts" onClick={() => setMenuOpen(false)}>{isAr ? 'قمصان' : 'Shirts'}</Link>
            <Link to="/shop?category=coats-outerwear" onClick={() => setMenuOpen(false)}>{isAr ? 'معاطف' : 'Coats & Outerwear'}</Link>
            <Link to="/shop?category=knitwear" onClick={() => setMenuOpen(false)}>{isAr ? 'تريكو' : 'Knitwear'}</Link>
            <Link to="/shop?category=trousers" onClick={() => setMenuOpen(false)}>{isAr ? 'بناطيل' : 'Trousers'}</Link>
            <Link to="/shop?category=accessories" onClick={() => setMenuOpen(false)}>{isAr ? 'إكسسوارات' : 'Accessories'}</Link>
            {isAuthenticated && <Link to="/orders" onClick={() => setMenuOpen(false)}>{isAr ? 'طلباتي' : 'Orders'}</Link>}
          </nav>
          <div className="flex gap-5 border-t border-stone-dark pt-5 text-[10px] tracking-[0.18em]">
            <button type="button" onClick={() => { setLang((value) => value === 'ar' ? 'en' : 'ar'); setMenuOpen(false); }}>
              <Globe size={14} className="mr-2 inline" />{lang === 'ar' ? 'ENGLISH' : 'العربية'}
            </button>
            {user?.role === 'ADMIN' && <Link to="/admin" onClick={() => setMenuOpen(false)}>ADMIN</Link>}
            {isAuthenticated && <button type="button" onClick={() => { logout(); setMenuOpen(false); }}>LOGOUT</button>}
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[70] bg-ink/70 p-6 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="mx-auto mt-[18vh] max-w-3xl bg-cream p-7 md:p-12">
            <div className="mb-12 flex items-center justify-between">
              <p className="text-[10px] tracking-[0.22em] text-clay">VELORA / SEARCH</p>
              <button type="button" onClick={() => setSearchOpen(false)} aria-label={isAr ? 'إغلاق' : 'Close'}><X size={20} /></button>
            </div>
            <form onSubmit={submitSearch} className="flex items-center gap-4 border-b border-ink pb-4">
              <Search size={19} />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchProducts || 'Search the collection'} className="w-full bg-transparent font-serif text-3xl outline-none md:text-5xl" />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
