import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { useLanguage } from '../../i18n/LanguageContext';
import { getCategoryName, getDisplayText } from '../../utils/localizedText';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      fetchCategories();
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.adminDeleteConfirm)) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: getCategoryName(category, lang),
      description: getDisplayText(category.description, lang, ''),
    });
    setEditingId(category._id);
    setShowForm(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="mb-8 flex items-end justify-between">
        <div><p className="admin-kicker">{t.adminCategories}</p><h1 className="admin-title mt-3">{t.adminCategoriesTitle}</h1></div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', description: '' });
          }}
          className="admin-button"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Form */}
      {showForm && (
        <div className="admin-panel mb-8 p-6">
          <h2 className="text-2xl font-bold mb-6">{editingId ? t.adminEditCategory : t.adminAddNewCategory}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder={t.adminCategoryName}
              value={formData.name}
              onChange={handleInputChange}
              required
              className="admin-input"
            />
            <textarea
              name="description"
              placeholder={t.adminDescription}
              value={formData.description}
              onChange={handleInputChange}
              className="admin-textarea"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="admin-button"
              >
                {editingId ? t.adminUpdateCategory : t.adminCreateCategory}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="admin-button bg-transparent !text-[#282622]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left font-semibold">{t.adminName}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminDescription}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminActions}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td className="px-6 py-4 font-semibold">{getCategoryName(category, lang)}</td>
                <td className="px-6 py-4">{getDisplayText(category.description, lang, '')}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded transition"
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
