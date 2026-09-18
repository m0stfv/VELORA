import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import PageTransition from '../components/PageTransition';

const emptyAddress = {
  street: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
  isDefault: false,
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    getCurrentUser,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const load = async () => {
      try {
        await getCurrentUser();
        await getAddresses();
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [getAddresses, getCurrentUser, isAuthenticated, navigate]);

  const handleAddressInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAddressForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setAddressForm(emptyAddress);
    setEditingAddressId(null);
  };

  const handleSaveAddress = async (event) => {
    event.preventDefault();
    const { street, city, state, country, zipCode } = addressForm;
    if (!street || !city || !state || !country || !zipCode) {
      return;
    }

    setSaving(true);
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressForm);
      } else {
        await addAddress(addressForm);
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address._id || address.id);
    setAddressForm({
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      country: address.country || '',
      zipCode: address.zipCode || '',
      isDefault: Boolean(address.isDefault),
    });
  };

  if (!isAuthenticated) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <PageTransition>
    <div className="velora-page flex flex-col">
      <Navbar />

      <div className="flex-1 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 border-b border-stone-dark pb-6">
            <p className="mb-3 text-[10px] tracking-widest2 text-clay">THE HOUSE OF VELORA</p>
            <h1 className="font-serif text-4xl text-ink md:text-5xl">My Profile</h1>
          </div>

          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="velora-panel h-fit p-7 md:p-9">
            <div className="mb-6">
              <h2 className="mb-6 font-serif text-3xl text-ink">Personal Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-[10px] tracking-widest2 text-muted">NAME</label>
                  <p className="text-sm text-ink">{user?.name || 'N/A'}</p>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] tracking-widest2 text-muted">EMAIL</label>
                  <p className="break-all text-sm text-ink">{user?.email || 'N/A'}</p>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] tracking-widest2 text-muted">ACCOUNT</label>
                  <p className="text-sm text-ink">
                    {user?.role === 'ADMIN' ? (
                      <span className="text-clay">Administrator</span>
                    ) : (
                      'Customer'
                    )}
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div id="addresses" className="border border-stone-dark p-7 md:p-9">
              <h2 className="mb-2 font-serif text-3xl text-ink">Saved Addresses</h2>
              <p className="mb-7 text-sm text-ink-soft">Keep your preferred delivery details ready for a faster checkout.</p>

              <form onSubmit={handleSaveAddress} className="mb-8 space-y-5 border-y border-stone-dark py-6">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input name="street" value={addressForm.street} onChange={handleAddressInputChange} placeholder="Street" className="velora-input" />
                  <input name="city" value={addressForm.city} onChange={handleAddressInputChange} placeholder="City" className="velora-input" />
                  <input name="state" value={addressForm.state} onChange={handleAddressInputChange} placeholder="State" className="velora-input" />
                  <input name="country" value={addressForm.country} onChange={handleAddressInputChange} placeholder="Country" className="velora-input" />
                  <input name="zipCode" value={addressForm.zipCode} onChange={handleAddressInputChange} placeholder="ZIP Code" className="velora-input md:col-span-2" />
                </div>

                <label className="flex items-center gap-2 text-xs text-ink-soft">
                  <input type="checkbox" name="isDefault" checked={addressForm.isDefault} onChange={handleAddressInputChange} />
                  Set as default address
                </label>

                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="velora-button disabled:opacity-60">
                    {saving ? 'Saving...' : editingAddressId ? 'Update Address' : 'Add Address'}
                  </button>
                  {editingAddressId && (
                    <button type="button" onClick={resetForm} className="velora-button velora-button-secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {user?.addresses && user.addresses.length > 0 ? (
                <div className="space-y-4">
                  {user.addresses.map((address, index) => (
                    <div key={address._id || index} className="border border-stone-dark p-5">
                      <p className="mb-2 text-sm text-ink">{address.street}</p>
                      <p className="text-xs text-ink-soft">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-xs text-ink-soft">{address.country}</p>
                      {address.isDefault && (
                        <span className="mt-3 inline-block border border-olive px-2 py-1 text-[10px] tracking-widest2 text-olive">
                          Default Address
                        </span>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button type="button" onClick={() => handleEditAddress(address)} className="border border-stone-dark px-3 py-1.5 text-xs transition hover:border-ink">
                          Edit
                        </button>
                        {!address.isDefault && (
                          <button type="button" onClick={() => setDefaultAddress(address._id || address.id)} className="border border-stone-dark px-3 py-1.5 text-xs transition hover:border-ink">
                            Set default
                          </button>
                        )}
                        <button type="button" onClick={() => deleteAddress(address._id || address.id)} className="border border-red-200 px-3 py-1.5 text-xs text-red-700">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-soft">No saved addresses yet.</p>
              )}
          </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    </PageTransition>
  );
}
