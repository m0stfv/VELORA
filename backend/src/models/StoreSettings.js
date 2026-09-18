const mongoose = require('mongoose');

const storeSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'default' },
    storeName: { type: String, default: 'VELORA', trim: true },
    contactEmail: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    shippingCost: { type: Number, default: 80, min: 0 },
    freeShippingThreshold: { type: Number, default: 1500, min: 0 },
    deliveryMinDays: { type: Number, default: 2, min: 1 },
    deliveryMaxDays: { type: Number, default: 5, min: 1 },
    codEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);
