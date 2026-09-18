import { ImageOff } from 'lucide-react';
import { useState } from 'react';

const isUsable = (src) => Boolean(src) && !src.includes('via.placeholder.com');

// Seeded products use frontend-public paths (/images/...). Uploaded files use /uploads/...
// Keep relative paths on the storefront origin; absolute URLs are left untouched.
const resolveImageSrc = (src) => {
  if (!isUsable(src)) return '';
  if (/^https?:\/\//i.test(src) || src.startsWith('data:') || src.startsWith('blob:')) return src;
  const normalized = src.replace(/^\/+/, '');
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.replace(/\/$/, '');
  return src.startsWith('/') ? `${cleanBase}${src}` : `${cleanBase}/${normalized}`;
};

export default function ProductImage({ src, alt, className = '', ...props }) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = resolveImageSrc(src);
  const showPlaceholder = !resolvedSrc || failed;

  if (showPlaceholder) {
    return (
      <div className={`flex items-center justify-center bg-stone text-muted ${className}`}>
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <ImageOff size={22} strokeWidth={1.3} />
          <span className="text-[9px] tracking-[0.15em]">IMAGE NOT SET</span>
        </div>
      </div>
    );
  }

  return <img {...props} src={resolvedSrc} alt={alt} loading={props.loading || 'lazy'} className={className} onError={() => setFailed(true)} />;
}
