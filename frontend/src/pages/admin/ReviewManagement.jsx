import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { useLanguage } from '../../i18n/LanguageContext';
import { getProductName } from '../../utils/localizedText';

export default function ReviewManagement() {
  const { t, lang } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/admin/reviews');
      setReviews(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    if (!window.confirm(t.adminDeleteReviewConfirm)) return;
    try {
      await api.delete(`/admin/reviews/${reviewId}`);
      fetchReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <p className="admin-kicker">{t.adminReviews}</p>
      <h1 className="admin-title mt-3 mb-10">{t.adminReviewsTitle}</h1>

      {error && <ErrorMessage message={error} />}

      {/* Reviews Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left font-semibold">{t.adminProduct}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminAuthor}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminRating}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminComment}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminDate}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminAction}</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td className="px-6 py-4">{getProductName(review.product, lang) || t.adminNA}</td>
                <td className="px-6 py-4">{review.user?.name || t.adminAnonymous}</td>
                <td className="px-6 py-4">
                  <span className="admin-badge admin-badge-burgundy">{review.rating} / 5</span>
                </td>
                <td className="px-6 py-4 max-w-xs truncate">{review.comment}</td>
                <td className="px-6 py-4">{new Date(review.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="p-2 text-[#873f46] transition hover:bg-[#e7ded0]"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
