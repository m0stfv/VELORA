import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useWishlistStore } from '../stores/wishlistStore';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import ProductImage from './ProductImage';
import { useLanguage } from '../i18n/LanguageContext';
import { getProductName } from '../utils/localizedText';

export default function ProductCard({ product }) {
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [isAddingWishlist, setIsAddingWishlist] = useState(false);
  const { addToCart } = useCartStore();
  const { addToWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { lang, isAr } = useLanguage();
  const navigate = useNavigate();
  const productName = getProductName(product, lang);

  const handleAddToCart = async (e) => {
    e.preventDefault();

    const requiresSize = Array.isArray(product?.sizes) && product.sizes.length > 0;
    const requiresColor = Array.isArray(product?.colors) && product.colors.length > 0;

    if (requiresSize || requiresColor) {
      const message = isAr ? 'يرجى اختيار المقاس أو اللون من صفحة المنتج' : 'Please choose the size or color from the product page.';
      toast.error(message);
      navigate(`/product/${product._id}`);
      return;
    }

    setIsAddingCart(true);
    try {
      await addToCart(product._id, 1, { product });
      toast.success(isAr ? 'تمت الإضافة إلى السلة' : 'Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || (isAr ? 'تعذر إضافة هذا المنتج إلى سلة التسوق.' : 'Unable to add this item to your cart.'));
    } finally {
      setIsAddingCart(false);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setIsAddingWishlist(true);
    try {
      await addToWishlist(product._id);
      toast.success('Added to wishlist');
    } catch (error) {
      toast.error(error.message || 'Could not add to wishlist');
    } finally {
      setIsAddingWishlist(false);
    }
  };

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone">
        <ProductImage
          src={product.images?.[0]}
          alt={productName}
          loading="lazy"
          className="h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.03]"
        />

        {discount > 0 && (
          <span className="absolute left-3 top-3 bg-cream px-2 py-1 text-[9px] font-medium tracking-[0.14em] text-ink">
            -{discount}%
          </span>
        )}

        <button
          onClick={handleAddToWishlist}
          disabled={isAddingWishlist}
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-ink/20 bg-cream/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <Heart size={15} strokeWidth={1.5} />
        </button>

        {/* Quick add bar */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingCart || product.stock === 0}
          className="absolute bottom-0 left-0 right-0 flex translate-y-full items-center justify-center gap-2 bg-ink py-3 text-[10px] font-medium tracking-[0.16em] text-cream transition-transform duration-300 group-hover:translate-y-0 disabled:opacity-60"
        >
          <ShoppingBag size={13} strokeWidth={1.5} />
          {product.stock === 0 ? 'OUT OF STOCK' : isAddingCart ? 'ADDING...' : 'QUICK ADD'}
        </button>
      </div>

      <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-5 pt-4">
        <h3 className="line-clamp-1 text-sm text-ink">{productName}</h3>
        <div className="flex shrink-0 items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="text-sm text-clay">EGP {product.discountPrice}</span>
              <span className="text-xs text-muted line-through">EGP {product.price}</span>
            </>
          ) : (
            <span className="text-sm text-clay">EGP {product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
