const test = require('node:test');
const assert = require('node:assert/strict');

const { getLocalizedText, normalizeLocalizedField } = require('../src/utils/localization');

test('locale helpers fall back to Arabic then English and convert legacy strings to bilingual values', () => {
  assert.equal(getLocalizedText({ ar: 'مرحبا', en: 'Hello' }, 'en'), 'Hello');
  assert.equal(getLocalizedText({ ar: 'مرحبا' }, 'en'), 'مرحبا');
  assert.equal(getLocalizedText('مرحبًا', 'en'), 'مرحبًا');
  assert.deepEqual(normalizeLocalizedField('مرحبًا', 'ar'), { ar: 'مرحبًا', en: 'مرحبًا' });
  assert.deepEqual(normalizeLocalizedField({ ar: 'مرحبًا', en: 'Hello' }, 'ar'), { ar: 'مرحبًا', en: 'Hello' });
  assert.deepEqual(normalizeLocalizedField('Classic White Linen Shirt', 'ar'), { ar: 'Classic White Linen Shirt', en: 'Classic White Linen Shirt' });
});
