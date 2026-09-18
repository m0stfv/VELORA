const StoreSettings = require('../models/StoreSettings');

const DEFAULTS = { freeShippingThreshold: 1500, shippingCost: 80 };

async function getShippingSettings() {
  try {
    const settings = await StoreSettings.findOne({ key: 'default' }).lean();
    return {
      freeShippingThreshold: Number(settings?.freeShippingThreshold ?? DEFAULTS.freeShippingThreshold),
      shippingCost: Number(settings?.shippingCost ?? DEFAULTS.shippingCost),
    };
  } catch (error) {
    return { ...DEFAULTS };
  }
}

async function calculateShipping(subtotal) {
  const { freeShippingThreshold, shippingCost } = await getShippingSettings();
  if (!subtotal || subtotal >= freeShippingThreshold) return 0;
  return shippingCost;
}

module.exports = { DEFAULTS, getShippingSettings, calculateShipping };
