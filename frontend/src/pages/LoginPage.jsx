import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ErrorMessage from '../components/ErrorMessage';
import PageTransition from '../components/PageTransition';
import { useAuthStore } from '../stores/authStore';
import { useLanguage } from '../i18n/LanguageContext';
import ProductImage from '../components/ProductImage';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated } = useAuthStore();
  const { t, isAr } = useLanguage();
  const [formData, setFormData] = useState({ email: '', password: '' });

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
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-cream" dir={isAr ? 'rtl' : 'ltr'}>
        <Navbar />

        <div className="velora-login-shell flex flex-1 items-center justify-center px-4 py-12 md:px-8 lg:px-12">
          <div className="velora-login-frame grid w-full max-w-[1200px] overflow-hidden border border-ink/10 bg-paper md:grid-cols-[0.95fr_1.05fr]">
            <div className="relative hidden min-h-[540px] md:block">
              <ProductImage
                src="/images/women-hero.png"
                alt="VELORA editorial"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d1d]/80 via-[#1d1d1d]/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-cream md:p-10">
                <p className="mb-4 text-[10px] tracking-[0.24em] text-cream/70">VELORA / THE EDIT</p>
                <p className="max-w-xs font-serif text-3xl leading-[1.05] md:text-[2.3rem]">
                  {isAr ? 'القطع التي تشبه حضورك.' : 'Pieces that feel like your own.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-14">
              <div className="w-full max-w-[480px]">
                <div className="mb-8">
                  <p className="mb-4 text-[10px] tracking-[0.22em] text-clay">
                    {isAr ? 'العودة إلى فيلورا' : 'WELCOME BACK TO VELORA'}
                  </p>
                  <h1 className="font-serif text-4xl leading-none text-ink sm:text-5xl">
                    {t.welcomeBack}
                  </h1>
                </div>

                <p className="mb-8 text-sm leading-6 text-ink-soft">
                  {t.signInAccount}
                </p>

                {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm text-ink-soft">{t.email}</label>
                    <input
                      type="email"
                      name="email"
                      placeholder={t.email}
                      value={formData.email}
                      onChange={handleChange}
                      className="velora-input"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm text-ink-soft">{t.password}</label>
                    <input
                      type="password"
                      name="password"
                      placeholder={t.password}
                      value={formData.password}
                      onChange={handleChange}
                      className="velora-input"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <Link to="/forgot-password" className="text-[11px] tracking-[0.12em] text-clay transition hover:text-ink">
                      {t.forgot}
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="velora-button w-full disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? t.signingIn.toUpperCase() : t.signIn.toUpperCase()}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-ink-soft">
                  {t.noAccount}{' '}
                  <Link to="/register" className="inline-flex items-center gap-1 font-medium text-clay transition hover:text-ink">
                    {t.createAccount}
                    <span aria-hidden="true">→</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}
