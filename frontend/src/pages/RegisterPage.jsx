import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ErrorMessage from '../components/ErrorMessage';
import PageTransition from '../components/PageTransition';
import { useAuthStore } from '../stores/authStore';
import { useLanguage } from '../i18n/LanguageContext';
import ProductImage from '../components/ProductImage';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error, isAuthenticated } = useAuthStore();
  const { t, isAr } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-cream" dir={isAr ? 'rtl' : 'ltr'}>
        <Navbar />

        <div className="grid flex-1 md:grid-cols-2">
          <div className="relative hidden min-h-[600px] overflow-hidden bg-ink md:block">
            <ProductImage src="/images/man-home.png" alt="VELORA editorial" className="h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 to-transparent p-10 text-cream">
              <p className="mb-4 text-[10px] tracking-widest2 text-cream/70">VELORA / BEGIN HERE</p>
              <p className="max-w-sm font-serif text-4xl leading-tight">{isAr ? 'خزانة تبدأ من اختيار واحد.' : 'A wardrobe begins with one considered choice.'}</p>
            </div>
          </div>
          <div className="flex items-center justify-center px-6 py-16 md:px-12 lg:px-24">
          <div className="w-full max-w-md">
            <p className="mb-4 text-[10px] tracking-widest2 text-clay">{isAr ? 'انضم إلى فيلورا' : 'JOIN THE VELORA EDIT'}</p>
            <h2 className="font-serif text-4xl text-ink md:text-5xl">{t.createAccount}</h2>
            <p className="mb-10 mt-3 text-sm text-ink-soft">{t.signInAccount}</p>

            {error && <ErrorMessage message={error} />}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-xs text-ink-soft">{t.name}
              <input
                type="text"
                name="name"
                placeholder={t.name}
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border border-stone-dark text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition"
                required
              />
              </label>
              <label className="block text-xs text-ink-soft">{t.email}
              <input
                type="email"
                name="email"
                placeholder={t.email}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border border-stone-dark text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition"
                required
              />
              </label>
              <label className="block text-xs text-ink-soft">{t.password}
              <input
                type="password"
                name="password"
                placeholder={t.password}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border border-stone-dark text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition"
                required
              />
              </label>
              <label className="block text-xs text-ink-soft">{t.confirmPassword}
              <input
                type="password"
                name="confirmPassword"
                placeholder={t.confirmPassword}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border border-stone-dark text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition"
                required
              />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="velora-button w-full disabled:opacity-50"
              >
                {loading ? t.creatingAccount : t.createAccount.toUpperCase()}
              </button>
            </form>

            <p className="text-center text-xs text-ink-soft mt-8">
              {t.signIn}{' '}
              <Link to="/login" className="text-clay hover:text-ink transition">
                {t.login}
              </Link>
            </p>
          </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}
