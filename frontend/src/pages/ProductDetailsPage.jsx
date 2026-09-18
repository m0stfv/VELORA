import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Star, ShoppingBag, Heart, ChevronLeft, Truck, ShieldCheck, RotateCcw, MessageSquare, Check, Sparkles, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ScrollReveal from '../components/ScrollReveal';
import PageTransition from '../components/PageTransition';
import SizeGuideModal from '../components/SizeGuideModal';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import ProductImage from '../components/ProductImage';
import { getCategoryName, getColorName, getProductDescription, getProductName } from '../utils/localizedText';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error, fetchProduct } = useProductStore();
  const { addToCart } = useCartStore();
  const { addToWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { isAr, lang } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [isAddingWishlist, setIsAddingWishlist] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

  useEffect(() => {
    if (!product?._id) return;
    const recentlyViewed = JSON.parse(localStorage.getItem('velora-recently-viewed') || '[]');
    const next = [product._id, ...recentlyViewed.filter((item) => item !== product._id)].slice(0, 8);
    localStorage.setItem('velora-recently-viewed', JSON.stringify(next));

    api.get(`/products/${product._id}/reviews`)
      .then((response) => setReviews(response.data.data || []))
      .catch(() => setReviews([]));
  }, [product?._id]);

  const showSizeSelector = Array.isArray(product?.sizes) && product.sizes.length > 0;
  const showColorSelector = Array.isArray(product?.colors) && product.colors.length > 0;
  const variantMap = useMemo(() => {
    const map = new Map();
    (product?.variants || []).forEach((variant) => {
      const key = `${(variant.size || '').toLowerCase()}|${(variant.color || '').toLowerCase()}`;
      map.set(key, Number(variant.stock || 0));
    });
    return map;
  }, [product?.variants]);

  const selectedVariantStock = useMemo(() => {
    if (!product || (!selectedSize && !selectedColor)) return product?.stock || 0;
    if (!product?.variants?.length) return product?.stock || 0;
    if (showSizeSelector && showColorSelector) {
      const sizeColorKey = `${(selectedSize || '').toLowerCase()}|${(selectedColor || '').toLowerCase()}`;
      return variantMap.get(sizeColorKey) ?? product?.stock ?? 0;
    }
    if (showSizeSelector && !showColorSelector) {
      const sizeKey = `${(selectedSize || '').toLowerCase()}|`;
      return variantMap.get(sizeKey) ?? product?.stock ?? 0;
    }
    if (!showSizeSelector && showColorSelector) {
      const colorKey = `|${(selectedColor || '').toLowerCase()}`;
      return variantMap.get(colorKey) ?? product?.stock ?? 0;
    }
    return product?.stock || 0;
  }, [product, selectedSize, selectedColor, showSizeSelector, showColorSelector, variantMap]);

  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!product?.saleEnd) {
      setNow(0);
      return undefined;
    }
    const saleEndsAt = new Date(product.saleEnd);
    if (!Number.isFinite(saleEndsAt.getTime())) {
      setNow(0);
      return undefined;
    }

    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [product?.saleEnd]);

  const saleEndsAt = product?.saleEnd ? new Date(product.saleEnd) : null;
  const saleActive = Boolean(saleEndsAt && saleEndsAt.getTime() > now);
  const countdownText = saleActive ? (() => {
    const msLeft = saleEndsAt.getTime() - now;
    const totalSeconds = Math.max(0, Math.floor(msLeft / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  })() : null;

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length;
  }, [reviews]);

  const ratingDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      const rating = Number(review.rating || 0);
      if (rating >= 1 && rating <= 5) counts[rating] += 1;
    });
    return counts;
  }, [reviews]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (showSizeSelector && !selectedSize) {
      toast.error(isAr ? 'يرجى اختيار المقاس' : 'Please select a size');
      return;
    }
    if (showColorSelector && !selectedColor) {
      toast.error(isAr ? 'يرجى اختيار اللون' : 'Please select a color');
      return;
    }
    setIsAddingCart(true);
    try {
      await addToCart(product._id, quantity, { size: selectedSize, color: selectedColor, product });
      toast.success(isAr ? 'تمت الإضافة إلى السلة' : 'Added to cart');
    } catch (err) {
      toast.error(err.message || (isAr ? 'تعذر الإضافة إلى السلة' : 'Could not add to cart'));
    } finally {
      setIsAddingCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsAddingWishlist(true);
    try {
      await addToWishlist(product._id);
      toast.success(isAr ? 'تمت الإضافة إلى المفضلة' : 'Added to wishlist');
    } catch (err) {
      toast.error(err.message || (isAr ? 'تعذر الإضافة إلى المفضلة' : 'Could not add to wishlist'));
    } finally {
      setIsAddingWishlist(false);
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!reviewForm.comment.trim()) {
      toast.error(isAr ? 'يرجى كتابة تعليق' : 'Please write a review');
      return;
    }
    setReviewSubmitting(true);
    try {
      const response = await api.post(`/products/${product._id}/reviews`, {
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviews((current) => [response.data.data, ...current]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success(isAr ? 'تم إرسال التقييم' : 'Review submitted');
    } catch (err) {
      const message = err.response?.data?.message || (isAr ? 'تعذر إرسال التقييم' : 'Could not submit review');
      const purchaseRequired = /purchased|purchase/i.test(message);
      toast.error(
        purchaseRequired
          ? (isAr ? 'يمكن فقط العملاء الذين اشتروا هذا المنتج إرسال تقييم.' : 'Only customers who purchased this item can leave a review.')
          : message
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  const productName = getProductName(product, lang);
  const productDescription = getProductDescription(product, lang);
  const categoryName = getCategoryName(product.category, lang);

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const currentPrice = product.discountPrice || product.price;
  const lowStock = selectedVariantStock > 0 && selectedVariantStock <= 4;
  const isOutOfStock = selectedVariantStock <= 0;
  const productImages = product.images?.length ? product.images : [''];

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-cream" dir={isAr ? 'rtl' : 'ltr'}>
        <Navbar />

        <div className="flex-1 pb-16 pt-28 md:pb-20 md:pt-32">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-xs text-ink-soft hover:text-ink mb-10 transition"
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
              {isAr ? 'رجوع' : 'Back'}
            </button>

            <p className="mb-8 text-[10px] tracking-[0.18em] text-muted">SHOP / {categoryName || 'WOMEN'} / {productName}</p>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
              <ScrollReveal direction="none">
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <div className="aspect-[4/5] overflow-hidden bg-stone">
                      <ProductImage
                        src={productImages[selectedImage]}
                      alt={productName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-3">
                    {productImages.map((image, index) => (
                      <button key={`${image}-${index}`} type="button" onClick={() => setSelectedImage(index)} className={`overflow-hidden border ${selectedImage === index ? 'border-ink' : 'border-transparent'} bg-stone`} aria-label={`View image ${index + 1}`}>
                        <ProductImage src={image} alt={`${productName} view ${index + 1}`} className="h-24 w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="border-t border-ink/15 pt-6 lg:pt-0">
                  {discount > 0 && (
                    <span className="mb-4 inline-block border border-clay/50 bg-clay/10 px-2 py-1 text-[10px] tracking-[0.24em] text-clay">
                      -{discount}% OFF
                    </span>
                  )}
                  {product.featured && (
                    <span className="mb-4 ml-2 inline-block border border-olive/50 bg-olive/10 px-2 py-1 text-[10px] tracking-[0.24em] text-olive">
                      {isAr ? 'مميز' : 'FEATURED'}
                    </span>
                  )}
                  <p className="velora-eyebrow mb-4">{categoryName || 'VELORA EDIT'}</p>
                  <h1 className="velora-display mb-4 text-5xl leading-[.9] text-ink md:text-6xl">{productName}</h1>

                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={14}
                          strokeWidth={1.5}
                          className={index < Math.round(averageRating || product.rating || 0) ? 'fill-clay text-clay' : 'text-stone-dark'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted">{reviews.length || product.numReviews || 0} {isAr ? 'تقييم' : 'reviews'}</span>
                  </div>

                  <div className="mb-8 flex items-baseline gap-3">
                    <span className="text-2xl text-clay">EGP {currentPrice}</span>
                    {product.discountPrice && <span className="text-base text-muted line-through">EGP {product.price}</span>}
                  </div>

                  {saleActive && (
                    <div className="mb-6 rounded-xl border border-clay/40 bg-clay/5 p-3 text-sm text-ink-soft">
                      <div className="flex items-center gap-2 text-clay">
                        <Sparkles size={15} />
                        <span>{isAr ? 'تخفيض لفترة محدودة' : 'Limited-time sale'}</span>
                      </div>
                      <p className="mt-2 font-medium">{countdownText}</p>
                    </div>
                  )}

                  <p className="mb-8 max-w-lg text-sm leading-7 text-ink-soft">{productDescription}</p>

                  <div className="mb-8 space-y-3">
                    {isOutOfStock ? (
                      <span className="text-xs text-clay">{isAr ? 'غير متوفر حاليًا' : 'Out of stock'}</span>
                    ) : lowStock ? (
                      <span className="text-xs text-amber-700">{isAr ? 'المخزون منخفض — لم يتبقَّ سوى عدد قليل' : 'Low stock — only a few left'}</span>
                    ) : (
                      <span className="text-xs text-olive">{isAr ? 'متوفر —' : 'In stock —'} {selectedVariantStock || product.stock || 0} {isAr ? 'قطعة متاحة' : 'available'}</span>
                    )}
                  </div>

                  {showSizeSelector && (
                    <div className="mb-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11px] tracking-[0.24em] text-ink-soft">{isAr ? 'المقاس' : 'SIZE'}</span>
                        <button type="button" onClick={() => setSizeGuideOpen(true)} className="text-[10px] tracking-[0.2em] text-clay underline-offset-2 hover:underline">
                          {isAr ? 'دليل المقاسات' : 'SIZE GUIDE'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-[52px] border px-3 py-2 text-sm transition ${selectedSize === size ? 'border-ink bg-ink text-cream' : 'border-stone-dark text-ink hover:border-ink'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {showColorSelector && (
                    <div className="mb-6">
                      <span className="mb-2 block text-[11px] tracking-[0.24em] text-ink-soft">{isAr ? 'اللون' : 'COLOR'}</span>
                      <div className="flex flex-wrap gap-3">
                        {product.colors.map((color) => {
                          const colorName = getColorName(color, lang);
                          return (
                            <button
                              key={colorName || color.hex || Math.random()}
                              type="button"
                              onClick={() => setSelectedColor(colorName)}
                              className={`h-7 w-7 rounded-full border ${selectedColor === colorName ? 'border-ink ring-2 ring-ink/20' : 'border-stone-dark'}`}
                              style={{ backgroundColor: color.hex || '#2a2823' }}
                              aria-label={colorName}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] tracking-[0.24em] text-ink-soft">{isAr ? 'الكمية' : 'QUANTITY'}</span>
                      <div className="flex items-center border border-stone-dark">
                        <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="px-4 py-2 hover:bg-stone transition">−</button>
                        <span className="px-5 py-2 text-sm">{quantity}</span>
                        <button type="button" onClick={() => setQuantity((value) => value + 1)} className="px-4 py-2 hover:bg-stone transition">+</button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isAddingCart || isOutOfStock}
                        className="flex-1 bg-ink px-4 py-3.5 text-[11px] tracking-[0.24em] text-cream transition hover:bg-clay disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="inline-flex items-center justify-center gap-2">
                          <ShoppingBag size={15} strokeWidth={1.5} />
                          {isAddingCart ? (isAr ? 'جاري الإضافة...' : 'ADDING...') : isAr ? 'أضف إلى السلة' : 'ADD TO CART'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={handleAddToWishlist}
                        disabled={isAddingWishlist}
                        className="flex h-12 w-12 items-center justify-center border border-stone-dark transition hover:border-ink"
                        aria-label={isAr ? 'إضافة إلى المفضلة' : 'Add to wishlist'}
                      >
                        <Heart size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-4 border-t border-stone-dark pt-8">
                    <div>
                      <p className="mb-1 text-[10px] tracking-[0.24em] text-muted">{isAr ? 'القسم' : 'CATEGORY'}</p>
                      <p className="text-sm text-ink">{categoryName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] tracking-[0.24em] text-muted">{isAr ? 'العلامة' : 'BRAND'}</p>
                      <p className="text-sm text-ink">{product.brand || 'N/A'}</p>
                    </div>
                  </div>

                    <div className="mt-8 grid gap-3 border border-ink/15 bg-stone/35 p-5">
                    <div className="flex items-center gap-3 text-sm text-ink-soft"><Truck size={16} /><span>{isAr ? 'شحن سريع داخل مصر' : 'Fast delivery across Egypt'}</span></div>
                    <div className="flex items-center gap-3 text-sm text-ink-soft"><ShieldCheck size={16} /><span>{isAr ? 'الدفع عند الاستلام فقط' : 'Cash on delivery only'}</span></div>
                    <div className="flex items-center gap-3 text-sm text-ink-soft"><RotateCcw size={16} /><span>{isAr ? 'إرجاع خلال 14 يومًا' : '14-day returns'}</span></div>
                  </div>

                    <div className="mt-8 border-t border-stone-dark">
                      <details className="border-b border-stone-dark py-4" open><summary className="flex cursor-pointer list-none items-center justify-between text-[10px] tracking-[0.18em] text-ink">DETAILS <span>+</span></summary><p className="pt-4 text-sm leading-7 text-ink-soft">{productDescription}</p></details>
                      <details className="border-b border-stone-dark py-4"><summary className="flex cursor-pointer list-none items-center justify-between text-[10px] tracking-[0.18em] text-ink">SHIPPING &amp; RETURNS <span>+</span></summary><p className="pt-4 text-sm leading-7 text-ink-soft">Fast delivery across Egypt with a 14-day return window for eligible pieces.</p></details>
                      <details className="border-b border-stone-dark py-4"><summary className="flex cursor-pointer list-none items-center justify-between text-[10px] tracking-[0.18em] text-ink">SIZE GUIDE <span>+</span></summary><button type="button" onClick={() => setSizeGuideOpen(true)} className="velora-link mt-4 text-clay">OPEN SIZE GUIDE <ArrowUpRight size={13} /></button></details>
                    </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="mt-20 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="border border-ink/15 bg-paper p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between gap-4 border-b border-ink/10 pb-5">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} className="text-ink" />
                    <h2 className="font-serif text-2xl text-ink">{isAr ? 'تقييمات العملاء' : 'Customer reviews'}</h2>
                  </div>
                  <span className="text-[10px] tracking-[0.22em] text-muted">{reviews.length} {isAr ? 'تقييم' : 'REVIEWS'}</span>
                </div>

                <div className="mb-8 grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
                  <div className="text-left md:text-center">
                    <div className="text-5xl font-semibold text-ink">{averageRating ? averageRating.toFixed(1) : '0.0'}</div>
                    <div className="mt-2 flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <Star key={index} size={15} className={index < Math.round(averageRating || 0) ? 'fill-clay text-clay' : 'text-stone-dark'} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingDistribution[star] || 0;
                      const width = reviews.length ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="grid grid-cols-[32px_1fr_30px] items-center gap-3 text-[11px] text-ink-soft">
                          <span>{star} ★</span>
                          <div className="h-2 overflow-hidden bg-stone-dark/70">
                            <div className="h-full bg-clay" style={{ width: `${width}%` }} />
                          </div>
                          <span>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {!reviews.length ? (
                  <div className="mb-8 rounded-3xl border border-dashed border-stone-dark bg-stone/20 p-6 text-center">
                    <div className="mb-3 text-2xl text-clay">★★★★★</div>
                    <h3 className="font-serif text-2xl text-ink">{isAr ? 'كن أول من يشارك تجربته' : 'Be the first to share your experience.'}</h3>
                    <p className="mt-3 text-sm text-ink-soft">{isAr ? 'لا توجد تقييمات بعد.' : 'No customer reviews yet.'}</p>
                  </div>
                ) : null}

                <div className="mb-8 border-b border-ink/10 pb-5">
                  <button type="button" onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })} className="inline-flex items-center gap-2 border border-ink px-4 py-2 text-[10px] tracking-[0.22em] text-ink transition hover:bg-ink hover:text-cream">
                    {isAr ? 'اكتب تقييمًا' : 'WRITE A REVIEW'}
                  </button>
                </div>

                <form id="review-form" onSubmit={handleReviewSubmit} className="mb-8 space-y-4 border border-stone-dark bg-stone/35 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm text-ink-soft">{isAr ? 'تقييمك' : 'Your rating'}</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm((current) => ({ ...current, rating: star }))}
                          className="text-xl transition hover:scale-110"
                          aria-label={`${star} star${star > 1 ? 's' : ''}`}
                        >
                          <Star size={18} className={star <= reviewForm.rating ? 'fill-clay text-clay' : 'text-stone-dark'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={reviewForm.comment} onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))} rows={4} className="w-full resize-none border border-stone-dark bg-cream px-3 py-2 text-sm outline-none focus:border-ink" placeholder={isAr ? 'شاركنا رأيك في هذا المنتج...' : 'Share your thoughts about this product...'} />
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" disabled={reviewSubmitting} className="bg-ink px-4 py-2.5 text-[10px] tracking-[0.2em] text-cream transition hover:bg-clay disabled:opacity-50">
                      {reviewSubmitting ? (isAr ? 'جاري الإرسال...' : 'SUBMITTING...') : (isAr ? 'إرسال التقييم' : 'SUBMIT REVIEW')}
                    </button>
                    <button type="button" onClick={() => setReviewForm({ rating: 5, comment: '' })} className="border border-stone-dark px-4 py-2.5 text-[10px] tracking-[0.2em] text-ink transition hover:border-ink">
                      {isAr ? 'إلغاء' : 'CANCEL'}
                    </button>
                  </div>
                </form>

                <div className="space-y-4">
                  {reviews.length ? reviews.map((review) => (
                    <article key={review._id} className="rounded-2xl border border-stone-dark bg-cream p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-ink">{review.user?.name || (isAr ? 'مستخدم' : 'Customer')}</p>
                          <p className="text-[11px] text-muted">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, index) => (
                            <Star key={index} size={12} className={index < review.rating ? 'fill-clay text-clay' : 'text-stone-dark'} />
                          ))}
                        </div>
                      </div>
                      {review.title && <p className="mb-2 text-sm font-medium text-ink">{review.title}</p>}
                      <p className="text-sm leading-6 text-ink-soft">{review.comment}</p>
                      {review.verified && (
                        <p className="mt-3 text-[10px] tracking-[0.18em] text-olive">{isAr ? 'تم الشراء' : 'VERIFIED PURCHASE'}</p>
                      )}
                    </article>
                  )) : null}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-stone-dark bg-white/20 p-6">
                  <div className="mb-4 flex items-center gap-3"><BadgeCheck size={18} className="text-olive" /><h3 className="font-serif text-xl text-ink">{isAr ? 'معلومات المنتج' : 'Product details'}</h3></div>
                  <ul className="space-y-3 text-sm text-ink-soft">
                    <li><span className="font-medium text-ink">{isAr ? 'المادة:' : 'Material:'}</span> {product.material || (isAr ? 'غير محدد' : 'Not specified')}</li>
                    <li><span className="font-medium text-ink">{isAr ? 'الاستدامة:' : 'Sustainability:'}</span> {product.sustainability || (isAr ? 'لا توجد تفاصيل' : 'No further details')}</li>
                    <li><span className="font-medium text-ink">{isAr ? 'الشحن:' : 'Shipping:'}</span> {isAr ? 'تسليم سريع داخل مصر' : 'Fast delivery in Egypt'}</li>
                    <li><span className="font-medium text-ink">{isAr ? 'الإرجاع:' : 'Returns:'}</span> {isAr ? 'استبدال أو إرجاع خلال 14 يومًا' : '14-day return window'}</li>
                  </ul>
                </div>
                <div className="rounded-3xl border border-stone-dark bg-cream p-6">
                  <h3 className="mb-4 font-serif text-xl text-ink">{isAr ? 'علامات الثقة' : 'Trust signals'}</h3>
                  <div className="space-y-3 text-sm text-ink-soft">
                    <div className="flex items-center gap-3"><Check size={16} className="text-olive" /> {isAr ? 'الدفع عند الاستلام' : 'Cash on delivery'}</div>
                    <div className="flex items-center gap-3"><Check size={16} className="text-olive" /> {isAr ? 'إرجاع خلال 14 يومًا' : '14-day return policy'}</div>
                    <div className="flex items-center gap-3"><Check size={16} className="text-olive" /> {isAr ? 'تسليم سريع' : 'Fast delivery'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
        <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      </div>
    </PageTransition>
  );
}
