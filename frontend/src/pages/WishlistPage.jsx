import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ProductCard from '../components/ProductCard';
import { useWishlistStore } from '../stores/wishlistStore';
import { useAuthStore } from '../stores/authStore';
import PageTransition from '../components/PageTransition';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, loading, error, fetchWishlist, removeFromWishlist } = useWishlistStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated, navigate, fetchWishlist]);

  if (!isAuthenticated) return null;

  return (
    <PageTransition>
    <div className="velora-page flex flex-col" dir="ltr">
      <Navbar />

      <div className="flex-1 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex items-end justify-between border-b border-stone-dark pb-6">
            <div>
              <p className="mb-3 text-[10px] tracking-widest2 text-clay">THE EDIT</p>
              <h1 className="font-serif text-4xl text-ink md:text-5xl">My Wishlist</h1>
            </div>
            <Heart className="hidden text-clay md:block" size={26} strokeWidth={1.2} />
          </div>

          {error && <ErrorMessage message={error} />}

          {loading ? (
            <LoadingSpinner />
          ) : items && items.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8">
              {items.map((product) => (
                <div key={product._id} className="relative">
                  <ProductCard product={product} />
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    aria-label="Remove from wishlist"
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-cream/90 text-ink transition hover:bg-ink hover:text-cream"
                  >
                    <Trash2 size={15} strokeWidth={1.4} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="velora-panel py-20 text-center">
              <p className="mb-6 font-serif text-2xl text-ink">Your wishlist is empty</p>
              <button
                onClick={() => navigate('/shop')}
                className="velora-button mx-auto"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
    </PageTransition>
  );
}
