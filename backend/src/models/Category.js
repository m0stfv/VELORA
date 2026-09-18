const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Please provide a category name'],
      default: { ar: '', en: '' },
      set: (value) => {
        if (typeof value === 'string') return { ar: value, en: value };
        return value;
      },
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: mongoose.Schema.Types.Mixed,
      default: { ar: '', en: '' },
      set: (value) => {
        if (typeof value === 'string') return { ar: value, en: value };
        return value;
      },
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
