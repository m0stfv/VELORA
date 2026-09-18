const getLocalizedText = (value, lang = 'ar') => {
  if (!value && value !== 0) return '';

  if (typeof value === 'string') return value;

  if (value && typeof value === 'object') {
    if (value[lang]) return value[lang];
    if (value.ar) return value.ar;
    if (value.en) return value.en;
    const firstValue = Object.values(value).find((entry) => typeof entry === 'string' && entry.trim());
    return firstValue || '';
  }

  return String(value);
};

const normalizeLocalizedField = (value, fallbackLang = 'ar') => {
  if (!value) return value;

  if (typeof value === 'string') {
    const normalized = { ar: value, en: value };
    if (fallbackLang === 'en') normalized.ar = value;
    return normalized;
  }

  if (value && typeof value === 'object') {
    const next = {};
    if (typeof value.ar === 'string' || value.ar === '') next.ar = value.ar ?? '';
    if (typeof value.en === 'string' || value.en === '') next.en = value.en ?? '';

    if (!next.ar && next.en) next.ar = next.en;
    if (!next.en && next.ar) next.en = next.ar;

    return Object.keys(next).length ? next : value;
  }

  return value;
};

const getCategoryMatchQuery = (categoryValue) => {
  if (!categoryValue) return {};
  if (typeof categoryValue === 'string') {
    return { $or: [{ 'name.ar': categoryValue }, { 'name.en': categoryValue }, { name: categoryValue }] };
  }

  const query = { $or: [] };
  if (categoryValue.ar) query.$or.push({ 'name.ar': categoryValue.ar });
  if (categoryValue.en) query.$or.push({ 'name.en': categoryValue.en });
  if (categoryValue.ar || categoryValue.en) query.$or.push({ name: categoryValue.ar || categoryValue.en });
  return query;
};

module.exports = {
  getLocalizedText,
  normalizeLocalizedField,
  getCategoryMatchQuery,
};