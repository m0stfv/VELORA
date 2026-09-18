export const FREE_SHIPPING_THRESHOLD = 1500;

export function formatPrice(amount, lang = 'ar') {
  const value = Number(amount) || 0;
  if (lang === 'ar') {
    return `${value.toLocaleString('ar-EG')} ج.م`;
  }
  return `EGP ${value.toLocaleString('en-EG')}`;
}
