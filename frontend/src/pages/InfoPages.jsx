import { ArrowRight, Truck, ShieldCheck, RotateCcw, Mail, Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductImage from '../components/ProductImage';
import { useLanguage } from '../i18n/LanguageContext';

function InfoLayout({ children, overlay = false }) {
  const { isAr } = useLanguage();
  return (
    <div className="velora-page" dir={isAr ? 'rtl' : 'ltr'}>
      {overlay ? null : <Navbar />}
      {children}
      <Footer />
    </div>
  );
}

const journalPosts = [
  {
    date: { en: 'APR 12, 2026', ar: '١٢ أبريل ٢٠٢٦' },
    title: { en: 'The Timeless Appeal of Classic Style', ar: 'سحر الأسلوب الكلاسيكي' },
    excerpt: {
      en: 'A closer look at the pieces that stay relevant season after season.',
      ar: 'نظرة أقرب إلى القطع التي تبقى ذات صلة موسمًا بعد موسم.',
    },
    image: '/images/pexels-olly-3755706.jpg',
  },
  {
    date: { en: 'APR 16, 2026', ar: '١٦ أبريل ٢٠٢٦' },
    title: { en: 'How to Build a Timeless Wardrobe', ar: 'كيف تبني خزانة خالدة' },
    excerpt: {
      en: 'A refined approach to choosing versatile pieces that last beyond a single season.',
      ar: 'نهج متوازن لاختيار قطع متعددة الاستخدامات تدوم لأطول من موسم واحد.',
    },
    image: '/images/pexels-rana-jenab-594484578-32392072.jpg',
  },
  {
    date: { en: 'MAR 28, 2026', ar: '٢٨ مارس ٢٠٢٦' },
    title: { en: 'The Inspiration Behind VELORA', ar: 'الإلهام وراء فيلورا' },
    excerpt: {
      en: 'Notes on the materials we trust and the rituals that give clothing a longer life.',
      ar: 'ملاحظات عن الخامات التي نثق بها والطقوس التي تطيل عمر الملابس.',
    },
    image: '/images/pexels-tr-n-qu-c-b-o-2424466-13673656.jpg',
  },
];

export function AboutPage() {
  const { t } = useLanguage();
  return (
    <InfoLayout overlay>
      <section className="relative min-h-[100svh] overflow-hidden bg-ink text-cream">
        <ProductImage
          src="/images/women-hero.png"
          alt=""
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-ink/15" />
        <Navbar overlay />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1380px] items-center px-6 py-28 md:px-12">
          <div className="max-w-lg">
            <p className="text-[10px] tracking-[0.32em] text-cream/70">{t.ourStory}</p>
            <h1 className="velora-display mt-5 text-5xl leading-[0.92] md:text-7xl">
              {t.storyTitleLine1}<br />{t.storyTitleLine2}
            </h1>
            <p className="mt-7 max-w-md text-sm leading-7 text-cream/78">{t.storyBody}</p>
            <p className="mt-5 max-w-md text-sm leading-7 text-cream/70">{t.aboutBody}</p>
            <Link to="/journal" className="mt-8 inline-flex items-center gap-3 border border-cream/80 px-6 py-3 text-[10px] tracking-[0.22em] text-cream transition hover:bg-cream hover:text-ink">
              {t.discoverMore} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </InfoLayout>
  );
}

export function ShippingPage() {
  const { t } = useLanguage();
  return (
    <InfoLayout>
      <div className="max-w-3xl mx-auto px-6 pb-16 pt-32">
        <p className="text-[11px] tracking-[0.25em] uppercase text-muted mb-5">{t.shipping}</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-8">{t.shippingHeading}</h1>
        <p className="mb-8 text-sm leading-7 text-ink-soft">{t.shippingBody}</p>
        <div className="space-y-6 text-ink-soft leading-7">
          <div className="border border-stone-dark p-6 bg-white/40">
            <div className="flex items-center gap-3 mb-3 text-ink"><Truck size={18} /> <span className="font-medium">{t.fastDelivery}</span></div>
            <p>{t.fastDeliveryBody}</p>
          </div>
          <div className="border border-stone-dark p-6 bg-white/40">
            <div className="flex items-center gap-3 mb-3 text-ink"><ShieldCheck size={18} /> <span className="font-medium">{t.cod}</span></div>
            <p>{t.codBody}</p>
          </div>
        </div>
      </div>
    </InfoLayout>
  );
}

export function ReturnsPage() {
  const { t } = useLanguage();
  return (
    <InfoLayout>
      <div className="max-w-3xl mx-auto px-6 pb-16 pt-32">
        <p className="text-[11px] tracking-[0.25em] uppercase text-muted mb-5">{t.returns}</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-8">{t.returnsHeading}</h1>
        <div className="border border-stone-dark p-6 bg-white/40 text-ink-soft leading-7">
          <div className="flex items-center gap-3 mb-3 text-ink"><RotateCcw size={18} /> <span className="font-medium">{t.easyExchanges}</span></div>
          <p>{t.returnsBody}</p>
        </div>
      </div>
    </InfoLayout>
  );
}

export function ContactPage() {
  const { t } = useLanguage();
  return (
    <InfoLayout>
      <div className="max-w-3xl mx-auto px-6 pb-16 pt-32">
        <p className="text-[11px] tracking-[0.25em] uppercase text-muted mb-5">{t.contact}</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-8">{t.getInTouch}</h1>
        <div className="border border-stone-dark p-8 bg-white/40 space-y-5 text-ink-soft leading-7">
          <div className="flex items-center gap-3 text-ink" dir="ltr"><Mail size={18} /> <span>support@velora.example</span></div>
          <p>{t.contactBody}</p>
          <p>{t.contactSupportBody}</p>
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-ink hover:text-clay">
            {t.backToShop} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </InfoLayout>
  );
}

export function JournalPage() {
  const { t, lang } = useLanguage();
  return (
    <InfoLayout>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-12">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="velora-eyebrow mb-5">{t.theJournal}</p>
            <h1 className="velora-display text-5xl leading-[.95] md:text-7xl">{t.journalTitle}</h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-ink-soft">{t.journalIntro}</p>
          </div>
          <Link to="/journal" className="velora-link text-ink">{t.viewAllArticles} <ArrowRight size={14} /></Link>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {journalPosts.map((post) => (
            <article key={post.title.en}>
              <div className="mb-5 aspect-[1.25] overflow-hidden bg-ink">
                <ProductImage src={post.image} alt={post.title[lang]} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
              </div>
              <p className="mb-3 text-[10px] tracking-[0.18em] text-muted">{post.date[lang]}</p>
              <h2 className="mb-3 font-serif text-2xl text-ink">{post.title[lang]}</h2>
              <p className="text-sm leading-7 text-ink-soft">{post.excerpt[lang]}</p>
              <Link to="/journal" className="velora-link mt-4 text-ink">{t.readMore} <ArrowRight size={14} /></Link>
            </article>
          ))}
        </div>
      </div>
    </InfoLayout>
  );
}

export function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <InfoLayout>
      <div className="flex min-h-[70vh] items-center justify-center bg-cream px-6 py-16 text-ink">
        <div className="max-w-xl text-center">
          <p className="mb-5 text-[11px] tracking-[0.3em] uppercase text-muted">VELORA</p>
          <h1 className="font-serif text-7xl text-ink">404</h1>
          <h2 className="mt-6 font-serif text-3xl text-ink">{t.notFoundTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-ink-soft">{t.notFoundBody}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/" className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 text-[11px] tracking-[0.2em] text-cream transition hover:bg-clay">
              <Home size={14} /> {t.homeLabel}
            </Link>
            <Link to="/shop" className="inline-flex items-center justify-center gap-2 border border-stone-dark px-6 py-3 text-[11px] tracking-[0.2em] text-ink transition hover:border-ink">
              <Search size={14} /> {t.shop}
            </Link>
          </div>
        </div>
      </div>
    </InfoLayout>
  );
}
