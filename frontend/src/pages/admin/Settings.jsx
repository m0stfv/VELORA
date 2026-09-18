import { useEffect, useState } from 'react';
import { Save, Store, Truck, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Settings() {
  const { t } = useLanguage();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/settings').then((res) => setForm(res.data.data)).catch((err) => setError(err.response?.data?.message || err.message)).finally(() => setLoading(false));
  }, []);

  const change = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, shippingCost: Number(form.shippingCost), freeShippingThreshold: Number(form.freeShippingThreshold), deliveryMinDays: Number(form.deliveryMinDays), deliveryMaxDays: Number(form.deliveryMaxDays) };
      const res = await api.put('/settings', payload);
      setForm(res.data.data);
      toast.success(t.adminSettingsSaved);
    } catch (err) { toast.error(err.response?.data?.message || err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (!form) return <ErrorMessage message={error || 'Unable to load settings'} />;

  return <div className="admin-page">
    <div className="mb-10 flex items-end justify-between gap-5 border-b border-white/10 pb-8">
      <div><p className="admin-kicker">{t.adminSystem} / {t.adminSettings}</p><h1 className="admin-title mt-3">{t.adminSettings}</h1><p className="mt-4 max-w-xl text-sm leading-6 text-[#b8afa3]">{t.adminSettingsIntro}</p></div>
      <button className="admin-button" onClick={save} disabled={saving}><Save size={17} />{saving ? t.adminSaving : t.adminSave}</button>
    </div>
    {error && <ErrorMessage message={error} />}
    <form onSubmit={save} className="grid gap-5 xl:grid-cols-2">
      <section className="admin-panel p-6"><div className="mb-6 flex items-center gap-3"><Store size={19}/><h2 className="text-2xl">{t.adminStoreDetails}</h2></div><div className="space-y-4"><label>{t.adminStoreName}<input name="storeName" value={form.storeName || ''} onChange={change} className="admin-input mt-2" /></label><label>{t.adminEmail}<input name="contactEmail" type="email" value={form.contactEmail || ''} onChange={change} className="admin-input mt-2" /></label><label>{t.adminWhatsapp}<input name="whatsapp" value={form.whatsapp || ''} onChange={change} className="admin-input mt-2" placeholder="+20..." /></label></div></section>
      <section className="admin-panel p-6"><div className="mb-6 flex items-center gap-3"><Truck size={19}/><h2 className="text-2xl">{t.adminShipping}</h2></div><div className="grid gap-4 sm:grid-cols-2"><label>{t.adminShippingCost}<input name="shippingCost" type="number" min="0" value={form.shippingCost} onChange={change} className="admin-input mt-2" /></label><label>{t.adminFreeThreshold}<input name="freeShippingThreshold" type="number" min="0" value={form.freeShippingThreshold} onChange={change} className="admin-input mt-2" /></label><label>{t.adminMinDays}<input name="deliveryMinDays" type="number" min="1" value={form.deliveryMinDays} onChange={change} className="admin-input mt-2" /></label><label>{t.adminMaxDays}<input name="deliveryMaxDays" type="number" min="1" value={form.deliveryMaxDays} onChange={change} className="admin-input mt-2" /></label></div></section>
      <section className="admin-panel p-6 xl:col-span-2"><div className="mb-6 flex items-center gap-3"><CreditCard size={19}/><h2 className="text-2xl">{t.adminPayment}</h2></div><label className="flex items-center gap-3"><input type="checkbox" name="codEnabled" checked={Boolean(form.codEnabled)} onChange={change} className="h-4 w-4" /><span>{t.adminCod}</span></label><p className="mt-3 text-sm text-[#b8afa3]">{t.adminPaymentNote}</p></section>
    </form>
  </div>;
}
