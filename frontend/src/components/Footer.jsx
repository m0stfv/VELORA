import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
  const { t, isAr } = useLanguage();

  return (
    <footer className="bg-ink text-cream/70 pt-16 pb-8" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-serif text-2xl tracking-[0.3em] text-cream mb-4">VELORA</h3>
            <p className="text-xs leading-relaxed text-cream/50">{t.brandLine}</p>
          </div>

          <div>
            <h4 className="text-[11px] tracking-widest2 text-cream mb-4">{t.shop.toUpperCase()}</h4>
            <ul className="space-y-2 text-xs text-cream/50">
              <li><Link to="/shop" className="hover:text-cream transition">{t.allProducts}</Link></li>
              <li><Link to="/wishlist" className="hover:text-cream transition">{t.wishlist}</Link></li>
              <li><Link to="/cart" className="hover:text-cream transition">{t.cart}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-widest2 text-cream mb-4">{t.support.toUpperCase()}</h4>
            <ul className="space-y-2 text-xs text-cream/50">
              <li><Link to="/contact" className="hover:text-cream transition">{t.contact}</Link></li>
              <li><Link to="/shipping" className="hover:text-cream transition">{t.shipping}</Link></li>
              <li><Link to="/returns" className="hover:text-cream transition">{t.returns}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-widest2 text-cream mb-4">{t.connect.toUpperCase()}</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-cream transition"><MessageCircle size={17} strokeWidth={1.5} /></a>
              <a href="#" className="hover:text-cream transition"><Send size={17} strokeWidth={1.5} /></a>
              <a href="#" className="hover:text-cream transition"><Mail size={17} strokeWidth={1.5} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-6 flex flex-col md:flex-row justify-between gap-2 text-[10px] tracking-wide text-cream/40">
          <span>{t.rights}</span>
          <span>{t.legal}</span>
        </div>
      </div>
    </footer>
  );
}
