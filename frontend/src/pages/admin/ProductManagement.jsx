import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import ProductImage from '../../components/ProductImage';
import { useLanguage } from '../../i18n/LanguageContext';
import { getCategoryName, getDisplayText, getProductDescription, getProductName } from '../../utils/localizedText';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  stock: '',
  category: '',
  brand: '',
  images: [],
};

export default function ProductManagement() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const uploadData = new FormData();
    files.forEach((file) => uploadData.append('images', file));

    setUploading(true);
    try {
      const response = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': undefined },
      });
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...response.data.data.urls],
      }));
      toast.success(t.adminSettingsSaved);
    } catch (err) {
      toast.error(err.response?.data?.message || t.adminUploadError);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
    setImageUrlInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast.error(t.adminProductImages);
      return;
    }

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
      } else {
        await api.post('/products', formData);
      }
      fetchProducts();
      setFormData(emptyForm);
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.adminDeleteConfirm)) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: getProductName(product, lang),
      description: getProductDescription(product, lang),
      price: product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      category: product.category?._id || '',
      brand: product.brand || '',
      images: product.images || [],
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="mb-8 flex items-end justify-between">
        <div><p className="admin-kicker">{t.adminProducts}</p><h1 className="admin-title mt-3">{t.adminProductsTitle}</h1></div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData(emptyForm);
          }}
          className="admin-button"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Form */}
      {showForm && (
        <div className="admin-panel mb-8 p-6">
          <h2 className="text-2xl font-bold mb-6">{editingId ? t.adminEditProduct : t.adminAddNewProduct}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder={t.adminProductName}
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
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="price"
                placeholder={t.adminPrice}
                value={formData.price}
                onChange={handleInputChange}
                required
                className="admin-input"
              />
              <input
                type="number"
                name="discountPrice"
                placeholder={t.adminDiscountPrice}
                value={formData.discountPrice}
                onChange={handleInputChange}
                className="admin-input"
              />
            </div>
            <input
              type="number"
              name="stock"
              placeholder={t.adminStock}
              value={formData.stock}
              onChange={handleInputChange}
              required
              className="admin-input"
            />
            <input
              type="text"
              name="brand"
              placeholder={t.adminBrand}
              value={formData.brand}
              onChange={handleInputChange}
              className="admin-input"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="admin-select"
            >
              <option value="">{t.adminSelectCategory}</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {getCategoryName(cat, lang)}
                </option>
              ))}
            </select>
            <div>
              <label className="mb-2 block text-sm font-semibold">{t.adminProductImages}</label>

              {formData.images.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-3">
                  {formData.images.map((url, i) => (
                    <div key={i} className="relative w-20 h-20">
                      <ProductImage src={url} alt="" className="h-full w-full border object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-[#873f46] text-white"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-[#cfc3b1] py-6 text-sm text-[#6f685f] transition hover:bg-[#e7ded0]">
                <Upload size={18} />
                {uploading ? t.adminUploading : t.adminUploadImages}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-3 my-3">
                <div className="h-px flex-1 bg-[#cfc3b1]" />
                <span className="text-xs text-[#958c80]">{t.adminOr}</span>
                <div className="h-px flex-1 bg-[#cfc3b1]" />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t.adminPasteImage}
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                  className="admin-input"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="admin-button bg-transparent !text-[#282622]"
                >
                  Add
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                No product photos yet? Search "clothing" on unsplash.com, right-click an image → Copy Image
                Address, and paste the link above as a placeholder until you have real photos.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="admin-button disabled:opacity-50"
              >
                {editingId ? 'Update Product' : 'Create Product'}
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

      {/* Products Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left font-semibold">{t.adminImage}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminName}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminPrice}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminStock}</th>
              <th className="px-6 py-3 text-left font-semibold">{t.adminActions}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4">
                  <ProductImage
                    src={product.images?.[0] || '/fashion-placeholder.svg'}
                    alt={getProductName(product, lang)}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">{getProductName(product, lang)}</td>
                <td className="px-6 py-4">EGP {product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
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
