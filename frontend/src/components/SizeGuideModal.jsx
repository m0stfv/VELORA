import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const sizeTable = [
  ['XS', '34', '44-46'],
  ['S', '36', '46-48'],
  ['M', '38', '48-50'],
  ['L', '40', '50-52'],
  ['XL', '42', '52-54'],
];

export default function SizeGuideModal({ open, onClose }) {
  const { isAr } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a2823]/60 p-4" aria-modal="true" role="dialog">
      <div dir={isAr ? 'rtl' : 'ltr'} className="w-full max-w-2xl border border-brown bg-cream p-5 shadow-2xl sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-muted uppercase">{isAr ? 'دليل المقاسات' : 'Size guide'}</p>
            <h3 className="mt-2 font-serif text-2xl text-ink">{isAr ? 'اختيار المقاس المناسب' : 'Find your fit'}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center border border-stone-dark text-ink transition hover:bg-stone"
            aria-label={isAr ? 'إغلاق' : 'Close'}
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-hidden border border-stone-dark">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/60">
              <tr>
                <th className="px-4 py-3 font-medium text-ink">{isAr ? 'المقاس' : 'Size'}</th>
                <th className="px-4 py-3 font-medium text-ink">{isAr ? 'الكتف / الصدر' : 'Chest'}</th>
                <th className="px-4 py-3 font-medium text-ink">{isAr ? 'الطول' : 'Length'}</th>
              </tr>
            </thead>
            <tbody>
              {sizeTable.map(([size, chest, length]) => (
                <tr key={size} className="border-t border-stone-dark">
                  <td className="px-4 py-3 text-ink">{size}</td>
                  <td className="px-4 py-3 text-ink-soft">{chest}</td>
                  <td className="px-4 py-3 text-ink-soft">{length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-sm leading-6 text-ink-soft">
          {isAr
            ? 'إذا كنت غير متأكد من المقاس، نوصيك باختيار المقاس الأكبر للملابس ذات القطع الفضفاضة أو المقاس الأصغر للقطع الأكثر إحكامًا.'
            : 'If you are unsure about sizing, we recommend choosing the larger size for relaxed fits or the smaller size for more tailored silhouettes.'}
        </p>
      </div>
    </div>
  );
}
