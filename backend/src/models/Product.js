const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Please provide a product name'],
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
      required: [true, 'Please provide a product description'],
      default: { ar: '', en: '' },
      set: (value) => {
        if (typeof value === 'string') return { ar: value, en: value };
        return value;
      },
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
    },
    brand: {
      type: String,
      default: '',
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [
        {
          name: { type: String, required: true },
          hex: { type: String, default: '#2a2823' },
        },
      ],
      default: [],
    },
    variants: {
      type: [
        {
          size: { type: String, default: '' },
          color: { type: String, default: '' },
          stock: { type: Number, min: 0, default: 0 },
          sku: { type: String, default: '' },
        },
      ],
      default: [],
    },
    saleStart: { type: Date, default: null },
    saleEnd: { type: Date, default: null },
    material: { type: String, default: '' },
    sustainability: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
