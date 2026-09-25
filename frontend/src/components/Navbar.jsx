import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Globe, Heart, LogOut, Menu, Search, Settings, ShoppingBag, User, X } from 'lucide-react';
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
            <button type="button" onClick={() => setSearchOpen(true)} className="flex h-10 w-10 items-center justify-center" aria-label={isAr ? 'بحث' : 'Search'}><Search size={16} strokeWidth={1.4} /></button>
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
            <Link
              to="/cart"
              className="group relative flex h-10 w-10 items-center justify-center overflow-visible"
              aria-label={isAr ? 'السلة' : 'Cart'}
              title={isAr ? 'السلة' : 'Cart'}
            >
              <ShoppingBag size={17} strokeWidth={1.35} className="transition duration-200 group-hover:scale-[1.04] group-hover:opacity-80" />
              {items.length > 0 && (
                <span
                  className="pointer-events-none absolute top-[7px] z-10 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-[8px] font-medium leading-none text-cream transition duration-200 group-hover:scale-105 group-hover:opacity-90"
                  style={isAr ? { left: '7px' } : { right: '7px' }}
                >
                  {items.length}
                </span>
              )}
            </Link>
            <button type="button" onClick={() => setMenuOpen(true)} className="flex h-10 w-10 items-center justify-center md:hidden" aria-label={isAr ? 'فتح القائمة' : 'Open menu'}><Menu size={17} /></button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-cream text-ink" role="dialog" aria-modal="true">
          <div className="flex items-center justify-between border-b border-stone-dark px-6 pb-5 pt-6">
            <span className="font-serif text-2xl tracking-[0.25em]">VELORA</span>
            <button type="button" onClick={() => setMenuOpen(false)} className="flex h-11 w-11 items-center justify-center" aria-label={isAr ? 'إغلاق' : 'Close'}><X size={21} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-8">
            <nav className="space-y-8 py-8" aria-label={isAr ? 'القائمة الرئيسية' : 'Main menu'}>
              <section>
                <p className="mb-3 text-[9px] font-medium tracking-[0.22em] text-muted">{isAr ? 'التنقل' : 'NAVIGATION'}</p>
                <div className="divide-y divide-stone-dark/70 border-y border-stone-dark/70">
                  {navItems.map(([path, label]) => (
                    <Link key={path} to={path} onClick={() => setMenuOpen(false)} className="flex min-h-14 items-center justify-between gap-4 py-3 font-serif text-2xl">
                      <span>{label}</span>
                      {isAr ? <ChevronLeft size={17} strokeWidth={1.2} /> : <ChevronRight size={17} strokeWidth={1.2} />}
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <p className="mb-3 text-[9px] font-medium tracking-[0.22em] text-muted">{isAr ? 'المتجر' : 'SHOP'}</p>
                <div className="space-y-1">
                  {[
                    ['/shop?category=shirts', isAr ? 'قمصان' : 'Shirts'],
                    ['/shop?category=coats-outerwear', isAr ? 'معاطف' : 'Coats & Outerwear'],
                    ['/shop?category=knitwear', isAr ? 'تريكو' : 'Knitwear'],
                    ['/shop?category=trousers', isAr ? 'بناطيل' : 'Trousers'],
                    ['/shop?category=accessories', isAr ? 'إكسسوارات' : 'Accessories'],
                  ].map(([path, label]) => (
                    <Link key={path} to={path} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center justify-between gap-4 border-b border-stone-dark/50 py-2 text-sm">
                      <span>{label}</span>
                      {isAr ? <ChevronLeft size={15} strokeWidth={1.2} /> : <ChevronRight size={15} strokeWidth={1.2} />}
                    </Link>
                  ))}
                </div>
              </section>

              {(isAuthenticated || user?.role === 'ADMIN') && (
                <section>
                  <p className="mb-3 text-[9px] font-medium tracking-[0.22em] text-muted">{isAr ? 'الحساب' : 'ACCOUNT'}</p>
                  <div className="space-y-1">
                    {isAuthenticated && <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center gap-3 border-b border-stone-dark/50 py-2 text-sm"><User size={16} strokeWidth={1.3} />{isAr ? 'حسابي' : 'My Profile'}</Link>}
                    {isAuthenticated && <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center gap-3 border-b border-stone-dark/50 py-2 text-sm"><Heart size={16} strokeWidth={1.3} />{isAr ? 'المفضلة' : 'Wishlist'}</Link>}
                    {isAuthenticated && <Link to="/orders" onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center gap-3 border-b border-stone-dark/50 py-2 text-sm"><ShoppingBag size={16} strokeWidth={1.3} />{isAr ? 'طلباتي' : 'Orders'}</Link>}
                    {user?.role === 'ADMIN' && <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center gap-3 border-b border-stone-dark/50 py-2 text-sm"><Settings size={16} strokeWidth={1.3} />{isAr ? 'لوحة التحكم' : 'Admin Dashboard'}</Link>}
                  </div>
                </section>
              )}
            </nav>

            <div className="flex flex-col gap-3 border-t border-stone-dark pt-5 text-[10px] tracking-[0.16em]">
              <button type="button" onClick={() => { setLang((value) => value === 'ar' ? 'en' : 'ar'); setMenuOpen(false); }} className="flex min-h-12 items-center gap-3 text-left">
                <Globe size={15} strokeWidth={1.3} />
                <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
                <span className="ml-auto text-muted">{lang === 'ar' ? 'ENGLISH' : 'العربية'}</span>
              </button>
              {isAuthenticated ? (
                <button type="button" onClick={() => { logout(); setMenuOpen(false); }} className="flex min-h-12 items-center gap-3 border-t border-stone-dark/70 pt-3 text-left">
                  <LogOut size={15} strokeWidth={1.3} /> {isAr ? 'تسجيل الخروج' : 'Log out'}
                </button>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center gap-3 border-t border-stone-dark/70 pt-3">
                  <User size={15} strokeWidth={1.3} /> {isAr ? 'تسجيل الدخول' : 'Log in'}
                </Link>
              )}
            </div>
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
