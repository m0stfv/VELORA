export const getLocalizedText = (value, lang = 'ar', fallbackLang = 'ar') => {
  if (!value && value !== 0) return '';

  if (typeof value === 'string') return value;

  if (value && typeof value === 'object') {
    if (value[lang]) return value[lang];
    if (value[fallbackLang]) return value[fallbackLang];
    if (value.en) return value.en;
    if (value.ar) return value.ar;
    const firstText = Object.values(value).find((entry) => typeof entry === 'string' && entry.trim());
    return firstText || '';
  }

  return String(value);
};

export const getProductName = (product, lang = 'ar') => {
  if (!product) return '';
  return getLocalizedText(product.name, lang, 'ar') || getLocalizedText(product.name, 'en', 'ar') || 'Product';
};

export const getProductDescription = (product, lang = 'ar') => {
  if (!product) return '';
  return getLocalizedText(product.description, lang, 'ar') || getLocalizedText(product.description, 'en', 'ar') || '';
};

export const getCategoryName = (category, lang = 'ar') => {
  if (!category) return '';
  return getLocalizedText(category.name, lang, 'ar') || getLocalizedText(category.name, 'en', 'ar') || 'Category';
};

export const getColorName = (color, lang = 'ar') => {
  if (!color) return '';
  if (typeof color === 'string') return color;
  if (color && typeof color === 'object') {
    return getLocalizedText(color.name, lang, 'ar') || getLocalizedText(color.name, 'en', 'ar') || 'Color';
  }
  return String(color);
};

export const getDisplayText = (value, lang = 'ar', defaultValue = '') => {
  if (!value && value !== 0) return defaultValue;
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    return getLocalizedText(value, lang, 'ar') || defaultValue;
  }
  return String(value);
};
