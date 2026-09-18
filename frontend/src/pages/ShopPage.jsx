import { useEffect, useMemo, useState } from 'react';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import CinematicHero from '../components/CinematicHero';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { useProductStore } from '../stores/productStore';
import { useLanguage } from '../i18n/LanguageContext';
import { getCategoryName } from '../utils/localizedText';

const DEFAULT_COLLECTION_IMAGE = '/images/pexels-luisbecerrafotografo-6065984.jpg';

const collections = {
  shirts: {
    label: 'Shirts',
    labelAr: 'قمصان',
    kicker: 'SHOP',
    kickerAr: 'قمصان',
    description: 'Timeless shirts, crafted for modern life.',
    descriptionAr: 'قمصان خالدة صُممت لحياة عصرية.',
    image: '/images/pexels-dxaxoxfz-17251247.jpg',
    cinematic: false,
  },
  'coats-outerwear': {
    label: 'Coats & Outerwear',
    labelAr: 'معاطف وملابس خارجية',
    kicker: 'OUTERWEAR',
    kickerAr: 'ملابس خارجية',
    description: 'Made to outlast the season.',
    descriptionAr: 'مصنوعة لتدوم أطول من الموسم.',
    image: '/images/man-home.png',
    cinematic: true,
    titleLines: ['Made to Outlast', 'the Season'],
    titleLinesAr: ['مصنوعة لتدوم', 'أطول من الموسم'],
  },
  knitwear: {
    label: 'Knitwear',
    labelAr: 'تريكو',
    kicker: 'KNITWEAR',
    kickerAr: 'تريكو',
    description: 'Warmth, with a quiet elegance.',
    descriptionAr: 'دفء بلمسة أناقة هادئة.',
    image: '/images/pexels-cottonbro-6975407.jpg',
    cinematic: false,
  },
  trousers: {
    label: 'Trousers',
    labelAr: 'بناطيل',
    kicker: 'TROUSERS',
    kickerAr: 'بناطيل',
    description: 'Classic cuts, made for everyday comfort.',
    descriptionAr: 'قصّات كلاسيكية للراحة اليومية.',
    image: '/images/pexels-robert-jeffrey-bonto-2439341-9218066.jpg',
    cinematic: false,
  },
  accessories: {
    label: 'Accessories',
    labelAr: 'إكسسوارات',
    kicker: 'ESSENTIALS',
    kickerAr: 'أساسيات',
    description: 'Everyday pieces, elevated.',
    descriptionAr: 'قطع يومية، بلمسة أرقى.',
    image: '/images/slide-3.png',
    cinematic: true,
    titleLines: ['The Foundation of', 'a Timeless Wardrobe'],
    titleLinesAr: ['أساس خزانة', 'خالدة'],
  },
};

const typeFilters = [
  { id: '', labelKey: 'allProducts' },
  { id: 'newest', labelKey: 'newArrivals', sort: 'newest' },
  { id: 'tops', labelKey: 'typeTops', search: 'shirt' },
  { id: 'bottoms', labelKey: 'typeBottoms', search: 'pant' },
  { id: 'outerwear', labelKey: 'typeOuterwear', search: 'coat' },
  { id: 'dresses', labelKey: 'typeDresses', search: 'dress' },
];

export default function ShopPage() {
  const { products, categories, loading, error, fetchProducts, fetchCategories } = useProductStore();
  const { t, isAr } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: params.get('category') || '',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    search: params.get('search') || '',
    sort: params.get('sort') || 'newest',
  });
  const [detailFilters, setDetailFilters] = useState({ size: '', color: '', availability: false, sale: false });
  const [filterOpen, setFilterOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const next = {
      category: params.get('category') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      search: params.get('search') || '',
      sort: params.get('sort') || 'newest',
    };
    setFilters(next);
  }, [params]);

  useEffect(() => {
    const timer = window.setTimeout(() => fetchProducts(filters), filters.search ? 280 : 0);
    return () => window.clearTimeout(timer);
  }, [fetchProducts, filters]);

  const update = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    const query = Object.fromEntries(Object.entries(next).filter(([, entry]) => entry));
    setParams(query, { replace: true });
  };

  const applyType = (item) => {
    setTypeFilter(item.id);
    const next = {
      ...filters,
      search: item.search || '',
      sort: item.sort || filters.sort,
    };
    setFilters(next);
    const query = Object.fromEntries(Object.entries(next).filter(([, entry]) => entry));
    setParams(query, { replace: true });
  };

  const collection = collections[filters.category] || {
    label: t.shopTitle,
    labelAr: 'المتجر',
    kicker: 'SHOP',
    kickerAr: 'المتجر',
    description: t.shopDescription,
    descriptionAr: 'مجموعة مختارة من القطع الخالدة.',
    image: DEFAULT_COLLECTION_IMAGE,
    cinematic: false,
  };

  const filterOptions = useMemo(() => ({
    sizes: [...new Set(products.flatMap((product) => product.sizes || []))].sort(),
    colors: [...new Set(products.flatMap((product) => (product.colors || []).map((color) => typeof color === 'string' ? color : color.name).filter(Boolean)))].sort(),
  }), [products]);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesSize = !detailFilters.size || product.sizes?.includes(detailFilters.size);
    const matchesColor = !detailFilters.color || product.colors?.some((color) => (typeof color === 'string' ? color : color.name) === detailFilters.color);
    const matchesAvailability = !detailFilters.availability || product.stock > 0;
    const matchesSale = !detailFilters.sale || Boolean(product.discountPrice);
    return matchesSize && matchesColor && matchesAvailability && matchesSale;
  }), [products, detailFilters]);

  const inputClass = 'w-full border-b border-stone-dark bg-transparent py-3 pr-8 text-sm text-ink outline-none transition focus:border-ink';
  const selectClass = `${inputClass} appearance-none`; 
  const heading = isAr ? (collection.labelAr || collection.label) : collection.label;

  return (
    <PageTransition>
      <main className="velora-page" dir={isAr ? 'rtl' : 'ltr'}>
        {collection.cinematic ? (
          <CinematicHero
            eyebrow={isAr ? collection.kickerAr : collection.kicker}
            titleLines={isAr ? collection.titleLinesAr : collection.titleLines}
            description={isAr ? collection.descriptionAr : collection.description}
            ctaLabel={t.exploreCollection}
            ctaTo={`/shop?category=${filters.category}`}
            image={collection.image}
            imageAlt={heading}
            footerLeft={<span>01 — 02 — 03</span>}
          />
        ) : (
          <>
            <Navbar />
            <header className="bg-cream px-6 pb-10 pt-28 md:px-12 md:pb-6 md:pt-32">
              <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[280px_1fr] lg:items-start">
                <div>
                  <p className="velora-eyebrow">{isAr ? collection.kickerAr : collection.kicker}</p>
                  <h1 className="velora-display mt-4 text-6xl leading-[.9] md:text-7xl">{heading}</h1>
                  <p className="mt-5 max-w-xs text-sm leading-7 text-ink-soft">{isAr ? collection.descriptionAr || collection.description : collection.description}</p>
                  <div className="mt-8 hidden border-t border-ink/10 pt-5 md:block">
                    <div className="flex flex-col gap-3 text-[11px] tracking-[0.12em] text-ink-soft">
                      {typeFilters.map((item) => (
                        <button
                          key={item.id || 'all'}
                          type="button"
                          onClick={() => applyType(item)}
                          className={`text-left transition hover:text-ink ${typeFilter === item.id ? 'text-ink' : ''}`}
                        >
                          {t[item.labelKey]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative min-h-[280px] overflow-hidden bg-ink md:min-h-[420px]">
                  <ProductImage src={collection.image} alt={heading} className="absolute inset-0 h-full w-full object-cover" />
                </div>
              </div>
            </header>
          </>
        )}

        <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-12 md:py-14">
          <button type="button" onClick={() => setFilterOpen((open) => !open)} className="mb-8 flex w-full items-center justify-between border-y border-ink/15 py-4 text-[10px] font-medium tracking-[0.18em] lg:hidden">
            <span className="flex items-center gap-2"><SlidersHorizontal size={15} /> {t.filterSort}</span>
            <span>{filterOpen ? t.closeLabel : t.openLabel}</span>
          </button>
          <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
          <aside className={`${filterOpen ? 'block' : 'hidden'} self-start lg:sticky lg:top-24 lg:block`}>
            <div className="mb-7 flex items-center justify-between border-b border-ink pb-4">
              <span className="text-[10px] tracking-[0.2em]">{t.filterSort}</span>
              <button type="button" onClick={() => setFilterOpen(false)} className="lg:hidden" aria-label={t.closeFilters}><X size={16} /></button>
              <Filter size={15} strokeWidth={1.3} className="hidden lg:block" />
            </div>

            <label className="mb-2 block text-[10px] tracking-[0.18em] text-muted">{t.search}</label>
            <div className="mb-8 flex items-center gap-2 border-b border-stone-dark">
              <Search size={15} />
              <input
                value={filters.search}
                onChange={(event) => update('search', event.target.value)}
                placeholder={t.searchPlaceholder}
                className={inputClass}
              />
            </div>

            <label className="mb-2 block text-[10px] tracking-[0.18em] text-muted">{t.category}</label>
            <div className="relative mb-7">
              <select value={filters.category} onChange={(event) => update('category', event.target.value)} className={selectClass} aria-label={t.category}>
                <option value="">{t.allCategories}</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.slug || category._id}>{getCategoryName(category, isAr ? 'ar' : 'en')}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-ink-soft">▾</span>
            </div>

            <div className="mb-7 grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] tracking-[0.15em] text-muted">{t.minLabel}</label>
                <input value={filters.minPrice} onChange={(event) => update('minPrice', event.target.value)} type="number" className={inputClass} />
              </div>
              <div>
                <label className="text-[9px] tracking-[0.15em] text-muted">{t.maxLabel}</label>
                <input value={filters.maxPrice} onChange={(event) => update('maxPrice', event.target.value)} type="number" className={inputClass} />
              </div>
            </div>

            <label className="mb-2 block text-[10px] tracking-[0.18em] text-muted">{t.sortBy}</label>
            <div className="relative">
              <select value={filters.sort} onChange={(event) => update('sort', event.target.value)} className={selectClass} aria-label={t.sortBy}>
                <option value="newest">{t.newest}</option>
                <option value="price-asc">{t.priceAsc}</option>
                <option value="price-desc">{t.priceDesc}</option>
                <option value="rating">{t.topRated}</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-ink-soft">▾</span>
            </div>

            <div className="mt-8 border-t border-ink/15 pt-6">
              <p className="mb-3 text-[10px] font-medium tracking-[0.18em] text-muted">{t.detailsLabel}</p>
              <select value={detailFilters.size} onChange={(event) => setDetailFilters((current) => ({ ...current, size: event.target.value }))} className={`${inputClass} mb-4`}>
                <option value="">{t.allSizes}</option>
                {filterOptions.sizes.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
              <select value={detailFilters.color} onChange={(event) => setDetailFilters((current) => ({ ...current, color: event.target.value }))} className={`${inputClass} mb-4`}>
                <option value="">{t.allColors}</option>
                {filterOptions.colors.map((color) => <option key={color} value={color}>{color}</option>)}
              </select>
              <label className="flex items-center gap-3 py-2 text-xs text-ink-soft"><input type="checkbox" checked={detailFilters.availability} onChange={(event) => setDetailFilters((current) => ({ ...current, availability: event.target.checked }))} /> {t.inStockOnly}</label>
              <label className="flex items-center gap-3 py-2 text-xs text-ink-soft"><input type="checkbox" checked={detailFilters.sale} onChange={(event) => setDetailFilters((current) => ({ ...current, sale: event.target.checked }))} /> {t.onSale}</label>
            </div>
          </aside>

          <section>
            {error && <ErrorMessage message={t.unableProducts} onRetry={() => { fetchCategories(); fetchProducts(filters); }} />}

            {loading ? (
              <LoadingSpinner />
            ) : visibleProducts.length ? (
              <div className="grid grid-cols-2 gap-x-5 gap-y-16 md:grid-cols-3 md:gap-x-7">
                {visibleProducts.map((product, index) => (
                  <ScrollReveal key={product._id} delay={(index % 4) * 0.05}>
                    <ProductCard product={product} />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="border-t border-stone-dark py-20 text-center">
                <p className="font-serif text-4xl">{t.noProducts}</p>
              </div>
            )}
          </section>
          </div>
        </div>

        <Footer />
      </main>
    </PageTransition>
  );
}
