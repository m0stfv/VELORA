import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
import api from '../services/api';
import { getCategoryName } from '../utils/localizedText';

const slides = [
  {
    id: 'shirts',
    eyebrow: 'TIMELESS ELEGANCE',
    eyebrowAr: 'أناقة خالدة',
    titleLines: ['More Than', 'Just Clothing'],
    titleLinesAr: ['أكثر من مجرد', 'ملابس'],
    description: 'VELORA is a refined collection of timeless pieces for those who value quality, style and authenticity.',
    descriptionAr: 'فيلورا مجموعة مختارة من القطع الخالدة لمن يقدّرون الجودة والأسلوب والأصالة.',
    cta: 'Explore Collection',
    ctaAr: 'استكشف المجموعة',
    to: '/shop?category=shirts',
    image: '/images/pexels-dxaxoxfz-17251247.jpg',
    footer: { title: 'Classic White Linen Shirt', titleAr: 'قميص كتان أبيض كلاسيك', to: '/shop?category=shirts' },
  },
  {
    id: 'coats-outerwear',
    eyebrow: 'COATS & OUTERWEAR',
    eyebrowAr: 'معاطف وملابس خارجية',
    titleLines: ['Made to Outlast', 'the Season'],
    titleLinesAr: ['مصنوعة لتدوم', 'أطول من الموسم'],
    description: 'Wool coats and tailored jackets, built for decades not seasons.',
    descriptionAr: 'معاطف صوف وجاكيتات مصممة لعقود لا لمواسم.',
    cta: 'Explore Collection',
    ctaAr: 'استكشف المجموعة',
    to: '/shop?category=coats-outerwear',
    image: '/images/man-home.png',
    footer: { title: 'Long Wool Coat', titleAr: 'معطف صوف طويل', to: '/shop?category=coats-outerwear' },
  },
  {
    id: 'accessories',
    eyebrow: 'ACCESSORIES',
    eyebrowAr: 'إكسسوارات',
    titleLines: ['The Foundation of', 'a Timeless Wardrobe'],
    titleLinesAr: ['أساس خزانة', 'خالدة'],
    description: 'Everyday pieces, elevated.',
    descriptionAr: 'قطع يومية، بلمسة أرقى.',
    cta: 'Explore Essentials',
    ctaAr: 'استكشف الأساسيات',
    to: '/shop?category=accessories',
    image: '/images/slide-3.png',
    footer: { title: 'Quiet Accessories', titleAr: 'إكسسوارات هادئة', to: '/shop?category=accessories' },
  },
];

const categoryImages = [
  { name: { ar: 'قمصان', en: 'Shirts' }, query: 'shirts', image: '/images/pexels-dayong-tien-681073045-22441291.jpg' },
  { name: { ar: 'معاطف وملابس خارجية', en: 'Coats & Outerwear' }, query: 'coats-outerwear', image: '/images/pexels-tima-miroshnichenko-6764923.jpg' },
  { name: { ar: 'تريكو', en: 'Knitwear' }, query: 'knitwear', image: '/images/pexels-cottonbro-6975407.jpg' },
];

export default function HomePage() {
  const { products, loading, error, fetchProducts } = useProductStore();
  const { t, isAr } = useLanguage();
  const [recent, setRecent] = useState([]);
  const [slide, setSlide] = useState(0);
  const current = slides[slide];

  useEffect(() => { fetchProducts({ featured: 'true' }); }, [fetchProducts]);
  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('velora-recently-viewed') || '[]');
    Promise.all(ids.slice(0, 4).map((id) => api.get(`/products/${id}`).then((res) => res.data.data).catch(() => null)))
      .then((items) => setRecent(items.filter(Boolean)));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  const featured = useMemo(() => {
    const selected = products.filter((product) => product.featured);
    return (selected.length ? selected : products).slice(0, 4);
  }, [products]);

  return (
    <PageTransition>
      <main className="velora-page" dir={isAr ? 'rtl' : 'ltr'}>
        <CinematicHero
          eyebrow={isAr ? current.eyebrowAr : current.eyebrow}
          titleLines={isAr ? current.titleLinesAr : current.titleLines}
          description={isAr ? current.descriptionAr : current.description}
          ctaLabel={isAr ? current.ctaAr : current.cta}
          ctaTo={current.to}
          image={current.image}
          imageAlt={current.titleLines.join(' ')}
          slides={slides}
          activeSlide={slide}
          onSlideChange={setSlide}
          footerRight={(
            <Link to={current.footer.to} className="hidden text-right sm:block">
              <p className="font-serif text-lg text-cream">{isAr ? current.footer.titleAr : current.footer.title}</p>
              <span className="mt-1 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-cream/70">{t.shopNow} <ArrowRight size={12} /></span>
            </Link>
          )}
        />

        {error && <div className="mx-auto max-w-6xl px-6 py-8"><ErrorMessage message={t.unableCollection} onRetry={() => fetchProducts({ featured: 'true' })} /></div>}
        {loading ? <div className="py-28"><LoadingSpinner /></div> : <>
          <section className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
            <ScrollReveal>
              <p className="velora-eyebrow">{t.povEyebrow}</p>
              <h2 className="velora-display mt-6 text-4xl leading-tight md:text-6xl">{t.povTitle}</h2>
              <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-ink-soft">{t.povBody}</p>
            </ScrollReveal>
          </section>

          <section className="mx-auto max-w-[1380px] px-6 pb-24 md:px-12 md:pb-32">
            <div className="mb-10 flex items-end justify-between border-b border-ink/10 pb-5">
              <div>
                <p className="velora-eyebrow">01 / {t.theCollection}</p>
                <h2 className="velora-display mt-3 text-4xl md:text-5xl">{t.selectedPieces}</h2>
              </div>
              <Link to="/shop" className="velora-link text-ink">{t.viewAll} <ArrowRight size={15} /></Link>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-4 md:gap-x-7">
              {featured.map((product, index) => <ScrollReveal key={product._id} delay={index * 0.06}><ProductCard product={product} /></ScrollReveal>)}
            </div>
          </section>

          <section className="bg-beige px-6 py-24 md:px-12 md:py-32">
            <div className="mx-auto max-w-[1380px]">
              <div className="mb-12">
                <p className="velora-eyebrow">02 / {t.collectionsLabel}</p>
                <h2 className="velora-display mt-3 text-4xl md:text-5xl">{t.collectionsTitle}</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {categoryImages.map((category, index) => (
                  <Link key={category.query} to={`/shop?category=${category.query}`} className="group relative overflow-hidden">
                    <div className="aspect-[0.78]">
                      <ProductImage src={category.image} alt={getCategoryName(category, isAr ? 'ar' : 'en')} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-6 pt-20 text-cream">
                      <p className="text-[9px] tracking-[0.2em]">0{index + 1} / {t.collectionWord}</p>
                      <h3 className="velora-display mt-2 text-3xl">{getCategoryName(category, isAr ? 'ar' : 'en')}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto grid max-w-[1380px] items-center gap-12 px-6 py-24 md:grid-cols-2 md:px-12 md:py-32">
            <div className="aspect-[1.05] overflow-hidden">
              <ProductImage src="/images/pexels-tr-n-qu-c-b-o-2424466-13673656.jpg" alt="VELORA story" className="h-full w-full object-cover" />
            </div>
            <div className="max-w-lg">
              <p className="velora-eyebrow">03 / {t.ourStory}</p>
              <h2 className="velora-display mt-6 text-5xl leading-tight md:text-6xl">{t.storyTitleLine1}<br />{t.storyTitleLine2}</h2>
              <p className="mt-7 text-sm leading-7 text-ink-soft">{t.storyBody}</p>
              <Link to="/about" className="velora-link mt-8 text-ink">{t.discoverMore} <ArrowRight size={15} /></Link>
            </div>
          </section>

          {recent.length > 0 && (
            <section className="border-y border-ink/10 bg-beige/60 px-6 py-20 md:px-12">
              <div className="mx-auto max-w-[1380px]">
                <p className="velora-eyebrow">04 / {t.recentlyViewedLabel}</p>
                <h2 className="velora-display mb-10 mt-3 text-4xl">{t.returnToEdit}</h2>
                <div className="grid grid-cols-2 gap-5 md:grid-cols-4">{recent.map((product) => <ProductCard key={product._id} product={product} />)}</div>
              </div>
            </section>
          )}

          <section className="bg-ink px-6 py-24 text-cream md:px-12 md:py-32">
            <div className="mx-auto flex max-w-[1380px] flex-col items-start justify-between gap-12 md:flex-row md:items-end">
              <div>
                <p className="text-[10px] tracking-[0.22em] text-cream/60">05 / {t.theJournal}</p>
                <h2 className="velora-display mt-5 text-5xl leading-tight md:text-6xl">{t.journalTitle}</h2>
              </div>
              <Link to="/journal" className="velora-link text-cream">{t.readJournal} <ArrowRight size={15} /></Link>
            </div>
          </section>
        </>}
        <Footer />
      </main>
    </PageTransition>
  );
}
