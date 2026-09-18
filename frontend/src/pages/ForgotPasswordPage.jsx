import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ErrorMessage from '../components/ErrorMessage';
import PageTransition from '../components/PageTransition';
import { useAuthStore } from '../stores/authStore';
import { useLanguage } from '../i18n/LanguageContext';

export default function ForgotPasswordPage() {
  const { forgotPassword, loading, error } = useAuthStore();
  const { t, isAr } = useLanguage();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      console.error('Forgot password failed:', err);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-cream" dir={isAr ? 'rtl' : 'ltr'}>
        <Navbar />

        <div className="flex-1 flex items-center justify-center py-16 px-6">
          <div className="w-full max-w-sm">
            {sent ? (
              <div className="text-center">
                <h2 className="font-serif text-3xl text-ink mb-4">Check your email</h2>
                <p className="text-sm text-ink-soft leading-relaxed mb-8">
                  If an account exists for <span className="text-ink">{email}</span>, a reset link is on its way.
                  The link expires in 30 minutes.
                </p>
                <Link to="/login" className="text-[11px] tracking-widest2 border-b border-ink text-ink pb-1">
                  {t.back.toUpperCase()}
                </Link>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-3xl text-center text-ink mb-1">Reset password</h2>
                <p className="text-center text-xs text-ink-soft mb-10">
                  Enter your email and we'll send you a reset link.
                </p>

                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-stone-dark text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition"
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-ink text-cream py-3 text-[11px] tracking-widest2 hover:bg-clay transition disabled:opacity-50"
                  >
                    {loading ? 'SENDING...' : 'SEND RESET LINK'}
                  </button>
                </form>

                <p className="text-center text-xs text-ink-soft mt-8">
                  <Link to="/login" className="text-clay hover:text-ink transition">
                    Back to login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}
