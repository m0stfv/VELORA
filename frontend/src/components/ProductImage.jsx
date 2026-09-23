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

const getResponsiveSources = (src) => {
  if (!src || !src.startsWith('/images/')) return null;
  const extensionIndex = src.lastIndexOf('.');
  if (extensionIndex < 0) return null;
  const base = src.slice(0, extensionIndex);
  return {
    mobile: `${base.replace('/images/', '/images/optimized/mobile/')}.webp`,
    desktop: `${base.replace('/images/', '/images/optimized/desktop/')}.webp`,
    large: `${base.replace('/images/', '/images/optimized/large/')}.webp`,
  };
};

export default function ProductImage({ src, alt, className = '', ...props }) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = resolveImageSrc(src);
  const responsiveSources = getResponsiveSources(src);
  const loading = props.loading || 'lazy';
  const sizes = props.sizes || '(max-width: 767px) 100vw, 50vw';
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

  const handleError = (event) => {
    if (responsiveSources && event.currentTarget.dataset.fallback !== 'true') {
      event.currentTarget.dataset.fallback = 'true';
      event.currentTarget.removeAttribute('srcset');
      event.currentTarget.src = resolvedSrc;
      return;
    }
    setFailed(true);
  };

  if (!responsiveSources) {
    return <img {...props} src={resolvedSrc} alt={alt} loading={loading} sizes={sizes} className={className} onError={handleError} />;
  }

  return (
    <picture>
      <source
        media="(max-width: 767px)"
        type="image/webp"
        srcSet={`${responsiveSources.mobile} 640w, ${responsiveSources.desktop} 1280w`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`${responsiveSources.desktop} 1280w, ${responsiveSources.large} 1920w`}
        sizes={sizes}
      />
      <img
        {...props}
        src={responsiveSources.desktop}
        srcSet={`${responsiveSources.desktop} 1280w, ${responsiveSources.large} 1920w`}
        sizes={sizes}
        alt={alt}
        loading={loading}
        className={className}
        onError={handleError}
      />
    </picture>
  );
}
