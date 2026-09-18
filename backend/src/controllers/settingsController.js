const StoreSettings = require('../models/StoreSettings');

const defaults = {
  key: 'default',
  storeName: 'VELORA',
  contactEmail: '',
  whatsapp: '',
  shippingCost: 80,
  freeShippingThreshold: 1500,
  deliveryMinDays: 2,
  deliveryMaxDays: 5,
  codEnabled: true,
};

const getSettings = async (req, res) => {
  try {
    const settings = await StoreSettings.findOneAndUpdate({ key: 'default' }, { $setOnInsert: defaults }, { new: true, upsert: true });
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch settings' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const allowed = ['storeName', 'contactEmail', 'whatsapp', 'shippingCost', 'freeShippingThreshold', 'deliveryMinDays', 'deliveryMaxDays', 'codEnabled'];
    const updates = {};
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];

    const settings = await StoreSettings.findOneAndUpdate(
      { key: 'default' },
      { $set: updates, $setOnInsert: defaults },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, message: 'Settings updated successfully', data: settings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update settings' });
  }
};

module.exports = { getSettings, updateSettings };
