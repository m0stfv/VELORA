import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function CinematicHero({
  eyebrow,
  title,
  titleLines,
  description,
  ctaLabel,
  ctaTo = '/shop',
  image,
  imageAlt,
  slides,
  activeSlide,
  onSlideChange,
  footerLeft,
  footerRight,
  align = 'left',
  minHeight = 'min-h-[100svh]',
}) {
  const heading = titleLines?.length ? titleLines : [title];

  return (
    <section className={`relative overflow-hidden bg-ink ${minHeight} text-cream`}>
      {image && <img src={image} alt={imageAlt || ''} className="absolute inset-0 h-full w-full object-cover object-[center_20%]" />}
      <div className="absolute inset-0 bg-ink/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/40" />
      <Navbar overlay />

      <div className={`relative z-10 mx-auto flex ${minHeight} max-w-[1380px] flex-col justify-end px-6 pb-10 pt-28 md:px-12 md:pb-14`}>
        <div className={`max-w-xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
          {eyebrow && <p className="text-[10px] tracking-[0.32em] text-cream/70">{eyebrow}</p>}
          <h1 className="velora-display mt-5 text-[3.4rem] leading-[0.92] md:text-[5.6rem]">
            {heading.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </h1>
          {description && <p className="mt-6 max-w-md text-sm leading-7 text-cream/78">{description}</p>}
          {ctaLabel && (
            <Link to={ctaTo} className="mt-8 inline-flex items-center gap-3 border border-cream/80 px-6 py-3 text-[10px] tracking-[0.22em] text-cream transition hover:bg-cream hover:text-ink">
              {ctaLabel} <ArrowRight size={14} />
            </Link>
          )}
        </div>

        <div className="mt-16 flex items-end justify-between gap-6">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] text-cream/70">
            {slides?.length ? slides.map((slide, index) => (
              <span key={slide.id || index} className="flex items-center gap-3">
                {index > 0 && <span className="h-px w-8 bg-cream/35" />}
                <button
                  type="button"
                  onClick={() => onSlideChange?.(index)}
                  className={activeSlide === index ? 'text-cream' : 'text-cream/40 hover:text-cream'}
                >
                  {String(index + 1).padStart(2, '0')}
                </button>
              </span>
            )) : footerLeft}
          </div>
          {footerRight}
        </div>
      </div>
    </section>
  );
}
