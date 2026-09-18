import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ErrorMessage from '../components/ErrorMessage';
import PageTransition from '../components/PageTransition';
import { useAuthStore } from '../stores/authStore';
import { useLanguage } from '../i18n/LanguageContext';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, loading, error } = useAuthStore();
  const { isAr } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await resetPassword(token, password);
      toast.success('Password reset. Please log in.');
      navigate('/login');
    } catch (err) {
      console.error('Reset password failed:', err);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-cream" dir={isAr ? 'rtl' : 'ltr'}>
        <Navbar />

        <div className="flex-1 flex items-center justify-center py-16 px-6">
          <div className="w-full max-w-sm">
            <h2 className="font-serif text-3xl text-center text-ink mb-1">Set a new password</h2>
            <p className="text-center text-xs text-ink-soft mb-10">Choose something you haven't used before.</p>

            {error && <ErrorMessage message={error} />}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-stone-dark text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition"
                required
                minLength={6}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-stone-dark text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition"
                required
                minLength={6}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-cream py-3 text-[11px] tracking-widest2 hover:bg-clay transition disabled:opacity-50"
              >
                {loading ? 'RESETTING...' : 'RESET PASSWORD'}
              </button>
            </form>

            <p className="text-center text-xs text-ink-soft mt-8">
              <Link to="/login" className="text-clay hover:text-ink transition">
                Back to login
              </Link>
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}
